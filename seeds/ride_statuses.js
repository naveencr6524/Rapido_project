/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 * 
 */const { v4: uuidv4 } = require('uuid');
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('ride_statuses').del()
  await knex('ride_statuses').insert([
    {id:uuidv4(), code: 'pending',label: 'Pending',orderIndex: 1 },
    {id: uuidv4(), code:'accepted',label:'Accepted',orderIndex:2 },
    {id:uuidv4(),code:'on_the_way',label:'on the Way',orderIndex:3},
    {id:uuidv4(),code:'completed',label:'Completed',orderIndex:4},
    {id:uuidv4(),code:'cancelled',label:'Cancelled',orderIndex:5}
  ]);
};
