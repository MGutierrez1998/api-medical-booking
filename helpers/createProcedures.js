require("dotenv").config()
const PnT = require("./lists/procedureAndTime")
const Procedure = require("../models/Procedure")
const connectDB = require("../db/connect")

const procedureList = Object.keys(PnT).map((procedure) => {
    return {
        procedure,
        duration: PnT[procedure],
    }
})

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Procedure.create([...procedureList])
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()
