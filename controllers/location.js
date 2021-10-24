const Location = require("../models/Location")
const { StatusCodes } = require("http-status-codes")
const { NotFoundError, BadRequestError } = require("../errors")

const getAllLocations = async (req, res) => {
    const { room, departmentId } = req.query
    const queryObject = {}

    if (room) {
        queryObject.room = { $regex: room, $options: "i" }
    }
    if (departmentId) {
        queryObject.departmentId = departmentId
    }

    const result = Location.find(queryObject)
    // pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    result.skip(skip).limit(limit)

    const location = await result
    res.status(StatusCodes.OK).json({ location, count: location.length })
}

const getLocation = async (req, res) => {
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

const createLocation = async (req, res) => {
    const location = await Location.create(req.body)
    res.status(StatusCodes.CREATED).json(location)
}

const updateLocation = async (req, res) => {
    const {
        body: { room, department },
        params: { id: locationId },
    } = req

    if (room === "" || department === "") {
        throw new BadRequestError("room, department fields cannot be empty")
    }

    const location = await Location.findByIdAndUpdate(locationId, req.body, {
        new: true,
        runValidators: true,
    })
    if (!location) {
        throw new NotFoundError(`No location with id ${locationId}`)
    }
    res.status(StatusCodes.OK).json({ location })
}

const deleteLocation = async (req, res) => {
    const {
        params: { id: locationId },
    } = req

    const location = await Location.findByIdAndRemove(locationId)
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
