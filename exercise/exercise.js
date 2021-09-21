/**
 * This class  represent an exercise using the YAPExIL fetched from athorkit/api  
 * More information about YAPExIL format can be found at https://drops.dagstuhl.de/opus/volltexte/2020/13027/pdf/OASIcs-SLATE-2020-14.pdf
 */

 const api = require('./authorkit-api')
 const CONST = require('./CONST')
 const fs = require('fs')
 const path   = require('path');
 path.resolve(__dirname, 'settings.json')
 module.exports = class Exercise {
   constructor(ID) {
     this.ID = ID
     this.JWT_TOKEN = undefined
     this.init()
     
   }

   async load_localy_exercise(p){

    const data = fs.readFileSync(path.join(__dirname,p), 'utf8')
    Object.assign(this, JSON.parse(data))

  }
   async load_remote_exercise() {
     await this.do_auth()
 
     try {
       const YAPExILData = await api.getExercise(
         CONST.BASE_URL,
         this.JWT_TOKEN,
         this.ID,
       )
       Object.assign(this, YAPExILData)
       
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
   init() {
     this.is_deleted = false
     this.updated_at = '0000-00-00T00:00:00.000Z'
     this.created_at = '0000-00-00T00:00:00.000Z'
     this.id = '00000000-0000-0000-0000-000000000000'
     this.title = 'Draft exercise'
     this.module = ''
     this.project_id = '00000000-0000-0000-0000-000000000000'
     this.owner_id = '00000000-0000-0000-0000-000000000000'
     this.keywords = []
     this.type = ''
     this.event = ''
     this.platform = ''
     this.difficulty = ''
     this.status = ''
     this.timeout = 0
     this.programmingLanguages = []
     this.statements = []
     this.instructions = []
   }
 }
 