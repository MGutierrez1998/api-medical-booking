const Booking = require('../models/Booking')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')

const getAllBookings = async (req,res) => {
    const booking = await Booking.find({})
    res.status(StatusCodes.OK).json({ booking, count: booking.length })
}

const getBooking = async (req,res) => {
    const {
        params: { id: bookingId },
    } = req

    const booking = await Booking.findOne({
        _id: bookingId,
    })
    if (!booking) {
        throw new NotFoundError(`No doctor with id ${bookingId}`)
    }
    res.status(StatusCodes.OK).json({ booking })
}

const createBooking = async (req,res) => {
    req.body.userId = req.user.userId
    const booking = await Booking.create(req.body)

    res.status(StatusCodes.CREATED).json(booking)
}

const updateBooking = async (req,res) => {
    const {
        body: { doctorId, locationId, procedure, description, bookingTime },
        params: { id: bookingId },
    } = req

    if (doctorId === '' || locationId === '' || procedure === '' || description === '' || bookingTime === '') {
        throw new BadRequestError('doctorId, locationId, procedure, description, bookingTime fields cannot be empty')
    }

    const booking = await Booking.findByIdAndUpdate(
        { _id: bookingId },
        req.body,
        { new: true, runValidators: true }
    )
    if (!booking) {
        throw new NotFoundError(`No booking with id ${bookingId}`)
    }
    res.status(StatusCodes.OK).json({ booking })
}

const deleteBooking = async (req,res) => {
    const {
        params: { id: bookingId },
    } = req

    const booking = await Booking.findByIdAndRemove({
        _id: bookingId
    })
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