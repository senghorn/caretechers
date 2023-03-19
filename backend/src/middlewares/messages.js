const { query } = require('express');
const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');
const { getUTCDateTime } = require('../utls');

module.exports.getMessagesByGroup = asyncHandler(async (req, res, next) => {
	const query = sql`SELECT * FROM Messages WHERE group_id = ${req.params.groupId} ORDER BY date_time DESC LIMIT 50;`
	let result = await db.query(query);

	if (req.query.offset) {
		result = result.slice(req.query.offset);
	};

	result.map(row => row.date_time = new Date(`${row.date_time} UTC`).toString());
	req.result = result;
	next();
});

module.exports.fetchMoreMessagesByLastMessageId = asyncHandler(async (req, res, next) => {
	const query = sql`SELECT * FROM Messages WHERE group_id = ${req.params.groupId} AND id < ${req.params.lastId} ORDER BY date_time DESC LIMIT 50;`
	let result = await db.query(query);

	result.map(row => row.date_time = new Date(`${row.date_time} UTC`).toString());
	req.result = result;
	next();
});

module.exports.getUsersInGroup = asyncHandler(async (req, res, next) => {
	const query = sql`SELECT * FROM Users WHERE group_id = ${req.params.groupId};`;
	let result = await db.query(query);
	req.result = result;
	next();
});

async function createNewMessage(message_data) {
	const query = sql`INSERT INTO Messages(sender, date_time, content, group_id) VALUES(${message.sender}, ${getUTCDateTime()}, ${message.content}, ${message.group_id})`;
	let result = await db.query(query);
	return result;
}

module.exports.checkIfSearchIsValid = asyncHandler(async (req, _res, next) => {
	if (!req.params.searchString) {
		return next(newError('Search string needs to be provided', 400));
	}
	next();
});

module.exports.getMessagesBySearchString = asyncHandler(async (req, _res, next) => {
	const search = '%' + req.params.searchString + '%';
	const query = sql`SELECT * FROM Messages WHERE content LIKE ${search}
	AND group_id = ${req.params.groupId}`;
	req.result = await db.query(query);
	next();
});

module.exports.setMessagePin = asyncHandler(async (req, _res, next) => {
	if (req.params.messageId) {
		const query = sql`UPDATE Messages SET pin = 1 WHERE id = ${req.params.messageId}`;
		req.result = await db.query(query);
	}
	else {
		return next(newError('Message ID is not provided', 400));
	}
	next();
});

module.exports.unpinMessage = asyncHandler(async (req, _res, next) => {
	if (req.params.messageId) {
		const query = sql`UPDATE Messages SET pin = 0 WHERE id = ${req.params.messageId}`;
		req.result = await db.query(query);
	}
	else {
		return next(newError('Message ID is not provided', 400));
	}
	next();
});


module.exports.getPinnedMessages = asyncHandler(async (req, _res, next) => {
	const query = sql`SELECT * FROM Messages WHERE group_id = ${req.params.groupId} AND pin = 1`;
	req.result = await db.query(query);
	next();
});