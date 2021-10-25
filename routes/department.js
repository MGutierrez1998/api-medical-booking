const express = require("express")
const router = express.Router()
const {
    getAllDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} = require("../controllers/department")

router.route("/").get(getAllDepartments).post(createDepartment)

router
    .route("/:id")
    .get(getDepartment)
    .patch(updateDepartment)
    .delete(deleteDepartment)

module.exports = router
