import express from 'express';
import { fileURLToPath } from 'url';
import EvaluationReport from '../../../evaluation-report/evaluation-report'
import ProgrammingExercise from '../../../programming-exercise/programming-exercise'
import evaluator from '../evaluator'
import path from 'path'

var data = []

var router = express.Router();


router.get('/', function(req, res, next) {
    res.send(getAvailableExercise())
});
router.post('/eval', function(req, res, next) {
    let evalReq = new EvaluationReport()
    if (evalReq.setRequest(req.body)) {
        if ('program' in evalReq.request) {
            try {

                ProgrammingExercise.deserialize(ProgrammingExercise.serializedPath(), `${evalReq.request.learningObject}.zip`).then(programmingExercise => {
                    let obj = evaluator.XPATH(programmingExercise, evalReq.request.program)

                    if (!data.includes(programmingExercise.id)) {
                        data.push(programmingExercise.id)
                        programmingExercise.serialize(path.join(__dirname, "../../public/zip")).then(test => {
                            if (test) {
                                console.log(`The exercise ${programmingExercise.id} was insert in cache`)
                            }

                        })

                    }
                    res.json(obj)



                })
            } catch (error) {
                console.log(error)
            }
        }
    }
});




export { router, data };