var express = require('express');
const EvaluationReport = require('../../evaluation-report/evaluation-report')
const router = express.Router();
const evaluator = require('../evaluator')
router.post('/evaluate', function(req, res, next) {
    let request = new EvaluationReport()
    let response = new EvaluationReport()
    if (request.setRequest(req.body)) {
        if ('program' in evaluation_report_incoming.request) {
            evaluator.XPATH(evaluation_report_incoming.request.learningObject, evaluation_report_incoming.request.program)
        }
    }
});

module.exports = router;