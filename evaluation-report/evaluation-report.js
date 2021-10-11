const Ajv = require("ajv")
const ajv = new Ajv();
const path = require('path');
const fs = require('fs')

/****************************************************************/
const Common_schema = JSON.parse(fs.readFileSync('../../APIs/schemas/Common.json', { encoding: 'utf8', flag: 'r' }))
const PEARL_schema = JSON.parse(fs.readFileSync('../../APIs/schemas/PEARL/PEARL.json', { encoding: 'utf8', flag: 'r' }))
const PEARL_REPLY_schema = JSON.parse(fs.readFileSync('../../APIs/schemas/PEARL/PEARL_REPLY.json', { encoding: 'utf8', flag: 'r' }))
const PEARL_REQUEST_schema = JSON.parse(fs.readFileSync('../../APIs/schemas/PEARL/PEARL_REQUEST.json', { encoding: 'utf8', flag: 'r' }));
/****************************************************************/
module.exports = class EvaluationReport {
    static validate = ajv.addSchema(Common_schema).addSchema(PEARL_REPLY_schema).addSchema(PEARL_REQUEST_schema).compile(PEARL_schema)
    constructor(message) {

        if (message != undefined && EvaluationReport.validate(message))
            this.message = message
    }
    setId(id) {
        if (!isNaN(id) && id > 0) {
            this.id = id
            return true
        }
        return false

    }
    setDate(date) {
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(date)) {
            this.date = date
            return true
        }
        return false

    }
    setRequest(request) {
        EvaluationReport.validate = ajv.compile(PEARL_REQUEST_schema)
        if (EvaluationReport.validate(request)) {
            this.request = {}
            if ('date' in request) {
                this.request.date = request.date
            } else return false

            if ('program' in request) {
                this.request.program = request.program
                this.request.learningObject = request.learningObject
            } else
                this.request.token = request.token
            return true
        }
        return false

    }
    setReply(reply) {
        EvaluationReport.validate = ajv.compile(PEARL_REPLY_schema)
        if (EvaluationReport.validate(reply)) {
            this.reply = {}

            if ('capabilities' in reply)
                this.reply.capabilities = reply.
            else
            if ('token' in reply)
                this.reply.token = reply.token
            else
            if ('report' in reply)
                this.reply.report = reply.report
            return true
        }
        return false

    }
    static isValidate(obj) {
        EvaluationReport.validate = ajv.compile(PEARL_schema)

        const valid = EvaluationReport.validate(obj)
        if (!valid) console.log(JSON.stringify(validate.errors))
        return valid
    }
}