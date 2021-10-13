const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { roles, genders, nationalities } = require('../lists') 
const { BadRequestError } = require('../errors')

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Please provide email'],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please provide a valid email'
            ],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide password'],
            match: [
                /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
                'Password must have minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character'
            ]
        },
        role: {
            type:String,
            enum: {
                values: [ ... roles ],
                message: '{VALUE} is not supported'
            },
            default: roles[0],
            immutable: true,
        },
        name: {
            type: String,
            required: [true, 'Please provide first name'],
            maxlength: [50, `Name must not exceed 50 characters`],
            minlength: [3,`Name must be greater than 3 characters`],
            match: [/^[A-Za-z]+$/, 'Please only use character in the alphabet for name'],
            lowercase: true,
            trim: true,
        },
        surname: {
            type: String,
            required: [true, 'Please provide surname'],
            maxlength: [50, `Surname must not exceed 50 characters`],
            minlength: [3, `Surname must be greater than 3 characters`],
            match: [/^[A-Za-z]+$/, 'Please only use character in the alphabet for surname'],
            lowercase: true,
            trim: true,
        },
        gender: {
            type: String,
            enum: {
                values: [ ... genders],
                message: '{VALUE} is not supported'
            },
            default: genders[0],
        },
        nationality: {
            type: String,
            enum: {
                    values: [ ... nationalities ],
                    message: '{VALUE} is not supported for nationlity, choose another nationality'
            },
            required: [true, 'Please provide nationality'],
        },
        mobile: {
            type: String,
            required: [true, 'Please provide mobile number'],
            match: [/^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$/, 
            'Please only use numbers for mobile'],
        },
        address: {
            type: String,
            required: [true, 'Please provide a address'],
            maxlength: [100, `Address cannot exceed 100 characters`],
            minlength: [3, `Address must be greater than 3 characters`],
            lowercase: true,
        }
    },
    {timestamps: true}
)


UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

UserSchema.pre('findOneAndUpdate', async function() {
    if (this._update.hasOwnProperty('password')) {
        const test = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(this._update.password)
        if (!test) {
            throw new BadRequestError('Password must have minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character')
        }
        const salt = await bcrypt.genSalt(10)
        this._update.password = await bcrypt.hash(this._update.password,salt)
    }
})

UserSchema.methods.createJWT = async function () {
    const { email, role, name, surname } = this
    return jwt.sign(
        { 
            userId: this._id, 
            email, role, name, surname
        }, 
        process.env.JWT_SECRET, 
        {
            expiresIn: process.env.JWT_LIFETIME
        },
    )
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)