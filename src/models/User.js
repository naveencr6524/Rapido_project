const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }
   
  static get jsonSchema() {
  return {
    type: 'object',
    required: ['id', 'name', 'email', 'phone'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 3 },
      email: { type: 'string', format: 'email' },
      phone: { type: 'string', pattern: '^[0-9]{10}$' },
      created_at: { type: 'string', format: 'date-time' },
      updated_at: { type: 'string', format: 'date-time' }
    }
  };
}



  static get relationMappings() {
    const Ride = require('./Ride');

    return {
      rides: {
        relation: Model.HasManyRelation,
        modelClass: Ride,
        join: {
          from: `${this.tableName}.id`,
          to: `${Ride.tableName}.userId`,
        },
      },
    };
  }
}



module.exports = User;
