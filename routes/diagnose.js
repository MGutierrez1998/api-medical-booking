const express = require('express')
const router = express.Router()
const {
    getAllDiagnoses,
    getDiagnose,
    createDiagnose,
    updateDiagnose,
} = require('../controllers/diagnose')

router.route('/')
    .get(getAllDiagnoses)
    .post(createDiagnose)

router.route('/:id')
    .get(getDiagnose)
    .patch(updateDiagnose)

module.exports = router