const mongoose = require("mongoose")

const LocationSchema = new mongoose.Schema({
    room: {
        type: String,
        match: [
            /^\b([A-F])[.]([1-6])[.]([1-9]|[12][0-9]|3[01])\b$/,
            "Please have romm in this format A.1.1",
        ],
        unique: true,
        immutable: true,
        required: [true, "Please provide room"],
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: "Department",
        required: [true, "Please provide departmentId"],
    },
})

module.exports = mongoose.model("Location", LocationSchema)
