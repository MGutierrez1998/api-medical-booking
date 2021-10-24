const Procedure = require("../models/Procedure")
const { StatusCodes } = require("http-status-codes")
const { NotFoundError } = require("../errors")

const getAllProcedures = async (req, res) => {
    const result = Procedure.find({})
    const procedure = await result
    res.status(StatusCodes.OK).json({ procedure, count: procedure.length })
}

const getProcedure = async (req, res) => {
    const {
        params: { id: procedureId },
    } = req

    const result = Procedure.findById(procedureId)
    const procedure = await result
    if (!procedure) {
        throw new NotFoundError(`No procedure with id ${procedureId}`)
    }
    res.status(StatusCodes.OK).json({ procedure })
}

const createProcedure = async (req, res) => {
    const procedure = await Procedure.create(req.body)
    res.status(StatusCodes.CREATED).json(procedure)
}

const deleteProcedure = async (req, res) => {
    const {
        params: { id: procedureId },
    } = req

    const procedure = await Procedure.findByIdAndRemove(procedureId)
    if (!procedure) {
        throw new NotFoundError(`No procedure with id ${procedureId}`)
    }
    res.status(StatusCodes.OK).send(`deleted document ${procedureId}`)
}

module.exports = {
    getAllProcedures,
    getProcedure,
    createProcedure,
    deleteProcedure,
}
