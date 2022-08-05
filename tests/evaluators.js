var assert = require('assert');
var xpath = require('../server/dist-server/evaluators/xpath');
var dtd = require('../server/dist-server/evaluators/dtd');
var xsd = require('../server/dist-server/evaluators/xsd');
const { loadSchemaYAPEXIL, ProgrammingExercise } = require("programming-exercise-juezlti");
const { loadSchemaPEARL, EvaluationReport } = require("evaluation-report-juezlti");

const config = {
    'BASE_URL': "http://fgpe.dcc.fc.up.pt/api",
    'EMAIL': "info@juezlti.eu",
    'PASSWORD': "Ju3zLT1.",
}

describe('xpath', function() {
    this.timeout(10000);
    it('c9d68b4f-e306-41f5-bba3-cafdcd024bfb  VALID', async function() {
        await loadSchemaPEARL();
        await loadSchemaYAPEXIL();
        let programmingExercise = await ProgrammingExercise.loadRemoteExercise("c9d68b4f-e306-41f5-bba3-cafdcd024bfb", config)
        const evalReq = new EvaluationReport();
        evalReq.setRequest({
            "date": (new Date()).toISOString(),
            "program": "concat(person/lastName, \" \" ,person/firstName)",
            "learningObject": "c9d68b4f-e306-41f5-bba3-cafdcd024bfb",

        })
        let assesment = await xpath.perform(programmingExercise, evalReq, "201800388")
        assert.equal(assesment.summary.classify, "Accepted");
    });


    it('c9d68b4f-e306-41f5-bba3-cafdcd024bfb  INVALID', async function() {
        await loadSchemaPEARL();
        await loadSchemaYAPEXIL();
        let programmingExercise = await ProgrammingExercise.loadRemoteExercise("c9d68b4f-e306-41f5-bba3-cafdcd024bfb", config)
        const evalReq = new EvaluationReport();
        evalReq.setRequest({
            "date": (new Date()).toISOString(),
            "program": "concat(pson/lastName, \"\" ,peron/firstName)",
            "learningObject": "c9d68b4f-e306-41f5-bba3-cafdcd024bfb",

        })
        let assesment = await xpath.perform(programmingExercise, evalReq, "201800388")
        assert.equal(assesment.summary.classify, "Wrong Answer");
    });
});




describe('DTD', function() {
    this.timeout(10000);
    it('3d7c802a-27fe-4437-8a48-8e379583a570  VALID', async function() {
        await loadSchemaPEARL();
        await loadSchemaYAPEXIL();
        let programmingExercise = await ProgrammingExercise.loadRemoteExercise("3d7c802a-27fe-4437-8a48-8e379583a570", config)
        const evalReq = new EvaluationReport();
        evalReq.setRequest({
            "date": (new Date()).toISOString(),
            "program": "\"<!ELEMENT STORY (title, context, problem, goal, THREADS, moral, INFOS)>\\n<!ATTLIST STORY xmlns:xlink CDATA #FIXED \\\"http://www.w3.org/1999/xlink\\\">\\n<!ELEMENT THREADS (EPISODE+)>\\n<!ELEMENT EPISODE (subgoal, ATTEMPT+, result) >\\n<!ELEMENT ATTEMPT (action | EPISODE) >\\n<!ELEMENT INFOS ( ( date | author | a )* ) >\\n<!ELEMENT title (#PCDATA) >\\n<!ELEMENT context (#PCDATA) >\\n<!ELEMENT problem (#PCDATA) >\\n<!ELEMENT goal (#PCDATA) >\\n<!ELEMENT subgoal (#PCDATA) >\\n<!ELEMENT result (#PCDATA) >\\n<!ELEMENT moral (#PCDATA) >\\n<!ELEMENT action (#PCDATA) >\\n<!ELEMENT date (#PCDATA) >\\n<!ELEMENT author (#PCDATA) >\\n<!ELEMENT a (#PCDATA)>\\n<!ATTLIST a\\n      xlink:href CDATA #REQUIRED\\n      xlink:type CDATA #FIXED \\\"simple\\\">\"",
            "learningObject": "3d7c802a-27fe-4437-8a48-8e379583a570",

        })
        let assesment = await dtd.perform(programmingExercise, evalReq, "201800388")
        assert.equal(assesment.summary.classify, "Accepted");
    });


    it('3d7c802a-27fe-4437-8a48-8e379583a570  INVALID', async function() {
        await loadSchemaPEARL();
        await loadSchemaYAPEXIL();
        let programmingExercise = await ProgrammingExercise.loadRemoteExercise("3d7c802a-27fe-4437-8a48-8e379583a570", config)
        const evalReq = new EvaluationReport();
        evalReq.setRequest({
            "date": (new Date()).toISOString(),
            "program": "\"<!ELEMENT STORY ( context, problem, goal, THREADS, moral, INFOS)>\\n<!ATTLIST STORY xmlns:xlink CDATA #FIXED \\\"http://www.w3.org/1999/xlink\\\">\\n<!ELEMENT THREADS (EPISODE+)>\\n<!ELEMENT EPISODE (subgoal, ATTEMPT+, result) >\\n<!ELEMENT ATTEMPT (action | EPISODE) >\\n<!ELEMENT INFOS ( ( date | author | a )* ) >\\n<!ELEMENT title (#PCDATA) >\\n<!ELEMENT context (#PCDATA) >\\n<!ELEMENT problem (#PCDATA) >\\n<!ELEMENT goal (#PCDATA) >\\n<!ELEMENT subgoal (#PCDATA) >\\n<!ELEMENT result (#PCDATA) >\\n<!ELEMENT moral (#PCDATA) >\\n<!ELEMENT action (#PCDATA) >\\n<!ELEMENT date (#PCDATA) >\\n<!ELEMENT author (#PCDATA) >\\n<!ELEMENT a (#PCDATA)>\\n<!ATTLIST a\\n      xlink:href CDATA #REQUIRED\\n      xlink:type CDATA #FIXED \\\"simple\\\">\"",
            "learningObject": "3d7c802a-27fe-4437-8a48-8e379583a570",

        })
        let assesment = await dtd.perform(programmingExercise, evalReq, "201800388")
        assert.equal(assesment.summary.classify, "Wrong Answer");
    });
});


describe('XSD', function() {
    this.timeout(10000);
    it('18177460-840a-4c57-8c24-d671ad9f5f95  VALID', async function() {
        await loadSchemaPEARL();
        await loadSchemaYAPEXIL();
        let programmingExercise = await ProgrammingExercise.loadRemoteExercise("18177460-840a-4c57-8c24-d671ad9f5f95", config)
        const evalReq = new EvaluationReport();
        evalReq.setRequest({
            "date": (new Date()).toISOString(),
            "program": "\"<?xml version=\\\"1.0\\\" encoding=\\\"ISO-8859-1\\\" ?>\\n<xs:schema xmlns:xs=\\\"http://www.w3.org/2001/XMLSchema\\\">\\n\\n<xs:element name=\\\"shiporder\\\">\\n <xs:complexType>\\n  <xs:sequence>\\n   <xs:element name=\\\"orderperson\\\" type=\\\"xs:string\\\"/>\\n   <xs:element name=\\\"shipto\\\">\\n    <xs:complexType>\\n     <xs:sequence>\\n      <xs:element name=\\\"name\\\" type=\\\"xs:string\\\"/>\\n      <xs:element name=\\\"address\\\" type=\\\"xs:string\\\"/>\\n      <xs:element name=\\\"city\\\" type=\\\"xs:string\\\"/>\\n      <xs:element name=\\\"country\\\" type=\\\"xs:string\\\"/>\\n     </xs:sequence>\\n    </xs:complexType>\\n   </xs:element>\\n   <xs:element name=\\\"item\\\" maxOccurs=\\\"unbounded\\\">\\n    <xs:complexType>\\n     <xs:sequence>\\n      <xs:element name=\\\"title\\\" type=\\\"xs:string\\\"/>\\n      <xs:element name=\\\"note\\\" type=\\\"xs:string\\\" minOccurs=\\\"0\\\"/>\\n      <xs:element name=\\\"quantity\\\" type=\\\"xs:positiveInteger\\\"/>\\n      <xs:element name=\\\"price\\\" type=\\\"xs:decimal\\\"/>\\n     </xs:sequence>\\n    </xs:complexType>\\n   </xs:element>\\n  </xs:sequence>\\n  <xs:attribute name=\\\"orderid\\\" type=\\\"xs:string\\\" use=\\\"required\\\"/>\\n </xs:complexType>\\n</xs:element>\\n\\n</xs:schema>\"",
            "learningObject": "18177460-840a-4c57-8c24-d671ad9f5f95",

        })
        let assesment = await xsd.perform(programmingExercise, evalReq, "201800388")
        assert.equal(assesment.summary.classify, "Accepted");
    });


    it('18177460-840a-4c57-8c24-d671ad9f5f95  INVALID', async function() {
        await loadSchemaPEARL();
        await loadSchemaYAPEXIL();
        let programmingExercise = await ProgrammingExercise.loadRemoteExercise("18177460-840a-4c57-8c24-d671ad9f5f95", config)
        const evalReq = new EvaluationReport();
        evalReq.setRequest({
            "date": (new Date()).toISOString(),
            "program": "\"<?xml version=\\\"1.0\\\" encoding=\\\"ISO-8859-1\\\" ?>\\n<xs:schema xmlns:xs=\\\"http://www.w3.org/2001/XMLSchema\\\">\\n\\n<xs:element name=\\\"shiporder\\\">\\n <xs:complexType>\\n  <xs:sequence>\\n   <xs:element name=\\\"orderperson\\\" type=\\\"xs:string\\\"/>\\n   <xs:element name=\\\"shipto\\\">\\n    <xs:complexType>\\n     <xs:sequence>\\n      <xs:element name=\\\"name\\\" type=\\\"xs:string\\\"/>\\n      <xs:element name=\\\"address\\\" type=\\\"xs:string\\\"/>\\n      <xs:element name=\\\"city\\\" type=\\\"xs:string\\\"/>\\n      <xs:element name=\\\"country\\\" type=\\\"xs:string\\\"/>\\n     </xs:sequence>\\n    </xs:complexType>\\n   </xs:element>\\n   <xs:element name=\\\"item\\\" maxOccurs=\\\"unbounded\\\">\\n    <xs:complexType>\\n     <xs:sequence>\\n      <xs:element name=\\\"title\\\" type=\\\"xs:string\\\"/>\\n      <xs:element name=\\\"note\\\" type=\\\"xs:string\\\" minOccurs=\\\"0\\\"/>\\n      <xs:element name=\\\"quantity\\\" type=\\\"xs:positiveInteger\\\"/>\\n      <xs:element name=\\\"prie\\\" type=\\\"xs:decimal\\\"/>\\n     </xs:sequence>\\n    </xs:complexType>\\n   </xs:element>\\n  </xs:sequence>\\n  <xs:attribute name=\\\"orderid\\\" type=\\\"xs:string\\\" use=\\\"required\\\"/>\\n </xs:complexType>\\n</xs:element>\\n\\n</xs:schema>\"",
            "learningObject": "18177460-840a-4c57-8c24-d671ad9f5f95",

        })
        let assesment = await xsd.perform(programmingExercise, evalReq, "201800388")
        assert.equal(true, assesment.summary.classify == "Compile Time Error" || assesment.summary.classify == "Wrong Answer");
    });
});