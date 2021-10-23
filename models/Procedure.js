const mongoose = require("mongoose")

function generateDurations(start, stop, step) {
    return Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
    )
}

const ProcedureSchema = new mongoose.Schema({
    procedure: {
        type: String,
        maxlength: [100, `Procedure must not exceed 100 characters`],
        minlength: [3, `Procedure must be greater than 3 characters`],
        trim: true,
        required: [true, "Please provide duration"],
        immutable: true,
        unique: true,
    },
    duration: {
        type: Number,
        enum: {
            values: [...generateDurations(300000, 10800000, 300000)],
            message:
                "{VALUE} is not supported for duration, choose between 5 min - 3 hours in milliseconds, steps of 300000ms",
        },
        required: [true, "Please provide duration"],
        immutable: true,
    },
})

module.exports = mongoose.model("Procedure", ProcedureSchema)
