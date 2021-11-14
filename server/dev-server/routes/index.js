import express from "express";
import EvaluationReport from "../../../evaluation-report/evaluation-report";
import ProgrammingExercise from "../../../programming-exercise/programming-exercise";
import CONST from "../../../programming-exercise/CONST";
import evaluator from "../evaluator";
import path from "path";
import request from "request";

import fs from "fs";

var data = [];

var router = express.Router();

router.get("/capabilities", function(req, res, next) {
    let evalRes = new EvaluationReport();
    let obj = {
        capabilities: [{
            id: "XPath-evaluator",
            features: [{
                    name: "language",
                    value: "XPath",
                },
                {
                    name: "version",
                    value: ".01",
                },
                {
                    name: "engine",
                    value: "https://www.npmjs.com/package/xpath",
                },
            ],
        }, ],
    };
    console.log(typeof obj);
    evalRes.setReply(obj);
    res.send(evalRes);
});

router.get("/", function(req, res) {
    let text = fs.readFileSync(
        path.join(__dirname, "../../public/doc/intro.txt"), { encoding: "utf8", flag: "r" }
    );
    let curl_exm = fs.readFileSync(
        path.join(__dirname, "../../public/doc/curl"), { encoding: "utf8", flag: "r" }
    );

    try {
        res.render("index");
    } catch (e) {
        console.log(e);
    }
});

router.post("/eval", function(req, res, next) {
    let evalReq = new EvaluationReport();
    if (evalReq.setRequest(req.body)) {
        console.log(evalReq);
        if ("program" in evalReq.request) {
            try {
                let exerciseObj = new ProgrammingExercise();

                exerciseObj
                    .loadRemoteExerciseAuthorkit(evalReq.request.learningObject)
                    .then((programmingExercise) => {
                        try {
                            let obj = evaluator.XPATH(programmingExercise, evalReq);

                            /** caching */
                            if (!data.includes(programmingExercise.id)) {
                                data.push(programmingExercise.id);
                                programmingExercise
                                    .serialize(path.join(__dirname, "../../public/zip"))
                                    .then((test) => {
                                        if (test) {
                                            console.log(
                                                `The exercise ${programmingExercise.id} was insert in cache`
                                            );
                                        }
                                    });
                            }
                            /** caching */
                            req.xpath_eval_result = JSON.stringify(obj);
                            next();
                        } catch (e) {
                            console.log(" 1º " + e);
                            res.send({ error: "LearningObj not found" });
                        }
                    });
            } catch (error) {
                console.log(" 2º " + error);
                res.send({ error: error });
            }
        }
    }
});

router.post("/eval", function(req, res, next) {
    request({
            method: "POST",
            url: `${CONST.FEEDBACK_MANAGER_URL}/`,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: req.xpath_eval_result,
        },
        function(error, response) {
            if (error) res.json(req.xpath_eval_result);
            else res.json(response.body);
        }
    );
});

export { router, data };