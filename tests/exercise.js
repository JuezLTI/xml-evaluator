const chai = require('chai')
  , expect = chai.expect
  , should = chai.should();
const api = require('../exercise/authorkit-api')
const Exercise = require('../exercise/exercise') 
const CONST = require('../exercise/CONST')
var JWT_TOKEN = "";


describe('Test for exercise class', async function () {
    var exercise_obj
  

    describe('Load  class from a remote repo ', async function () {
        before(async function() {
            JWT_TOKEN =  (
              await api.login(CONST.BASE_URL, CONST.EMAIL, CONST.PASSWORD)
            ).accessToken 
        
             exercise_obj = new Exercise('ede1bb0e-a4df-408a-9b43-e8689ceb0afb')
            await exercise_obj.load_remote_exercise()
        
          }
          );
      
          it('id ',  function () {
            should.exist(exercise_obj.id)
          })
          it('is_deleted ',  function () {
            
            should.exist(exercise_obj.is_deleted)
          })
          it('updated_at ',  function () {
            should.exist(exercise_obj.updated_at)
          })
          it('created_at ',  function () {
            should.exist(exercise_obj.created_at)
          })
          it('title ',  function () {
            should.exist(exercise_obj.title)
          })
          it('type ',  function () {
            should.exist(exercise_obj.type)
          })
          it('module ',  function () {
            should.exist(exercise_obj.module)
          })
          it('project_id ',  function () {
            should.exist(exercise_obj.project_id)
          })
          it('owner_id ',  function () {
            should.exist(exercise_obj.owner_id)
          })
          it('keywords ',  function () {
            should.exist(exercise_obj.keywords)
          })
          it('event ',  function () {
            should.exist(exercise_obj.event)
          })
          it('platform ',  function () {
            should.exist(exercise_obj.platform)
          })
          it('difficulty ',  function () {
            should.exist(exercise_obj.difficulty)
          })
          it('status ',  function () {
            should.exist(exercise_obj.status)
          })
          it('timeout ',  function () {
            should.exist(exercise_obj.timeout)
          })
          it('programmingLanguages ',  function () {
            should.exist(exercise_obj.programmingLanguages)
          })
          it('statements ',  function () {
            should.exist(exercise_obj.statements)
          })
          it('instructions ',  function () {
            should.exist(exercise_obj.instructions)
          })
      
    })
    describe('Load  class from a local repo ', async function () {
        before(async function() {
          
        
            exercise_obj.init()
            await exercise_obj.load_localy_exercise('../tests/resources/YAPExIL_exercise.json')
        
          }
          );
      
          it('id ',  function () {
            should.exist(exercise_obj.id)
          })
          it('is_deleted ',  function () {
            
            should.exist(exercise_obj.is_deleted)
          })
          it('updated_at ',  function () {
            should.exist(exercise_obj.updated_at)
          })
          it('created_at ',  function () {
            should.exist(exercise_obj.created_at)
          })
          it('title ',  function () {
            should.exist(exercise_obj.title)
          })
          it('type ',  function () {
            should.exist(exercise_obj.type)
          })
          it('module ',  function () {
            should.exist(exercise_obj.module)
          })
          it('project_id ',  function () {
            should.exist(exercise_obj.project_id)
          })
          it('owner_id ',  function () {
            should.exist(exercise_obj.owner_id)
          })
          it('keywords ',  function () {
            should.exist(exercise_obj.keywords)
          })
          it('event ',  function () {
            should.exist(exercise_obj.event)
          })
          it('platform ',  function () {
            should.exist(exercise_obj.platform)
          })
          it('difficulty ',  function () {
            should.exist(exercise_obj.difficulty)
          })
          it('status ',  function () {
            should.exist(exercise_obj.status)
          })
          it('timeout ',  function () {
            should.exist(exercise_obj.timeout)
          })
          it('programmingLanguages ',  function () {
            should.exist(exercise_obj.programmingLanguages)
          })
          it('statements ',  function () {
            should.exist(exercise_obj.statements)
          })
          it('instructions ',  function () {
            should.exist(exercise_obj.instructions)
          })
      
    })
    
  })

