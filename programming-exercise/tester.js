const ProgrammingExercise = require('./programming-exercise')
const api = require('./authorkit-api')
const Ajv = require("ajv")
const ajv = new Ajv()
const addFormats = require("ajv-formats")
addFormats(ajv, ["date", "time", "date-time"])
const fs = require('fs')
const path = require('path');
const CONST = require('./CONST')

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
    await exercise_obj.load_remote_exercise(`${CONST.BASE_URL}/exercises/60e038a4-f3ee-4229-899d-549509aedd73`)
    console.log(exercise_obj.solutions_contents)
        /*  exercise_obj.setId(1)
          exercise_obj.setKeywords(["XML", "XPATH"])
          exercise_obj.setSolutions([{ "pathname": "solutions.js", "lang": "javaScript" }])
          exercise_obj.setSolutions_contents(fs.readFileSync(path.join(__dirname, `/temp/${exercise_obj.solutions[0].pathname}`)))
          exercise_obj.setStatements([{ "pathname": "statement.html", "nat_lang": "en", "format": "HTML" }])
          exercise_obj.setStatements_contents(fs.readFileSync(path.join(__dirname, `/temp/${exercise_obj.statements[0].pathname}`)))*/

})()