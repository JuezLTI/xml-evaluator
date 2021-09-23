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

async function getExercise(baseUrl, token, id) {
    const searchParams = new URLSearchParams()
    searchParams.append('join', 'statements')
    searchParams.append('join', 'instructions')
    searchParams.append('join', 'solutions')
    searchParams.append('join', 'tests')

    return await got
        .get(`${baseUrl}/exercises/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            resolveBodyOnly: true,
            searchParams: new URLSearchParams(searchParams),
        })
        .json()
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
}