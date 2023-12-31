const Ajv = require('ajv');
const ajv = new Ajv();
const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');
const jwt = require('jsonwebtoken');
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
      userId: { type: 'string' },
    },
    required: ['name', 'visitFrequency'],
  };
  const validate = ajv.compile(schema);
  if (!validate(req.body)) {
    return next(newError(JSON.stringify(validate.errors), 400));
  }
  next();
});

module.exports.compareMembers = asyncHandler(async (req, _res, next) => {
  let query = sql`SELECT m.member_id, m.active, u.first_name, u.last_name, COUNT(cv.id) as completed_visits, 
                (SELECT COUNT(*) FROM Visits v WHERE v.visitor = u.email AND v.group_id = m.group_id AND v.date <= CURRENT_DATE()) AS total_visits
                FROM GroupMembers m JOIN Users u ON u.email = m.member_id 
                LEFT JOIN Visits cv ON cv.visitor = u.email AND cv.group_id = m.group_id AND cv.completed = 1 AND cv.date <= CURRENT_DATE()
                WHERE m.group_id = ${req.params.groupId} GROUP BY u.email;`;

  if (req.query.after) {
    query = sql`SELECT m.member_id, m.active, u.first_name, u.last_name, COUNT(cv.id) as completed_visits, 
                (SELECT COUNT(*) FROM Visits v WHERE v.visitor = u.email AND v.group_id = m.group_id AND v.date <= CURRENT_DATE() AND v.date > ${req.query.after}) AS total_visits
                FROM GroupMembers m JOIN Users u ON u.email = m.member_id 
                LEFT JOIN Visits cv ON cv.visitor = u.email AND cv.group_id = m.group_id AND cv.completed = 1 AND cv.date <= CURRENT_DATE() AND cv.date > ${req.query.after}
                WHERE m.group_id = ${req.params.groupId} GROUP BY u.email;`;
  }

  const result = await db.query(query);

  req.result = result;

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

  let createGroupResult = await db.query(query);

  if (createGroupResult) {
    const group_id = createGroupResult.insertId;
    const email = req.body.userId;

    const insertUserToAsGroupAdmin = sql`INSERT INTO GroupMembers (member_id, group_id, active, admin_status) 
    VALUES (${email}, ${group_id}, 1, 2) 
    ON DUPLICATE KEY UPDATE group_id = ${group_id}, active = 1, admin_status = 2;
    UPDATE Users SET curr_group = ${group_id} WHERE email = ${email};
    `;
    const insertUserResult = await db.query(insertUserToAsGroupAdmin);
    if (insertUserResult[0].affectedRows && insertUserResult[1].affectedRows) {
      req.result = {
        status: 'succeed',
      };
      next();
    } else {
      console.log(insertUserResult);
      return next(new Error('Failed to join group.'));
    }
  } else {
    return next(new Error('Failed to create new group.'));
  }
});

module.exports.getGroupsDeprecated = asyncHandler(async (req, res, next) => {
  const query = sql`SELECT * FROM \`Groups\` G LIMIT ${req.params.limit}`;
  req.result = await db.query(query);
  next();
});

module.exports.getGroupNameAndPassword = asyncHandler(async (req, res, next) => {
  const query = sql`SELECT name, password FROM \`Groups\` G
	WHERE id = ${req.params.groupId}`;
  const [result] = await db.query(query);
  req.groupInfo = result;
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
  let query = sql`SELECT name, first_name, last_name, profile_pic, password from GroupMembers m join Users u join \`Groups\` g where u.email = m.member_id and m.group_id = g.id and g.id = ${req.params.groupId}; `;
  req.result = await db.query(query);
  next();
});

module.exports.getActiveGroupInfo = asyncHandler(async (req, _res, next) => {
  let query = sql`SELECT name, first_name, last_name, profile_pic, password, admin_status, phone_num, email from GroupMembers m join Users u join \`Groups\` g where u.email = m.member_id and m.group_id = g.id and g.id = ${req.params.groupId} and m.active = 1; `;
  req.result = await db.query(query);
  next();
});

module.exports.generateToken = (req, _res, next) => {
  const token = jwt.sign(
    {
      groupName: req.groupInfo.name,
      groupPassword: req.groupInfo.password,
    },
    process.env.ACCESS_TOKEN_SECRET
    //  { expiresIn: '5m' }
  );

  req.result = token;
  next();
};

module.exports.verifyToken = (req, res, next) => {
  try {
    const info = jwt.verify(req.params.token, process.env.ACCESS_TOKEN_SECRET);
    req.result = info;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send('Link verification failed');
  }
};
