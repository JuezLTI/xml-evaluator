const ProgrammingExercise = require('./programming-exercise')
const api = require('./authorkit-api')
const Ajv = require("ajv")
const ajv = new Ajv()
const addFormats = require("ajv-formats")
addFormats(ajv, ["date", "time", "date-time"])

const base64 = require('base64topdf');
let a = new ProgrammingExercise();
(async() => {
    await ProgrammingExercise.setup_validate()

    await a.load_remote_exercise('d07aa835-8899-4f90-967b-135e6f651222')
    await a.serialize()
    let b = await ProgrammingExercise.deserialize()
    for (let f of b) {
        let v = new ProgrammingExercise(f)

    }
})()