const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');

module.exports.getTasksByGroup = asyncHandler(async (req, _res, next) => {
	const query = sql`SELECT * FROM TaskMeta TM
					JOIN RecurringPattern RP on TM.id = RP.task_id
					WHERE TM.group_id = ${req.params.groupId};`;
	req.result = await db.query(query);
	next();
});

// *** THIS MIDDLEWARE WILL BE USED LATER FOR COMPLICATED RECURRENCE PATTERNS ***
// module.exports.sortTasksByType = asyncHandler(async (req, _res, next) => {
// 	let sortedTasks = {
// 		everyVist: [],
// 		scheduled: []
// 	};

// 	req.tasks.map(task => {
// 		if (task.recurring_type === 'everytime') {
// 			sortedTasks.everyVist.push(task)
// 		} else {
// 			sortedTasks.scheduled.push(task)
// 		}
// 	});

// 	req.tasks = sortedTasks;
// 	next();
// });
