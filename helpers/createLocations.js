require("dotenv").config()
const Department = require("../models/Department")
const Location = require("../models/Location")
const connectDB = require("../db/connect")

function createLocationArray(departments) {
    const buildings = "ABCDEF".split("")
    const floors = [...Array(7).keys()].map(String).splice(1, 6)
    const rooms = [...Array(32).keys()].map(String).splice(1, 31)

    let locationArray = []
    buildings.forEach((building) => {
        floors.forEach((floor) => {
            rooms.forEach((room) => {
                const randomDepartment =
                    departments[Math.floor(Math.random() * departments.length)]
                const locationObj = {
                    room: `${building}.${floor}.${room}`,
                    departmentId: `${randomDepartment}`,
                }
                locationArray.push(locationObj)
            })
        })
    })

    return locationArray
}

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        const results = await Department.find({})
        const departments = results.map((department) =>
            department._id.toString()
        )
        const locationArray = createLocationArray(departments)
        await Location.create([...locationArray])
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()
