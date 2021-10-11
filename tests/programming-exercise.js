const chai = require('chai'),
    expect = chai.expect,
    should = chai.should();
const api = require('../programming-exercise/authorkit-api')
const path = require('path');


const ProgrammingExercise = require('../programming-exercise/programming-exercise')
const CONST = require('../programming-exercise/CONST');
var JWT_TOKEN = "";


describe('Test for ProgrammingExercise', async function() {
    this.timeout(10000);

    before(async function() {
        JWT_TOKEN = (
            await api.login(CONST.BASE_URL, CONST.EMAIL, CONST.PASSWORD)
        ).accessToken
    })

    it('Testing metadata of an exercise fetched using authokit-api ', async function() {
        let exercise_obj = new ProgrammingExercise()
        await exercise_obj.load_remote_exercise(`${CONST.BASE_URL}/exercises/e75ab89a-b03b-4876-8e5b-dcb2e1dd0cf7`)
        expect(ProgrammingExercise.isValid(exercise_obj)).to.equal(true);

    })

    it('Testing metadata  of an exercise using deserialization ', async function() {
        let exercise_list = await ProgrammingExercise.deserialize(path.join(__dirname, 'resources'))
        for (let exercise of exercise_list) {
            let exercise_obj = new ProgrammingExercise(exercise)
            expect(ProgrammingExercise.isValid(exercise_obj)).to.equal(true);
        }

    })
    it('Testing metadata from a object that was fetch using authorkit-api then was done serialization and finally deserialization ', async function() {
        let exercise_obj = new ProgrammingExercise()
        await exercise_obj.load_remote_exercise(`${CONST.BASE_URL}/exercises/e75ab89a-b03b-4876-8e5b-dcb2e1dd0cf7`)
        await exercise_obj.serialize()
        exercise_list = await ProgrammingExercise.deserialize(path.join(__dirname, 'resources'))
        for (let exercise of exercise_list) {
            exercise_obj = new ProgrammingExercise(exercise)
            expect(ProgrammingExercise.isValid(exercise_obj)).to.equal(true);
        }

    })
    done()


})