const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');
const { newError, getUTCDateTime } = require('../utls');
const Ajv = require('ajv');
const ajv = new Ajv();


module.exports.createNewHealthMeasurement = asyncHandler(async (req, _res, next) => {
	var query = sql`INSERT INTO HealthMeasurements(graph_id, measurement, date) 
    VALUES(${req.params.graphId}, ${req.body.measurement}, ${req.body.date});`;
	await db.query(query);
	next();
});

module.exports.getMeasurementsByGraphId = asyncHandler(async(req, _res, next) => {
	const query = sql`SELECT M.date, M.measurement FROM HealthMeasurements M
						WHERE M.graph_id = ${req.params.graphId};`;

	const results = await db.query(query);
	const measurements = {};

	for (const row of results) {
		measurements[row.date] = row.measurement;
	}
	req.result = measurements;
	next();
});

module.exports.deleteMeasurement = asyncHandler(async(req, _res, next) => {
	const query = sql`DELETE FROM HealthMeasurements WHERE date = ${req.params.timestamp} AND graph_id = ${req.params.graphId};`;
	await db.query(query);
	next();
});