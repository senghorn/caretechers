const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');
const { newError, getUTCDateTime } = require('../utls');
const Ajv = require('ajv');
const ajv = new Ajv();


module.exports.createNewHealthMeasurement = asyncHandler(async (req, _res, next) => {
	var query = sql`INSERT INTO HealthMeasurements(graph_id, measurement, date) 
    VALUES(${req.params.graphId}, ${req.body.measurement}, ${getUTCDateTime()});`;
	await db.query(query);
	next();
});