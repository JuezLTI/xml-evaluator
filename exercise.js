/**
 * This class  represent an exercise using the YAPExIL fetched from athorkit/api  
 * More information about YAPExIL format can be found at https://drops.dagstuhl.de/opus/volltexte/2020/13027/pdf/OASIcs-SLATE-2020-14.pdf
 */

 const api = require('./authorkit-api')
 const CONST = require('./CONST')
 module.exports = class Exercise {
   constructor(ID) {
     this.ID = ID
     this.JWT_TOKEN = undefined
   }
   async load_exercise_byId() {
     await this.do_auth()
 
     try {
       this.YAPExILData = await api.getExercise(
         CONST.BASE_URL,
         this.JWT_TOKEN,
         this.ID,
       )
     } catch (err) {
       console.log(err)
     }
   }
   async do_auth() {
     if (this.JWT_TOKEN === undefined) {
       try {
         this.JWT_TOKEN = (
           await api.login(CONST.BASE_URL, CONST.EMAIL, CONST.PASSWORD)
         ).accessToken
       } catch (err) {
         console.log(err)
       }
     }
   }
   to_string() {
     return JSON.stringify(this)
   }
   reset() {
     this.YAPExILData = {}
     this.YAPExILData.is_deleted = false
     this.YAPExILData.updated_at = '0000-00-00T00:00:00.000Z'
     this.YAPExILData.created_at = '0000-00-00T00:00:00.000Z'
     this.YAPExILData.id = '00000000-0000-0000-0000-000000000000'
     this.YAPExILData.title = 'Draft exercise'
     this.YAPExILData.module = ''
     this.YAPExILData.project_id = '00000000-0000-0000-0000-000000000000'
     this.YAPExILData.owner_id = '00000000-0000-0000-0000-000000000000'
     this.YAPExILData.keywords = []
     this.YAPExILData.type = ''
     this.YAPExILData.event = ''
     this.YAPExILData.platform = ''
     this.YAPExILData.difficulty = ''
     this.YAPExILData.status = ''
     this.YAPExILData.timeout = 0
     this.YAPExILData.programmingLanguages = []
     this.YAPExILData.statements = []
     this.YAPExILData.instructions = []
   }
 }
 