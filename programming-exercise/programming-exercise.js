/**
 * @file Represent an exercise using the YAPExIL schema
 * 
 * More information about YAPExIL format can be found at https://drops.dagstuhl.de/opus/volltexte/2020/13027/pdf/OASIcs-SLATE-2020-14.pdf
 * @author Marco Primo
 */


const zip_a_folder = require('zip-a-folder');
const readChunk = require('read-chunk');
const extract = require('extract-zip')
const api = require('./authorkit-api')
const CONST = require('./CONST')
const fs = require('fs')
const fileType = require('file-type');
const rimraf = require("rimraf");
const path = require('path');
const base64topdf = require('base64topdf');
const Ajv = require("ajv")
const ajv = new Ajv()
const addFormats = require("ajv-formats")

/****************************************************************/
//Adding some formats needed to yapexil.schema.json be valid
addFormats(ajv, ["date", "time", "date-time"]);
path.resolve(__dirname, 'settings.json');

/****************************************************************/
const Common_schema = JSON.parse(fs.readFileSync('../../APIs/schemas/Common.json', { encoding: 'utf8', flag: 'r' }))
const YAPEXIL_RESOURCE_schema = JSON.parse(fs.readFileSync('../../APIs/schemas/YAPEXIL/YAPEXIL_RESOURCE.json', { encoding: 'utf8', flag: 'r' }))
const YAPEXIL_TEST_SET_schema = JSON.parse(fs.readFileSync('../../APIs/schemas/YAPEXIL/YAPEXIL_TEST_SET.json', { encoding: 'utf8', flag: 'r' }))
const YAPEXIL_TESTS_schema = JSON.parse(fs.readFileSync('../../APIs/schemas/YAPEXIL/YAPEXIL_TESTS.json', { encoding: 'utf8', flag: 'r' }))
const YAPEXIL_SOLUTIONS_schema = JSON.parse(fs.readFileSync('../../APIs/schemas/YAPEXIL/YAPEXIL_SOLUTIONS.json', { encoding: 'utf8', flag: 'r' }))
const YAPEXIL_STATEMENTS_schema = JSON.parse(fs.readFileSync('../../APIs/schemas/YAPEXIL/YAPEXIL_STATEMENTS.json', { encoding: 'utf8', flag: 'r' }))
const YAPEXIL_schema = JSON.parse(fs.readFileSync('../../APIs/schemas/YAPEXIL/YAPEXIL.json', { encoding: 'utf8', flag: 'r' }))

/****************************************************************/
var JWT_TOKEN;
/****************************************************************/
/** @function do_auth
 *  
 * Internal function to does the authentication
 *  @param {string} ID  The exercise ID   */
async function do_auth() {
    if (JWT_TOKEN === undefined) {
        try {
            JWT_TOKEN = (
                await api.login(CONST.BASE_URL, CONST.EMAIL, CONST.PASSWORD)
            ).accessToken
        } catch (err) {
            console.log(err)
        }
    }
}

/**
 * Creates a new ProgrammingExercise.
 * @class
 */

module.exports = class ProgrammingExercise {
    static validate = ajv.addSchema(Common_schema).addSchema(YAPEXIL_RESOURCE_schema).addSchema(YAPEXIL_TESTS_schema).addSchema(YAPEXIL_TEST_SET_schema).addSchema(YAPEXIL_SOLUTIONS_schema).addSchema(YAPEXIL_STATEMENTS_schema).compile(YAPEXIL_schema)

    constructor(exercise) {
        if (exercise != undefined && ProgrammingExercise.isValid(exercise))
            Object.assign(this, exercise)

    }
    setId(id) {
        if (!isNaN(id) && id > 0) {
            this.id = id
            return true
        }
        return false

    }
    setTitle(title) {
        if (typeof title === 'string' || title instanceof String) {
            this.title = title
            return true
        }
        return false

    }
    setAuthor(author) {
        if (typeof author === 'string' || author instanceof String) {
            this.author = author
            return true
        }
        return false
    }
    setKeywords(keywords) {
        if (Array.isArray(keywords)) {
            for (let str of keywords) {
                if (str.length > 50)
                    return false
            }
            this.keywords = keywords
            return true
        }
        return false
    }
    setStatus(status) {
        if (typeof status === 'string' || status instanceof String) {
            status = status.toUpperCase()
            if (["DRAFT", "PUBLISHED", "UNPUBLISHED", "TRASH"].includes(status)) {
                this.status = status
                return true
            } else return false
        }
        return false
    }
    setType(type) {
        if (typeof type === 'string' || type instanceof String) {
            type = type.toUpperCase()
            if ([
                    "BLANK_SHEET",
                    "EXTENSION",
                    "IMPROVEMENT",
                    "BUG_FIX",
                    "FILL_IN_GAPS",
                    "SORT_BLOCKS",
                    "SPOT_BUG"
                ].includes(type)) {
                this.type = type
                return true
            } else return false
        }
        return false
    }
    setCreated_at(created_at) {
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(date)) {
            this.created_at = created_at
            return true
        }
        return falses
    }
    setTests(tests) {
        ProgrammingExercise.validate = ajv.compile(YAPEXIL_TESTS_schema)
        if (ProgrammingExercise.validate(tests)) {
            this.tests = tests
            return true
        }
        console.log(tests)
        console.log(JSON.stringify(ProgrammingExercise.validate.errors))
        return false

    }
    setSolutions(solutions) {
        ProgrammingExercise.validate = ajv.compile(YAPEXIL_SOLUTIONS_schema)

        if (ProgrammingExercise.validate(solutions)) {
            this.solutions = solutions
            return true
        }
        console.log(JSON.stringify(ProgrammingExercise.validate.errors))
        return false
    }
    setStatements(statements) {
        ProgrammingExercise.validate = ajv.compile(YAPEXIL_STATEMENTS_schema)
        if (ProgrammingExercise.validate(statements)) {
            this.statements = statements
            return true
        }
        console.log(JSON.stringify(ProgrammingExercise.validate.errors))

        return false
    }
    setTests_contents_in(tests_contents_in) {
        this.tests_contents_in = tests_contents_in
    }
    setTests_contents_out(tests_contents_out) {
        this.tests_contents_out = tests_contents_out
    }
    setSolutions_contents(solutions_contents) {
        this.solutions_contents = solutions_contents
    }
    setStatements_contents(statements_contents) {
        this.statements_contents = statements_contents
    }

    /** @function getDescription
     *  
     * This function returns the an object list  with an  question statement and the format 
     *  */
    getDescription() {
            let list = this.statements.map((data) => {
                let obj = { type: data.format, content: this.statements_contents[data.id] }
                return obj
            })
            return list
        }
        /** @function getTests
         *  
         * This function returns the an object list  with an test input and ouput
         *  */
    getTests() {
            let list = this.tests.map((data) => {
                let obj = { input: this.tests_contents_in[data.id], output: this.tests_contents_out[data.id] }
                return obj
            })
            return list
        }
        /** @function getSolutions
         *  
         * This function returns the an object list  with the solutions
         *  */
    getSolutions() {
            let list = this.solutions.map((data) => {
                let obj = { name: data.pathname, solution: this.solutions_contents[data.id] }
                return obj
            })
            return list
        }
        /** @function load_remote_exercise
         *  
         * This function will load an exercise coming from authorkit API in this class 
         *  @param {string} ID  The exercise ID   */
    async load_remote_exercise(ID) {
        await do_auth()
        try {

            const YAPExILData = await api.getExercise(
                CONST.BASE_URL,
                JWT_TOKEN,
                ID,
                true
            )
            Object.assign(this, YAPExILData)


            // If this exercise is coming through the authokit lets get some data that are missing
            // set statments content of the exercise
            this.statements_contents = []
            for (let metadata_statment of this.statements) {
                let decode = metadata_statment.format == "pdf" ? false : true
                this.statements_contents[metadata_statment.id] = await api.getStatementContents(
                    CONST.BASE_URL,
                    JWT_TOKEN,
                    metadata_statment.id,
                    decode
                )
            }

            // set solutions content of the exercise
            this.solutions_contents = []
            for (let metadata_solutions of this.solutions) {
                this.solutions_contents[metadata_solutions.id] = await api.getSolutionContents(
                    CONST.BASE_URL,
                    JWT_TOKEN, metadata_solutions.id
                )
            }


            // set output test content of the exercise
            this.tests_contents_out = []
            for (let metadata_tests of this.tests) {
                this.tests_contents_out[metadata_tests.id] = await api.getOutputContents(
                    CONST.BASE_URL,
                    JWT_TOKEN,
                    metadata_tests.id,
                )
            }

            // set input test content of the exercise
            this.tests_contents_in = []
            for (let metadata_tests of this.tests) {
                this.tests_contents_in[metadata_tests.id] = await api.getInputContents(
                    CONST.BASE_URL,
                    JWT_TOKEN,
                    metadata_tests.id,
                )
            }
            /**************************************************************************************************/
        } catch (err) {
            console.log(err)
        }

    }

    /** @function validate
     *  
     * This function makes an evaluation from an object using the schema loaded by the function setup_validate()
     *   */
    static isValid(obj) {
        ProgrammingExercise.validate = ajv.compile(YAPEXIL_schema)
        const valid = ProgrammingExercise.validate(obj)
        if (!valid) console.log(JSON.stringify(ProgrammingExercise.validate.errors))
        return valid

    }

    /** @function  serialize
     * 
     * This function output a zip file that will have a concreted exercise
     *   @param {string} p The string that represents the path where this function will output the zip file, if none path is passed the default folder is the "serialized" folder under the current directory
     *  
     *   */
    async serialize(p = serialized_path()) {

            const directory = path.join(__dirname, this.id)

            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
                fs.writeFileSync(path.join(directory, "metadata.txt"), JSON.stringify(this, null, '\t'), {
                    encoding: "utf8",
                });

                /*************************************************************************************************************************/
                // Creating directories [solution,tests,statements]
                // Under each one of these directories will have the metadata information as well the concreted content 
                const directory_solutions = path.join(directory, "solutions")
                if (!fs.existsSync(directory_solutions)) {
                    fs.mkdirSync(directory_solutions);
                    fs.writeFileSync(path.join(directory_solutions, "metadata.txt"), JSON.stringify(this.solutions, null, '\t'), {
                        encoding: "utf8",
                    });
                    for (let metadata_solutions of this.solutions) {
                        fs.writeFileSync(path.join(directory_solutions, metadata_solutions.pathname), this.solutions_contents[metadata_solutions.id], {
                            encoding: "utf8",
                        });
                    }
                }
                const directory_tests = path.join(directory, "tests")
                if (!fs.existsSync(directory_tests)) {
                    fs.mkdirSync(directory_tests);
                    fs.writeFileSync(path.join(directory_solutions, "metadata.txt"), JSON.stringify(this.tests, null, '\t'), {
                        encoding: "utf8",
                    });
                    for (let metadata_tests of this.tests) {
                        fs.writeFileSync(path.join(directory_tests, metadata_tests.input), this.tests_contents_in[metadata_tests.id], {
                            encoding: "utf8",
                        });
                        fs.writeFileSync(path.join(directory_tests, metadata_tests.output), this.tests_contents_out[metadata_tests.id], {
                            encoding: "utf8",
                        });
                    }
                }
                const directory_statements = path.join(directory, "statements")
                if (!fs.existsSync(directory_statements)) {
                    fs.mkdirSync(directory_statements);
                    fs.writeFileSync(path.join(directory_statements, "metadata.txt"), JSON.stringify(this.statements, null, '\t'), {
                        encoding: "utf8",
                    });
                    for (let metadata_statments of this.statements) {
                        if (metadata_statments.format != "pdf")
                            fs.writeFileSync(path.join(directory_statements, metadata_statments.pathname), this.statements_contents[metadata_statments.id], {
                                encoding: "utf8",
                            });
                        else
                            base64topdf.base64Decode(this.statements_contents[metadata_statments.id], path.join(directory_statements, metadata_statments.pathname));

                    }
                }
                /*************************************************************************************************************************/
                // make a zip if these folders 
                let file_zip_name = path.join(p, this.id)
                await zip_a_folder.zip(directory, `${file_zip_name}.zip`);
                // deleting the folder created for auxiliary at the  zip process 
                // I tried with fs.rmdirSync but did not work 
                rimraf.sync(directory)
            }
        }
        /** @function  deserialize
         * 
         * This function create a list of ProgrammingExercise class instance 
         *   @param {string} p The string that represents the path where this function will read the zip file, if none path is passed the default folder is the "serialized" folder under the current directory
         *  
         *   */
    static async deserialize(p = serialized_path()) {
        var exercise_list = []
        let files = fs.readdirSync(p)
        for (let exercise_zip_name of files) {
            var n_programming_exercise = Object.create(null);
            var file_path = path.join(p, exercise_zip_name)

            //deleting the .zip from the name
            exercise_zip_name = exercise_zip_name.replace(/\.[^/.]+$/, "")

            // these lines will to check if the current file is a zip file
            const buffer = readChunk.sync(file_path, 0, 4100);
            let type = await fileType.fromBuffer(buffer)
            if (type != undefined && type.ext === 'zip') {

                try {
                    /************************************************************************************************************/
                    //getting the main metadata  in the root of the folder
                    let unzip_path = path.join(temp_path(), exercise_zip_name)
                    await extract(file_path, { dir: unzip_path })
                    let metadata = fs.readFileSync(path.join(unzip_path, 'metadata.txt'), { encoding: 'utf8', flag: 'r' });
                    n_programming_exercise = Object.assign(this, JSON.parse(metadata))
                    let solutions_path = path.join(unzip_path, 'solutions')




                    /************************************************************************************************************/
                    //The walks of  all folders and retrieve information to build one Instance of the class ProgrammingExercise
                    if (fs.existsSync(solutions_path)) {
                        for (let metadata_solutions of n_programming_exercise['solutions']) {
                            let solution = fs.readFileSync(path.join(solutions_path, metadata_solutions.pathname), { encoding: 'utf8', flag: 'r' });
                            n_programming_exercise.solutions_contents[metadata_solutions.id] = solution


                        }
                    }

                    let tests_path = path.join(unzip_path, 'tests')
                    if (fs.existsSync(tests_path)) {

                        for (let metadata_tests of n_programming_exercise['tests']) {
                            let test_in = fs.readFileSync(path.join(tests_path, metadata_tests.input), { encoding: 'utf8', flag: 'r' });
                            n_programming_exercise.tests_contents_in[metadata_tests.id] = test_in
                        }

                        for (let metadata_tests of n_programming_exercise['tests']) {
                            let test_out = fs.readFileSync(path.join(tests_path, metadata_tests.output), { encoding: 'utf8', flag: 'r' });
                            n_programming_exercise.tests_contents_out[metadata_tests.id] = test_out
                        }

                    }

                    let statement_path = path.join(unzip_path, 'statements')
                    if (fs.existsSync(statement_path)) {
                        for (let metadata_statement of n_programming_exercise['statements']) {
                            if (metadata_statement.format != 'pdf') {
                                let statement = fs.readFileSync(path.join(statement_path, metadata_statement.pathname), { encoding: 'utf8', flag: 'r' });
                                n_programming_exercise.statements_contents[metadata_statement.id] = statement
                            } else {
                                let statement = fs.readFileSync(path.join(statement_path, metadata_statement.pathname), { encoding: 'base64', flag: 'r' });
                                n_programming_exercise.statements_contents[metadata_statement.id] = statement

                            }
                        }
                    }
                    /************************************************************************************************************/
                    exercise_list.push(n_programming_exercise)
                } catch (err) {
                    console.log(err)
                }
            }
        }
        return exercise_list
    }
    to_string() {
        return JSON.stringify(this)
    }
}

function serialized_path() {
    return path.join(__dirname, 'serialized')

}

function temp_path() {
    return path.join(__dirname, 'temp')

}