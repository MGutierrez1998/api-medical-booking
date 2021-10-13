const Location = require('../models/Location')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')

const getAllLocations = async (req,res) => {
    const location = await Location.find({})
    res.status(StatusCodes.OK).json({ location, count: location.length })
}

const getLocation = async (req,res) => {
    const {
        params: { id: locationId },
    } = req

    const location = await Location.findOne({
        _id: locationId,
    })
    if (!location) {
        throw new NotFoundError(`No location with id ${locationId}`)
    }
    res.status(StatusCodes.OK).json({ location })
}

const createLocation = async (req,res) => {
    const location = await Location.create(req.body)
    res.status(StatusCodes.CREATED).json(location)
}

const updateLocation = async (req,res) => {
    const {
        body: { building, floor, room, department},
        params: { id: locationId },
    } = req

    if (building === '' || floor === '' || room === '' || department === '') {
        throw new BadRequestError('building, floor, room, department fields cannot be empty')
    }

    req.body.combined = `${building}.${floor}.${room}`
    const location = await Location.findByIdAndUpdate(
        { _id: locationId},
        req.body,
        { new: true, runValidators: true }
    )
    if (!location) {
        throw new NotFoundError(`No location with id ${locationId}`)
    }
    res.status(StatusCodes.OK).json({ location })
}

const deleteLocation = async (req,res) => {
    const {
        params: { id: locationId },
    } = req

    const location = await Location.findByIdAndRemove({
        _id: locationId
    })
    if (!location) {
        throw new NotFoundError(`No location with id ${locationId}`)
    }
    res.status(StatusCodes.OK).send(`deleted document ${locationId}`)
}

module.exports = {
    getAllLocations,
    getLocation,
    createLocation,
    updateLocation,
    deleteLocation,
}