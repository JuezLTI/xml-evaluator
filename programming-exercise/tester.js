const ProgrammingExercise = require('./programming-exercise')
const api = require('./authorkit-api')
const Ajv = require("ajv")
const ajv = new Ajv()
const addFormats = require("ajv-formats")
addFormats(ajv, ["date", "time", "date-time"])

const base64 = require('base64topdf');
let a = new ProgrammingExercise();
(async() => {
    /*
        await a.load_remote_exercise('d07aa835-8899-4f90-967b-135e6f651222')
        console.log(ProgrammingExercise.validate(a))
        console.log(a.setTests(a.tests))
        console.log(a.setStatements(a.statements))
        console.log(a.setTests(a.tests))*/
    let exercise_obj = new ProgrammingExercise()
    await exercise_obj.load_remote_exercise('e75ab89a-b03b-4876-8e5b-dcb2e1dd0cf7')
    console.log(ProgrammingExercise.isValid(exercise_obj))



})()