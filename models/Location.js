const mongoose = require('mongoose')
const { departments } = require('../lists')

const LocationSchema = new mongoose.Schema(
    {
        room: {
            type: String,
            match: [
                /^\b([A-F])[.]([1-6])[.]([1-9]|[12][0-9]|3[01])\b$/,
                'Please have romm in this format A.1.1'
            ],
            unique: true,
            immutable: true,
            required: [true, 'Please provide room'],
        },
        department: {
            type: String,
            enum: {
                    values: [ ... departments ],
                    message: '{VALUE} is not supported for department, choose another deparment'
            },
            required: [true, 'Please provide department'],
        }
    }
)

module.exports = mongoose.model('Location', LocationSchema)