const express = require('express');
const router = express.Router();
const controller = require('../controllers/usercontrol')
const driverController = require('../controllers/driverController.js')

// user scenarios

router.post('/createuser', controller.createUsers);
router.post('/bookride', controller.bookRide);
router.get('/getUserRides/:userId', controller.getUserRides);
router.get('/getRideDetails/:rideId', controller.getRideDeatils);
router.get('./cancelRide', controller.cancelRide);

//driver scenarios


router.post('/createdriver',driverController.signUpDriver);
router.get('/pendingrides',driverController.getPendingRides);
router.patch('/pendingrides/:rideId',driverController.acceptRide);
router.get('/driverrides/:driverId',driverController.getDriverRides);
router.patch('/ridestatus/:rideId',driverController.updateRideStatus);
router.get('/ridedetails/:rideId',driverController.getRideDetails)

module.exports = router