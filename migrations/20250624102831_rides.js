/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('rides',function(table){
    table.uuid('id').primary().notNullable();
    table.uuid('userId').notNullable();
    table.uuid('driverId').nullable();
    table.string('pickupLocation').notNullable();
    table.string('dropLocation').notNullable();
    table.uuid('vehicleTypeId').notNullable();
    table.integer('fare').notNullable();
    table.uuid('statusId').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('userId').references('id').inTable('users').onDelete('CASCADE');
table.foreign('driverId').references('id').inTable('drivers').onDelete('SET NULL');
table.foreign('vehicleTypeId').references('id').inTable('vehicle_types').onDelete('RESTRICT');
table.foreign('statusId').references('id').inTable('ride_statuses').onDelete('RESTRICT');

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('rides')
};