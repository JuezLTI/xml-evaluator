const chai = require('chai'),
    expect = chai.expect,
    should = chai.should();
const api = require('../programming-exercise/authorkit-api')
const path = require('path');


const EvaluationReport = require('../evaluation-report/evaluation-report.js')
const CONST = require('../programming-exercise/CONST');
var JWT_TOKEN = "";


describe('Test for EvaluationReport', async function() {
    let evaluationReport = new EvaluationReport()


    it('Testing setId ', function() {

        expect(evaluationReport.setId(1)).to.equal(true);

    })

    it('Testing setDate ', function() {
        ///^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$


        expect(evaluationReport.setDate('2020-10-22T05:30:22')).to.equal(true);

    })
    it('Testing setReply', function() {
        expect(evaluationReport.setReply({
            "token": 123
        })).to.equal(true)

    })
    it('Testing setRequest', function() {
        expect(evaluationReport.setRequest({

            "date": "2021-06-29T09:01:00",
            "program": "count(//node())",
            "learningObject": "http://jueslti.eu/exercise/123"

        })).to.equal(true)

    })


})