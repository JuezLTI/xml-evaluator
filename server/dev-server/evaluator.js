import xpath from 'xpath'
import { DOMParser } from 'xmldom'
const Libxml = require('node-libxml');
import { loadSchemaPEARL, EvaluationReport } from "evaluation-report-juezlti";
import fs from 'fs'
import path from 'path';

function XPATH(programmingExercise, evalReq) {
    return new Promise((resolve) => {
        loadSchemaPEARL().then(() => {

            let evalRes = new EvaluationReport();
            evalRes.setRequest(evalReq.request)
            let program = evalReq.request.program
            const compilationErrors = [];
            let isWrongAnswer = false;
            let response = {}
            response.report = {}
            response.report.capability = {
                "id": "XPath-evaluator",
                "features": [{
                    "name": "language",
                    "value": "XPath"
                }, {
                    "name": "version",
                    "value": "1.0"
                }, {
                    "name": "engine",
                    "value": "https://www.npmjs.com/package/xpath"
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
            let i = 0;
            try {
                for (let metadata of programmingExercise.tests) {
                    let testPEARinstance = {}

                    testPEARinstance.input = programmingExercise.tests_contents_in[metadata.id]
                    testPEARinstance.expectedOutput = solution
                    testPEARinstance.obtainedOutput = program
                    testPEARinstance.mark = metadata.weight
                    testPEARinstance.feedback = ""
                    testPEARinstance.environmentValues = []

                    let input = new DOMParser().parseFromString(programmingExercise.tests_contents_in[metadata.id]);
                    let teacherNode = null,
                        studentNode = null;


                    var teacherResult = xpath.evaluate(
                        solution, // xpathExpression
                        input, // contextNode
                        null, // namespaceResolver
                        xpath.XPathResult.ANY_TYPE, // resultType
                        null // result
                    )
                    var studentResult = xpath.evaluate(
                        program, // xpathExpression
                        input, // contextNode
                        null, // namespaceResolver
                        xpath.XPathResult.ANY_TYPE, // resultType
                        null // result
                    )

                    if (teacherResult.resultType == 1 || teacherResult.resultType == 2) {
                        if ("numberValue" in teacherResult)
                            if (teacherResult.numberValue != studentResult.numberValue) {

                                compilationErrors.push({ i: "incorrect xpath expression" })

                            }
                        if ("stringValue:" in teacherResult)
                            if (teacherResult.stringValue != studentResult.stringValue) {
                                compilationErrors.push({ i: "incorrect xpath expression" })


                            }

                    } else if (teacherResult.resultType == 4 || teacherResult.resultType == 5) {
                        teacherNode = teacherResult.iterateNext();
                        studentNode = studentResult.iterateNext();
                        console.log("teacher node " + teacherNode)
                        if (teacherNode == undefined) {
                            compilationErrors.push({ i: "incorrect xpath expression" })
                        } else {
                            while (teacherNode) {
                                if (teacherNode != studentNode) {
                                    compilationErrors.push({ i: "incorrect xpath expression" })
                                    break;
                                }
                                teacherNode = teacherResult.iterateNext();
                                studentNode = studentResult.iterateNext();
                            }

                        }
                    }
                    if (compilationErrors.length > 0) {
                        isWrongAnswer = true
                        testPEARinstance.classify = "Wrong Answer"

                    } else {
                        testPEARinstance.classify = "Accepted"
                    }
                    response.report.tests.push(testPEARinstance)
                    i++
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
                    "feedback": "Impossible to process the submit xpath expression"
                }

                console.log("**************ERROR****************")
                console.log(e);
                console.log("**************ERROR****************")
                evalRes.setReply(response)
                resolve(evalRes)
            }




        })
    })

}


function DTD(programmingExercise, evalReq, studentID) {
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
                    "value": "https://www.npmjs.com/package/w3c-xml-validator"
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
            const dtd_file = path.join(__dirname, '../public', dtd_name);

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


                        libxml.loadDtds([path.join(__dirname, '../public', dtd_name)]);
                        validation_result = libxml.validateAgainstDtds();

                        if (validation_result == undefined) {
                            throw "Compilation error"
                        }
                        testPEARinstance.obtainedOutput = validation_result.toString()
                        if (libxml.validationDtdErrors != undefined) {
                            testPEARinstance.feedback = libxml.validationDtdErrors[dtd_file][0].message
                        }
                        console.log(testPEARinstance.feedback)
                        if (current_out == "true") {
                            testPEARinstance.classify = validation_result ? "Accepted" : "Wrong Answer"
                            if (!validation_result) {
                                isWrongAnswer = true;
                            }

                        } else if (current_out == "false") {
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
    XPATH,
    DTD
}