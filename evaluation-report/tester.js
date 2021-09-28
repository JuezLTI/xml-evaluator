const EvaluationReport = require('./evaluation-report')
const Ajv = require("ajv")
const ajv = new Ajv()
const path = require('path');
const fs = require('fs')
let a = new EvaluationReport();
(async() => {
    let sample = JSON.parse(fs.readFileSync('../../APIs/schemas/PEARL/samples/ex1.json', { encoding: 'utf8', flag: 'r' }))
    console.log(EvaluationReport.validate(sample))
    let evaluationReport = new EvaluationReport();
    let request = JSON.parse(fs.readFileSync('../../APIs/schemas/PEARL/samples/ex_request.json', { encoding: 'utf8', flag: 'r' }))
    evaluationReport.setRequest(request)
    console.log(evaluationReport.request)
    let reply = JSON.parse(fs.readFileSync('../../APIs/schemas/PEARL/samples/ex_reply.json', { encoding: 'utf8', flag: 'r' }))
    evaluationReport.setReply(reply)
    console.log(evaluationReport.reply)
    console.log(EvaluationReport.validate(sample))
    evaluationReport.setId(3)



})()