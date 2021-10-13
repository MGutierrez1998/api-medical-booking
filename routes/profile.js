const express = require('express')
const router = express.Router()

const {
    getAllProfiles,
    getProfile,
    createProfile,
    updateProfile,
} = require('../controllers/profile')

router.route('/')
    .get(getAllProfiles)
    .post(createProfile)

router.route('/:id')
    .get(getProfile)
    .patch(updateProfile)

module.exports = router