var express = require('express');
const EvaluationReport = require('../../evaluation-report/evaluation-report')
const router = express.Router();
const evaluator = require('../evaluator')
router.post('/', function(req, res, next) {
    let evaluation_report_incoming = new EvaluationReport()
    let evaluation_report_outcomming = new EvaluationReport()

    if (evaluation_report_incoming.setRequest(req.body)) {
        if ('program' in evaluation_report_incoming.request) {
            evaluator.XPATH(evaluation_report_incoming.request.learningObject, evaluation_report_incoming.request.program)
        }
    }
});

module.exports = router;