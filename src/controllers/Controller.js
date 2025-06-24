
const { v4: uuid } = require('uuid')
const { Drivers } = require('../model/Drivers.js')
const { Rides } = require()
const { VehicleTypes } = require('../model/Vehicle_types.js')


const driverSignUp = async (erq, res) => {
    try {
        const newDriver = await Drivers.query().insert({
            id: uuid(), name: req.body.name, email: req.body.email, phone: req.body.phone,
            vehicleModel: req.body.vehicleModel, vehicleTypeId: req.body.vehicleTypeId,
            vehicleNumber: req.body.vehicleNumber
        })
        res.status(201).json({ message: 'Driver Registered Successfully', driver: newDriver })

    }
    catch (error) {
res.status(500).json({message:'Driver signup failed',error:error.message})
    }
}

