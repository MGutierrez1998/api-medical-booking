const certifications = require('./certifications')
const genders = require('./genders')
const nationalities = require('./nationalities')
const roles = require('./roles')
const procedureAndTime = require('./procedureAndTime')
const {
    departmentsAndProcedures,
    departments,
    procedures,
} = require('./departmentAndProcedure')

module.exports = {
    certifications,
    genders,
    nationalities,
    roles,
    departmentsAndProcedures,
    departments,
    procedures,
    procedureAndTime,
}