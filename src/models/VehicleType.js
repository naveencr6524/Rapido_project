const { Model } = require('objection');


class VehicleType extends Model {
  static get tableName() {
    return 'vehicle_types';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'typeName', 'baseFare', 'perKmRate'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        typeName: { type: 'string', minLength: 1 },
        baseFare: { type: 'number' },
        perKmRate: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Driver = require('./Driver');
    const Ride = require('./Ride');
    return {
      drivers: {
        relation: Model.HasManyRelation,
        modelClass: Driver,
        join: {
          from: 'vehicle_types.id',
          to: 'drivers.vehicleTypeId'
        }
      },
      rides: {
        relation: Model.HasManyRelation,
        modelClass: Ride,
        join: {
          from: 'vehicle_types.id',
          to: 'rides.vehicleTypeId'
        }
      }
    };
  }
}

module.exports = VehicleType;
