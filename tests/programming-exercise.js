const chai = require('chai'),
    expect = chai.expect;
const path = require('path');
const CONST = require('../programming-exercise/CONST');
const ProgrammingExercise = require('../programming-exercise/programming-exercise')

describe('Test for ProgrammingExercise', async function() {
    this.timeout(10000);

    it('Testing metadata of an exercise fetched using authokit-api ', async function() {
        let exercise_obj = new ProgrammingExercise()
        await exercise_obj.load_remote_exercise_authorkit(`e75ab89a-b03b-4876-8e5b-dcb2e1dd0cf7`)
        expect(ProgrammingExercise.isValid(exercise_obj)).to.equal(true);

    })

    it('Testing deserialization ', async function() {
        let exercise_obj = await ProgrammingExercise.deserialize(path.join(__dirname, 'resources'), "a960c9c1-3d09-4a3d-b34b-cda9571560c9.zip")
        expect(ProgrammingExercise.isValid(exercise_obj)).to.equal(true);
    })

    it('Testing serialization ', async function() {
        let exercise_obj = new ProgrammingExercise()
        await exercise_obj.load_remote_exercise_authorkit(`e75ab89a-b03b-4876-8e5b-dcb2e1dd0cf7`)
        await exercise_obj.serialize(path.join(__dirname, 'resources'))
        exercise_obj = await ProgrammingExercise.deserialize(path.join(__dirname, 'resources'), "e75ab89a-b03b-4876-8e5b-dcb2e1dd0cf7.zip")
        expect(ProgrammingExercise.isValid(exercise_obj)).to.equal(true);


    })
    done()


})