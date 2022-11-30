const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');

module.exports.getMessagesByGroup = asyncHandler(async (req, res, next) => {
	const query = sql`SELECT * FROM Messages WHERE group_id = ${req.params.groupId} ORDER BY date_time DESC;`;
	let result = await db.query(query);

	if (req.query.offset) {
		result = result.slice(req.query.offset);
	};

	result.map(row => row.date_time = new Date(`${row.date_time} UTC`).toString());
	req.result = result;
	next();
});