const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user'],
            unique: true,
            immutable:true,
        },
        name: {
            type: String,
            required: [true, 'Please provide first name'],
            maxlength: [50, `Name must not exceed ${this[0]} characters`],
            minlength: [3,`Name must be greater than ${this[0]} characters`],
            match: [/^[A-Za-z]+$/, 'Please only use character in the alphabet for name'],
            lowercase: true,
            trim: true,
        },
        surname: {
            type: String,
            required: [true, 'Please provide surname'],
            maxlength: [50, `Surname must not exceed ${this[0]} characters`],
            minlength: [3, `Surname must be greater than ${this[0]} characters`],
            match: [/^[A-Za-z]+$/, 'Please only use character in the alphabet for surname'],
            lowercase: true,
            trim: true,
        },
        gender: {
            type: String,
            enum: {
                values: ['male','female','other'],
                message: '{VALUE} is not supported'
            },
            default: 'other',
        },
        nationality: {
            type: String,
            maxlength: [50, `Nationality must not exceed ${this[0]} characters`],
            minlength: [3,`Nationality must be greater than ${this[0]} characters`],
            match: [/^[A-Za-z]+$/, 'Please only use character in the alphabet for nationality'],
            default: null,
            lowercase: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: [true, 'Please provide mobile number'],
            match: [/^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/, 
            'Please only use numbers for mobile'],
        },
        street: {
            type: String,
            required: [true, 'Please provide a street'],
            maxlength: [100, `Street cannot exceed ${this[0]} characters`],
            minlength: [3, `Street must be greater than ${this[0]} characters`],
            lowercase: true,
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model('Profile', ProfileSchema)