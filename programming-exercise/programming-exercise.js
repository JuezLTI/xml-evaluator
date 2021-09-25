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
//Static variables
var validate;
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
    constructor(obj) {
            Object.assign(this, this.init())
            if (obj != undefined) {
                this.id = obj.id
                this.title = obj.title
                this.author = obj.author
                this.keywords = obj.keywords
                this.status = obj.status
                this.type = obj.type
                this.created_at = obj.created_at
                this.statements = obj.statements
                this.solutions = obj.solutions
                this.tests = obj.tests
                if (`tests_contents_in` in obj) {
                    this.tests_contents_in = obj.tests_contents_in
                }
                if (`tests_contents_out` in obj) {
                    this.tests_contents_out = obj.tests_contents_out
                }
                if (`solutions_contents` in obj) {
                    this.solutions_contents = obj.solutions_contents
                }
                if (`statements_contents` in obj) {
                    this.statements_contents = obj.statements_contents
                }
                console.log(`Is this exercise valid: ${ this.validate()}`)

            }


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
                )
                Object.assign(this, YAPExILData)

                /**************************************************************************************************/
                //NORMALIZING DATA FETCHED BY URI  
                //the data coming to the author kit API need to be changed to pass in AJV test
                this.type = this.type.toUpperCase()
                this.difficulty = this.difficulty.toUpperCase()
                this.status = this.status.toUpperCase()
                for (let i in this.statements) {
                    this.statements[i].format = this.statements[i].format.toUpperCase()

                }
                for (let i in this.tests) {
                    this.tests[i].input = this.tests[i].input.pathname
                    this.tests[i].output = this.tests[i].output.pathname
                    if (!('message' in this.tests[i].feedback)) {
                        this.tests[i].feedback.message = ""
                    }
                    if (!('weight' in this.tests[i].feedback)) {
                        this.tests[i].feedback.weight = ""
                    }
                }
                /**************************************************************************************************/
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
            } finally {
                console.log(`Is this exercise valid: ${ this.validate()}`)
            }

        }
        /** @function setup_validate
         *  
         * This function just needs to be called once, since this is a function that will set for us the YAPEXILSCHEMA 
         *   */
    static async setup_validate() {
            const schema = await api.getYapexilSchema(CONST.YAPEXIL_SCHEMA);
            validate = ajv.compile(schema)
        }
        /** @function validate
         *  
         * This function makes an evaluation from the current object using the schema loaded by the function setup_validate()
         *   */
    validate() {
        const valid = validate(this)
        if (!valid) console.log(JSON.stringify(validate.errors))
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
    init() {
        return {
            id: '00000000-0000-0000-0000-000000000000',
            title: 'Draft exercise',
            author: "",
            keywords: [],
            status: '',
            type: '',
            created_at: '0000-00-00T00:00:00.000Z',
            statements: [],
            solutions: [],
            tests: [],
        }

    }
}

function serialized_path() {
    return path.join(__dirname, 'serialized')

}

function temp_path() {
    return path.join(__dirname, 'temp')

}