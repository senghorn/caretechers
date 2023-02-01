const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');
const { newError } = require('../utls');
const Ajv = require('ajv');
const ajv = new Ajv();

module.exports.verifyCreateHealthGraph = asyncHandler(async (req, _res, next) => {
	const schema = {
		type: 'object',
		properties: {
            groupId: { type: 'number' },
			title: { type: 'string' },
			units: { type: 'string' }			
		},
		required: ['groupId','title', 'units']
	};
	const validate = ajv.compile(schema);
	if (!validate(req.body)) {
		return next(newError(JSON.stringify(validate.errors), 400));
	}
	next();
});

module.exports.createNewHealthGraph = asyncHandler(async (req, _res, next) => {
	var query = sql`INSERT INTO HealthGraphs(group_id, title, units) VALUES(${req.body.groupId}, ${req.body.title}, ${req.body.units});`;
	await db.query(query);
	next();
});