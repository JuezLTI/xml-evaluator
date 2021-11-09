import xpath from 'xpath'
import { DOMParser } from 'xmldom'
import EvaluationReport from '../../evaluation-report/evaluation-report'

function XPATH(programmingExercise, evalReq) {
    let evalRes = new EvaluationReport();
    evalRes.setRequest(evalReq.request)
    let program = evalReq.request.program
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
    try {

        let solution_id = ""
        for (let solutions of programmingExercise.solutions) {
            if (solutions.lang == "xml") {
                solution_id = solutions.id
                break;
            }
        }
        const solution = programmingExercise.solutions_contents[solution_id]
        let correct_anwsers = []

        for (let metadata of programmingExercise.tests) {
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


            teacherNode = teacherResult.iterateNext();
            studentNode = studentResult.iterateNext();

            while (teacherNode) {
                //console.log(node.localName + ": " + node.firstChild.data);
                //console.log("Node: " + node.toString());
                if (teacherNode != studentNode) {

                    response.report.compilationErrors = "incorrect xpath expression"

                    console.log(" evalRes.setReply ? " + evalRes.setReply(response))
                    return evalRes
                }


                teacherNode = teacherResult.iterateNext();
                studentNode = studentResult.iterateNext();

            }
            console.log("evalRes.setReply " + evalRes.setReply(response))
            return evalRes

        }


    } catch (error) {
        console.log(error)
        response.report.compilationErrors = JSON.stringify(error)
        console.log("evalRes.setReply " + evalRes.setReply(response))
        return evalRes
    }

}

module.exports = {
    XPATH
}