// test/test.js
const chai = require('chai')
  , expect = chai.expect
  , should = chai.should();
const api = require('../exercise/authorkit-api')
const Exercise = require('../exercise/exercise') 
const CONST = require('../exercise/CONST')
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var JWT_TOKEN = "";
describe('Authorkit tests', function () {
  before(async function() {
    JWT_TOKEN =  (
      await api.login(CONST.BASE_URL, CONST.EMAIL, CONST.PASSWORD)
    ).accessToken 
  }
  );
  describe('Exercises', function () {
    it('Get all exercises by project ', async function () {
      const  a = await  api.getAllExerciseStatements(CONST.BASE_URL,JWT_TOKEN,"e57d8867-6234-41a6-b239-2cd978ad1e70")
      const cmd = `curl -X 'GET' \
      '${CONST.BASE_URL}/exercises?limit=200&sort=title,ASC&join=statements&fields=id,title,keywords' \
      -H 'accept: applicaiton/json' \
      -H 'Content-Type: application/json' \
      -H 'project: e57d8867-6234-41a6-b239-2cd978ad1e70' \
      -H 'Authorization: Bearer ${JWT_TOKEN}' \ `
      const  { stdout, stderr } = await exec(cmd);
      expect(JSON.stringify(a)).to.equal(stdout);
      
    })
      it('Get exercise by its id ', async function () {
      const exercise_id = "60e038a4-f3ee-4229-899d-549509aedd73"
      const  a = await  api.getExercise(CONST.BASE_URL,JWT_TOKEN,exercise_id)
      const cmd = `curl -X 'GET' \
      '${CONST.BASE_URL}/exercises/${exercise_id}?join=statements&join=instructions&join=skeleton&join=embeddable' \
      -H 'accept: applicaiton/json' \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer ${JWT_TOKEN}' \ `
      const  { stdout, stderr } = await exec(cmd);
      expect(JSON.stringify(a)).to.equal(stdout);
      
    })

    it('Get statement by its id ', async function () {
      const statement_id = "91cec638-9b76-4fbb-aff2-7af0434c9e35"
      const  a = await  api.getStatementContents(CONST.BASE_URL,JWT_TOKEN,statement_id)
      const cmd = `curl -X 'GET' \
      '${CONST.BASE_URL}/statements/${statement_id}/contents' \
      -H 'accept: */*' \
      -H 'Content-Type: application/json' \
      -H 'Authorization: Bearer ${JWT_TOKEN}' \ `
      const  { stdout, stderr } = await exec(cmd);
      expect(a).to.equal(api.b64decode(stdout));
      
    })
  })
})
describe('Class  Exercise tests', function () {
  var exercise_obj 
  before(async function() {
    JWT_TOKEN =  (
      await api.login(CONST.BASE_URL, CONST.EMAIL, CONST.PASSWORD)
    ).accessToken 

    exercise_obj = new Exercise('ede1bb0e-a4df-408a-9b43-e8689ceb0afb')
    await exercise_obj.load_exercise_byId()


  }
  );

  describe('Test YAPExILData from an exercise object  if it has all properties', async function () {
    it('id ',  function () {
      should.exist(exercise_obj.YAPExILData.id)
    })
    it('is_deleted ',  function () {
      
      should.exist(exercise_obj.YAPExILData.is_deleted)
    })
    it('updated_at ',  function () {
      should.exist(exercise_obj.YAPExILData.updated_at)
    })
    it('created_at ',  function () {
      should.exist(exercise_obj.YAPExILData.created_at)
    })
    it('title ',  function () {
      should.exist(exercise_obj.YAPExILData.title)
    })
    it('type ',  function () {
      should.exist(exercise_obj.YAPExILData.type)
    })
    it('module ',  function () {
      should.exist(exercise_obj.YAPExILData.module)
    })
    it('project_id ',  function () {
      should.exist(exercise_obj.YAPExILData.project_id)
    })
    it('owner_id ',  function () {
      should.exist(exercise_obj.YAPExILData.owner_id)
    })
    it('keywords ',  function () {
      should.exist(exercise_obj.YAPExILData.keywords)
    })
    it('event ',  function () {
      should.exist(exercise_obj.YAPExILData.event)
    })
    it('platform ',  function () {
      should.exist(exercise_obj.YAPExILData.platform)
    })
    it('difficulty ',  function () {
      should.exist(exercise_obj.YAPExILData.difficulty)
    })
    it('status ',  function () {
      should.exist(exercise_obj.YAPExILData.status)
    })
    it('timeout ',  function () {
      should.exist(exercise_obj.YAPExILData.timeout)
    })
    it('programmingLanguages ',  function () {
      should.exist(exercise_obj.YAPExILData.programmingLanguages)
    })
    it('statements ',  function () {
      should.exist(exercise_obj.YAPExILData.statements)
    })
    it('instructions ',  function () {
      should.exist(exercise_obj.YAPExILData.instructions)
    })
  })
});


