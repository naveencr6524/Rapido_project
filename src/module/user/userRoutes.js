const express = require('express');
const router = express.Router();
const controller = require('./userController')
const validators = require('../validators/validators');
const validate = require('../validators/validateMiddleWare');

// user scenarios

router.post('/createuser', validators.createUserValidator, validate, controller.createUsers);
router.post('/bookride', validators.bookRideValidator, validate, controller.bookRide);
router.get('/getUserRides/:userId', validators.getUserRidesValidator, validate, controller.getUserRides);
router.get('/getRideDetails/:rideId', validators.getRideDetailsValidator, validate, controller.getRideDeatils);
router.post('/cancelRide', validators.cancelRideValidator, validate, controller.cancelRide);
router.get('/rideStatusHistory/:rideId', validators.getRideHistoryValidator, validate, controller.RideStatusHistories)


module.exports = router

