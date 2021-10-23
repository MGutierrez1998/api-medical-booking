const Department = require("../models/Department")
const { StatusCodes } = require("http-status-codes")
const { NotFoundError } = require("../errors")

const getAllDepartments = async (req, res) => {
    const result = Department.find({})
    const department = await result
    res.status(StatusCodes.OK).json({ department, count: department.length })
}

const getDepartment = async (req, res) => {
    const {
        params: { id: departmentId },
    } = req

    const result = Department.findById(departmentId)
    const department = await result
    if (!department) {
        throw new NotFoundError(`No department with id ${departmentId}`)
    }
    res.status(StatusCodes.OK).json({ department })
}

const createDepartment = async (req, res) => {
    const department = await Department.create(req.body)
    res.status(StatusCodes.CREATED).json(department)
}

const updateDepartment = async (req, res) => {
    const {
        body: { procedure, updateType },
        params: { id: departmentId },
    } = req

    if (procedure === "" || departmentId === "" || updateType === "") {
        throw new BadRequestError(
            "procedure, departmentId and updateType fields cannot be empty"
        )
    }

    let update = {}

    if (updateType === "push") {
        update = {
            $addToSet: {
                procedures: procedure,
            },
        }
    }

    if (updateType === "pull") {
        update = {
            $pull: {
                procedures: procedure,
            },
        }
    }
    console.log(update)

    const department = await Department.findByIdAndUpdate(
        departmentId,
        update,
        {
            new: true,
            runValidators: true,
        }
    )
    if (!department) {
        throw new NotFoundError(`No department with id ${departmentId}`)
    }
    res.status(StatusCodes.OK).json({ department })
}

const deleteDepartment = async (req, res) => {
    const {
        params: { id: departmentId },
    } = req

    const department = await Department.findByIdAndRemove(departmentId)
    if (!department) {
        throw new NotFoundError(`No department with id ${procedureId}`)
    }
    res.status(StatusCodes.OK).send(`deleted document ${departmentId}`)
}

module.exports = {
    getAllDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
}
