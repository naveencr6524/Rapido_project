const express = require('express');
const router = express.Router();
const controller = require('../controllers/usercontrol')

// user scenarios

  router.post('/createuser',controller.createUsers);
  router.post('/bookride',controller.bookRide);
  router.get('/getUserRides/:userId',controller.getUserRides);
  router.get('/getRideDetails/:rideId',controller.getRideDeatils);
  router.get('./cancelRide',controller.cancelRide);
  


  module.exports=router