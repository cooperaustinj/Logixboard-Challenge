import { Organization } from 'src/types';
import { db } from './db';

export async function get(id: string) {
    return await db('organization').first().where({ id });
}

export async function save(org: Organization) {
    await db('organization').insert(org).onConflict('id').merge();
}
