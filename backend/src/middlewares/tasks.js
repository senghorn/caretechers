const Ajv = require('ajv');
const ajv = new Ajv();
const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');
const { newError } = require('../utls');

module.exports.getTaskById = asyncHandler(async (req, _res, next) => {
  const query = sql`SELECT TM.title, TM.description, TM.start_date, TM.end_date
                    FROM TaskMeta TM
                    WHERE TM.id=${req.params.taskId} AND TM.group_id = ${req.params.groupId};`;
  req.result = await db.query(query);
  next();
});

module.exports.getTaskRepeats = asyncHandler(async (req, _res, next) => {
  const query = sql`SELECT TM.start_date, TM.end_date, RP.* FROM TaskMeta TM LEFT JOIN RecurringPattern RP ON RP.task_id = ${req.params.taskId} WHERE TM.id=${req.params.taskId};`;
  req.result = await db.query(query);
  next();
});

module.exports.getTasksByGroup = asyncHandler(async (req, _res, next) => {
  const query = sql`SELECT TM.id, TM.group_id, TM.title, TM.description, TM.start_date, TM.end_date, 
          RP.task_id AS rp_id, RP.separation_count, RP.day_of_week, RP.week_of_month, RP.day_of_month, RP.month_of_year
          FROM TaskMeta TM
					LEFT JOIN RecurringPattern RP on TM.id = RP.task_id
					WHERE TM.group_id = ${req.params.groupId} AND (TM.end_date IS NULL OR TM.end_date > ${req.query.after_date});`;
  req.result = await db.query(query);
  next();
});

module.exports.deleteTask = asyncHandler(async (req, _res, next) => {
  const taskInfoQuery = sql`SELECT start_date FROM TaskMeta WHERE id = ${req.params.taskId}`;
  const [task] = await db.query(taskInfoQuery);
  const shouldDelete = task.start_date >= req.query.end_date;
  const query =
    req.query.end_date && !shouldDelete
      ? sql`UPDATE TaskMeta SET end_date = ${req.query.end_date} WHERE id = ${req.params.taskId};`
      : sql`DELETE FROM TaskMeta WHERE id = ${req.params.taskId};`;
  await db.query(query);
  next();
});

module.exports.getTasksByDateRange = asyncHandler(async (req, res, next) => {
  const { groupId } = req.params;
  const { start, end } = req.query;

  // TO-DO: validate variables

  const query = sql`SELECT DATE_FORMAT(Days.the_date, '%Y-%m-%d') AS date, tasks.id, tasks.title, tasks.description,
		 visits.id AS visitId, visits.visitor, visits.completed AS visitCompleted, users.first_name, users.last_name, IFNULL(past_tasks.completed, 0) AS taskCompleted,
		 tasks.group_id as groupId, gr.name AS groupName, gr.timezone as timeZone,
		 DATE_FORMAT(tasks.start_date, '%Y-%m-%d') AS startRepeat, DATE_FORMAT(tasks.end_date, '%Y-%m-%d') AS endRepeat,
		 repeats.task_id as repeatParent
 
		 FROM (SELECT DATE_SUB(${start}, INTERVAL 1 DAY) + INTERVAL (day) DAY AS the_date FROM Day_Indexes) Days
		 JOIN \`Groups\` gr ON (gr.id = ${groupId})
		 JOIN TaskMeta valid_tasks ON valid_tasks.group_id = gr.id
 
		 LEFT JOIN RecurringPattern repeats ON repeats.task_id = valid_tasks.id 
		 AND (DATE(valid_tasks.start_date) <= Days.the_date AND (valid_tasks.end_date IS NULL OR valid_tasks.end_date > Days.the_date))
		 AND ((repeats.task_id = valid_tasks.id AND DATE(valid_tasks.start_date) = Days.the_date) 
			 OR ( (repeats.month_of_year IS NULL OR repeats.month_of_year = MONTH(Days.the_date)) AND (repeats.week_of_month IS NULL OR repeats.week_of_month = FLOOR((DAYOFMONTH(Days.the_date) - 1) / 7) + 1) 
				 AND ((repeats.day_of_week IS NULL) OR (repeats.day_of_week = DAYOFWEEK(Days.the_date)) OR (repeats.day_of_month = DAYOFMONTH(Days.the_date)))
			 )
		 )
 
		 JOIN TaskMeta tasks ON tasks.id = valid_tasks.id AND (tasks.id = repeats.task_id OR DATE(tasks.start_date) = Days.the_date)
		 LEFT JOIN Visits visits ON visits.date = Days.the_date
		 LEFT JOIN Tasks past_tasks ON past_tasks.meta_id = tasks.id AND past_tasks.occurence_date = Days.the_date
		 LEFT JOIN Users users ON users.email = visits.visitor
 
		 WHERE Days.the_date BETWEEN ${start} AND ${end}
		 GROUP BY Days.the_date, tasks.id;`;

  req.result = await db.query(query);
  next();
});

module.exports.createTask = asyncHandler(async (req, _res, next) => {
  const query = sql`INSERT INTO TaskMeta (group_id, title, description, start_date) 
                    VALUES (${req.params.groupId}, ${req.body.title}, ${req.body.description}, ${req.body.start_date});`;

  const result = await db.query(query);

  if (req.body.repeat_pattern) {
    const insertQuery = sql`INSERT INTO RecurringPattern (task_id, separation_count, 
                     day_of_week, week_of_month, day_of_month, month_of_year, recurring_type) VALUES (${result.insertId}, ${req.body.repeat_pattern.separation_count},
                     ${req.body.repeat_pattern.day_of_week}, ${req.body.repeat_pattern.week_of_month}, ${req.body.repeat_pattern.day_of_month}, ${req.body.repeat_pattern.month_of_year},
                     ${req.body.repeat_pattern.recurring_type});`;
    await db.query(insertQuery);
  }

  req.result = result;
  next();
});

module.exports.editTaskDeprecated = asyncHandler(async (req, _res, next) => {
  const query = sql`UPDATE TaskMeta SET title=${req.body.title}, description=${req.body.description}, start_date=${req.body.start_date} WHERE id=${req.params.taskId};`;

  const deleteQuery = sql`DELETE FROM RecurringPattern WHERE task_id = ${req.params.taskId};`;
  await db.query(deleteQuery);
  console.log(req.body.repeat_pattern);
  if (req.body.repeat_pattern) {
    const insertQuery = sql`INSERT INTO RecurringPattern (task_id, separation_count, 
                     day_of_week, week_of_month, day_of_month, month_of_year, recurring_type) VALUES (${req.params.taskId}, ${req.body.repeat_pattern.separation_count},
                     ${req.body.repeat_pattern.day_of_week}, ${req.body.repeat_pattern.week_of_month}, ${req.body.repeat_pattern.day_of_month}, ${req.body.repeat_pattern.month_of_year},
                     ${req.body.repeat_pattern.recurring_type});`;
    await db.query(insertQuery);
  }

  req.result = await db.query(query);
  next();
});

module.exports.editTask = asyncHandler(async (req, _res, next) => {
  const attemptDelete = sql`DELETE FROM TaskMeta WHERE id=${req.params.taskId} AND start_date >= ${req.query.end_date};`;
  await db.query(attemptDelete);
  const query = sql`UPDATE IGNORE TaskMeta SET end_date=${req.query.end_date} WHERE id=${req.params.taskId};
                    INSERT INTO TaskMeta (group_id, title, description, start_date) VALUES (${req.body.groupId}, ${req.body.title}, ${req.body.description}, ${req.body.start_date});`;
  req.result = (await db.query(query))[1];
  if (req.body.repeat_pattern) {
    const insertQuery = sql`INSERT INTO RecurringPattern (task_id, separation_count,
                      day_of_week, week_of_month, day_of_month, month_of_year, recurring_type) VALUES (${req.result.insertId}, ${req.body.repeat_pattern.separation_count},
                      ${req.body.repeat_pattern.day_of_week}, ${req.body.repeat_pattern.week_of_month}, ${req.body.repeat_pattern.day_of_month}, ${req.body.repeat_pattern.month_of_year},
                      ${req.body.repeat_pattern.recurring_type});`;
    await db.query(insertQuery);
  }
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

module.exports.verifyTaskIsValid = (req, _res, next) => {
  const schema = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      start_date: { type: 'string' },
      end_date: { type: 'string' },
      is_recurring: { type: 'boolean' },
      recurring_type: { type: 'string' },
      separation_count: { type: 'integer' },
      day_of_week: { type: 'integer' },
      week_of_month: { type: 'integer' },
      day_of_month: { type: 'integer' },
      month_of_year: { type: 'integer' },
    },
    required: ['title', 'start_date'],
  };
  const validate = ajv.compile(schema);
  if (!validate(req.body)) {
    return next(newError(JSON.stringify(validate.errors), 400));
  }
  next();
};

module.exports.createNewTask2 = asyncHandler(async (req, _res, next) => {
  let columns = ['title', 'group_id', 'start_date'];
  if (req.body.description) {
    columns.push('description');
  }
  if (req.body.endDate) {
    columns.push('end_date');
  }

  let query = sql`INSERT INTO TaskMeta(`;

  for (let i = 0; i < columns.length; i++) {
    if (i === columns.length - 1) {
      query.append(`${columns[i]}) `);
      query.append(sql`VALUES(${req.body.title}, ${req.params.groupId}, ${req.body.start_date}`);
    } else {
      query.append(`${columns[i]}, `);
    }
  }

  if (req.body.description) {
    query.append(sql`, ${req.body.description}`);
  }
  if (req.body.endDate) {
    query.append(sql`, ${req.body.end_date}`);
  }
  query.append(sql`);`);

  const [result] = await db.query(query);
  console.log(result);
});

module.exports.createNewTask = asyncHandler(async (req, _res, next) => {
  let columns = ['title', 'group_id', 'start_date', 'is_recurring'];
  if (req.body.description) {
    columns.push('description');
  }
  if (req.body.endDate) {
    columns.push('end_date');
  }

  let query = sql`INSERT INTO TaskMeta(`;
  for (let i = 0; i < columns.length; i++) {
    if (i === columns.length - 1) {
      query.append(`${columns[i]}) `);
      query.append(sql`VALUES(${req.body.title}, ${req.params.groupId}, ${req.body.start_date}`);
    } else {
      query.append(`${columns[i]}, `);
    }
  }

  if (req.body.description) {
    query.append(sql`, ${req.body.description}`);
  }
  if (req.body.endDate) {
    query.append(sql`, ${req.body.end_date}`);
  }
  query.append(sql`);`);

  await db.query(query);

  query = sql`SELECT id FROM TaskMeta WHERE group_id = ${req.params.groupId} AND title = ${req.body.title}`; // THIS MIGHT NOT RESULT IN ONE ID...
  if (req.body.description) {
    query.append(sql` AND description = ${req.body.description}`);
  }
  const [result] = await db.query(query);
  const taskId = result.id;

  if (req.body.is_recurring) {
    columns = ['task_id', 'recurring_type'];
    if (
      !req.body.recurring_type ||
      (!req.body.separation_count &&
        !req.body.day_of_week &&
        !req.body.week_of_month &&
        !req.body.day_of_month &&
        !req.body.month_of_year)
    ) {
      return next(
        newError(
          'If the task is recurring, recurringType must be provided as well as one of the following: separation_count, day_of_week, week_of_month, day_of_month, or month_of_year.'
        )
      );
    }
    if (req.body.separation_count) {
      columns.push('separation_count');
    }
    if (req.body.day_of_week) {
      columns.push('day_of_week');
    }
    if (req.body.week_of_month) {
      columns.push('week_of_month');
    }
    if (req.body.day_of_month) {
      columns.push('day_of_month');
    }
    if (req.body.month_of_year) {
      columns.push('month_of_year');
    }
    query = sql`INSERT INTO RecurringPattern(`;
    for (let i = 0; i < columns.length; i++) {
      if (i === columns.length - 1) {
        query.append(`${columns[i]}) `);
        query.append(sql`VALUES(${taskId}, ${req.body.recurring_type}`);
      } else {
        query.append(`${columns[i]}, `);
      }
    }
    if (req.body.separation_count) {
      query.append(sql`, ${req.body.separation_count}`);
    }
    if (req.body.day_of_week) {
      query.append(sql`, ${req.body.day_of_week}`);
    }
    if (req.body.week_of_month) {
      query.append(sql`, ${req.body.week_of_month}`);
    }
    if (req.body.day_of_month) {
      query.append(sql`, ${req.body.day_of_month}`);
    }
    if (req.body.month_of_year) {
      query.append(sql`, ${req.body.month_of_year}`);
    }
    query.append(sql`);`);
    await db.query(query);
    next();
  }
});
