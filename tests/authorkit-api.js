const chai = require('chai'),
    expect = chai.expect,
    should = chai.should();
const api = require('../programming-exercise/authorkit-api')
const CONST = require('../programming-exercise/CONST')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var JWT_TOKEN = "";
describe('Authorkit tests', function() {
    before(async function() {
        JWT_TOKEN = (
            await api.login(CONST.BASE_URL, CONST.EMAIL, CONST.PASSWORD)
        ).accessToken
    });
    describe('Exercises', function() {
        it('Get exercise by its id ', async function() {
            const exercise_id = "60e038a4-f3ee-4229-899d-549509aedd73"
            const a = await api.getExercise(CONST.BASE_URL, JWT_TOKEN, exercise_id)
            const cmd = `curl -X 'GET' \
      '${CONST.BASE_URL}/exercises/${exercise_id}?join=statements&join=instructions&join=solutions&join=tests' \
      -H 'accept: applicaiton/json' \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer ${JWT_TOKEN}' \ `
            const { stdout, stderr } = await exec(cmd);
            expect(JSON.stringify(a)).to.equal(stdout);

        }).timeout(5000);

        it('Get statement by its id ', async function() {
            const statement_id = "91cec638-9b76-4fbb-aff2-7af0434c9e35"
            const a = await api.getStatementContents(CONST.BASE_URL, JWT_TOKEN, statement_id, true)
            const cmd = `curl -X 'GET' \
      '${CONST.BASE_URL}/statements/${statement_id}/contents' \
      -H 'accept: */*' \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer ${JWT_TOKEN}' \ `
            const { stdout, stderr } = await exec(cmd);
            expect(a).to.equal(api.b64decode(stdout));

        }).timeout(5000);
    })
})