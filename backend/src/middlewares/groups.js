const Ajv = require('ajv');
const ajv = new Ajv();
const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');
const { newError } = require('../utls');

module.exports.checkIfGroupExists = asyncHandler(async (req, res, next) => {
  const query = sql`SELECT * FROM \`Groups\` G
						WHERE id = ${req.params.groupId}`;
  const [result] = await db.query(query);
  if (!result) {
    return next(newError('This group does not exist!', 404));
  }

  next();
});

module.exports.verifyGroupBody = asyncHandler(async (req, _res, next) => {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      visitFrequency: { type: 'number' },
      timeZone: { type: 'string' },
    },
    required: ['name', 'visitFrequency'],
  };
  const validate = ajv.compile(schema);
  if (!validate(req.body)) {
    return next(newError(JSON.stringify(validate.errors), 400));
  }
  next();
});

module.exports.createNewGroup = asyncHandler(async (req, _res, next) => {
  let query;
  if (req.body.timeZone) {
    query = sql`INSERT INTO \`Groups\`(name, visit_frequency, timezone, password) VALUES (${req.body.name}, 
			${req.body.visitFrequency}, ${req.body.timeZone}, SUBSTR(MD5(RAND()), 1, 15));`;
  } else {
    query = sql`INSERT INTO \`Groups\`(name, visit_frequency, password) VALUES (${req.body.name}, 
			${req.body.visitFrequency}, SUBSTR(MD5(RAND()), 1, 15));`;
  }

  let result = await db.query(query);
  query = sql`SELECT * FROM \`Groups\` WHERE id = ${result.insertId}`
  result = await db.query(query);
  req.result = {
    groupName: result[0].name,
    groupPassword: result[0].password
  }
  next();
});

module.exports.getGroupsDeprecated = asyncHandler(async (req, res, next) => {
  const query = sql`SELECT * FROM \`Groups\` G LIMIT ${req.params.limit}`;
  req.result = await db.query(query);
  next();
});

module.exports.getGroupPassword = asyncHandler(async (req, res, next) => {
  const query = sql`SELECT password FROM \`Groups\` G
	WHERE id = ${req.params.groupId}`;
  req.result = await db.query(query);
  next();
});

module.exports.resetPassword = asyncHandler(async (req, _res, next) => {
  let query = sql`UPDATE \`Groups\` G SET G.password = SUBSTR(MD5(RAND()), 1, 15)
	WHERE G.id = ${req.params.groupId}`;

  await db.query(query);
  next();
});

module.exports.getGroupInfo = asyncHandler(async (req, _res, next) => {
  let query = sql`SELECT name, first_name, last_name, profile_pic, password from \`Groups\` g join Users u where u.group_id = g.id and g.id = ${req.params.groupId}; `;
  req.result = await db.query(query);
  next();
});
