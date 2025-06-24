const { Model } = require('objection')
const VehicleTypes=require('./Vehicle_types.js')
const Ride = require('./Ride.js')

class Drivers extends Model {
    static get tableName() {
        return 'drivers'
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['id', 'name', 'email', 'phone', 'vehicleNumber',
                'vehicleModel', 'isAvailable', 'vehicleTypeId'],
            properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string', minLength: 3, maxLength: 50 },
                email: { type: 'string', format: 'email' },
                phone: { type: 'string', maxLength: 10 },
                vehicleNumber: { type: 'string', minLength: 4, maxLength: 10 },
                vehicleModel: { type: 'string' },
                isAvailable: { type: 'boolean' },
                vehicleTypeId: { type: 'string', format: 'uuid' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    }
    static get relationMappings() {
        return {
            vehicleTypes: {
                relation: Model.BelongsToOneRelation,
                modelClass:VehicleTypes,
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
        }
    }
}
module.exports = {Drivers};