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
	const query = sql`INSERT INTO Users(email, first_name, last_name, phone_num) VALUES(${req.body.email}, ${req.body.firstName}, ${req.body.lastName}, ${req.body.phoneNum});`;
	await db.query(query);
	next();
});

module.exports.getUserByID = asyncHandler(async (req, _res, next) => {
	const query = sql`SELECT * FROM Users
					WHERE Users.email = ${req.params.userId};`;
	req.result = await db.query(query);
	next();
});

module.exports.verifyUserExists = asyncHandler(async(req, _res, next) => {
	const query = sql`SELECT * FROM Users WHERE email = ${req.params.userId};`;
	const [result] = await db.query(query);
	if(!result) {
		return next(newError('This user does not exist', 404));
	}
	next();
});

module.exports.addUserToGroup = asyncHandler(async(req, _res, next) => {
	if (!req.body.groupId || typeof req.body.groupId !== 'number') {
		return next(newError('This groupId is invalid!', 400));
	}

	let query = sql`SELECT * FROM \`Groups\` G
						WHERE id = ${req.body.groupId}`;
	const [result] = await db.query(query);

	if (!result) {
		return next(newError('This group does not exist!', 404));
	}

	query = sql`UPDATE Users SET group_id = ${req.body.groupId} WHERE email = ${req.params.userId};`;
	await db.query(query);
	next();
});