const User = require("../../models/constants/User");
const Ride = require("../../models/constants/Ride");
const RideStatus = require("../../models/constants/RideStatus");
const RideStatusHistory = require("../../models/constants/RideStatusHistory");
const VehicleType = require("../../models/VehicleType");
const Driver = require("../../models/constants/Driver");
const { message } = require("statuses");

const createUsers = async (req, res) => {
  

 
  try {
    const { name, email, phone } = req.body;
    const users = await User.query().insert({
      name,
      email,
      phone,
    });

    res.status(201).json({
      message: "user created successfully",
      user: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "error occurred while creating",
      error: error.message,
    });
  }
};

const bookRide = async (req, res) => {
  const { userId, pickupLocation, dropLocation, vehicleTypeId } = req.body;

  try {
    const pendingStatus = await RideStatus.query().findOne({ code: "pending" });

    const availableDriver = await Driver.query()
      .where({
        vehicleTypeId,
        isAvailable: true,
      })
      .first();

    if (!availableDriver) {
      return res.status(400).json({
        message: "No available drivers for the selected vehicle type",
      });
    }

    if (!pendingStatus) {
      return res
        .status(500)
        .json({ message: "Ride status 'pending' not found" });
    }

    const rideData = await Ride.query().upsertGraph(
      {
        userId,
        pickupLocation,
        dropLocation,
        vehicleTypeId,
        fare: 100,
        statusId: pendingStatus.id,
        statusHistory: [
          {
            statusId: pendingStatus.id,
            updated_by: "user",
          },
        ],
      },
      {
        relate: true,
        insertMissing: true,
        noDelete: true,
      }
    );

    res.status(201).json({ message: "Ride Booked successfully", rideData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ride can't be placed", error: error.message });
  }
};

const getUserRides = async (req, res) => {
  try {
    const { userId } = req.params;

    const userRides = await Ride.query().where("userId", userId);

    if (userRides.length == 0) {
      res.json({message:[]});
    }

    res.status(200).json({ userRides });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error occured while fetching", error: error.mesage });
  }
};

const getRideDeatils = async (req, res) => {
  

  try {
     const { rideId } = req.params;
    const ride = await Ride.query()
      .findById(rideId)
      .withGraphFetched("[status,vehicleType,driver,statusHistory]")
      .throwIfNotFound();
    res.status(200).json({ mesage: "Ride details fetched successfully", ride });
  } catch (error) {
    res.status(500).json({
      message: "some error occured while Fetching",
      error: error.message,
    });
  }
};

const cancelRide = async (req, res) => {

  try {
    const { userId, rideId } = req.body;

    const ride = await Ride.query().findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "ride not found" });
    }

    if (ride.userId !== userId) {
      res.status(403).json({ message: "unauthorized to cancel this ride" });
    }

    const pendingStatus = await RideStatus.query().findOne({ code: "pending" });

    if (ride.statusId !== pendingStatus.id) {
      return res.status(400).json({
        message: "Ride cannot be cancelled. Already accepted or completed.",
      });
    }

    const cancelledStatus = await RideStatus.query().findOne({
      code: "cancelled",
    });

    await Ride.query().upsertGraph(
      {
        id: rideId,
        statusId: cancelledStatus.id,
        // updatedAt: new Date().toISOString(),
        statusHistory: [
          {
            rideId,
            statusId: cancelledStatus.id,
            updated_by: "user",
          },
        ],
      },
      {
        relate: true,
        insertMissing: true,
        noDelete: true,
      }
    );

    res.status(200).json({ message: "Ride cancelled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling ride", error: error.message });
  }
};

const RideStatusHistories = async (req, res) => {
 
 
  try {
    const { rideId } = req.params;
    const history = await RideStatusHistory.query()
      .where("rideId", rideId)
      .withGraphFetched("status")
      .orderBy("updated_at", "asc");

    if (history.length == 0) {
      res.json({ message:[] });
    }

    res
      .status(200)
      .json({ message: "ride history fetched succesfully", history });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error occured while fetching", error: error.messagae });
  }
};

module.exports = {
  getRideDeatils,
  createUsers,
  cancelRide,
  RideStatusHistories,
  bookRide,
  getUserRides,
};
