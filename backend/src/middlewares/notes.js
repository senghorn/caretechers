const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');
const { newError, getUTCDateTime } = require('../utls');

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

module.exports.checkIfNoteIsValid = asyncHandler(async (req, _res, next) => {
	if (!req.body.title) {
		return next(newError('Note title needs to be provided', 400));
	}
	next();
});

module.exports.createNewNote = asyncHandler(async(req, _res, next) => {
	let query;

	if (req.body.content) {
		query = sql`INSERT INTO Notes(group_id, title, content, last_edited) VALUES(${req.params.groupId}, ${req.body.title}, ${req.body.content}, ${getUTCDateTime()})`;
	} else {
		query = sql`INSERT INTO Notes(group_id, title, last_edited) VALUES(${req.params.groupId}, ${req.body.title}, ${getUTCDateTime()})`;
	}
	await db.query(query);
	next();
});