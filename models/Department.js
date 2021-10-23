const mongoose = require("mongoose")

const DepartmentSchema = new mongoose.Schema({
    department: {
        type: String,
        maxlength: [100, `Deprtment must not exceed 100 characters`],
        minlength: [3, `Deprtment must be greater than 3 characters`],
        trim: true,
        required: [true, "Please provide duration"],
        immutable: true,
        unique: true,
    },
    procedures: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Procedure",
            index: { unique: true, dropDups: true },
        },
    ],
})

module.exports = mongoose.model("Department", DepartmentSchema)
