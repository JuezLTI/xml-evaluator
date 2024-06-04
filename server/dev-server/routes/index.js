import express from "express";
import { loadSchemaYAPEXIL, ProgrammingExercise } from "programming-exercise-juezlti";
import { loadSchemaPEARL, EvaluationReport } from "evaluation-report-juezlti";
import dotenv from 'dotenv'
dotenv.config('../env.js');
import path from "path";
import request from "request";
import Cache from "cache";
var cache = new Cache(60 * 10000); // Create a cache with 600 second TTL
import fs from "fs";


var router = express.Router();


router.get("/invalidate-cache", function(req, res, next) {
    cache = undefined;
    cache = new Cache(60 * 10000);
    res.send("Ok");
});


router.post("/eval", async function(req, res, next) {

    await loadSchemaPEARL();
    await loadSchemaYAPEXIL();


    evaluate(req)
        .then(async(obj) => {


            obj.reply.report.user_id = req.studentID
            req.xpath_eval_result = obj;

            request({
                    method: "POST",
                    url: process.env.FEEDBACK_MANAGER_URL,
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(req.xpath_eval_result)
                },
                function(error, response) {

                    if (error != null || response.statusCode != 200) {
                        throw new Error(error);

                    } else {
                        let pearlWithFeedback = JSON.parse(response.body)
                        res.send(pearlWithFeedback);
                    }
                }
            );




        })
        .catch((err) => {
            res.send({ "error": err.message }).status(500);
        });
});









async function evaluate(req) {

    const evalReq = new EvaluationReport();
    if (!evalReq.setRequest(req.body)) {

        console.log("INVALID PEARL")
        throw new Error("INVALID PEARL");
    }
    const programmingExercise = await getProgrammingExercise(evalReq);
    
    programmingExercise.keywords = sanitizeKeywords(programmingExercise.keywords)
    if(!fulfilPreConditions(JSON.parse(evalReq.request.program), programmingExercise.keywords)) {
        throw ( new Error("Your solution doesn't meet the requirements."))
    }

    var assesment = undefined
    const target = programmingExercise.programmingLanguages[0].toLowerCase()
    try {
        var evaluator = require(`../evaluators/${target}.js`);
        assesment = await evaluator.perform(programmingExercise, evalReq, req.body.studentID)
        return assesment;
    } catch (ex) {
        console.log(ex)
        throw new Error(`Invalid evaluator module '${target}.js'`);
    }

}



async function getProgrammingExercise(evalReq) {
    console.log("---")
    console.log(evalReq.request.learningObject)
    console.log("----")
    let programmingExercise = cache.get(evalReq.request.learningObject);

    if (programmingExercise == null) {
        try {
            programmingExercise = await ProgrammingExercise
                .loadRemoteExercise(evalReq.request.learningObject, {
                    'BASE_URL': process.env.BASE_URL,
                    'EMAIL': process.env.EMAIL,
                    'PASSWORD': process.env.PASSWORD,
                });

        } catch (err) {
            throw new Error("LearningObj not found")
        }
        cache.put(evalReq.request.learningObject, programmingExercise)
        return programmingExercise;

    } else {
        cache.put(evalReq.request.learningObject, programmingExercise)
        return programmingExercise;
    }
}

const sanitizeKeywords = (keywords) => {
    let sanitizedKeywords = [];
    keywords.forEach(keyword => {
        if (keyword.includes(',')) {
            keyword.split(',').map(k => k.trim()).forEach(k => sanitizedKeywords.push(k));
        } else {
            sanitizedKeywords.push(keyword.trim());
        }
    });
    return sanitizedKeywords;
}

const fulfilPreConditions = (program, keywords) => {
    let fulfilled = true
    let programLowerCase = program.toLowerCase()

    let mandatoryKeyword = keywords.find(keyword => keyword.toLowerCase().startsWith('mandatory'));
    if (mandatoryKeyword) {
        let mandatoryKeywords = mandatoryKeyword.toLowerCase().match(/\[(.*?)\]/)[1].split(';')
        mandatoryKeywords = mandatoryKeywords.map(keyword => keyword.match(/"(.*?)"/)[1]);
        mandatoryKeywords.forEach(keyword => {
            if(!programLowerCase.includes(keyword)) {
                fulfilled = false
            }
        })
    }
    let forbiddenKeyword = keywords.find(keyword => keyword.toLowerCase().startsWith('forbidden'));
    if (forbiddenKeyword) {
        let forbiddenKeywords = forbiddenKeyword.toLowerCase().match(/\[(.*?)\]/)[1].split(';')
        forbiddenKeywords = forbiddenKeywords.map(keyword => keyword.match(/"(.*?)"/)[1]);
        forbiddenKeywords.forEach(keyword => {
            if(programLowerCase.includes(keyword)) {
                fulfilled = false
            }
        })
    }
    return fulfilled
}

export { router };
