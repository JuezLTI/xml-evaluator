const request = require('request');
const { v4: uuidv4 } = require('uuid');
const ProgrammingExercise = require('../programming-exercise/programming-exercise')

let obj = {
    "targetText": "https://www.w3schools.com/xml/books.xml",
    "exercises": [{
            "xpath": "/bookstore/book/title",
            "test": "Everyday Italian,Harry Potter,XQuery Kick Start,Learning XML",
            "title": "1",
            "statement": " selects all the title nodes at https://www.w3schools.com/xml/books.xml"
        }, {
            "xpath": "/bookstore/book[1]/title",
            "test": "Everyday Italian",
            "title": "2",
            "statement": " Select the title of the first book at https://www.w3schools.com/xml/books.xml"

        },
        {
            "xpath": "/bookstore/book/price[text()]",
            "test": "30.00,29.99,49.99,39.95",
            "title": "3",
            "statement": " Select all the prices at https://www.w3schools.com/xml/books.xml"

        },
        {
            "xpath": "/bookstore/book[price>35]/price",
            "test": "49.99,39.95",
            "title": "4",
            "statement": " Select price nodes with price>35 at https://www.w3schools.com/xml/books.xml"

        },
        {
            "xpath": "/bookstore/book[price>35]/title",
            "test": "XQuery Kick Start,Learning XML",
            "title": "5",
            "statement": "Select title nodes with price>35 at https://www.w3schools.com/xml/books.xml"

        },
    ]
};
(async() => {
    for (let exercise of obj.exercises) {
        let solution_id = uuidv4();
        let test_id = uuidv4();
        let statement_id = uuidv4();


        let programmingExercise = new ProgrammingExercise();
        programmingExercise.setId(uuidv4())
        programmingExercise.setTitle(exercise.title)
        programmingExercise.setAuthor("me")
        programmingExercise.setSolutions([{
            id: solution_id,
            pathname: 'solution.xml',
            lang: 'xml'
        }])
        programmingExercise.solutions_contents = {}
        programmingExercise.solutions_contents[solution_id] = exercise.xpath

        programmingExercise.setTests([{
            id: test_id,
            arguments: [],
            weight: 5,
            visible: true,
            input: 'input1.txt',
            output: 'output1.txt'
        }])
        programmingExercise.tests_contents_in = {}
        programmingExercise.tests_contents_out = {}
        await request({
            'method': 'GET',
            'url': obj.targetText,
            'headers': {
                'Accept': 'text/xml',
            },
        }, function(error, response) {
            if (error) throw new Error(error);
            programmingExercise.tests_contents_in[test_id] = response.body
            programmingExercise.tests_contents_out[test_id] = exercise.xpath
            programmingExercise.setStatements([{
                id: statement_id,
                pathname: 'statements.txt',
                nat_lang: 'en',
                format: 'TXT'
            }])
            programmingExercise.statements_contents = {}
            programmingExercise.statements_contents[statement_id] = exercise.statement
            programmingExercise.serialize("./temp")
        })



    }


})();