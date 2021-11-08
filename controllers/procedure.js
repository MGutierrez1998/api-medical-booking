const Procedure = require("../models/Procedure")
const { StatusCodes } = require("http-status-codes")
const { NotFoundError } = require("../errors")

const getAllProcedures = async (req, res) => {
    const { procedure, numericFilters } = req.query
    const queryObject = {}

    if (procedure) {
        queryObject.procedure = { $regex: procedure, $options: "i" }
    }

    if (numericFilters) {
        numericFilters.replace("&lt;", "<")
        numericFilters.replace("&lte;", "<=")
        console.log(numericFilters)
        const operatorMap = {
            ">": "$gt",
            ">=": "$gte",
            "=": "$eq",
            "<": "$lt",
            "<=": "$lte",
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        )
        const options = ["duration"]
        filters = filters.split(",").forEach((item) => {
            const [field, operator, value] = item.split("-")
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
            }
        })
    }

    const result = Procedure.find(queryObject)
    const procedures = await result
    res.status(StatusCodes.OK).json({ procedures, count: procedures.length })
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
