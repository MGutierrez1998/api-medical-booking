const Profile = require('../models/Profile')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')

const getAllProfiles = async (req,res) => {
    const profile = await Profile.find({}).sort('createdAt')
    res.status(StatusCodes.OK).json({ profile, count: profile.length })
}

const getProfile = async (req,res) => {
    const {
        user: { userId },
        params: { id: profileId },
    } = req

    const profile = await Profile.findOne({
        _id: profileId,
        userId,
    })
    if (!profile) {
        throw new NotFoundError(`No profile with id ${profileId}`)
    }
    res.status(StatusCodes.OK).json({ profile })
}

const createProfile = async (req,res) => {
    req.body.userId = req.user.userId
    const profile = await Profile.create(req.body)

    res.status(StatusCodes.CREATED).json(profile)
}

const updateProfile = async (req,res) => {
    const {
        body: { name, surname, gender, nationality, mobile, street },
        user: { userId },
        params: { id: profileId },
    } = req

    if (name === '' || surname === '' || gender === '' || nationality === '' || mobile === '' || street === '') {
        throw new BadRequestError('name, surname, gender, nationality, mobile, street fields cannot be empty')
    }
    const profile = await Profile.findByIdAndUpdate(
        { _id: profileId, userId },
        req.body,
        { new: true, runValidators: true }
    )
    if (!profile) {
        throw new NotFoundError(`No profile with id ${profileId}`)
    }
    res.status(StatusCodes.OK).json({ profile })
}

module.exports = {
    getAllProfiles,
    getProfile,
    createProfile,
    updateProfile,
}