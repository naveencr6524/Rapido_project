/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('vehicle_types',(table)=>{
    table.uuid('id').primary().notNullable();
    table.string('typeName').notNullable();
   table.decimal('baseFare', 10, 2).notNullable(); // for price values 99999999.99
    table.decimal('perKmRate', 10, 2).notNullable(); // for rate values
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
})
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('vehicle_types')
};
