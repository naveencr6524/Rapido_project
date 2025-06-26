const { body, param } = require('express-validator');

exports.signUpValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('vehicleModel').notEmpty().withMessage('Vehicle model is required'),
  body('vehicleNumber').notEmpty().withMessage('Vehicle number is required'),
  body('vehicleTypeId').isUUID().withMessage('Valid vehicle type ID is required')
];

exports.acceptRideValidation = [
  param('driverId').isUUID().withMessage('Valid driver ID is required'),
  param('rideId').isUUID().withMessage('Valid ride ID is required')
];

exports.updateRideStatusValidation = [
  param('driverId').isUUID().withMessage('Valid driver ID is required'),
  param('rideId').isUUID().withMessage('Valid ride ID is required'),
  body('statusId').isUUID().withMessage('Valid status ID is required')
];

exports.getRideDetailsValidation = [
  param('driverId').isUUID().withMessage('Valid driver ID is required'),
  param('rideId').isUUID().withMessage('Valid ride ID is required')
];

exports.assignVehicleTypeValidator = [
  body('driverId').isUUID().withMessage('Invalid driverId'),
  body('vehicleTypeId').isUUID().withMessage('Invalid vehicleTypeId'),
];

exports.bookRideValidator = [
  body('userId').isUUID().withMessage('Invalid userId'),
  body('pickup').notEmpty().withMessage('Pickup location is required'),
  body('drop').notEmpty().withMessage('Drop location is required'),
  body('vehicleTypeId').isUUID().withMessage('Invalid vehicleTypeId'),
];