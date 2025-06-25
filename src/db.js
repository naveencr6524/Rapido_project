const { Model } = require('objection');
const Knex = require('knex');
const knexConfig = require('../knexfile.js');

const knex = Knex(knexConfig.development);


Model.knex(knex);

module.exports = knex;
