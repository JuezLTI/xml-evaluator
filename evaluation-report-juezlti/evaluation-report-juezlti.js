const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv();
addFormats(ajv)
const path = require("path");
const fs = require("fs");
const got = require('got');

/****************************************************************/
const PEARL_URI = 'https://raw.githubusercontent.com/JuezLTI/APIs/main/schemas/PEARL/PEARL.json';

async function loadSchemaPEARL(uri = PEARL_URI) {
    if (EvaluationReport.validate == null) {
        const response = await got(uri, { responseType: 'json', resolveBodyOnly: true });
        EvaluationReport.validate = ajv.compile(response)
    }

}
/****************************************************************/
class EvaluationReport {
    static validate = null;
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
module.exports = {
    loadSchemaPEARL,
    EvaluationReport
}