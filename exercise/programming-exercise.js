/**
 * This class  represent an exercise using the YAPExIL fetched from athorkit/api  
 * More information about YAPExIL format can be found at https://drops.dagstuhl.de/opus/volltexte/2020/13027/pdf/OASIcs-SLATE-2020-14.pdf
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

path.resolve(__dirname, 'settings.json')
module.exports = class ProgrammingExercise {
    constructor(...properties) {
        this.JWT_TOKEN = undefined
        this.init()
        if (properties != undefined) {
            Object.assign(this, properties)
        }

    }

    async load_localy_exercise(p) {

        const data = fs.readFileSync(path.join(__dirname, p), 'utf8')
        Object.assign(this, JSON.parse(data))

    }
    async load_remote_exercise(ID) {
        await this.do_auth()
        try {
            // set metada info
            const YAPExILData = await api.getExercise(
                CONST.BASE_URL,
                this.JWT_TOKEN,
                ID,
            )
            Object.assign(this, YAPExILData)

            // set statments of the exercise
            this.statements_contents = []
            for (let metadata_statment of this.statements) {
                let decode = metadata_statment.format == "pdf" ? false : true
                this.statements_contents[metadata_statment.id] = await api.getStatementContents(
                    CONST.BASE_URL,
                    this.JWT_TOKEN,
                    metadata_statment.id,
                    decode
                )
            }

            // set solutions of the exercise
            this.solutions_contents = []
            for (let metadata_solutions of this.solutions) {
                this.solutions_contents[metadata_solutions.id] = await api.getSolutionContents(
                    CONST.BASE_URL,
                    this.JWT_TOKEN, metadata_solutions.id
                )
            }


            // set output test of the exercise
            this.tests_contents_out = []
            for (let metadata_tests of this.tests) {
                this.tests_contents_out[metadata_tests.id] = await api.getOutputContents(
                    CONST.BASE_URL,
                    this.JWT_TOKEN,
                    metadata_tests.id,
                )
            }

            // set input test of the exercise
            this.tests_contents_in = []
            for (let metadata_tests of this.tests) {
                this.tests_contents_in[metadata_tests.id] = await api.getInputContents(
                    CONST.BASE_URL,
                    this.JWT_TOKEN,
                    metadata_tests.id,
                )
            }

        } catch (err) {
            console.log(err)
        }
    }

    async do_auth() {
        if (this.JWT_TOKEN === undefined) {
            try {
                this.JWT_TOKEN = (
                    await api.login(CONST.BASE_URL, CONST.EMAIL, CONST.PASSWORD)
                ).accessToken
            } catch (err) {
                console.log(err)
            }
        }
    }
    async serialize(p = serialized_path()) {
        const directory = path.join(__dirname, this.id)
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
            fs.writeFileSync(path.join(directory, "metadata.txt"), JSON.stringify(this, null, '\t'), {
                encoding: "utf8",
            });
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
                    fs.writeFileSync(path.join(directory_tests, metadata_tests.input.pathname), this.tests_contents_in[metadata_tests.id], {
                        encoding: "utf8",
                    });
                    fs.writeFileSync(path.join(directory_tests, metadata_tests.output.pathname), this.tests_contents_out[metadata_tests.id], {
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

            let file_zip_name = path.join(p, this.id)
            await zip_a_folder.zip(directory, `${file_zip_name}.zip`)

            rimraf.sync(directory);
        }
    }
    static async deserialize(p = serialized_path()) {
        var exercise_list = []
        let files = fs.readdirSync(p)
        for (let exercise_zip_name of files) {
            var file_path = path.join(p, exercise_zip_name)

            exercise_zip_name = exercise_zip_name.replace(/\.[^/.]+$/, "")

            exercise_list[exercise_zip_name] = new ProgrammingExercise();

            const buffer = readChunk.sync(file_path, 0, 4100);

            let type = await fileType.fromBuffer(buffer)
            if (type.ext = 'zip') {
                try {
                    let unzip_path = path.join(temp_path(), exercise_zip_name)
                    await extract(file_path, { dir: unzip_path })

                    let metadata = fs.readFileSync(path.join(unzip_path, 'metadata.txt'), { encoding: 'utf8', flag: 'r' });
                    exercise_list[exercise_zip_name] = Object.assign(this, JSON.parse(metadata))
                    let solutions_path = path.join(unzip_path, 'solutions')

                    if (fs.existsSync(solutions_path)) {
                        for (let metadata_solutions of exercise_list[exercise_zip_name]['solutions']) {
                            let solution = fs.readFileSync(path.join(solutions_path, metadata_solutions.pathname), { encoding: 'utf8', flag: 'r' });
                            exercise_list[exercise_zip_name]['solutions_contents'][metadata_solutions.id] = solution


                        }
                    }

                    let tests_path = path.join(unzip_path, 'tests')
                    if (fs.existsSync(tests_path)) {

                        for (let metadata_tests of exercise_list[exercise_zip_name]['tests']) {
                            let test_in = fs.readFileSync(path.join(tests_path, metadata_tests.input.pathname), { encoding: 'utf8', flag: 'r' });
                            exercise_list[exercise_zip_name]['tests_contents_in'][metadata_tests.id] = test_in
                        }

                        for (let metadata_tests of exercise_list[exercise_zip_name]['tests']) {
                            let test_out = fs.readFileSync(path.join(tests_path, metadata_tests.output.pathname), { encoding: 'utf8', flag: 'r' });
                            exercise_list[exercise_zip_name]['tests_contents_out'][metadata_tests.id] = test_out
                        }

                    }


                    let statement_path = path.join(unzip_path, 'statements')
                    if (fs.existsSync(statement_path)) {
                        for (let metadata_statement of exercise_list[exercise_zip_name]['statements']) {
                            if (metadata_statement.format != 'pdf') {
                                let statement = fs.readFileSync(path.join(statement_path, metadata_statement.pathname), { encoding: 'utf8', flag: 'r' });
                                exercise_list[exercise_zip_name]['statements_contents'][metadata_statement.id] = statement
                            } else {
                                let statement = fs.readFileSync(path.join(statement_path, metadata_statement.pathname), { encoding: 'base64', flag: 'r' });
                                exercise_list[exercise_zip_name]['statements_contents'][metadata_statement.id] = statement

                            }
                        }
                    }

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
        this.is_deleted = false
        this.updated_at = '0000-00-00T00:00:00.000Z'
        this.created_at = '0000-00-00T00:00:00.000Z'
        this.id = '00000000-0000-0000-0000-000000000000'
        this.title = 'Draft exercise'
        this.module = ''
        this.project_id = '00000000-0000-0000-0000-000000000000'
        this.owner_id = '00000000-0000-0000-0000-000000000000'
        this.keywords = []
        this.type = ''
        this.event = ''
        this.platform = ''
        this.difficulty = ''
        this.status = ''
        this.timeout = 0
        this.programmingLanguages = []
        this.statements = []
        this.solutions = []
        this.tests = []
        this.instructions = []
    }
}

function serialized_path() {
    return path.join(__dirname, 'serialized')

}

function temp_path() {
    return path.join(__dirname, 'temp')

}