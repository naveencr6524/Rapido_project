const { v4: uuid } = require('uuid')
const Driver = require('../models/constants/Driver.js')
const Ride = require('../models/constants/Ride.js')
const RideStatus = require('../models/constants/RideStatus.js')

exports.signUpDriver = async (data) => {
    return await Driver.query().insert({
        id: uuid(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        vehicleModel: data.vehicleModel,
        vehicleNumber: data.vehicleNumber,
        vehicleTypeId: data.vehicleTypeId,
        isAvailable: true
    })
}

exports.getPendingRides = async () => {
    return await Ride.query().whereNull('driverId').withGraphFetched('[user,vehicleType,status]').orderBy('createdAt', 'desc')
}

exports.acceptRide = async (driverId, rideId) => {

    const ride = await Ride.query().findById(rideId)

    if (!ride) throw new Error('Ride not found')

    if (ride.driverId) throw new Error('Ride already accepted')

    const acceptedStatus = await RideStatus.query().findOne({ code: 'accepted' })
    if (!acceptedStatus) throw new Error('Accepted status not found')

    return await Ride.query().patchAndFetchById(rideId, { driverId, statusId: acceptedStatus.id })

}

exports.getDriverRides = async (driverId) => {
    return await Ride.query().where('driverId', driverId).withGraphFetched('[vehicleType,status]').orderBy('createdAt', 'desc')
}

exports.updateRideStatus = async (driverId, rideId, statusId) => {
    const ride = await Ride.query().findById(rideId)
    if (!ride || ride.driverId !== driverId) throw new Error('unauthorized or invalid ride')

    return await Ride.query().patchAndFetchById(rideId, { statusId })
}

exports.getRideDetails=async(driverId,rideId)=>{
    const ride=await Ride.query().findById(rideId)
  if (!ride || ride.driverId !== driverId) throw new Error('Unauthorized access');
 return await Ride.query().findById(rideId).withGraphFetched('[user, vehicleType, status]')
}