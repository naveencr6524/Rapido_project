const express=require('express')
const router=express.Router()
const controller=require('../../module/user/driverController.js')
const validators=require('../validators/driverValidator.js')
const validate=require('../validators/runValidation.js')

router.post('/driversignup',validators.signUpValidation,validate,controller.signUpDriver)
router.get('/pendingrides',controller.getPendingRides)
router.patch('/accept/:rideId',validators.acceptRideValidation,validate,controller.acceptRide)
router.get('/driverride/:driverId', controller.getDriverRides);
router.patch('/ridestatus/:driverId/:rideId', validators.updateRideStatusValidation, validate, controller.updateRideStatus);
router.get('/ridedetails/:driverId/:rideId', validators.getRideDetailsValidation, validate, controller.getRideDetails);
router.get('/vehicletypes', controller.getAllVehicleTypes);
router.patch('/assignvehicle/:driverId', validators.assignVehicleTypeValidator, validate, controller.assignVehicleType);
router.post('/bookride', validators.bookRideValidator, validate, controller.bookRide);

module.exports = router;