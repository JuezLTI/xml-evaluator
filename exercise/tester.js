const ProgrammingExercise = require('./programming-exercise')
const base64 = require('base64topdf');
let a = new ProgrammingExercise();
(async() => {
    await a.load_remote_exercise('e75ab89a-b03b-4876-8e5b-dcb2e1dd0cf7')
    await a.serialize()
    let b = await ProgrammingExercise.deserialize()
    console.log(b)



})()

/*
let a = new Exercise('')
;(async () => {
  await a.load_localy_exercise('../tests/resources/YAPExIL_exercise.json')
  console.log(a.to_string())
})()*/