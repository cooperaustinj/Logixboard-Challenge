import { Knex } from 'knex';
import { convertKilos, weightToKilos } from '../utils/conversion';
import { Shipment, TransportPack, WeightUnit } from '../types';
import { db } from './db';

export async function get(referenceId: string) {
    const record = (
        await db.raw(
            `
        SELECT
            s.reference_id,
            s.estimated_time_arrival,
            array(
                SELECT
                    o.code
                FROM
                    shipment_organization so
                    JOIN organization o ON o.id = so.organization_id
                WHERE
                    reference_id = s.reference_id
            ) organizations,
            array(
                SELECT
                    tp.weight || '|' || tp.unit
                FROM
                    transport_pack tp
                WHERE
                    reference_id = s.reference_id
            ) weights
        FROM
            shipment s
        WHERE
            s.reference_id = ?
        GROUP BY
            s.reference_id
    `,
            referenceId,
        )
    ).rows[0];
    if(!record) return null;
    const result: Shipment = {
        referenceId: record.reference_id,
        estimatedTimeArrival: record.estimated_time_arrival.toISOString().replace('Z', ''), // remove trailing Z to match original message format
        organizations: record.organizations,
        transportPacks: {
            nodes: record.weights.map((w: string): TransportPack => {
                // Example w: 324|OUNCES
                const split = w.split('|');
                return { totalWeight: { weight: split[0], unit: split[1] as WeightUnit } };
            }),
        },
    };
    return result;
}

export async function save(shipment: Shipment) {
    const trx = await db.transaction();

    const shipmentWriteModel = {
        reference_id: shipment.referenceId,
        estimated_time_arrival: shipment.estimatedTimeArrival,
    };
    await trx('shipment').insert(shipmentWriteModel).onConflict('reference_id').merge();

    await trx('shipment_organization').delete().where({ reference_id: shipment.referenceId });
    await trx
        .insert((qb: Knex.QueryBuilder) => {
            qb.select('reference_id', 'id')
                .from('organization')
                .joinRaw('JOIN shipment ON shipment.reference_id = ?', shipment.referenceId)
                .whereIn('code', shipment.organizations);
        })
        .into(db.raw('shipment_organization (reference_id, organization_id)'));

    if (shipment.transportPacks.nodes.length > 0) {
        await trx('transport_pack').delete().where({ reference_id: shipment.referenceId });
        const transportPackWriteModels = shipment.transportPacks.nodes
            .map(n => n.totalWeight)
            .map(tw => ({
                reference_id: shipment.referenceId,
                weight: tw.weight,
                unit: tw.unit,
                weight_kilograms: weightToKilos(tw.weight, tw.unit as WeightUnit),
            }));
        await trx('transport_pack').insert(transportPackWriteModels);
    }

    await trx.commit();
}
export async function getAggregateWeight(unit: WeightUnit) {
    const record = (await db('transport_pack').sum('weight_kilograms'))[0];
    return Math.round(convertKilos(record.sum || 0, unit));
}
