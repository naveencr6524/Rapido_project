/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const {v4 : uuid}=require('uuid')
exports.seed = async function(knex) {

  await knex('vehicle_types').del()
  await knex('vehicle_types').insert([
    {id:uuid(),  typeName: 'Bike',baseFare: 20.00,perKmRate: 5.00,createdAt: new Date(),updatedAt: new Date()},
    {id:uuid(),  typeName: 'Auto',baseFare: 30.00,perKmRate: 8.00,createdAt: new Date(),updatedAt: new Date()},
    {id:uuid(),  typeName: 'Car',baseFare: 50.00,perKmRate: 12.50,createdAt: new Date(),updatedAt: new Date()},
  ]);
};