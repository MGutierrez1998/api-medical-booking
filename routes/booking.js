const express = require('express')
const router = express.Router()
const {
    getAllBookings,
    getBooking,
    createBooking,
    updateBooking,
    deleteBooking,
} = require('../controllers/booking')

router.route('/')
    .get(getAllBookings)
    .post(createBooking)

router.route('/:id')
    .get(getBooking)
    .patch(updateBooking)
    .delete(deleteBooking)

module.exports = router