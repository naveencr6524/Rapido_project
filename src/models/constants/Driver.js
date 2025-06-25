const { Model } = require('objection');
const VehicleType = require('./VehicleType');
const Ride = require('./Ride');

class Driver extends Model {
  static get tableName() {
    return 'drivers';
  }

  static get idColumn() {
    return 'id';
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
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        vehicleNumber: { type: 'string' },
        vehicleModel: { type: 'string' },
        isAvailable: { type: 'boolean' },
        vehicleTypeId: { type: 'string', format: 'uuid' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    return {
      vehicleType: {
        relation: Model.BelongsToOneRelation,
        modelClass: VehicleType,
        join: {
          from: 'drivers.vehicleTypeId',
          to: 'vehicle_types.id'
        }
      },
      rides: {
        relation: Model.HasManyRelation,
        modelClass: Ride,
        join: {
          from: 'drivers.id',
          to: 'rides.driverId'
        }
      }
    };
  }
}

module.exports = Driver;
