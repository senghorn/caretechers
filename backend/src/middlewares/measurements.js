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

module.exports.updateMeasurement = asyncHandler(async (req, _res, next) => {
	let query = sql`UPDATE HealthMeasurements SET `;
	if (!req.body.measurement) {
		return next(newError('Measurement must be provided!', 400));
	}

	query.append(sql`measurement = ${req.body.measurement}`);
	query.append(sql` WHERE graph_id = ${req.params.graphId}, and date = ${req.params.timestamp};`);
	await db.query(query);
	next();
});

module.exports.getMeasurementByDateAndGraphId = asyncHandler(async (req, _res, next) => {
	const query = sql`SELECT * FROM HealthMeasurements WHERE graph_id = ${req.params.graphId} and date = ${req.params.timestamp}`;
	const [result] = await db.query(query);

	if (!result) {
		return next(newError(`Measurement (${req.params.noteId}, ${req.params.timestamp}) does not exist!`, 404));
	}

	req.result = result;
	next();
});