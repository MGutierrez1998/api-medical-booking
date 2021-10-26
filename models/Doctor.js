const mongoose = require("mongoose")
const { certifications } = require("../lists")

const DoctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user"],
        unique: true,
        immutable: true,
        validate: {
            validator: async function () {
                const results = await this.populate("userId", ["role"])
                return results.userId.role === "doctor"
            },
            message: "userId {VALUE} does not have doctor role",
        },
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: "Department",
        required: [true, "Please provide department"],
    },
    certification: {
        type: String,
        enum: {
            values: [...certifications],
            message:
                "{VALUE} is not supported for cetification, choose another certification",
        },
        required: [true, "Please provide cecrtification"],
    },
})

module.exports = mongoose.model("Doctor", DoctorSchema)
