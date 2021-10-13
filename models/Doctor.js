const mongoose = require('mongoose')
const deparments = require('../lists/departments')
const certifications = require('../lists/certifications')

const DoctorSchema = new mongoose.Schema(
    {
        userId: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: [true, 'Please provide user'],
                unique: true,
                immutable: true,
        },
        department: {
            type: String,
            enum: {
                    values: [ ... deparments ],
                    message: '{VALUE} is not supported for department, choose another deparment'
            },
            required: [true, 'Please provide department'],
        },
        certification: {
            type: String,
            enum: {
                    values: [ ... certifications ],
                    message: '{VALUE} is not supported for cetification, choose another certification'
            },
            required: [true, 'Please provide cecrtification'],
        }
})


module.exports = mongoose.model('Doctor', DoctorSchema)