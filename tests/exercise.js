const chai = require('chai'),
    expect = chai.expect,
    should = chai.should();
const api = require('../exercise/authorkit-api')
const ProgrammingExercise = require('../exercise/programming-exercise')
const CONST = require('../exercise/CONST');
const { doesNotMatch } = require('assert');
var JWT_TOKEN = "";


describe('Test for exercise class', async function() {
    describe('Load  class from a remote repo ', async function() {
        this.timeout(10000);

        before(async function() {
            JWT_TOKEN = (
                await api.login(CONST.BASE_URL, CONST.EMAIL, CONST.PASSWORD)
            ).accessToken
        })

        it('Testing metadata of an exercise fetched using authokit-api ', async function() {
            let exercise_obj = new ProgrammingExercise()
            await exercise_obj.load_remote_exercise('e75ab89a-b03b-4876-8e5b-dcb2e1dd0cf7')
            metadata(exercise_obj)
        })
        it('Testing metadata of an exercise using json file ', async function() {
            let exercise_obj = new ProgrammingExercise()
            await exercise_obj.load_localy_exercise('../tests/resources/YAPExIL_exercise.json')
            metadata(exercise_obj)
        })
        it('Testing metadata  of an exercise using deserialization ', async function() {
            let aux = await ProgrammingExercise.deserialize()
            for (let t of aux) {
                metadata(t)
            }

        })
        it('Testing metadata from a object that was fetch using authorkit-api then was done serialization and finally deserialization ', async function() {
            let exercise_obj = new ProgrammingExercise()
            exercise_obj.load_remote_exercise('e75ab89a-b03b-4876-8e5b-dcb2e1dd0cf7')
            await exercise_obj.serialize()
            let b = await ProgrammingExercise.deserialize()
            for (let t of b) {
                metadata(t)
            }

        })
        done()
    })

})

function metadata(exercise_obj) {
    should.exist(exercise_obj.id)
    should.exist(exercise_obj.title)
    should.exist(exercise_obj.type)
    should.exist(exercise_obj.difficulty)
    should.exist(exercise_obj.status)
    should.exist(exercise_obj.keywords)
    should.exist(exercise_obj.platform)
    should.exist(exercise_obj.statements)
    should.exist(exercise_obj.solutions)
    should.exist(exercise_obj.tests)

}