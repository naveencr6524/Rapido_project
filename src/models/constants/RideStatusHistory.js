const { Model } = require('objection');

class RideStatusHistory extends Model {
  static get tableName() {
    return 'ride_status_history';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'rideId', 'statusId', 'updated_by'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        rideId: { type: 'string', format: 'uuid' },
        statusId: { type: 'string', format: 'uuid' },
        updated_by: { type: 'string', enum: ['user', 'driver', 'system'] },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Ride = require('./Ride');
    const RideStatus = require('./RideStatus'); 

    return {
      ride: {
        relation: Model.BelongsToOneRelation,
        modelClass: Ride,
        join: {
          from: `${this.tableName}.rideId`,
          to: `${Ride.tableName}.id`,
        },
      },
      status: {
        relation: Model.BelongsToOneRelation,
        modelClass: RideStatus,
        join: {
          from: `${this.tableName}.statusId`,
          to: `${RideStatus.tableName}.id`, 
        },
      },
    };
  }
}

module.exports = RideStatusHistory;
