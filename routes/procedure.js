const express = require("express")
const router = express.Router()
const {
    getAllProcedures,
    getProcedure,
    createProcedure,
    deleteProcedure,
} = require("../controllers/Procedure")

router.route("/").get(getAllProcedures).post(createProcedure)

router.route("/:id").get(getProcedure).delete(deleteProcedure)

module.exports = router
