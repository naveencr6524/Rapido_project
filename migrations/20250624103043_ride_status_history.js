/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('ride_status_history',function(table){
    table.uuid('id').primary().notNullable();
    table.uuid('rideId').notNullable();
    table.uuid('statusId').notNullable();
    table.enum('updated_by', ['user', 'driver', 'system']).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('rideId').references('id').inTable('rides').onDelete('CASCADE');
    table.foreign('statusId').references('id').inTable('ride_statuses').onDelete('RESTRICT');

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('ride_status_history')
  
};