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
      currGroup: { type: 'number' },
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
  if (req.body.currGroup != null) {
    query = sql`INSERT INTO Users(email, first_name, last_name, phone_num, curr_group, profile_pic) VALUES(${req.body.email}, ${req.body.firstName}, ${req.body.lastName}, ${req.body.phoneNum},${req.body.currGroup}, ${req.body.profilePic});`;
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

  let query = sql`SELECT id FROM \`Groups\` G
						WHERE name = ${req.body.groupName} AND password = ${req.body.groupPassword}`;
  let [group] = await db.query(query);

  if (!group) {
    return next(newError('Group does not exist or password is wrong!', 404));
  }

  if(req.body.adminStatus) {
    if(req.body.adminStatus == 2){
      query = sql`SELECT * FROM GroupMembers WHERE admin_status = 2 AND group_id=${group.id} AND active = TRUE;`;

      let [rootAdmin] = await db.query(query);
      if (rootAdmin) {
        return next(newError('Only one root administrator allowed.', 400));
      }
    } else if(!(req.body.adminStatus == 0 || req.body.adminStatus == 1 || req.body.adminStatus == 2)) {
      return next(newError('Value of adminStatus must be 0, 1, or 2.', 400));
    }

    query = sql`DELETE FROM GroupMembers WHERE member_id=${req.params.userId} AND group_id=${group.id};
    INSERT INTO GroupMembers(group_id, member_id, active, admin_status)
    VALUES (${group.id}, ${req.params.userId}, TRUE, ${req.body.adminStatus});UPDATE Users SET curr_group=${group.id}
    WHERE email=${req.params.userId};
  `;
  } else {
    query = sql`DELETE FROM GroupMembers WHERE member_id=${req.params.userId} AND group_id=${group.id};
    INSERT INTO GroupMembers(group_id, member_id, active)
    VALUES (${group.id}, ${req.params.userId}, TRUE);UPDATE Users SET curr_group=${group.id}
    WHERE email=${req.params.userId};
  `;
  }
  
  result = await db.query(query);
  if (result.affectedRows == 0) {
    return next(newError('Cannot join the group!', 400));
  }
  next();
});

module.exports.changeUserAdminStatus = asyncHandler(async (req, _res, next) => {
  if (!req.body.groupId || !req.body.adminStatus) {
    return next(newError('Request body is incorrect.', 400));
  }

  let query;

  if(req.body.adminStatus == 2){ 
    query = sql`SELECT * FROM GroupMembers WHERE admin_status = 2 AND group_id=${group.id} AND active = TRUE;`;

    let [rootAdmin] = await db.query(query);
    if (rootAdmin) {
      return next(newError('Only one root administrator allowed.', 400));
    }
  } else if(!(req.body.adminStatus == 0 || req.body.adminStatus == 1 || req.body.adminStatus == 2)) {
    return next(newError('Value of adminStatus must be 0, 1, or 2.', 400));
  }

  query = sql`UPDATE GroupMembers SET GroupMembers.admin_status = ${req.body.adminStatus} WHERE member_id=${req.params.userId} AND group_id=${!req.body.groupId};
  `;

  await db.query(query);
  next();
});

module.exports.getUserAdminStatus = asyncHandler(async (req, _res, next) => {
  if (!req.body.groupId) {
    return next(newError('Request body is incorrect.', 400));
  }

  let query = sql`SELECT admin_status FROM GroupMembers WHERE member_id = ${req.params.userId} AND group_id=${group.id} AND active = TRUE;`;

  const [result] = await db.query(query);
  req.result = result;
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

  query = sql`INSERT INTO GroupMembers(member_id, group_id, active) VALUES(${req.params.userId}, ${req.body.groupId}, TRUE);`;
  await db.query(query);
  next();
});

module.exports.setUserNotificationIdentifier = asyncHandler(async (req, _res, next) => {
  const { userId } = req.params;
  const query = sql`UPDATE Users SET notification_identifier = ${req.body.identifier} WHERE email = ${userId};`;
  await db.query(query);
  next();
});

module.exports.getUserCurrGroupByID = asyncHandler(async (req, _res, next) => {
  const query = sql`SELECT curr_group FROM Users WHERE email = ${req.params.userId};`;
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
    return next(newError('This user does not exist', 404));
  }

  const activeGroupQuery = sql`SELECT * FROM GroupMembers gm
  JOIN \`Groups\` g ON g.id = gm.group_id
  WHERE gm.member_id = ${req.user.id} AND gm.active = 1;`;
  const groups = await db.query(activeGroupQuery);
  let allGroups = [];
  groups.forEach(g => {
    allGroups.push({
      group_id: g.group_id,
      name: g.name,
      password: g.password,
      timezone: g.timezone
    })
  })
  req.result = {
    curr_group: result.curr_group,
    id: result.email,
    first_name: result.first_name,
    last_name: result.last_name,
    profile_pic: result.profile_pic,
    phone_num: result.phone_num,
    notification_identifier: result.notification_identifier,
    groups: allGroups
  };
  next();
});

module.exports.getUserCurrGroupByID = asyncHandler(async (req, _res, next) => {
  const query = sql`SELECT curr_group FROM Users WHERE email = ${req.params.userId};`;
  const [result] = await db.query(query);
  if (!result) {
    return next(newError('This user does not have a group', 404));
  }
  req.result = result;
  next();
});

module.exports.getAllUserGroups = asyncHandler(async (req, _res, next) => {
  const query = sql`SELECT group_id FROM GroupMembers WHERE member_id = ${req.params.userId} and active = TRUE;`;
  const [result] = await db.query(query);
  if (!result) {
    return next(newError('This user does not have any groups', 404));
  }
  req.result = result;
  next();
});

module.exports.setUserCurrGroup = asyncHandler(async (req, _res, next) => {
  if (!req.body.currGroup) {
    return next(newError('The currGroup is invalid!', 400));
  }
  const query = sql`UPDATE Users SET curr_group = ${req.body.currGroup} WHERE email = ${req.params.userId};`;
  await db.query(query);
  next();
});

module.exports.removeUserFromGroup = asyncHandler(async (req, _res, next) => {
  query = sql`UPDATE GroupMembers SET active = FALSE WHERE member_id = ${req.params.userId} and group_id = ${req.params.groupId};UPDATE Users SET curr_group = NULL WHERE email = ${req.params.userId};`;
  await db.query(query);
  next();
});
