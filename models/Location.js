const mongoose = require('mongoose')
const deparments = require('../lists/departments')

const LocationSchema = new mongoose.Schema(
    {
        building: {
            type: String,
            enum: {
                    values: [ ... Array(13).keys() ].map(String).splice(1,12),
                    message: '{VALUE} is not supported for building, choose number between 1-12'
            },
            required: [true, 'Please provide building number'],
            immutable: true,
        },
        floor: {
            type: String,
            enum: {
                    values: [ ... Array(7).keys() ].map(String).splice(1,6),
                    message: '{VALUE} is not supported for floor, choose number between 1-6'
            },
            required: [true, 'Please provide floor number'],
            immutable: true,
        },
        room: {
            type: String,
            enum: {
                    values: [ ... Array(21).keys() ].map(String).splice(1,20),
                    message: '{VALUE} is not supported for room, choose number between 1-20'
            },
            required: [true, 'Please provide room number'],
            immutable: true,
        },
        combined: {
            type: String,
            match: [
                /^\d+(\.\d+)*$/,
                'Please have combined in this format 1.1.1'
            ],
            unique: true,
            immutable: true,
        },
        department: {
            type: String,
            enum: {
                    values: [ ... deparments ],
                    message: '{VALUE} is not supported for department, choose another deparment'
            },
            required: [true, 'Please provide room number'],
        }
    }
)

LocationSchema.pre('save', async function() {
    this.combined = `${this.building}.${this.floor}.${this.room}`
})


module.exports = mongoose.model('Location', LocationSchema)