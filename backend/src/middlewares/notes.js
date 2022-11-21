const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');
const { newError } = require('../utls');

module.exports.getNotesByGroupId = asyncHandler(async(req, _res, next) => {
	const query = sql`SELECT N.id, N.title, N.content, N.last_edited FROM \`Groups\` G
						JOIN Notes N ON G.id = N.group_id
						WHERE N.group_id = ${req.params.groupId}`;

	req.result = await db.query(query);
	next();
});

module.exports.getNoteByNoteId = asyncHandler(async (req, _res, next) => {
	const query = sql`SELECT * FROM Notes WHERE id = ${req.params.noteId}`;
	const [result] = await db.query(query);

	if (!result) {
		return next(newError(`Note (${req.params.noteId}) does not exist!`, 404));
	}

	req.result = result;
	next();
});