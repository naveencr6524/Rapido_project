const express = require('express');
const router = express.Router();
const controller = require('./userController')

// user scenarios

  router.post('/createuser',controller.createUsers);
  router.post('/bookride',controller.bookRide);
  router.get('/getUserRides/:userId',controller.getUserRides);
  router.get('/getRideDetails/:rideId',controller.getRideDeatils);
  router.get('./cancelRide',controller.cancelRide);
  router.get('/rideStatusHistory/:rideId',controller.RideStatusHistories)
  


  module.exports=router