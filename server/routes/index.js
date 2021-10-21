const path = require('path');
const express = require('express');
const EvaluationReport = require(path.join(__dirname, '../../evaluation-report/evaluation-report'))
const ProgrammingExercise = require(path.join(__dirname, '../../programming-exercise/programming-exercise'))

const router = express.Router();
const evaluator = require(path.join(__dirname, '../evaluator'))


router.get('/', function(req, res, next) {
    res.send("Teste")
});
router.post('/eval', function(req, res, next) {
    let evalReq = new EvaluationReport()
    if (evalReq.setRequest(req.body)) {
        if ('program' in evalReq.request) {
            try {

                ProgrammingExercise.deserialize(ProgrammingExercise.serializedPath(), `${evalReq.request.learningObject}.zip`).then(data => {
                    let obj = evaluator.XPATH(data, evalReq.request.program)
                    res.json(obj)

                })
            } catch (error) {
                console.log(error)
            }
        }
    }
});

module.exports = router;