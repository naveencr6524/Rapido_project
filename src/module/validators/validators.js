const { body, param } = require('express-validator');

exports.createUserValidator = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('phone').isLength({ min: 10, max: 10 }).withMessage('Phone must be 10 digits'),
];

exports.bookRideValidator = [
  body('userId').isUUID().withMessage('Valid userId required'),
  body('pickupLocation').notEmpty().withMessage('Pickup location required'),
  body('dropLocation').notEmpty().withMessage('Drop location required'),
  body('vehicleTypeId').isUUID().withMessage('Valid vehicleTypeId required'),
];

exports.cancelRideValidator = [
  body('userId').isUUID().withMessage('Valid userId required'),
  body('rideId').isUUID().withMessage('Valid rideId required'),
];

exports.getUserRidesValidator = [
  param('userId').isUUID().withMessage('Valid userId required'),
];

exports.getRideDetailsValidator = [
  param('rideId').isUUID().withMessage('Valid rideId required'),
];

exports.getRideHistoryValidator = [
  param('rideId').isUUID().withMessage('Valid rideId required'),
];
