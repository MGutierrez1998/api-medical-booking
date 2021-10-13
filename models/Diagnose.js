const mongoose = require('mongoose')

const DiagnoseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide userId'],
            immutable: true,
        },
        bookingId: {
            type: mongoose.Types.ObjectId,
            ref: 'Booking',
            required: [true, 'Please provide bookingId'],
            immutable: true,
            unique: true,
        },
        issue: {
            type: String,
            required: [true, 'Please provide a issue'],
            maxlength: [200, `Issue must not exceed ${this[0]} characters`],
            minlength: [3,`Issue must be greater than ${this[0]} characters`],
        },
        outcome: {
            type: String,
            required: [true, 'Please provide a outcome'],
            maxlength: [200, `Outcome must not exceed ${this[0]} characters`],
            minlength: [3,`Outcome must be greater than ${this[0]} characters`],
        },
        recommendation: {
            type: String,
            required: [true, 'Please provide a recommendation'],
            maxlength: [200, `Recommendation must not exceed ${this[0]} characters`],
            minlength: [3,`Recommendation must be greater than ${this[0]} characters`],
        },
    },
    {timestamps: true}
)

module.exports = mongoose.model('Diagnose', DiagnoseSchema)