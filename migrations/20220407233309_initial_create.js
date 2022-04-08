/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.raw(`
        CREATE TABLE organization (
            id UUID UNIQUE,
            code VARCHAR(3) UNIQUE,
            PRIMARY KEY (id, code)
        );

        CREATE TABLE shipment (
            reference_id VARCHAR(9) PRIMARY KEY,
            estimated_time_arrival TIMESTAMPTZ
        );

        CREATE TABLE shipment_organization (
            reference_id VARCHAR(9),
            organization_id UUID,
            PRIMARY KEY (reference_id, organization_id),
            FOREIGN KEY (reference_id) REFERENCES shipment(reference_id),
            FOREIGN KEY (organization_id) REFERENCES organization(id)
        );

        CREATE TABLE transport_pack (
            id INT generated always AS identity,
            reference_id VARCHAR(9),
            weight INT NOT NULL,
            unit VARCHAR(15),
            weight_kilograms FLOAT NOT NULL,
            PRIMARY KEY (id, reference_id),
            FOREIGN KEY (reference_id) REFERENCES shipment(reference_id)
        );
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.raw(`
        DROP TABLE transport_pack;
        DROP TABLE shipment_organization;
        DROP TABLE shipment;
        DROP TABLE organization;
    `);
};
