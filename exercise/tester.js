const Exercise = require('./exercise')
let a = new Exercise('ede1bb0e-a4df-408a-9b43-e8689ceb0afb')
;(async () => {
  await a.load_exercise_byId()
  console.log(a.to_string())
})()
