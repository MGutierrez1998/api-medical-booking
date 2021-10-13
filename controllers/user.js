const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')

const getAllUsers = async (req,res) => {
    const { role, name, surname, gender, dateFilters, sort, select } = req.query
    const queryObject = {}

    if (role) {
        queryObject.role = role
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }
    if (surname) {
        queryObject.surname = { $regex: surname, $options: 'i' }
    }
    if (gender) {
        queryObject.gender = gender
    }

    if (dateFilters) {
        dateFilters.replace('&lt;','<')
        dateFilters.replace('&lte;','<=')
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = dateFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        )
        const options = ['createdAt', 'updatedAt']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)) {
                queryObject[field] = { [operator]: new Date(Number(value)) }
            }
        })
    }

    const result = User.find(queryObject)

    if (sort) {
        const sortList = sort.split(',').join(' ')
        result.sort(sortList)
    } else {
        result.sort('createAt')
    }

    if (select) {
        const selectList = select.split(',').join(' ')
        result.select(selectList)
    }

    // pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result.skip(skip).limit(limit)


    const users = await result
    res.status(StatusCodes.OK).json({ users, count: users.length })
}

const getUser = async (req,res) => {
    const {
        params: { id: userId },
    } = req

    const user = await User.findOne({
        _id: userId,
    })
    if (!user) {
        throw new NotFoundError(`No user with id ${userId}`)
    }
    res.status(StatusCodes.OK).json({ user })
}

const updateUser = async (req,res) => {
    const {
        body: { email, passowrd, name, surname, gender, nationality, mobile, street },
        params: { id: userId },
    } = req

    if (email === '' || passowrd === '' || name === '' || surname === '' || gender === '' || nationality === '' || mobile === '' || street === '') {
        throw new BadRequestError('name, surname, gender, nationality, mobile, street fields cannot be empty')
    }
    const user = await User.findByIdAndUpdate(
        userId,
        req.body,
        { new: true, runValidators: true }
    )
    if (!user) {
        throw new NotFoundError(`No user with id ${userId}`)
    }
    res.status(StatusCodes.OK).json({ user })
}

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
}