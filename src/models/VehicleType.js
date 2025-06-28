const { Model } = require('objection');
const { v4: uuidv4 } = require("uuid");
const {timeStamps, uuid, number} = require('./constants/Val')


class VehicleType extends Model {
  static get tableName() {
    return 'vehicle_types';
  }
    
    $beforeInsert(){
         if(!this.id){
          this.id = uuidv4()
         }
      }

  
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'typeName', 'baseFare', 'perKmRate'],
      properties: {
        id: uuid,
        typeName: { type: 'string', minLength: 1 },
        baseFare: number,
        perKmRate: number,
        createdAt: timeStamps,
        updatedAt: timeStamps
      }
    };
  }

  static get relationMappings() {
    const Driver = require('./Driver');
    const Ride = require('./constants/Ride');
    return {
      drivers: {
        relation: Model.HasManyRelation,
        modelClass: Driver,
        join: {
          from: `${this.tableName}.id`,
          to: `${Driver.tableName}.vehicleTypeId`
        }
      },
      rides: {
        relation: Model.HasManyRelation,
        modelClass: Ride,
        join: {
          from: `${this.tableName}.id`,
          to: `${Ride.tableName}.vehicleTypeId`
        }
      }
    };
  }
}

module.exports = VehicleType;
