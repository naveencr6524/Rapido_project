const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const Ride = require("../models/Ride");
const RideStatus = require("../models/RideStatus");
const RideStatusHistory = require("../models/RideStatusHistory");

const createUsers = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ message: "must fill all inputs" });
  }

  try {
    const users = await User.query().insert({
      id: uuidv4(),
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

  if (!userId || !pickupLocation || !dropLocation || !vehicleTypeId) {
    return res.status(400).json({ message: "Must fill all inputs" });
  }

  try {
    const pendingStatus = await RideStatus.query().findOne({ code: "pending" });

    if (!pendingStatus) {
      return res
        .status(500)
        .json({ message: "Ride status 'pending' not found" });
    }

    const ride = await Ride.query().insert({
      id: uuidv4(),
      userId,
      pickupLocation,
      dropLocation,
      vehicleTypeId,
      statusId: pendingStatus.id,
    });

    res.status(201).json({ message: "Ride created successfully", ride });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ride can't be placed", error: error.message });
  }
};

const getUserRides = async (req, res) => {
  const { userId } = req.params;

  try {
    const userRides = await Ride.query().where("usereId", userId);

    if (userRides.length == 0) {
      res.status(404).json({ message: "this  user has no rides" });
    }

    res.status(200).json({ userRides });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error occured while fetching", error: error.mesage });
  }
};

const getRideDeatils = async (req, res) => {
  const { rideId } = req.params;

  try {
    const ride = await Ride.query()
      .findById(rideId)
      .withGraphFetched("[status,vehicleType,driver]")
      .throwIfNotFound();
    res.status(200).json({ mesage: "Ride details fetched successfully", ride });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "some error occured while Fetching",
        error: error.message,
      });
  }
};

const cancelRide = async (req, res) => {
  const { userId, rideId } = req.body;

  try {
    const ride = await Ride.query().findById(rideId);

    if (!ride) {
      res.status(404).json({ message: "ride not found" });
    }

    if (ride.userId !== userId) {
      res.status(403).json({ message: "unauthorized to cancel this ride" });
    }

    const pendingStatus = await RideStatus.query().findOne({ code: "pending" });
    const cancelledStatus = await RideStatus.query().findOne({
      code: "cancelled",
    });

    if (ride.statusId !== pendingStatus.id) {
      return res
        .status(400)
        .json({
          message: "Ride cannot be cancelled. Already accepted or completed.",
        });
    }

    await Ride.query().findById(rideId).patch({
      statusId: cancelledStatus.id,
      updatedAt: new Date().toISOString(),
    });

    await RideStatusHistory.query().insert({
      id: uuidv4(),
      rideId,
      statusId: cancelledStatus.id,
      updated_by: "user"
    });

    res.status(200).json({ message: "Ride cancelled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling ride", error: error.message });
  }
};



const RideStatusHistory = async(req,res) => {
    const {rideId} = req.params;

  if(!rideId){
    res.status(400).json({message:"ride id is required"})
  }

  try {
      const history = await RideStatusHistory.query()
      .where('rideId', rideId)
      .withGraphFetched('status') 
      .orderBy('updated_at', 'asc'); 

      if(history.length==0){
        res.status(404).json({message:"No history available for this ride"})
      }

    res.status(200).json({message:"ride history fetched succesfully",history})
  } catch (error) {
      res.status(500).json({message:"error occured while fetching",error:error.messagae})
  }

}



module.exports = {
  createUsers,
  bookRide,
  getUserRides,
  getRideDeatils,
  cancelRide,
};
