const { Model } = require('objection');
const { v4: uuidv4 } = require("uuid");
const { uuid, string, timeStamps } = require('./Val')

class Ride extends Model {
  static get tableName() {
    return 'rides';
  }
       $beforeInsert(){
         if(!this.id){
          this.id = uuidv4()
         }
      }

  static get jsonSchema() {
  return {
    type: 'object',
    required: [ 'userId', 'pickupLocation', 'dropLocation', 'vehicleTypeId', 'fare', 'statusId'],
    properties: {
      id: uuid,
      userId: uuid,
      driverId: { type: ['string', 'null'], format: 'uuid' },
      pickupLocation:string,
      dropLocation: string,
      vehicleTypeId: uuid,
      statusId: uuid,
      fare: { type: 'number', minimum: 0 },
      created_at: timeStamps,
      updated_at: timeStamps
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
          to: `${RideStatusHistory.tableName}.rideId`,
        },
      },
    };
  }
}

module.exports = Ride;
