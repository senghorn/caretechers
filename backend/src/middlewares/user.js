const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');
const { newError } = require('../utls');
const Ajv = require('ajv');
const ajv = new Ajv();

module.exports.verifyCreateUserBody = asyncHandler(async (req, _res, next) => {
  const schema = {
    type: 'object',
    properties: {
      email: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      phoneNum: { type: 'string' },
      groupId: { type: 'number' },
      profilePic: { type: 'string' },
    },
    required: ['email', 'firstName', 'lastName', 'phoneNum', 'profilePic'],
  };
  const validate = ajv.compile(schema);
  if (!validate(req.body)) {
    return next(newError(JSON.stringify(validate.errors), 400));
  }
  next();
});

module.exports.createNewUser = asyncHandler(async (req, _res, next) => {
  var query = sql`INSERT INTO Users(email, first_name, last_name, phone_num, profile_pic) VALUES(${req.body.email}, ${req.body.firstName}, ${req.body.lastName}, ${req.body.phoneNum}, ${req.body.profilePic});`;
  if (req.body.groupId != null) {
    query = sql`INSERT INTO Users(email, first_name, last_name, phone_num, group_id, profile_pic) VALUES(${req.body.email}, ${req.body.firstName}, ${req.body.lastName}, ${req.body.phoneNum},${req.body.groupId}, ${req.body.profilePic});`;
  }
  await db.query(query);
  next();
});

module.exports.editUser = asyncHandler(async (req, _res, next) => {
  const query = sql`UPDATE Users SET Users.email = ${req.body.email}, Users.first_name = ${req.body.firstName}, 
	Users.last_name = ${req.body.lastName}, Users.phone_num = ${req.body.phoneNum}, Users.curr_group = ${req.body.groupId}, Users.profile_pic = ${req.body.profilePic}
	WHERE Users.email = ${req.params.userId};`;
  await db.query(query);
  next();
});

module.exports.getUserByID = asyncHandler(async (req, _res, next) => {
  const query = sql`SELECT * FROM Users
					WHERE Users.email = ${req.params.userId};`;

  const [result] = await db.query(query);
  if (!result) {
    return next(newError('This user does not exist', 404));
  }
  req.result = result;
  next();
});

module.exports.verifyUserExists = asyncHandler(async (req, _res, next) => {
  const query = sql`SELECT * FROM Users WHERE email = ${req.params.userId};`;
  const [result] = await db.query(query);
  if (!result) {
    return next(newError('This user does not exist', 404));
  }
  next();
});

module.exports.addUserToGroupWithNameAndPassword = asyncHandler(async (req, _res, next) => {
  if (!req.body.groupName || !req.body.groupPassword) {
    return next(newError('Join Group request body is incorrect!', 400));
  }

  let query = sql`UPDATE Users SET group_id = (
    SELECT id 
    FROM \`Groups\` 
    WHERE name = ${req.body.groupName} AND password = ${req.body.groupPassword}
  ) 
  WHERE email = ${req.params.userId} AND EXISTS(SELECT * FROM \`Groups\` 
  WHERE name = ${req.body.groupName} AND password = ${req.body.groupPassword});
  `
  const result = await db.query(query);
  if (result.affectedRows == 0) {
    return next(newError('Cannot join the group!', 400));
  }
  next();
});

module.exports.addUserToGroup = asyncHandler(async (req, _res, next) => {
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

module.exports.setUserNotificationIdentifier = asyncHandler(async (req, _res, next) => {
  const { userId } = req.params;
  const query = sql`UPDATE Users SET notification_identifier = ${req.body.identifier} WHERE email = ${userId};`;
  await db.query(query);
  next();
});

module.exports.getUserGroupByID = asyncHandler(async (req, _res, next) => {
  const query = sql`SELECT * FROM Users WHERE email = ${req.params.userId};`;
  const [result] = await db.query(query);
  if (!result) {
    return next(newError('This user does not have a group', 404));
  }
  req.result = result;
  next();
});

module.exports.getUserByToken = asyncHandler(async (req, _res, next) => {

  query = sql`SELECT * FROM Users WHERE email = ${req.user.id}`;
  const [result] = await db.query(query);
  if (!result) {
    return next(newError('This user does not have a group', 404));
  }
  req.result = {
    curr_group: result.curr_group, id: result.email, first_name: result.first_name,
    last_name: result.last_name, profile_pic: result.profile_pic, phone_num: result.phone_num,
    notification_identifier: result.notification_identifier
  }
  next();
});

// Will have to update when we allow multiple groups
module.exports.removeUserFromGroup = asyncHandler(async (req, _res, next) => {
  query = sql`UPDATE Users SET group_id = NULL WHERE email = ${req.params.userId};`;
  await db.query(query);
  next();
});
