const Ajv = require('ajv');
const ajv = new Ajv();
const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');
const {newError} = require('../utls');

module.exports.checkIfGroupExists = asyncHandler(async (req, res, next) => {
	const query = sql`SELECT * FROM \`Groups\` G
						WHERE id = ${req.params.groupId}`;
	const [result] = await db.query(query);

	if (!result) {
		return next(newError('This group does not exist!', 404));
	}

	next();
});

module.exports.verifyGroupBody = asyncHandler(async(req, _res, next) => {
	const schema = {
		type: 'object',
		properties: {
		name: { type: 'string' },
		visitFrequency: { type: 'number' },
		timeZone: { type: 'string' }
		},
		required: ['name', 'visitFrequency'],
	};
	const validate = ajv.compile(schema);
	if (!validate(req.body)) {
		return next(newError(JSON.stringify(validate.errors), 400));
	}
	next();
});

module.exports.createNewGroup = asyncHandler(async(req, _res, next) => {
	let query;
	if (req.body.timeZone) {
		query = sql`INSERT INTO \`Groups\`(name, visit_frequency, timezone) VALUES (${req.body.name}, ${req.body.visitFrequency}, ${req.body.timeZone});`;
	} else {
		query = sql`INSERT INTO \`Groups\`(name, visit_frequency) VALUES (${req.body.name}, ${req.body.visitFrequency});`;
	}

	const result = await db.query(query);
	req.result = {groupId: result.insertId}
	next();
});
