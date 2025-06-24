const{Model}=require('objection')
const knex=require('knex')
const knexConfig =require('../../knexfile.js')

const db=knex(knexConfig.development)
Model.knex(db)
module.exports=db;