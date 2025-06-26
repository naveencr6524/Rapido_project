const { Model } = require('objection');
const { v4: uuidv4 } = require("uuid");
const { uuid, string, timeStamps } = require('./constants/Val')

class Driver extends Model {
  static get tableName() {
    return 'drivers';
  }

    $beforeInsert(){
         if(!this.id){
          this.id = uuidv4()
         }
      }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'id',
        'name',
        'email',
        'phone',
        'vehicleNumber',
        'vehicleModel',
        'isAvailable',
        'vehicleTypeId'
      ],
      properties: {
        id: uuid,
        name: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        phone: string,
        vehicleNumber: string,
        vehicleModel: string,
        isAvailable: { type: 'boolean' },
        vehicleTypeId: uuid,
        createdAt: timeStamps,
        updatedAt: timeStamps
      }
    };
  }

  static get relationMappings() {
    const VehicleType = require('./VehicleType');
    const Ride = require('./Ride');
    return {
      vehicleType: {
        relation: Model.BelongsToOneRelation,
        modelClass: VehicleType,
        join: {
          from: `${this.tableName}.vehicleTypeId`,
          to: `${VehicleType.tableName}.id`
        }
      },
      rides: {
        relation: Model.HasManyRelation,
        modelClass: Ride,
        join: {
          from: `${this.tableName}.id`,
          to: `${Ride.tableName}.driverId`
        }
      }
    };
  }
}

module.exports = Driver;
