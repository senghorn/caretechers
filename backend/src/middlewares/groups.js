const asyncHandler = require("express-async-handler");
const sql = require("sql-template-strings");

const db = require("../database");
const { newError } = require("../utls");

module.exports.checkIfGroupExists = asyncHandler(async (req, res, next) => {
  const query = sql`SELECT * FROM \`Groups\` G
						WHERE id = ${req.params.groupId}`;
  const [result] = await db.query(query);

  if (!result) {
    return next(newError("This group does not exist!", 404));
  }

  next();
});

module.exports.getGroups = asyncHandler(async (req, res, next) => {
  const query = sql`SELECT * FROM \`Groups\` G LIMIT ${req.params.limit}`;
  req.result = await db.query(query);
  next();
});
