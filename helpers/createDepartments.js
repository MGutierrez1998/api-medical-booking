require("dotenv").config()
const Department = require("../models/Department")
const Procedure = require("../models/Procedure")
const {
    departmentsAndProcedures: DnP,
} = require("./lists/departmentAndProcedure")
const connectDB = require("../db/connect")

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)

        await Promise.all(
            Object.keys(DnP).map(async (dep) => {
                const temp = DnP[dep]

                const id = await Promise.all(
                    temp.map(async (element) => {
                        const procedure = await Procedure.findOne({
                            procedure: element,
                        })
                        return procedure._id.toString()
                    })
                )

                await Department.create({
                    department: dep,
                })

                await Department.findOneAndUpdate(
                    {
                        department: dep,
                    },
                    {
                        $push: {
                            procedures: [...id],
                        },
                    }
                )
            })
        )

        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()
