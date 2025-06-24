/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('drivers',(table)=>{
   table.uuid('id').primary().notNullable();
   table.string('name').notNullable();
   table.string('email').unique().notNullable();
   table.string('phone').unique().notNullable();
   table.string('vehicleNumber').notNullable();
   table.string('vehicleModel').notNullable();
   table.boolean('isAvailable').notNullable();
   table.uuid('vehicleTypeId').notNullable();
   table.timestamp('createdAt').defaultTo(knex.fn.now());
   table.timestamp('updatedAt').defaultTo(knex.fn.now());
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('drivers')
};




