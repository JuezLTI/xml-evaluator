/**
 * @file Represent an exercise using the YAPExIL schema
 * 
 * More information about YAPExIL format can be found at https://drops.dagstuhl.de/opus/volltexte/2020/13027/pdf/OASIcs-SLATE-2020-14.pdf
 * @author Marco Primo
 */


const archiver = require('archiver');
const stream = require('stream');
const os = require("os");
const fs = require('fs')
const { promisify } = require('util');
const got = require('got');
const pipeline = promisify(stream.pipeline);
const readChunk = require('read-chunk');
const extract = require('extract-zip')
const fileType = require('file-type');
const rimraf = require("rimraf");
const path = require('path');
const base64topdf = require('base64topdf');
const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const ajv = new Ajv()
addFormats(ajv)
const YAPEXIL_URI = 'https://raw.githubusercontent.com/KA226-COVID/APIs/main/schemas/YAPEXIL/YAPEXIL.json';

/****************************************************************/
//Adding some formats needed to yapexil.schema.json be valid
path.resolve(__dirname, 'settings.json');

/****************************************************************/

/****************************************************************/
var JWT_TOKEN;
/****************************************************************/
/** @function do_auth
 *  
 * Internal function to does the authentication
 *  @param {string} ID  The exercise ID   */
async function do_auth(BASE_URL, EMAIL, PASSWORD, callback) {

    const credentials = {
        email: EMAIL,
        password: PASSWORD,
    }
    if (JWT_TOKEN === undefined) {
        try {
            got(`${BASE_URL}/auth/login`, {
                resolveBodyOnly: true,
                responseType: 'json',
                hooks: {
                    beforeRequest: [
                        options => {
                            options.method = "POST";
                            options.body = JSON.stringify(credentials);
                            options.headers['content-length'] = options.body.length.toString();
                            options.headers['Accept'] = 'application/json';
                            options.headers['Content-Type'] = 'application/json';
                        }
                    ],



                }
            }).then((response) => {
                let jsonData = response
                if (jsonData.accessToken)
                    callback(jsonData.accessToken)
                else
                    throw new Error("Not possible to authenticate at Authorkit")
            })
        } catch (err) {
            console.log(err)
        }
    } else {
        callback(JWT_TOKEN)
    }
}


function normalizeData(data) {
    /**************************************************************************************************/
    //NORMALIZING DATA FETCHED BY URI  
    //the data coming to the author kit API need to be changed to pass in AJV test
    for (let i in data.statements)
        data.statements[i].format = data.statements[i].format.toUpperCase()
    for (let i in data.tests)
        data.tests[i].weight = parseInt(data.tests[i].weight)


    if ("difficulty" in data)
        data.difficulty = data.difficulty.toUpperCase()

    if (!("title" in data))
        data.title = "BLANK"
    if (!("author" in data))
        data.author = "anonymous"
    if (!("keywords" in data))
        data.keywords = []
    if (!("status" in data))
        data.status = "DRAFT"
    else {
        data.status = data.status.toUpperCase()
    }
    if (!("type" in data))
        data.type = "BLANK_SHEET"
    else {
        data.type = data.type.toUpperCase()
    }
    data.tests.map((t) => {
        if ("visible" in t) {
            if (t.visible == "true")
                t.visible = true
            else
                t.visible = false
        }
        if ("timeout" in t) {
            t.timeout = parseInt(t.timeout)

        }
        if ("feedback" in t) {
            for (let f of t.feedback) {
                if (typeof f.weight == "string") {
                    f.weight = parseInt(f.weight)
                }
            }

        }

    })
}


async function loadSchemaYAPEXIL(uri = YAPEXIL_URI) {
    if (ProgrammingExercise.validate == null) {
        const response = await got(uri, { responseType: 'json', resolveBodyOnly: true });
        ProgrammingExercise.validate = ajv.compile(response)
    }
}
/**
 * Creates a new ProgrammingExercise.
 * @class
 */
class ProgrammingExercise {
    static validate = null;
    BASE_URL = "";
    EMAIL = "";
    PASSWORD = "";
    constructor(exercise, isNecessaryContent) {
        if (exercise != undefined) {
            if (ProgrammingExercise.isValid(exercise))
                Object.assign(this, exercise)
        } else {
            this.id = '00000000-0000-0000-0000-000000000000'
            this.title = 'Tamplate Title'
            this.keywords = []
            this.type = 'BLANK_SHEET'
            this.status = 'DRAFT'
            this.author = 'Anonymous'
            this.created_at = `${(new Date()).toISOString()}`
            this.solutions = [{
                id: '00000000-0000-0000-0000-000000000000',
                pathname: 'solution.cpp',
                lang: 'cpp'
            }]
            this.tests = [{
                id: '00000000-0000-0000-0000-000000000000',
                arguments: [],
                weight: 5,
                visible: true,
                input: 'input1.txt',
                output: 'output1.txt'
            }, ]
            this.statements = [{
                id: '00000000-0000-0000-0000-000000000000',
                pathname: 'statements.html',
                nat_lang: 'en',
                format: 'HTML'
            }, ]
            if (isNecessaryContent) {
                this.solutions_contents = {
                    "00000000-0000-0000-0000-000000000000": ""
                }
                this.tests_contents_in = {
                    "00000000-0000-0000-0000-000000000000": ""
                }
                this.tests_contents_out = {
                    "00000000-0000-0000-0000-000000000000": ""
                }
                this.statements_contents = {
                    "00000000-0000-0000-0000-000000000000": ""
                }
            }



        }
    }

    setId(id) {
        let aux = {}
        Object.assign(aux, this)
        aux.id = id
        if (ProgrammingExercise.isValid(aux)) {
            this.id = id
            return true
        }
        return false

    }
    setTitle(title) {
        let aux = {}
        Object.assign(aux, this)
        aux.title = title
        if (ProgrammingExercise.isValid(aux)) {
            this.title = title
            return true
        }
        return false

    }
    setAuthor(author) {
        let aux = {}
        Object.assign(aux, this)
        aux.author = author
        if (ProgrammingExercise.isValid(aux)) {
            this.author = author
            return true
        }
        return false
    }
    setKeywords(keywords) {
        let aux = {}
        Object.assign(aux, this)
        aux.keywords = keywords
        if (ProgrammingExercise.isValid(aux)) {
            this.keywords = keywords
            return true
        }
        return false
    }
    setStatus(status) {
        let aux = {}
        Object.assign(aux, this)
        aux.status = status
        if (ProgrammingExercise.isValid(aux)) {
            this.status = status
            return true
        } else return false


    }
    setType(type) {
        let aux = {}
        Object.assign(aux, this)
        aux.type = type
        if (ProgrammingExercise.isValid(aux)) {
            this.type = type
            return true
        } else return false


    }
    setTests(tests) {
        let aux = {}
        Object.assign(aux, this)
        aux.tests = tests
        if (ProgrammingExercise.isValid(aux)) {
            this.tests = tests
            return true
        }
        return false

    }
    setSolutions(solutions) {
        let aux = {}
        Object.assign(aux, this)
        aux.solutions = solutions
        if (ProgrammingExercise.isValid(aux)) {
            this.solutions = solutions
            return true
        }
        return false
    }
    setStatements(statements) {
            let aux = {}
            Object.assign(aux, this)
            aux.statements = statements
            if (ProgrammingExercise.isValid(aux)) {
                this.statements = statements
                return true
            }
            return false
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
         * This function will load an exercise coming from an API in this class 
         *  @param {string} ID   exercise's ID
         */
    static loadRemoteExercise(ID, config) {

        return new Promise(function(resolve, reject) {
            do_auth(config.BASE_URL, config.EMAIL, config.PASSWORD, async(token) => {
                try {
                    console.log(os.tmpdir())
                    const tempDir = os.tmpdir();
                    await pipeline(
                        got.stream(`${config.BASE_URL}/exercises/${ID}/export`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            }
                        }),
                        fs.createWriteStream(path.join(tempDir, "response.zip"))
                    ).then(() => {
                        if (fs.existsSync(path.join(tempDir, "response"))) {
                            rimraf.sync(path.join(tempDir, "response"))
                        }
                        ProgrammingExercise.deserialize(tempDir).then((data) => {
                            resolve(data)
                        })
                    })



                } catch (error) {
                    console.log(error)
                    reject(this)
                }
            })

        });




    }


    /** @function validate
     *  
     * This function makes an evaluation from an object using the schema loaded by the function setup_validate()
     *   */
    static isValid(obj) {

        if (ProgrammingExercise.validate == null) {
            throw new Error('YAPEXIL schema not loaded');

        }
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


    serialize(p = serializedPath()) {
            return new Promise((resolve, reject) => {
                const directory = path.join(p, this.id)
                try {
                    if (fs.existsSync(directory)) {
                        rimraf.sync(directory)
                    }
                    fs.mkdirSync(directory);
                    let aux = {}
                    Object.assign(aux, this)
                    delete aux.tests_contents_in;
                    delete aux.tests_contents_out;
                    delete aux.statements_contents;
                    delete aux.solutions_contents;
                    delete aux.libraries_contents;
                    delete aux.skeletons_contents;

                    delete aux.solutions;
                    delete aux.statements;
                    delete aux.tests;
                    delete aux.libraries;
                    delete aux.skeletons;

                    fs.writeFileSync(path.join(directory, "metadata.json"), JSON.stringify(aux, null, '\t'), {
                        encoding: "utf8",
                    });

                    /*************************************************************************************************************************/
                    // Creating directories [solution,tests,statements,skeletons,libraries]
                    // Under each one of these directories will have the metadata information as well the concreted content 
                    if (Symbol.iterator in Object(this.libraries)) {
                        const directory_libraries = path.join(directory, "libraries")
                        if (!fs.existsSync(directory_libraries)) {
                            fs.mkdirSync(directory_libraries);

                            for (let metadata_libraries of this.libraries) {
                                let directory_libraries_id = path.join(directory_libraries, metadata_libraries.id)
                                fs.mkdirSync(directory_libraries_id);
                                fs.writeFileSync(path.join(directory_libraries_id, "metadata.json"), JSON.stringify(metadata_libraries, null, '\t'), {
                                    encoding: "utf8",
                                    flag: 'wx'
                                });
                                fs.writeFileSync(path.join(directory_libraries_id, metadata_libraries.pathname), this.libraries_contents[metadata_libraries.id], {
                                    encoding: "utf8",
                                });
                            }
                        }
                    }

                    if (Symbol.iterator in Object(this.skeletons)) {
                        const directory_skeletons = path.join(directory, "skeletons")
                        if (!fs.existsSync(directory_skeletons)) {
                            fs.mkdirSync(directory_skeletons);

                            for (let metadata_skeletons of this.skeletons) {
                                let directory_skeletons_id = path.join(directory_skeletons, metadata_skeletons.id)
                                fs.mkdirSync(directory_skeletons_id);
                                fs.writeFileSync(path.join(directory_skeletons_id, "metadata.json"), JSON.stringify(metadata_skeletons, null, '\t'), {
                                    encoding: "utf8",
                                    flag: 'wx'
                                });
                                fs.writeFileSync(path.join(directory_skeletons_id, metadata_skeletons.pathname), this.skeletons_contents[metadata_skeletons.id], {
                                    encoding: "utf8",
                                });
                            }
                        }
                    }




                    if (Symbol.iterator in Object(this.solutions)) {
                        const directory_solutions = path.join(directory, "solutions")
                        if (!fs.existsSync(directory_solutions)) {
                            fs.mkdirSync(directory_solutions);

                            for (let metadata_solutions of this.solutions) {
                                let directory_solutions_id = path.join(directory_solutions, metadata_solutions.id)
                                fs.mkdirSync(directory_solutions_id);
                                fs.writeFileSync(path.join(directory_solutions_id, "metadata.json"), JSON.stringify(metadata_solutions, null, '\t'), {
                                    encoding: "utf8",
                                    flag: 'wx'
                                });
                                fs.writeFileSync(path.join(directory_solutions_id, metadata_solutions.pathname), this.solutions_contents[metadata_solutions.id], {
                                    encoding: "utf8",
                                });
                            }
                        }
                    }
                    if (Symbol.iterator in Object(this.tests)) {
                        const directory_tests = path.join(directory, "tests")
                        if (!fs.existsSync(directory_tests)) {
                            fs.mkdirSync(directory_tests);

                            for (let metadata_tests of this.tests) {
                                let directory_tests_id = path.join(directory_tests, metadata_tests.id)
                                fs.mkdirSync(directory_tests_id);

                                fs.writeFileSync(path.join(directory_tests_id, "metadata.json"), JSON.stringify(metadata_tests, null, '\t'), {
                                    encoding: "utf8",
                                    flag: 'wx'
                                });

                                fs.writeFileSync(path.join(directory_tests_id, metadata_tests.input), this.tests_contents_in[metadata_tests.id], {
                                    encoding: "utf8",
                                    flag: 'wx'
                                });
                                fs.writeFileSync(path.join(directory_tests_id, metadata_tests.output), this.tests_contents_out[metadata_tests.id], {
                                    encoding: "utf8",
                                    flag: 'wx'
                                });
                            }
                        }
                    }
                    if (Symbol.iterator in Object(this.statements)) {
                        const directory_statements = path.join(directory, "statements")
                        if (!fs.existsSync(directory_statements)) {
                            fs.mkdirSync(directory_statements);

                            for (let metadata_statements of this.statements) {
                                let directory_statements_id = path.join(directory_statements, metadata_statements.id)
                                fs.mkdirSync(directory_statements_id);

                                fs.writeFileSync(path.join(directory_statements_id, "metadata.json"), JSON.stringify(metadata_statements, null, '\t'), {
                                    encoding: "utf8",
                                    flag: 'wx'
                                });

                                if (metadata_statements.format.toUpperCase() != "PDF")
                                    fs.writeFileSync(path.join(directory_statements_id, metadata_statements.pathname), this.statements_contents[metadata_statements.id], {
                                        encoding: "utf8",
                                        flag: 'wx'
                                    });
                                else
                                    base64topdf.base64Decode(this.statements_contents[metadata_statements.id], path.join(directory_statements_id, metadata_statements.pathname));

                            }
                        }
                    }

                    /*************************************************************************************************************************/
                    // make a zip if these folders 
                    let file_zip_name = path.join(p, this.id)
                    const stream = fs.createWriteStream(`${file_zip_name}.zip`);
                    const archive = archiver('zip', { zlib: { level: 9 } });

                    (new Promise((inner_resolve, inner_reject) => {
                        archive
                            .directory(directory, false)
                            .on('error', err => inner_reject(err))
                            .pipe(stream);

                        stream.on('close', () => inner_resolve());
                        archive.finalize();
                    })).then(() => {
                            rimraf.sync(directory)
                            resolve(true)
                        }).catch((err) => {
                            reject(false);

                        })
                        // deleting the folder created for auxiliary at the  zip process 
                        // I tried with fs.rmdirSync but did not work 

                } catch (e) {
                    console.log(e)
                    reject(false)
                }
            })





        }
        /** @function  deserialize
         * 
         * This function create a list of ProgrammingExercise class instance 
         *   @param {string} p The string that represents the path where this function will read the zip file, if none path is passed the default folder is the "serialized" folder under the current directory
         *  
         *   */
    static async deserialize(p = serializedPath(), filename = "response.zip") {
        var n_programming_exercise = {}
            //deleting the .zip from the name
        var file_path = path.join(p, filename)

        filename = filename.replace(/\.[^/.]+$/, "")

        // these lines will to check if the current file is a zip file
        const buffer = readChunk.sync(file_path, 0, 4100);
        let type = await fileType.fromBuffer(buffer)
        if (type != undefined && type.ext === 'zip') {

            try {
                /************************************************************************************************************/
                //getting the main metadata  in the root of the folder
                let unzip_path = path.join(os.tmpdir(), filename)
                await extract(file_path, { dir: unzip_path })
                let n_programming_exercise = JSON.parse(fs.readFileSync(path.join(unzip_path, 'metadata.json'), { encoding: 'utf8', flag: 'r' }));
                n_programming_exercise.solutions = []
                n_programming_exercise.tests = []
                n_programming_exercise.statements = []
                n_programming_exercise.skeletons = []
                n_programming_exercise.libraries = []
                    /************************************************************************************************************/
                    //The walks of  all folders and retrieve information to build one Instance of the class ProgrammingExercise


                let libraries_path = path.join(unzip_path, 'libraries')

                n_programming_exercise.libraries_contents = {}
                if (fs.existsSync(libraries_path)) {
                    let folders = fs.readdirSync(libraries_path)
                    for (let folder of folders) {
                        let libraries_path_id = path.join(libraries_path, folder)
                        let metadata = JSON.parse(fs.readFileSync(path.join(libraries_path_id, "metadata.json"), { encoding: 'utf8', flag: 'r' }))
                        n_programming_exercise.libraries.push(metadata)
                        let skeleton = fs.readFileSync(path.join(libraries_path_id, metadata.pathname), { encoding: 'utf8', flag: 'r' });
                        n_programming_exercise.libraries_contents[metadata.id] = skeleton
                    }
                }






                let skeletons_path = path.join(unzip_path, 'skeletons')
                n_programming_exercise.skeletons_contents = {}
                if (fs.existsSync(skeletons_path)) {
                    let folders = fs.readdirSync(skeletons_path)
                    for (let folder of folders) {
                        let skeletons_path_id = path.join(skeletons_path, folder)
                        let metadata = JSON.parse(fs.readFileSync(path.join(skeletons_path_id, "metadata.json"), { encoding: 'utf8', flag: 'r' }))
                        n_programming_exercise.skeletons.push(metadata)
                        let skeleton = fs.readFileSync(path.join(skeletons_path_id, metadata.pathname), { encoding: 'utf8', flag: 'r' });
                        n_programming_exercise.skeletons_contents[metadata.id] = skeleton
                    }
                }

                let solutions_path = path.join(unzip_path, 'solutions')

                n_programming_exercise.solutions_contents = {}
                if (fs.existsSync(solutions_path)) {
                    let folders = fs.readdirSync(solutions_path)
                    for (let folder of folders) {
                        let solutions_path_id = path.join(solutions_path, folder)
                        let metadata = JSON.parse(fs.readFileSync(path.join(solutions_path_id, "metadata.json"), { encoding: 'utf8', flag: 'r' }))
                        n_programming_exercise.solutions.push(metadata)
                        let solution = fs.readFileSync(path.join(solutions_path_id, metadata.pathname), { encoding: 'utf8', flag: 'r' });
                        n_programming_exercise.solutions_contents[metadata.id] = solution
                    }
                }
                let tests_path = path.join(unzip_path, 'tests')

                n_programming_exercise.tests_contents_in = {}
                n_programming_exercise.tests_contents_out = {}
                if (fs.existsSync(tests_path)) {
                    let folders = fs.readdirSync(tests_path)
                    for (let folder of folders) {
                        let tests_path_id = path.join(tests_path, folder)
                        let metadata = JSON.parse(fs.readFileSync(path.join(tests_path_id, "metadata.json"), { encoding: 'utf8', flag: 'r' }))
                        n_programming_exercise.tests.push(metadata)
                        let tests_in = fs.readFileSync(path.join(tests_path_id, metadata.input), { encoding: 'utf8', flag: 'r' });
                        let tests_out = fs.readFileSync(path.join(tests_path_id, metadata.output), { encoding: 'utf8', flag: 'r' });
                        n_programming_exercise.tests_contents_in[metadata.id] = tests_in
                        n_programming_exercise.tests_contents_out[metadata.id] = tests_out

                    }
                }
                /************************************************************************************************************/
                let statement_path = path.join(unzip_path, 'statements')


                n_programming_exercise.statements_contents = {}
                if (fs.existsSync(statement_path)) {
                    let folders = fs.readdirSync(statement_path)
                    for (let folder of folders) {
                        let statement_path_id = path.join(statement_path, folder)
                        let metadata = JSON.parse(fs.readFileSync(path.join(statement_path_id, "metadata.json"), { encoding: 'utf8', flag: 'r' }))
                        n_programming_exercise.statements.push(metadata)
                        let statement;
                        if (metadata.format.toUpperCase() == "PDF") {
                            statement = fs.readFileSync(path.join(statement_path_id, metadata.pathname), { encoding: 'base64', flag: 'r' });

                        } else {
                            statement = fs.readFileSync(path.join(statement_path_id, metadata.pathname), { encoding: 'utf8', flag: 'r' });
                        }


                        n_programming_exercise.statements_contents[metadata.id] = statement
                    }
                }
                /************************************************************************************************************/
                normalizeData(n_programming_exercise)
                let obj = (new ProgrammingExercise(n_programming_exercise))

                return obj
            } catch (err) {
                console.log(err)
                return {}
            }


        }
    }
    toString() {
        return JSON.stringify(this)
    }

}

function serializedPath() {
    let dir = path.join(__dirname, 'serialized')
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    return dir;

}
module.exports = {
    loadSchemaYAPEXIL,
    ProgrammingExercise
}