const { Model } = require('objection');

class Ride extends Model {
  static get tableName() {
    return 'rides';
  }
   
  static get jsonSchema() {
  return {
    type: 'object',
    required: ['id', 'userId', 'pickupLocation', 'dropLocation', 'vehicleTypeId', 'fare', 'statusId'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      driverId: { type: ['string', 'null'], format: 'uuid' },
      pickupLocation: { type: 'string' },
      dropLocation: { type: 'string' },
      vehicleTypeId: { type: 'string', format: 'uuid' },
      statusId: { type: 'string', format: 'uuid' },
      fare: { type: 'number', minimum: 0 },
      created_at: { type: 'string', format: 'date-time' },
      updated_at: { type: 'string', format: 'date-time' }
    }
  };
}



  static get relationMappings() {
    const User = require('./User');
    const Driver = require('./Driver'); 
    const VehicleType = require('./VehicleType'); 
    const RideStatus = require('./RideStatus');
    const RideStatusHistory = require('./RideStatusHistory');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: `${this.tableName}.userId`,
          to: `${User.tableName}.id`,
        },
      },

      driver: {
        relation: Model.BelongsToOneRelation,
        modelClass: Driver,
        join: {
          from: 'rides.driverId',
          to: 'drivers.id',
        },
      },

      vehicleType: {
        relation: Model.BelongsToOneRelation,
        modelClass: VehicleType,
        join: {
          from: 'rides.vehicleTypeId',
          to: 'vehicle_types.id',
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

      statusHistory: {
        relation: Model.HasManyRelation,
        modelClass: RideStatusHistory,
        join: {
          from: `${this.tableName}.id`,
          to: `${RideStatusHistory}.rideId`,
        },
      },
    };
  }
}

module.exports = Ride;
