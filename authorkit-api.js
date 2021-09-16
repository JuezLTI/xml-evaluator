/**
 *  This file is based on the file  with the same name in this repo https://github.com/josepaiva94/fgpe-authorkit-client
 *  credits to  https://github.com/josepaiva94/
 */

const got = require('got')
const FormData = require('form-data')

async function login(baseUrl, email, password) {
  return await got.post(`${baseUrl}/auth/login`, {
    json: {
      email,
      password,
    },
    resolveBodyOnly: true,
    responseType: 'json',
  })
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

async function getAllExerciseStatements(baseUrl, token, projectId) {
  const searchParams = {
    fields: 'id,title,keywords',
    join: 'statements',
    sort: 'title,ASC',
    limit: 200,
  }

  //console.log(new URLSearchParams(searchParams).toString())
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
  searchParams.append('join', 'embeddable')
  searchParams.append('join', 'skeleton')

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

async function getStatementContents(baseUrl, token, id) {
  const b64contents = await got.get(`${baseUrl}/statements/${id}/contents`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    resolveBodyOnly: true,
  })
  return b64decode(b64contents)
}

async function updateStatementContents(baseUrl, token, id, filename, contents) {
  const fd = new FormData()
  fd.append('file', Buffer.from(contents), filename)
  return await got.patch(`${baseUrl}/statements/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    resolveBodyOnly: true,
    body: fd,
  })
}

function b64decode(data) {
  const buff = Buffer.from(data, 'base64')
  return buff.toString('utf8')
}

module.exports = {
  login,
  getAllExerciseStatements,
  getStatementContents,
  updateStatementContents,
  getAllProjects,
  getExercise,
}
