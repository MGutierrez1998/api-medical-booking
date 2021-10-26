const Booking = require("../models/Booking")
const { StatusCodes } = require("http-status-codes")
const { NotFoundError, BadRequestError } = require("../errors")

const getAllBookings = async (req, res) => {
    const {
        userId,
        doctorId,
        locationId,
        procedureId,
        week,
        dateFilters,
        select,
    } = req.query
    const queryObject = {}

    if (userId) {
        queryObject.userId = userId
    }
    if (doctorId) {
        queryObject.doctorId = doctorId
    }
    if (locationId) {
        queryObject.locationId = locationId
    }
    if (procedureId) {
        queryObject.procedureId = procedureId
    }
    // uses specified datetime to get the range of the whole week
    if (week) {
        const current = new Date(Number(week))
        let weekstart = current.getDate() - current.getDay()
        let weekend = weekstart + 7
        weekstart = new Date(current.setDate(weekstart))
        weekend = new Date(current.setDate(weekend))
        queryObject.bookingTime = {
            $gte: weekstart.setHours(0, 0, 0, 0),
            $lt: weekend.setHours(0, 0, 0, 0),
        }
    }
    // specify a date range
    if (dateFilters) {
        dateFilters.replace("&lt;", "<")
        dateFilters.replace("&lte;", "<=")
        const operatorMap = {
            ">": "$gt",
            ">=": "$gte",
            "=": "$eq",
            "<": "$lt",
            "<=": "$lte",
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = dateFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        )
        const options = ["bookingTime"]
        filters = filters.split(",").forEach((item) => {
            const [field, operator, value] = item.split("-")
            if (options.includes(field)) {
                queryObject[field] = { [operator]: new Date(Number(value)) }
            }
        })
    }

    const result = Booking.find(queryObject)

    result.populate("userId", ["email", "name", "surname", "mobile"])
    result.populate({
        path: "doctorId",
        populate: {
            path: "userId",
            select: ["email", "name", "surname", "mobile"],
        },
    })
    result.populate("locationId")
    result.populate("procedureId")

    // filtering
    if (select) {
        const selectList = select.split(",").join(" ")
        result.select(selectList)
    }

    // pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result.skip(skip).limit(limit)

    const booking = await result
    res.status(StatusCodes.OK).json({ booking, count: booking.length })
}

const getBooking = async (req, res) => {
    const {
        params: { id: bookingId },
    } = req

    const result = Booking.findById(bookingId)
    result.populate("userId", ["email", "name", "surname", "mobile"])
    result.populate({
        path: "doctorId",
        populate: {
            path: "userId",
            select: ["email", "name", "surname", "mobile"],
        },
    })
    result.populate("locationId")
    result.populate("procedureId")

    const booking = await result

    if (!booking) {
        throw new NotFoundError(`No booking with id ${bookingId}`)
    }
    res.status(StatusCodes.OK).json({ booking })
}

const createBooking = async (req, res) => {
    req.body.userId = req.user.userId
    const booking = await Booking.create(req.body)

    res.status(StatusCodes.CREATED).json(booking)
}

const updateBooking = async (req, res) => {
    const {
        body: { doctorId, locationId, procedureId, description, bookingTime },
        params: { id: bookingId },
    } = req

    if (
        doctorId === "" ||
        locationId === "" ||
        procedureId === "" ||
        description === "" ||
        bookingTime === ""
    ) {
        throw new BadRequestError(
            "doctorId, locationId, procedureId, description, bookingTime fields cannot be empty"
        )
    }

    const results = await Booking.findById(bookingId)
    if (!results) {
        throw new NotFoundError(`No booking with id ${bookingId}`)
    }

    await results.checkUpdate({
        doctorId,
        locationId,
        procedureId,
        bookingTime,
    })

    const booking = await Booking.findByIdAndUpdate(bookingId, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(StatusCodes.OK).json({ booking })
}

const deleteBooking = async (req, res) => {
    const {
        params: { id: bookingId },
    } = req

    const booking = await Booking.findByIdAndRemove(bookingId)
    if (!booking) {
        throw new NotFoundError(`No booking with id ${bookingId}`)
    }
    res.status(StatusCodes.OK).send(`deleted document ${bookingId}`)
}

module.exports = {
    getAllBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
}
