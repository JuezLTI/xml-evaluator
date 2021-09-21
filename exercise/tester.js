const Exercise = require('./exercise')
/*
let a = new Exercise('ede1bb0e-a4df-408a-9b43-e8689ceb0afb')
;(async () => {
  await a.load_remote_exercise()
  console.log(a.to_string())
})()
*/
let a = new Exercise('')
;(async () => {
  await a.load_localy_exercise('../tests/resources/YAPExIL_exercise.json')
  console.log(a.to_string())
})()