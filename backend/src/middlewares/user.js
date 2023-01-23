const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');
const { newError} = require('../utls');
const Ajv = require('ajv');
const ajv = new Ajv();

module.exports.verifyCreateUserBody = asyncHandler(async (req, _res, next) => {
	const schema = {
		type: 'object',
		properties: {
			email: {type: 'string'},
			firstName: {type: 'string'},
			lastName: {type: 'string'},
			phoneNum: {type: 'string'},
			groupId: {type: 'number'}
		},
		required: ['email', 'firstName', 'lastName', 'phoneNum']
	};
	const validate = ajv.compile(schema);
	if (!validate(req.body)) {
		return next(newError(JSON.stringify(validate.errors), 400));
	}
	next();
});

module.exports.createNewUser = asyncHandler(async(req, _res, next) => {
	const query = sql`INSERT INTO Users VALUES(${req.body.email}, ${req.body.firstName}, ${req.body.lastName}, ${req.body.phoneNum}, ${req.body.groupId});`;
	await db.query(query);
	next();
});

module.exports.getUserByID = asyncHandler(async (req, _res, next) => {
	const query = sql`SELECT * FROM Users
					WHERE Users.email = ${req.params.userId};`;
	req.result = await db.query(query);
	next();
});
