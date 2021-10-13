const express = require('express')
const router = express.Router()
const {
    getAllLocations,
    getLocation,
    createLocation,
    updateLocation,
    deleteLocation,
} = require('../controllers/location')

router.route('/')
    .get(getAllLocations)
    .post(createLocation)

router.route('/:id')
    .get(getLocation)
    .patch(updateLocation)
    .delete(deleteLocation)

module.exports = router