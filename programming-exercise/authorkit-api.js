/**
 *  This file is based on the file  with the same name in this repo https://github.com/josepaiva94/fgpe-authorkit-client
 *  credits to  https://github.com/josepaiva94/
 */

const got = require('got')
const FormData = require('form-data')

async function login(baseUrl, email, password) {
    let result = await got.post(`${baseUrl}/auth/login`, {
        json: {
            email,
            password,
        },
        resolveBodyOnly: true,
        responseType: 'json',
    })
    return result;
}
async function getAllProjects(baseUrl, token) {
    return await got
        .get(`${baseUrl}/projects`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            resolveBodyOnly: true,
        })
        .json()
}

async function getAllExercise(baseUrl, token, projectId) {
    const searchParams = {
        fields: 'id,title,keywords',
        join: 'statements',
        sort: 'title,ASC',
        limit: 200,
    }

    return await got
        .get(`${baseUrl}/exercises`, {
            headers: {
                Authorization: `Bearer ${token}`,
                project: projectId,
            },
            resolveBodyOnly: true,
            searchParams: new URLSearchParams(searchParams),
        })
        .json()
}

async function getExercise(baseUrl, token, URI, normalize) {
    const searchParams = new URLSearchParams()
    searchParams.append('join', 'statements')
    searchParams.append('join', 'instructions')
    searchParams.append('join', 'solutions')
    searchParams.append('join', 'tests')

    let data = await got
        .get(URI, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            resolveBodyOnly: true,
            searchParams: new URLSearchParams(searchParams),
        }).json();
    if (normalize)
        normalizeData(data)

    return data
}

function normalizeData(data) {
    /**************************************************************************************************/
    //NORMALIZING DATA FETCHED BY URI  
    //the data coming to the author kit API need to be changed to pass in AJV test
    data.created_at = data.created_at.substr(0, data.created_at.indexOf('.'));
    data.updated_at = data.updated_at.substr(0, data.updated_at.indexOf('.'));
    for (let i in data.solutions) {
        data.solutions[i].created_at = data.solutions[i].created_at.substr(0, data.solutions[i].created_at.indexOf('.'));
        data.solutions[i].updated_at = data.solutions[i].updated_at.substr(0, data.solutions[i].updated_at.indexOf('.'));
    }



    data.type = data.type.toUpperCase()
    data.difficulty = data.difficulty.toUpperCase()
    data.status = data.status.toUpperCase()
    for (let i in data.statements) {
        data.statements[i].format = data.statements[i].format.toUpperCase()
        data.statements[i].created_at = data.statements[i].created_at.substr(0, data.statements[i].created_at.indexOf('.'));
        data.statements[i].updated_at = data.statements[i].updated_at.substr(0, data.statements[i].updated_at.indexOf('.'));
    }
    for (let i in data.tests) {
        data.tests[i].input = data.tests[i].input.pathname
        data.tests[i].output = data.tests[i].output.pathname
        if (!('message' in data.tests[i].feedback)) {
            data.tests[i].feedback.message = ""
        }
        if (!('weight' in data.tests[i].feedback)) {
            data.tests[i].feedback.weight = ""
        }
    }

    /**************************************************************************************************/
}

async function getStatementContents(baseUrl, token, id, decode) {
    const b64contents = await got.get(`${baseUrl}/statements/${id}/contents`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        resolveBodyOnly: true,
    })
    let data = b64contents
    if (decode) data = b64decode(b64contents)
    return data
}

async function getSolutionContents(baseUrl, token, id) {
    const b64contents = await got.get(`${baseUrl}/solutions/${id}/contents`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        resolveBodyOnly: true,
    })
    return b64decode(b64contents)
}
async function getInputContents(baseUrl, token, id) {

    const b64contents = await got.get(`${baseUrl}/tests/${id}/input/contents`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        resolveBodyOnly: true,
    })
    return b64decode(b64contents)
}
async function getOutputContents(baseUrl, token, id) {
    const b64contents = await got.get(`${baseUrl}/tests/${id}/output/contents`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        resolveBodyOnly: true,
    })
    return b64decode(b64contents)
}
async function getYapexilSchema(URI) {
    const data = await got.get(URI, {
        headers: {
            resolveBodyOnly: true,
            responseType: 'json',
        },
        resolveBodyOnly: true,
    })
    return JSON.parse(data)
}


function b64decode(data) {
    const buff = Buffer.from(data, 'base64')
    return buff.toString('utf8')
}

module.exports = {
    login,
    getAllExercise,
    getExercise,
    getStatementContents,
    getSolutionContents,
    getInputContents,
    getOutputContents,
    getAllProjects,
    b64decode,
    getYapexilSchema,

}