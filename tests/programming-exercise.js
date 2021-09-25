const chai = require('chai'),
    expect = chai.expect,
    should = chai.should();
const api = require('../exercise/authorkit-api')
const path = require('path');


const ProgrammingExercise = require('../exercise/programming-exercise')
const CONST = require('../exercise/CONST');
var JWT_TOKEN = "";


describe('Test for exercise class', async function() {
    var schema
    this.timeout(10000);

    before(async function() {
        JWT_TOKEN = (
            await api.login(CONST.BASE_URL, CONST.EMAIL, CONST.PASSWORD)
        ).accessToken
        await ProgrammingExercise.setup_validate()
    })

    it('Testing metadata of an exercise fetched using authokit-api ', async function() {
        let exercise_obj = new ProgrammingExercise()
        await exercise_obj.load_remote_exercise('e75ab89a-b03b-4876-8e5b-dcb2e1dd0cf7')
        expect(exercise_obj.validate()).to.equal(true);

    })

    it('Testing metadata  of an exercise using deserialization ', async function() {
        let exercise_list = await ProgrammingExercise.deserialize(path.join(__dirname, 'resources'))
        for (let exercise of exercise_list) {
            let exercise_obj = new ProgrammingExercise()
            exercise_obj.load_exercise(exercise)
            expect(exercise_obj.validate()).to.equal(true);
        }

    })
    it('Testing metadata from a object that was fetch using authorkit-api then was done serialization and finally deserialization ', async function() {
        let exercise_obj = new ProgrammingExercise()
        exercise_obj.load_remote_exercise('e75ab89a-b03b-4876-8e5b-dcb2e1dd0cf7')
        await exercise_obj.serialize()
        exercise_list = await ProgrammingExercise.deserialize(path.join(__dirname, 'resources'))
        for (let exercise of exercise_list) {
            exercise_obj = new ProgrammingExercise()
            exercise_obj.load_exercise(exercise)
            expect(exercise_obj.validate()).to.equal(true);
        }

    })
    done()


})