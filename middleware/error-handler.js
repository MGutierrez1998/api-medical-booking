const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later'
    }

    if(err.name === "ValidationError") {
        customError.msg = Object.values(err.errors).map((item) => item.message).join(', ')
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    if (err.code && err.code === 11000) {
        customError.msg = `'${err.message.split('"')[1]}' value entered for '${err.message.split(':')[2].split('_')[0].trim()}' field already exists, please choose another value`
        customError.statusCode = StatusCodes.BAD_REQUEST
    } 

    if (err.name === 'CastError') {
        customError.msg = `No item found with id : ${err.value}`
        customError.statusCode = StatusCodes.NOT_FOUND
    }

    return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
