const Doctor = require("../models/Doctor")
const { StatusCodes } = require("http-status-codes")
const { NotFoundError, BadRequestError } = require("../errors")

const getAllDoctors = async (req, res) => {
    const { userId, departmentId, certification, select } = req.query
    const queryObject = {}

    if (userId) {
        queryObject.userId = userId
    }

    if (departmentId) {
        queryObject.departmentId = departmentId
    }

    if (certification) {
        queryObject.certification = { $regex: certification, $options: "i" }
    }

    const result = Doctor.find(queryObject)

    if (select) {
        const selectList = [...select.split(",")]
        result.populate("userId", selectList)
    } else {
        result.populate("userId", ["email", "name", "surname", "mobile"])
    }

    // pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result.skip(skip).limit(limit)

    const doctor = await result
    res.status(StatusCodes.OK).json({ doctor, count: doctor.length })
}

const getDoctor = async (req, res) => {
    const {
        params: { id: doctorId },
        query: { select },
    } = req

    const result = Doctor.findOne({
        _id: doctorId,
    })

    if (select) {
        const selectList = [...select.split(",")]
        result.populate("userId", selectList)
    } else {
        result.populate("userId", ["email", "name", "surname", "mobile"])
    }

    const doctor = await result
    if (!doctor) {
        throw new NotFoundError(`No doctor with id ${doctorId}`)
    }
    res.status(StatusCodes.OK).json({ doctor })
}

const createDoctor = async (req, res) => {
    req.body.userId = req.user.userId
    const doctor = await Doctor.create(req.body)

    res.status(StatusCodes.CREATED).json(doctor)
}

const updateDoctor = async (req, res) => {
    const {
        body: { department, certification },
        params: { id: doctorId },
    } = req

    if (department === "" || certification === "") {
        throw new BadRequestError(
            "deprtment and cecrtification fields cannot be empty"
        )
    }

    const doctor = await Doctor.findByIdAndUpdate(doctorId, req.body, {
        new: true,
        runValidators: true,
    })
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
