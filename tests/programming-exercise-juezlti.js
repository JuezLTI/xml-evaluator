const chai = require('chai'),
    expect = chai.expect;
const path = require('path');
const uuid = require('uuid');
const randomstring = require("randomstring");
const { loadSchemaYAPEXIL, ProgrammingExercise } = require('programming-exercise-juezlti');
const { doesNotMatch } = require('assert');


const config = {
    'BASE_URL': "http://fgpe.dcc.fc.up.pt/api",
    'EMAIL': "info@juezlti.eu",
    'PASSWORD': "Ju3zLT1.",
}

describe('Test for ProgrammingExercise', function() {
    this.timeout(10000);

    before(async function() {

        await loadSchemaYAPEXIL();
    });

    it('Test metadata of an exercise fetched using authokit-api ', async function() {
        let programmingExercise = await ProgrammingExercise.loadRemoteExercise("18177460-840a-4c57-8c24-d671ad9f5f95", config)
        expect(ProgrammingExercise.isValid(programmingExercise)).to.equal(true);

    })

    it('Test deserialization and serialization ', async function() {

        let programmingExercise = await ProgrammingExercise.loadRemoteExercise("c9d68b4f-e306-41f5-bba3-cafdcd024bfb", config)
        await programmingExercise.serialize(path.join(__dirname, 'resources'))
        let exerciseObj2 = await ProgrammingExercise.deserialize(path.join(__dirname, 'resources'), `${programmingExercise.id}.zip`)
        expect(ProgrammingExercise.isValid(exerciseObj2)).to.equal(true);

    })



    it('Test setID', function() {
        let exerciseObj = new ProgrammingExercise()
        expect(exerciseObj.setId(uuid.v4())).to.equal(true)
    })

    it('Test setTitle', function() {
        let exerciseObj = new ProgrammingExercise()
        expect(exerciseObj.setTitle(
            randomstring.generate({
                length: Math.random() * (100),
                charset: 'alphabetic'
            })
        )).to.equal(true)
    })
    it('Test setAuthor', function() {
        let exerciseObj = new ProgrammingExercise()
        expect(exerciseObj.setAuthor(
            randomstring.generate({
                length: Math.random() * (100),
                charset: 'alphabetic'
            })
        )).to.equal(true)
    })
    it('Test setKeywords', function() {
        let exerciseObj = new ProgrammingExercise()
        let list = []
        for (let i in (Math.random() * 20)) {
            list.push(

                randomstring.generate({
                    length: Math.random() * (100),
                    charset: 'alphabetic'
                })
            )
        }
        expect(exerciseObj.setKeywords(list)).to.equal(true)
    })

    it('Test setStatus', function() {
        let exerciseObj = new ProgrammingExercise()
        let list = [
            "DRAFT",
            "PUBLISHED",
            "UNPUBLISHED",
            "TRASH"
        ]
        expect(exerciseObj.setStatus(
            list[
                Math.round(Math.random() * (3))
            ]
        )).to.equal(true)
    })

    it('Test setType', function() {
        let exerciseObj = new ProgrammingExercise()
        let list = [
            "BLANK_SHEET",
            "EXTENSION",
            "IMPROVEMENT",
            "BUG_FIX",
            "FILL_IN_GAPS",
            "SORT_BLOCKS",
            "SPOT_BUG"
        ]
        expect(exerciseObj.setType(
            list[
                Math.round(Math.random() * (6))
            ]
        )).to.equal(true)
    })
    it('Test setTest', function() {
        let exerciseObj = new ProgrammingExercise()

        expect(exerciseObj.setTests(
            [{
                id: '00000000-0000-0000-0000-000000000000',
                arguments: [],
                weight: 5,
                visible: true,
                input: 'input1.txt',
                output: 'output1.txt'
            }]
        )).to.equal(true)
    })

    it('Test setStatements', function() {
        let exerciseObj = new ProgrammingExercise()

        expect(exerciseObj.setStatements(
            [{
                id: '00000000-0000-0000-0000-000000000000',
                pathname: 'statements.html',
                nat_lang: 'en',
                format: 'HTML'
            }, ]
        )).to.equal(true)
    })
    it('Test setSolutions', function() {
        let exerciseObj = new ProgrammingExercise()

        expect(exerciseObj.setSolutions(
            [{
                id: '00000000-0000-0000-0000-000000000000',
                pathname: 'solution.cpp',
                lang: 'cpp'
            }]
        )).to.equal(true)
    })




})