const { Model } = require('objection')
const Drivers=require('./Drivers.js')
const Ride = require('./Ride.js')

class VehicleTypes extends Model {
    static get tableName() {
        return 'vehicle_types'
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['id', 'typeName', 'baseFare', 'perKmRate'],
            properties: {
                id: { type: 'string', format: 'uuid' },
                typeName: { type: 'string', minLength: 3, maxLength: 50 },
                baseFare: { type: 'number' },
                perKmRate: { type: 'number' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }
    static get relationMappings() {
        return {
            drivers: {
                relation: Model.HasManyRelation,
     
                modelClass: Drivers,
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
        }
    }
}

module.exports = {VehicleTypes};