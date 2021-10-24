const mongoose = require("mongoose")
const { ConflictError } = require("../errors")
const Department = require("./Department")
const Doctor = require("./Doctor")
const Location = require("./Location")
const Procedure = require("./Procedure")

const BookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide userId"],
            immutable: true,
            validate: {
                validator: async function () {
                    const results = await this.populate("userId", ["role"])
                    return results.userId.role === "patient"
                },
                message: "userId {VALUE} does not have patient role",
            },
        },
        doctorId: {
            type: mongoose.Types.ObjectId,
            ref: "Doctor",
            required: [true, "Please provide doctorId"],
        },
        locationId: {
            type: mongoose.Types.ObjectId,
            ref: "Location",
            required: [true, "Please provide locationId"],
        },
        procedureId: {
            type: mongoose.Types.ObjectId,
            ref: "Procedure",
            required: [true, "Please provide procedureId"],
        },
        description: {
            type: String,
            required: [true, "Please provide a description"],
            maxlength: [100, `Description must not exceed 100 characters`],
            minlength: [3, `Description must be greater than 3 characters`],
        },
        bookingTime: {
            type: Date,
            required: [true, "Please provide booking time"],
            immutable: true,
        },
    },
    { timestamps: true }
)

BookingSchema.pre("save", async function () {
    // get input booking details
    const {
        doctorId: { departmentId: doctorDepartment },
    } = await this.populate("doctorId", ["departmentId"])
    const {
        locationId: { departmentId: locationDepartment },
    } = await this.populate("locationId", ["departmentId"])
    const {
        procedureId: { _id: procedure_id, duration: procedureDuration },
    } = await this.populate("procedureId")

    const { procedures } = await Department.findById(doctorDepartment)

    // checks if Doctor is in the correct department and if they can conduct procedure.
    const check1 = procedures.includes(procedure_id)

    // checks if location can be used by the doctor and therefore the procedure can be conducted in.
    const check2 = doctorDepartment.toString() === locationDepartment.toString()
    if (!check1 || !check2) {
        throw new ConflictError(
            "doctorId, locationId, procedureId is not compatible with each other."
        )
    }

    // get the timeframe of the procdure
    const startTime = this.bookingTime.valueOf()
    const endTime = startTime + procedureDuration
    const bookingTime = {
        $gte: startTime,
        $lt: endTime,
    }

    // checks if the location is free for the timeframe of the procedure
    const locationId = this.locationId._id.toString()
    const location = await booking.find({ locationId, bookingTime })
    if (location[0]) {
        throw new ConflictError("This location is booked at this time")
    }

    // checks if this doctor is free at this timeframe of the procedure
    const doctorId = this.doctorId._id.toString()
    const doctor = await booking.find({ doctorId, bookingTime })
    if (doctor[0]) {
        throw new ConflictError("This doctor is occupied at this time")
    }

    // checks if this user already has a booking in this timeframe
    const userId = this.userId._id.toString()
    const user = await booking.find({ userId, bookingTime })
    if (user[0]) {
        throw new ConflictError(
            "This user already has a booking at this timeframe"
        )
    }
})

BookingSchema.methods.checkUpdate = async function ({
    doctorId,
    locationId,
    procedureId: updateProcedure,
}) {
    // Current department booking details
    const {
        doctorId: { departmentId: doctorDepartment },
    } = await this.populate("doctorId", ["departmentId"])

    const {
        locationId: { departmentId: locationDepartment },
    } = await this.populate("locationId", ["departmentId"])
    const {
        procedureId: { _id: procedure_id, duration: procedureDuration },
    } = await this.populate("procedureId")

    const departments = await Department.find({})
    const procedureDepartment = departments.filter(({ _id, procedures }) => {
        if (procedures.includes(procedure_id)) {
            return _id
        }
    })[0]

    // getting departments of update data
    const doctor = Doctor.findById(doctorId)
    const location = Location.findById(locationId)
    const newDoctor = doctor?.departmentId
    const newLocation = location?.departmentId
    const newProcedure = departments.filter(({ _id, procedures }) => {
        if (procedures.includes(updateProcedure)) {
            return _id
        }
    })[0]

    // validator, checks if all doctor, location and precedure are all from the same department
    const check1 = newDoctor ?? doctorDepartment
    const check2 = newLocation ?? locationDepartment
    const check3 = newProcedure?._id ?? procedureDepartment?._id

    if (
        !(
            check1.toString() === check2.toString() &&
            check1.toString() === check3.toString() &&
            check2.toString() === check3.toString()
        )
    ) {
        throw new ConflictError(
            `doctorId, locationId, procedureId must all corrolate to the same Department`
        )
    }

    // get update information
    const checkDoctor = doctorId ?? this.doctorId._id
    const checkLocation = locationId ?? this.locationId._id
    const updateProcedureDuration = await Procedure.findById(updateProcedure)
    const newProcedureDuration =
        updateProcedureDuration?.duration ?? procedureDuration

    // calculate time range of the updating values
    const startTime = this.bookingTime.valueOf()
    const endTime = startTime + newProcedureDuration
    const bookingTime = {
        $gte: startTime,
        $lt: endTime,
    }

    // checks if the location is available and is not being used for the timeframe
    if (!(this.locationId._id.toString() === checkLocation.toString())) {
        const availability = await booking.find({
            locationId: checkLocation,
            bookingTime,
        })
        if (availability[0]) {
            throw new ConflictError(
                "This location is not available at this timeframe"
            )
        }
    }

    // checks if the doctor is available and is not being used for the timeframe
    if (!(this.doctorId._id.toString() === checkDoctor.toString())) {
        const availability = await booking.find({
            doctorId: checkDoctor,
            bookingTime,
        })
        if (availability[0]) {
            throw new ConflictError(
                "This doctor is not available at this timeframe"
            )
        }
    }
}

const booking = mongoose.model("Booking", BookingSchema)
module.exports = booking
