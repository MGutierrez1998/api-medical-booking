require("dotenv").config()
const User = require("../models/User")
const Doctor = require("../models/Doctor")
const { addresses, names, states, surnames } = require("./lists")
const connectDB = require("../db/connect")
const { certifications, nationalities } = require("../lists")
const Department = require("../models/Department")

const random = (max) => Math.floor(Math.random() * max)
const aL = addresses.length
const stL = states.length
const suL = surnames.length
//const dL = departments.length
const cL = certifications.length
const nL = nationalities.length

const thousand = 1000
const mobileStateCodes = ["2", "3", "4", "7", "8"]
const mL = mobileStateCodes.length
const randomNumber = () => Math.floor(10000000 + Math.random() * 90000000)

const userArray = () =>
    names.map((name) => {
        return {
            email: `${name}@gmail.com`,
            password: "User1234!",
            role: "doctor",
            name,
            surname: surnames[random(suL)],
            nationality: `${nationalities[random(nL)]}`,
            mobile: `0${mobileStateCodes[random(mL)]}${randomNumber()}`,
            address: `${random(thousand)} ${addresses[random(aL)]}, ${
                states[random(stL)]
            }`,
        }
    })

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        const newUsers = await User.create([...userArray()])
        const result = await Department.find({})
        const departments = result.map((department) =>
            department._id.toString()
        )
        const dL = departments.length
        const doctorArray = newUsers.map((user) => {
            const { id } = user
            return {
                userId: id,
                departmentId: departments[random(dL)],
                certification: certifications[random(cL)],
            }
        })
        await Doctor.create([...doctorArray])
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()
