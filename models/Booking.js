const mongoose = require('mongoose')
const procedures = require('../lists/procedures')

const BookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide userId'],
            immutable: true,
        },
        doctorId: {
            type: mongoose.Types.ObjectId,
            ref: 'Doctor',
            required: [true, 'Please provide doctorId'],
        },
        locationId: {
            type: mongoose.Types.ObjectId,
            ref: 'Location',
            required: [true, 'Please provide locationId'],
        },
        procedure: {
            type: String,
            enum: {
                    values: [ ... procedures ],
                    message: '{VALUE} is not supported for procedure, choose another procedure'
            },
            required: [true, 'Please provide procedure'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
            maxlength: [100, `Description must not exceed ${this[0]} characters`],
            minlength: [3,`Description must be greater than ${this[0]} characters`],
        },
        bookingTime: {
            type: Date,
            required: [true, 'Please provide booking time'],
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model('Booking', BookingSchema)