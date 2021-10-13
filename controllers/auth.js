const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    const user = await User.create({ ... req.body })
    const token = await user.createJWT()

    const { email, role, name, surname } = user
    res.status(StatusCodes.CREATED)
        .json({ 
            user: {
                email, role, name, surname, 
            }, 
            token 
        })
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invaild Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invaild Credentials')
    }

    const token = await user.createJWT()
    const { role, name, surname } = user
    res.status(StatusCodes.OK)
        .json({ 
            user: {
                id: user._id,
                email: user.email, 
                role, name, surname 
            }, 
            token 
        })
}

module.exports = {
    register,
    login
}