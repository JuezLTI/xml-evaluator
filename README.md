
<div markdown=1 style="text-size: small; text-align:right;"> 
  <a href="README_en.md">[EN]</a>
  <a href="README_es.md">[ES]</a> 
  <a href="README_pt.md">[PT]</a> 
  <a href="README_tr.md">[TR]</a>
  <a href="README_sv.md">[SV]</a> 
</div>

# xml-evaluator

## XML Evaluation service
This repository is one among others two, that represents components that will be part of JuezLTI's developed by INESC-TEC
![Alt text](./docs/JuezLTIs.png/ 'JuezLTIs format')


## Description
Here is defined two classes util now, these classes are EvaluationReport and ProgrammingExercise, both classes are used two represent data that come in and out of the XML-evaluator
![Alt text](./docs/xml-evaluation-service.png/ 'xml-evaluation-service format')


## Installation

To run the unit tests that will cover programming-exercise.js and evaluation-report.js do.
```sh
cd tests
npm install
npm run setup
node run nyan
```
The unit tests are performed  using Mocha and Chai


