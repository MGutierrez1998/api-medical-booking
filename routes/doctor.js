const express = require('express')
const router = express.Router()
const {
    getAllDoctors,
    getDoctor,
    createDoctor,
    updateDoctor,
} = require('../controllers/doctor')

router.route('/')
    .get(getAllDoctors)
    .post(createDoctor)

router.route('/:id')
    .get(getDoctor)
    .patch(updateDoctor)

module.exports = router