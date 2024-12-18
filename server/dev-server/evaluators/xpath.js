import xpath from 'xpath'
import { DOMParser } from 'xmldom'
import { loadSchemaPEARL, EvaluationReport } from "evaluation-report-juezlti";;

function perform(programmingExercise, evalReq) {
    return new Promise((resolve) => {
        loadSchemaPEARL().then(() => {
            let evalRes = new EvaluationReport();
            evalRes.setRequest(evalReq.request)
            let program = evalReq.request.program
            let compilationErrors = [];
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
                if (solutions.lang.toUpperCase() == "XPATH") {
                    solution_id = solutions.id
                    break;
                }
            }
            const solution = programmingExercise.solutions_contents[solution_id]

            try {
                for (let metadata of programmingExercise.tests) {
                    let testPEARinstance = {}
                    testPEARinstance.input = programmingExercise.tests_contents_in[metadata.id]
                    testPEARinstance.expectedOutput = ""
                    testPEARinstance.obtainedOutput = ""
                    testPEARinstance.mark = metadata.weight
                    testPEARinstance.visible = metadata.visible
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

                    // Obtener los valores de los resultados
                    let teacherValue = getResultValue(teacherResult);
                    let studentValue = getResultValue(studentResult);

                    // Asignar los valores a testPEARinstance
                    testPEARinstance.expectedOutput = teacherValue;
                    testPEARinstance.obtainedOutput = studentValue;

                    if (testPEARinstance.expectedOutput == testPEARinstance.obtainedOutput) {
                        testPEARinstance.classify = "Accepted"
                    } else {
                        isWrongAnswer = true
                        testPEARinstance.classify = "Wrong Answer"
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

// get result value depending on the result type
function getResultValue(result) {
    switch (result.resultType) {
        case xpath.XPathResult.NUMBER_TYPE:
            return result.numberValue.toString();
        case xpath.XPathResult.STRING_TYPE:
            return result.stringValue;
        case xpath.XPathResult.BOOLEAN_TYPE:
            return result.booleanValue.toString();
        case xpath.XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
        case xpath.XPathResult.ORDERED_NODE_ITERATOR_TYPE:
            let nodes = [];
            let node;
            while (node = result.iterateNext()) {
                nodes.push(node.textContent);
            }
            return nodes.join("\n");
        default:
            throw new Error('Unsupported result type');
    }
}

module.exports = {
    perform
}
