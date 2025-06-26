const express = require('express');
const router = express.Router();
const controller = require('./userController')
const validators = require('../validators/validators');
const validate = require('../validators/validateMiddleWare');
const driverController = require('./Controller')


// user scenarios

router.post('/createuser', validators.createUserValidator, validate, controller.createUsers);
router.post('/bookride', validators.bookRideValidator, validate, controller.bookRide);
router.get('/getUserRides/:userId', validators.getUserRidesValidator, validate, controller.getUserRides);
router.get('/getRideDetails/:rideId', validators.getRideDetailsValidator, validate, controller.getRideDeatils);
router.post('/cancelRide', validators.cancelRideValidator, validate, controller.cancelRide);
router.get('/rideStatusHistory/:rideId', validators.getRideHistoryValidator, validate, controller.RideStatusHistories)

// Driver Scenarios
router.post('/createdriver', driverController.signUpDriver);
router.get('/pendingrides', driverController.getPendingRides);
router.patch('/acceptRide/:driverId/:rideId', driverController.acceptRide);
router.get('/driverrides/:driverId', driverController.getDriverRides);
router.patch('/ridestatus/:driverId/:rideId/:statusId', driverController.updateRideStatus);
router.get('/ridedetails/:driverId/:rideId', driverController.getRideDetails);
router.get('/vehicletypes', driverController.getAllVehicleTypes);
router.post('/vehicletypes', driverController.assignVehicleType);
router.post('/rides', driverController.bookRide);

module.exports = router

