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

module.exports.getGraphsByGroupId = asyncHandler(async(req, _res, next) => {
	const query = sql`SELECT * FROM HealthGraphs WHERE HealthGraphs.group_id = ${req.params.groupId}`;

	req.result = await db.query(query);
	next();
});

module.exports.checkIfGraphExists = asyncHandler(async (req, res, next) => {
	const query = sql`SELECT * FROM HealthGraphs
						WHERE HealthGraphs.id = ${req.params.graphId}`;
	const [result] = await db.query(query);

	if (!result) {
		return next(newError("This graph does not exist!", 404));
	}

	next();
});