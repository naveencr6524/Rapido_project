const { Model } = require('objection');

class RideStatus extends Model {
  static get tableName() {
    return 'ride_statuses';
  }

    static get jsonSchema() {
  return {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      created_at: { type: 'string', format: 'date-time' },
      updated_at: { type: 'string', format: 'date-time' }
    }
  };
}


  static get relationMappings() {
    const RideStatusHistory = require('./RideStatusHistory')
    const Ride = require('./Ride');

    return {
      history: {
        relation: Model.HasManyRelation,
        modelClass: RideStatusHistory,
        join: {
          from: `${this.tableName}.id`,
          to: `${RideStatusHistory.tableName}.statusId`,
        },
      },
      rides: {
        relation: Model.HasManyRelation,
        modelClass: Ride,
        join: {
          from: `${this.tableName}.id`,
          to: `${Ride.tableName}.statusId`,
        },
      },
    };
  }
}

module.exports = RideStatus;
