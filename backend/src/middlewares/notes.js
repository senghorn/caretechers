const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');

module.exports.getNotesByGroupId = asyncHandler(async(req, res, next) => {
	const query = sql`SELECT N.id, N.title, N.content, N.last_edited FROM \`Groups\` G
						JOIN Notes N ON G.id = N.group_id
						WHERE N.group_id = ${req.params.groupId}`;

	req.result = await db.query(query);
	next();
});