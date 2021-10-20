const chai = require('chai'),
    expect = chai.expect,
    should = chai.should();
const path = require('path');


const EvaluationReport = require('../evaluation-report/evaluation-report.js')
const CONST = require('../programming-exercise/CONST');
var JWT_TOKEN = "";


describe('Test for EvaluationReport', async function() {


    it('Testing setId ', function() {
        let evaluationReport = new EvaluationReport()

        expect(evaluationReport.setId('1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')).to.equal(true);

    })

    it('Testing setDate ', function() {
        let evaluationReport = new EvaluationReport()

        expect(evaluationReport.setDate('2020-10-22T05:30:22.569Z')).to.equal(true);

    })
    it('Testing setReply', function() {
        let evaluationReport = new EvaluationReport()

        expect(evaluationReport.setReply({
            "token": 123
        })).to.equal(true)

    })
    it('Testing setRequest', function() {
        let evaluationReport = new EvaluationReport()

        expect(evaluationReport.setRequest({
            "date": "2021-06-29T09:01:00.123Z",
            "program": "count(//node())",
            "learningObject": "http://jueslti.eu/exercise/123"

        })).to.equal(true)

    })


})