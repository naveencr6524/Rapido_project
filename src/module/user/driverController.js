const { v4: uuid } = require('uuid');
const Driver = require('../../models/constants/Driver');
const Ride = require('../../models/constants/Ride');
const RideStatus = require('../../models/constants/RideStatus');
const VehicleType = require('../../models/constants/VehicleType');

// 1. Driver Sign Up
exports.signUpDriver = async (req, res) => {
  try {
    const data = req.body;
    const driver = await Driver.query().insert({
      id: uuid(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      vehicleModel: data.vehicleModel,
      vehicleNumber: data.vehicleNumber,
      vehicleTypeId: data.vehicleTypeId,
      isAvailable: true
    });
    res.status(201).json({ message: 'Driver created successfully', data: driver });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. View unassigned pending rides
exports.getPendingRides = async (req, res) => {
  try {
    const pendingStatus = await RideStatus.query().findOne({ code: 'pending' });
    if (!pendingStatus) return res.status(404).json({ error: 'Pending status not found' });

    const rides = await Ride.query()
      .whereNull('driverId')
      .andWhere('statusId', pendingStatus.id)
      .withGraphFetched('[user, vehicleType, status]')
      .orderBy('created_at', 'desc');

    res.status(200).json({ data: rides });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Accept Ride
exports.acceptRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { driverId } = req.body;

    const ride = await Ride.query().findById(rideId);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.driverId) return res.status(400).json({ error: 'Ride already accepted' });

    const cancelledStatus = await RideStatus.query().findOne({ code: 'cancelled' });
    if (ride.statusId === cancelledStatus?.id)
      return res.status(400).json({ error: 'Ride is already cancelled' });

    const acceptedStatus = await RideStatus.query().findOne({ code: 'accepted' });
    const onTheWayStatus = await RideStatus.query().findOne({ code: 'on_the_way' });

    if (!acceptedStatus || !onTheWayStatus)
      return res.status(500).json({ error: 'Required statuses not found' });

    const updated = await Ride.query().upsertGraph({
      id: rideId,
      driverId,
      statusId: acceptedStatus.id,
      statusHistory: [
        { statusId: acceptedStatus.id, updated_by: 'driver' },
        { statusId: onTheWayStatus.id, updated_by: 'driver' }
      ]
    }, {
      relate: true,
      insertMissing: true,
      noDelete: true
    });

    res.status(200).json({ message: 'Ride accepted', data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Get All Driver Rides
exports.getDriverRides = async (req, res) => {
  try {
    const { driverId } = req.params;
    const rides = await Ride.query()
      .where('driverId', driverId)
      .withGraphFetched('[vehicleType, status]')
      .orderBy('created_at', 'desc');

    res.status(200).json({ data: rides });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Update Ride Status
exports.updateRideStatus = async (req, res) => {
  try {
    const { driverId, rideId } = req.params;
    const { statusId } = req.body;

    const ride = await Ride.query().findById(rideId);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.driverId !== driverId) return res.status(403).json({ error: 'Unauthorized' });

    const newStatus = await RideStatus.query().findById(statusId);
    if (!newStatus) return res.status(400).json({ error: 'Invalid status ID' });

    const allowedStatusCodes = ['completed', 'cancelled'];
    if (!allowedStatusCodes.includes(newStatus.code)) {
      return res.status(400).json({ error: 'Only completed or cancelled allowed' });
    }

    if (ride.statusId === statusId) {
      return res.status(400).json({ error: 'Already in this status' });
    }

    const updatedRide = await Ride.query().upsertGraph({
      id: rideId,
      statusId,
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          statusId,
          updated_by: 'driver'
        }
      ]
    }, {
      relate: true,
      insertMissing: true,
      noDelete: true
    });

    res.status(200).json({ message: 'Ride status updated', data: updatedRide });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Get Ride Details
exports.getRideDetails = async (req, res) => {
  try {
    const { driverId, rideId } = req.params;

    const ride = await Ride.query().findById(rideId);
    if (!ride || ride.driverId !== driverId)
      return res.status(403).json({ error: 'Unauthorized access' });

    const rideDetails = await Ride.query()
      .findById(rideId)
      .withGraphFetched('[user, vehicleType, status]');

    res.status(200).json({ data: rideDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. List All Vehicle Types
exports.getAllVehicleTypes = async (req, res) => {
  try {
    const types = await VehicleType.query().orderBy('created_at', 'desc');
    res.status(200).json({ data: types });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 8. Assign Vehicle Type
exports.assignVehicleType = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { vehicleTypeId } = req.body;

    const driver = await Driver.query().findById(driverId);
    if (!driver) return res.status(404).json({ error: 'Driver not found' });

    const updated = await Driver.query().patchAndFetchById(driverId, {
      vehicleTypeId
    });

    res.status(200).json({ message: 'Vehicle type assigned', data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 9. Book Ride (Optional)
exports.bookRide = async (req, res) => {
  try {
    const { userId, pickup, drop, vehicleTypeId } = req.body;

    const vehicleType = await VehicleType.query().findById(vehicleTypeId);
    if (!vehicleType) return res.status(400).json({ error: 'Invalid vehicle type' });

    const pendingStatus = await RideStatus.query().findOne({ code: 'pending' });

    const ride = await Ride.query().insert({
      id: uuid(),
      userId,
      pickup,
      drop,
      vehicleTypeId,
      statusId: pendingStatus?.id,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Ride booked successfully', data: ride });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
