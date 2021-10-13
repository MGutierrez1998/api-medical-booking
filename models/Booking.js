const mongoose = require('mongoose')
const { procedures, departments, departmentsAndProcedures: DnP, procedureAndTime: PnT } = require('../lists')
const { ConflictError } = require('../errors')
const Location = require('./Location')
const Doctor = require('./Doctor')

const BookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide userId'],
            immutable: true,
            validate: {
                validator: async function () {
                    const results = await this.populate('userId',['role'])
                    return results.userId.role === 'patient'
                },
                message: 'userId {VALUE} does not have patient role'
            },
        },
        doctorId: {
            type: mongoose.Types.ObjectId,
            ref: 'Doctor',
            required: [true, 'Please provide doctorId'],
        },
        locationId: {
            type: mongoose.Types.ObjectId,
            ref: 'Location',
            required: [true, 'Please provide locationId'],
        },
        procedure: {
            type: String,
            enum: {
                    values: [ ... procedures ],
                    message: '{VALUE} is not supported for procedure, choose another procedure'
            },
            required: [true, 'Please provide procedure'],
        },
        description: {
            type: String,
            required: [true, 'Please provide a description'],
            maxlength: [100, `Description must not exceed 100 characters`],
            minlength: [3,`Description must be greater than 3 characters`],
        },
        bookingTime: {
            type: Date,
            required: [true, 'Please provide booking time'],
            immutable: true,
        }
    },
    {timestamps: true}
)

BookingSchema.pre('save', async function() {
    // get input booking details
    const {
        procedure,
        doctorId: { department: doctorDepartment },
    } = await this.populate('doctorId', ['department'])

    const {
        locationId: { department: locationDepartment },
    } = await this.populate('locationId', ['department'])

    // checks if Doctor is in the correct department and if they can conduct procedure.
    const check1 = DnP[doctorDepartment].includes(procedure)

    // checks if location can be used by the doctor and therefore the procedure can be conducted in.
    const check2 = doctorDepartment === locationDepartment
    if (!check1 || !check2) {
        throw new ConflictError('doctorId, locationId, procedure is not compatible with each other.')
    } 

    // get the timeframe of the procdure
    const startTime = this.bookingTime.valueOf()
    const endTime = startTime + PnT[procedure]
    const bookingTime = { 
        $gte: startTime,
        $lt: endTime, 
    }

    // checks if the location is free for the timeframe of the procedure
    const locationId = this.locationId._id.toString()
    const location = await booking.find({ locationId, bookingTime })
    if (location[0]) {
        throw new ConflictError('This location is booked at this time')
    }

    // checks if this doctor is free at this timeframe of the procedure
    const doctorId = this.doctorId._id.toString()
    const doctor = await booking.find({ doctorId, bookingTime })
    if (doctor[0]) {
        throw new ConflictError('This doctor is occupied at this time')
    }
})

BookingSchema.methods.checkUpdate = async function ({doctorId, locationId, procedure: updateProcedure}) {
    // Current department booking details
    const {
        procedure,
        doctorId: { department: doctorDepartment },
    } = await this.populate('doctorId', ['department'])

    const {
        locationId: { department: locationDepartment },
    } = await this.populate('locationId', ['department'])

    const procedureDepartment = departments.filter((p) => {
        if ( DnP[p].includes(procedure) ) {
            return p
        }
    })[0]

    // New department booking details
    const doctor = await Doctor.findById(doctorId)
    const location = await Location.findById(locationId)

    const newDoctor = doctor?.department
    const newLocation = location?.department
    const newProcedure = departments.filter((p) => {
        if ( DnP[p].includes(updateProcedure) ) {
            return p
        }
    })[0]

    // validator, checks if all doctor, location and precedure are all from the same department
    const check1 = newDoctor ?? doctorDepartment
    const check2 = newLocation ?? locationDepartment
    const check3 = newProcedure ?? procedureDepartment

    if (!(check1 === check2 && check1 === check3 && check2 === check3)) {
        throw new ConflictError(`doctorId, locationId, procedure must all corrolate to the same Department`)
    }

    // get update information
    const checkDoctor = doctorId ?? this.doctorId._id
    const checkLocation = locationId ?? this.locationId._id
    const checkProcedure = updateProcedure ?? procedure
    
    // calculate time range of the updating values
    const startTime = this.bookingTime.valueOf()
    const endTime = startTime + PnT[checkProcedure]
    const bookingTime = { 
        $gte: startTime,
        $lt: endTime, 
    }

    // checks if the location is available and is not being used for the timeframe
    if (!(this.locationId._id.toString() === checkLocation.toString())) {
        const availability = await booking.find({ locationId: checkLocation, bookingTime })
        if (availability[0]) {
            throw new ConflictError('This location is not available at this timeframe')
        }
    }
    
    // checks if the doctor is available and is not being used for the timeframe
    if (!(this.doctorId._id.toString() === checkDoctor.toString())) {
        const availability = await booking.find({ doctorId: checkDoctor, bookingTime })
        if (availability[0]) {
            throw new ConflictError('This doctor is not available at this timeframe')
        }
    }
}

const booking = mongoose.model('Booking', BookingSchema)
module.exports = booking