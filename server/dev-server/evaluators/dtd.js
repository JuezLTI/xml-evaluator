const Libxml = require('node-libxml');
import { loadSchemaPEARL, EvaluationReport } from "evaluation-report-juezlti";
import fs from 'fs'
import path from 'path';



function perform(programmingExercise, evalReq, studentID) {
    return new Promise((resolve) => {
        loadSchemaPEARL().then(() => {

            let evalRes = new EvaluationReport();
            evalRes.setRequest(evalReq.request)
            let program = JSON.parse(evalReq.request.program)
            let isWrongAnswer = false;
            let response = {}
            response.report = {}
            response.report.capability = {
                "id": "DTD-evaluator",
                "features": [{
                    "name": "language",
                    "value": "DTD"
                }, {
                    "name": "version",
                    "value": "1.0"
                }, {
                    "name": "engine",
                    "value": "https://www.npmjs.com/package/node-libxml"
                }]
            }

            response.report.exercise = programmingExercise.id
            response.report.tests = []


            let solution_id = ""
            for (let solutions of programmingExercise.solutions) {
                if (solutions.lang.toUpperCase() == "XML") {
                    solution_id = solutions.id
                    break;
                }
            }
            const solution = programmingExercise.solutions_contents[solution_id]
            const dtd_name = `/student-DTD-schemas/student_${studentID}_${programmingExercise.id}.dtd`


            const regex = new RegExp('<!DOCTYPE .* SYSTEM ".*">', 'gm')
            const dtd_file = path.join(__dirname, '../../public', dtd_name);

            fs.writeFile(dtd_file, program, async(err) => {

                try {
                    let libxml = new Libxml();
                    if (err) {
                        console.log(err)
                        throw err;
                    }
                    let isWrongAnswer = false;
                    for (let metadata of programmingExercise.tests) {
                        let current_in = programmingExercise.tests_contents_in[metadata.id];
                        let current_out = programmingExercise.tests_contents_out[metadata.id];
                        libxml.loadXmlFromString(current_in);



                        let testPEARinstance = {}
                        testPEARinstance.input = current_in
                        testPEARinstance.expectedOutput = current_out
                        testPEARinstance.mark = metadata.weight
                        testPEARinstance.feedback = ""
                        testPEARinstance.environmentValues = []
                        let validation_result = undefined;


                        libxml.loadDtds([path.join(__dirname, '../../public', dtd_name)]);
                        validation_result = libxml.validateAgainstDtds();

                        if (validation_result == undefined) {
                            throw "Compilation error"
                        }
                        testPEARinstance.obtainedOutput = validation_result.toString()
                        if (libxml.validationDtdErrors != undefined) {
                            testPEARinstance.feedback = libxml.validationDtdErrors[dtd_file][0].message
                        }
                        console.log(testPEARinstance.feedback)
                        if (eval(current_out)) {
                            testPEARinstance.classify = validation_result ? "Accepted" : "Wrong Answer"
                            if (!validation_result) {
                                isWrongAnswer = true;
                            }

                        } else {
                            testPEARinstance.classify = !validation_result ? "Accepted" : "Wrong Answer"
                            if (validation_result) {
                                isWrongAnswer = true;
                            }
                        }

                        response.report.tests.push(testPEARinstance)


                    }


                    evalRes.setReply(response)

                    evalRes.summary = {
                        "classify": (isWrongAnswer ? "Wrong Answer" : "Accepted"),
                        "feedback": ""
                    }


                    resolve(evalRes)
                } catch (e) {
                    response.report.tests = [];
                    evalRes.summary = {
                        "classify": "Compile Time Error",
                        "feedback": "Impossible to process the submit DTD"
                    }

                    console.log("**************ERROR****************")
                    console.log(e);
                    console.log("**************ERROR****************")
                    evalRes.setReply(response)
                    resolve(evalRes)

                }
            });






        })
    })

}

module.exports = {
    perform
}