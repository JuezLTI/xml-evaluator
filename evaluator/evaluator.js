const ProgrammingExercise = require('../programming-exercise/programming-exercise')
const xpath = require('xpath')
const dom = require('xmldom').DOMParser

function XPATH(programmingExercise) {
    for (let i in programmingExercise.tests_contents_in) {
        console.log(programmingExercise.solutions_contents[i])
        let doc = new dom().parseFromString(programmingExercise.tests_contents_in[i]);
        let data = xpath.select(programmingExercise.solutions_contents[i], doc);

        if (data == programmingExercise.tests_contents_out[i]) {
            console.log(`correct awnser on question ${i}`)
        } else {
            console.log(`*${programmingExercise.tests_contents_out[i]}!=${data}* `)


        }


    }
    return true
}

module.exports = {
    XPATH
}