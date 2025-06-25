const { validationResult } = require('express-validator')
const driverService = require('../services/driverService.js')
const validations = require('../validators/driverValidator.js')

const runValidation = async (req, res, rules) => {
    for (const rule of rules) {
        await rule.run(req)
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return true
    }
    return false
}



exports.signUpDriver = async (req, res) => {
    if (await runValidation(req, res, validations.signUpValidation)) return;

    try {
        const driver = await driverService.signUpDriver(req.body)
        res.status(201).json(driver)
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getPendingRides = async (req, res) => {
    try {
        const rides = await driverService.getPendingRides()
        res.json(rides);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.acceptRide = async (req, res) => {
    if (await runValidation(req, res, validations.acceptRideValidation)) return;

    try {
        const { driverId, rideId } = req.params;
        const ride = await driverService.acceptRide(driverId, rideId);
        res.json(ride);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.getDriverRides = async (req, res) => {
    try {
        const rides = await driverService.getDriverRides(req.params.driverId);
        res.json(rides);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateRideStatus = async (req, res) => {
    if (await runValidation(req, res, validations.updateRideStatusValidation)) return;

    try {
        const { driverId, rideId } = req.params;
        const { statusId } = req.body;
        const updated = await driverService.updateRideStatus(driverId, rideId, statusId);
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getRideDetails = async (req, res) => {
    if (await runValidation(req, res, validations.getRideDetailsValidation)) return;

    try {
        const { driverId, rideId } = req.params;
        const ride = await driverService.getRideDetails(driverId, rideId);
        res.json(ride);
    } catch (err) {
        res.status(403).json({ error: err.message });
    }
};