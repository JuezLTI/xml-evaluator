const ProgrammingExercise = require('../programming-exercise/programming-exercise')
const fs = require('fs')
const path = require('path');
const evaluator = require('./evaluator')


let exercise_obj = new ProgrammingExercise()
exercise_obj.setId(1)
exercise_obj.setKeywords(["XML", "XPATH"])
exercise_obj.setSolutions([{ "pathname": "solutions.txt", "lang": "XPATH" }])
exercise_obj.setSolutions_contents({ 1: "/bookstore/book/price//text()" })
exercise_obj.setStatements([{ "pathname": "statement.html", "nat_lang": "en", "format": "HTML" }])
exercise_obj.setStatements_contents(fs.readFileSync(path.join(__dirname, `../programming-exercise/temp/${exercise_obj.statements[0].pathname}`)))
exercise_obj.setTests([{
    "id": "1",
    "input": "test_in.txt",

    "output": "test_out.txt",

    "visible": false,
}])
let data_in = fs.readFileSync(path.join(__dirname, `../programming-exercise/temp/${exercise_obj.tests[0].input}`)) + ""
exercise_obj.setTests_contents_in({ "1": data_in });

let data_out = fs.readFileSync(path.join(__dirname, `../programming-exercise/temp/${exercise_obj.tests[0].output}`)) + "";
exercise_obj.setTests_contents_out({ "1": data_out });


evaluator.XPATH(exercise_obj)