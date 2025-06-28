const { v4: uuid } = require('uuid')
const Driver = require('../models/constants/Driver.js')
const Ride = require('../models/constants/Ride.js')
const RideStatus = require('../models/constants/RideStatus.js')
const VehicleType = require('../models/VehicleType.js')
exports.signUpDriver = async (data) => {
    return await Driver.query().insert({
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
  const pendingStatus = await RideStatus.query().findOne({ code: 'pending' });

  if (!pendingStatus) {
    throw new Error('Pending status not found');
  }

  return await Ride.query()
    .whereNull('driverId')
    .andWhere('statusId', pendingStatus.id)
    .withGraphFetched('[user, vehicleType, status]')
    .orderBy('created_at', 'desc');
};
exports.acceptRide = async (driverId, rideId) => {
  // Fetch the ride
  const ride = await Ride.query().findById(rideId);
  if (!ride) throw new Error('Ride not found');
  
  if (ride.driverId) throw new Error('Ride already accepted');
  
 
  const cancelledStatus = await RideStatus.query().findOne({ code: 'cancelled' });
  if (ride.statusId === cancelledStatus.id) {
    throw new Error('Ride has already been cancelled and cannot be accepted');
  }

  
  const acceptedStatus = await RideStatus.query().findOne({ code: 'accepted' });
  const onTheWayStatus = await RideStatus.query().findOne({ code: 'on_the_way' });

  if (!acceptedStatus) throw new Error('Accepted status not found');
  if (!onTheWayStatus) throw new Error('On The Way status not found');

  
  return await Ride.query().upsertGraph({
    id: rideId,
    driverId, 
    statusId: acceptedStatus.id, 
    statusHistory: [
      {
        statusId: acceptedStatus.id,
        updated_by: 'driver',
      },
      {
        statusId: onTheWayStatus.id, 
        updated_by: 'driver',
      }
    ]
  }, {
    relate: true, 
    insertMissing: true, 
    noDelete: true
  });
};


exports.getDriverRides = async (driverId) => {
    return await Ride.query().where('driverId', driverId).withGraphFetched('[vehicleType,status]').orderBy('created_at', 'desc')
}

exports.updateRideStatus = async (driverId, rideId, statusId) => {
  
  const ride = await Ride.query().findById(rideId);
  if (!ride) throw new Error('Ride not found');

  
  if (ride.driverId !== driverId) {
    throw new Error('Unauthorized: This ride does not belong to you');
  }


  const allowedStatusCodes = ['completed', 'cancelled'];
  const newStatus = await RideStatus.query().findById(statusId);

  if (!newStatus) throw new Error('Invalid status ID');

  if (!allowedStatusCodes.includes(newStatus.code)) {
    throw new Error('Drivers can only mark rides as completed or cancelled');
  }

 
  if (ride.statusId === statusId) {
    throw new Error('Ride is already in the requested status');
  }

  
  const updatedRide = await Ride.query().upsertGraph({
    id: rideId,
    statusId,
    updatedAt: new Date().toISOString(),
    statusHistory: [
      {
        statusId,
        updated_by: 'driver',
        
      }
    ]
  }, {
    relate: true,
    insertMissing: true,
    noDelete: true
  });

  return updatedRide;
};

exports.getRideDetails = async (driverId, rideId) => {
    const ride = await Ride.query().findById(rideId)
    if (!ride || ride.driverId !== driverId) throw new Error('Unauthorized access');
    return await Ride.query().findById(rideId).withGraphFetched('[user, vehicleType, status]')

}

exports.getAllVehicleTypes = async () => {
    return await VehicleType.query().orderBy('created_at', 'desc');
};


exports.assignVehicleTypeToDriver = async (driverId, vehicleTypeId) => {
    const driver = await Driver.query().findById(driverId);
    if (!driver) throw new Error('Driver not found');

    return await Driver.query().patchAndFetchById(driverId, {
        vehicleTypeId,
    });
};

exports.bookRide = async (data) => {
    const { userId, pickup, drop, vehicleTypeId } = data;

    const vehicleType = await VehicleType.query().findById(vehicleTypeId);
    if (!vehicleType) throw new Error('Invalid vehicle type selected');

    return await Ride.query().insert({
        id: uuid(),
        userId,
        pickup,
        drop,
        vehicleTypeId,
        status: 'pending', 
    })
}
