const xpath = require('xpath')
const dom = require('xmldom').DOMParser

function XPATH(programmingExercise) {
    let solution_id = ""
    for (let solutions of programmingExercise.solutions) {
        if (solutions.lang == "xml") {
            solution_id = solutions.id
            break;
        }
    }
    const solution = programmingExercise.solutions_contents[solution_id]
    let correct_anwsers = []

    for (let metadata of programmingExercise.tests) {
        let input = new dom().parseFromString(programmingExercise.tests_contents_in[metadata.id]);
        let data = xpath.select(solution, input);

        if (data == programmingExercise.tests_contents_out[metadata.id]) {
            console.log(`correct awnser for  ${metadata.input}`)
            correct_anwsers.push(true)
        } else {
            console.log(`*${programmingExercise.tests_contents_out[metadata.id]}!=${data}* `)
            correct_anwsers.push(false)
        }


    }
    return correct_anwsers
}

module.exports = {
    XPATH
}