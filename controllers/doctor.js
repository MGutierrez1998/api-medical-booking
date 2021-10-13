const Doctor = require('../models/Doctor')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')

const getAllDoctors = async (req,res) => {
    const doctor = await Doctor.find({})
    res.status(StatusCodes.OK).json({ doctor, count: doctor.length })
}

const getDoctor = async (req,res) => {
    const {
        params: { id: doctorId },
    } = req

    const doctor = await Doctor.findOne({
        _id: doctorId,
    })
    if (!doctor) {
        throw new NotFoundError(`No doctor with id ${doctorId}`)
    }
    res.status(StatusCodes.OK).json({ doctor })
}

const createDoctor = async (req,res) => {
    req.body.userId = req.user.userId
    const doctor = await Doctor.create(req.body)

    res.status(StatusCodes.CREATED).json(doctor)
}

const updateDoctor = async (req,res) => {
    const {
        body: { department, certification },
        params: { id: doctorId },
    } = req

    if (department ===  '' || certification === '' ) {
        throw new BadRequestError('deprtment and cecrtification fields cannot be empty')
    }

    const doctor = await Doctor.findByIdAndUpdate(
        { _id: doctorId },
        req.body,
        { new: true, runValidators: true }
    )
    if (!doctor) {
        throw new NotFoundError(`No doctor with id ${doctorId}`)
    }
    res.status(StatusCodes.OK).json({ doctor })
}

module.exports = {
    getAllDoctors,
    getDoctor,
    createDoctor,
    updateDoctor,
}