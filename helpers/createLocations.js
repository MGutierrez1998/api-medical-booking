require('dotenv').config()
const {departments} = require('../lists')
const Location = require('../models/Location')
const connectDB = require('../db/connect')

const buildings = "ABCDEF".split("");
const floors = [ ... Array(7).keys() ].map(String).splice(1,6)
const rooms = [ ... Array(32).keys() ].map(String).splice(1,31)

let locationArray = []

buildings.forEach( building => {
  floors.forEach( floor => {
    rooms.forEach( room => {
      const randomDepartment = departments[Math.floor(Math.random()*departments.length)]
      const locationObj = {
        "room": `${building}.${floor}.${room}`,
        "department": `${randomDepartment}`,
      }
      locationArray.push(locationObj)
    })
  })
})

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    await Location.create([... locationArray])
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()