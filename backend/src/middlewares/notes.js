const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');
const { newError, getUTCDateTime } = require('../utls');

module.exports.getNotesByGroupId = asyncHandler(async (req, _res, next) => {
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

module.exports.createNewNote = asyncHandler(async (req, _res, next) => {
	let query;

	if (req.body.content) {
		query = sql`INSERT INTO Notes(group_id, title, content, last_edited) VALUES(${req.params.groupId}, ${req.body.title}, ${req.body.content}, ${getUTCDateTime()})`;
	} else {
		query = sql`INSERT INTO Notes(group_id, title, last_edited) VALUES(${req.params.groupId}, ${req.body.title}, ${getUTCDateTime()})`;
	}
	const result = await db.query(query);
	req.result = { noteId: result.insertId };
	next();
});

module.exports.checkIfNoteExists = asyncHandler(async (req, _res, next) => {
	const query = sql`SELECT id FROM Notes WHERE id = ${req.params.noteId};`;
	const [note] = await db.query(query);
	if (!note) {
		return next(newError(`This note(${req.params.noteId}) does not exist!`), 404);
	}
	next();
});

module.exports.updateNote = asyncHandler(async (req, _res, next) => {
	let query = sql`UPDATE Notes SET `;
	if (!req.body.title && !req.body.content) {
		return next(newError('Note title or content must be provided!', 400));
	}
	if (req.body.title && req.body.content) {
		query.append(sql`title = ${req.body.title}, content = ${req.body.content}, last_edited = ${getUTCDateTime()}`);
	} else {
		if (req.body.title) {
			query.append(sql`title = ${req.body.title}, last_edited = ${getUTCDateTime()}`);
		}
		if (req.body.content) {
			query.append(sql`content = ${req.body.content}, last_edited = ${getUTCDateTime()}`);
		}
	}

	query.append(sql` WHERE id = ${req.params.noteId};`);
	await db.query(query);
	next();
});

module.exports.deleteNote = asyncHandler(async (req, _res, next) => {
	let query = sql`DELETE FROM Notes WHERE id = ${req.params.noteId};`;
	await db.query(query);
	next();
});

module.exports.getNotesBySearchString = asyncHandler(async (req, _res, next) => {
	const search = '%' + req.params.searchString + '%';
	const query = sql`SELECT * FROM Notes WHERE (title LIKE ${search} OR content LIKE ${search})
	AND group_id = ${req.params.groupId}`;
	req.result = await db.query(query);
	next();
});

module.exports.checkIfSearchIsValid = asyncHandler(async (req, _res, next) => {
	if (!req.params.searchString) {
		return next(newError('Search string needs to be provided', 400));
	}
	next();
});
