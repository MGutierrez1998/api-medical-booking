const Diagnose = require("../models/Diagnose")
const { StatusCodes } = require("http-status-codes")
const { NotFoundError, BadRequestError } = require("../errors")

const getAllDiagnoses = async (req, res) => {
    const { userId } = req.query
    const queryObject = {}

    if (userId) {
        queryObject.userId = userId
    }

    const result = Diagnose.find(queryObject).sort("createdAt")
    result.populate({
        path: "bookingId",
        populate: {
            path: "procedureId",
        },
    })

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result.skip(skip).limit(limit)

    const diagnose = await result

    res.status(StatusCodes.OK).json({ diagnose, count: diagnose.length })
}

const getDiagnose = async (req, res) => {
    const {
        params: { id: diagnoseId },
    } = req

    const diagnose = await Diagnose.findOne({
        _id: diagnoseId,
    })
    if (!diagnose) {
        throw new NotFoundError(`No diagnose with id ${diagnoseId}`)
    }
    res.status(StatusCodes.OK).json({ diagnose })
}

const createDiagnose = async (req, res) => {
    const diagnose = await Diagnose.create(req.body)

    res.status(StatusCodes.CREATED).json(diagnose)
}

const updateDiagnose = async (req, res) => {
    const {
        body: { userId, bookingId, issue, outcome, recommendation },
        params: { id: diagnoseId },
    } = req

    if (
        userId === "" ||
        bookingId === "" ||
        issue === "" ||
        outcome === "" ||
        recommendation === ""
    ) {
        throw new BadRequestError(
            "userId, bookingId, issue, outcome, recommendation fields cannot be empty"
        )
    }

    const diagnose = await Diagnose.findByIdAndUpdate(
        { _id: diagnoseId },
        req.body,
        { new: true, runValidators: true }
    )
    if (!diagnose) {
        throw new NotFoundError(`No diagnose with id ${diagnoseId}`)
    }
    res.status(StatusCodes.OK).json({ diagnose })
}

module.exports = {
    getAllDiagnoses,
    getDiagnose,
    createDiagnose,
    updateDiagnose,
}
