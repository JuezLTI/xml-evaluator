const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();
addFormats(ajv);
const path = require("path");
const fs = require("fs");
/****************************************************************/

const PEARL = JSON.parse(
    fs.readFileSync("../../APIs/schemas/PEARL/PEARL.json", {
        encoding: "utf8",
        flag: "r",
    })
);
/****************************************************************/
module.exports = class EvaluationReport {
    static validate = ajv.compile(PEARL);
    constructor(message) {
        if (message != undefined && EvaluationReport.Validate(message)) {
            this.request = message.request;
            this.reply = message.reply;
        } else {
            this.request = {
                date: `${new Date().toISOString()}`,
                program: "count(//node())",
                learningObject: "00000000-0000-0000-0000-000000000000",
            };
            this.reply = {};
        }
    }
    setId(id) {
        let aux = {};
        Object.assign(aux, this);
        aux.id = id;
        if (EvaluationReport.Validate(aux)) {
            this.id = id;
            return true;
        }
        return false;
    }
    setDate(date) {
        let aux = {};
        Object.assign(aux, this);
        aux.date = date;
        if (EvaluationReport.Validate(aux)) {
            this.date = date;
            return true;
        }
        return false;
    }
    setRequest(request) {
        let aux = {};
        Object.assign(aux, this);
        aux.request = request;
        if (EvaluationReport.Validate(aux)) {
            this.request = request;
            return true;
        }
        return false;
    }
    setReply(reply) {
        let aux = {};
        Object.assign(aux, this);
        aux.reply = reply;

        if (EvaluationReport.Validate(aux)) {
            this.reply = reply;
            return true;
        }
        return false;
    }
    static Validate(obj) {
        const valid = EvaluationReport.validate(obj);
        if (!valid) console.log(JSON.stringify(EvaluationReport.validate.errors));
        return valid;
    }
};