const sql = require('sql-template-strings');
const db = require('../database');
const asyncHandler = require('express-async-handler');

module.exports.createVisit = asyncHandler(async (req, _res, next) => {
  const { groupId } = req.params;
  const { date, userEmail } = req.body;

  const query = sql`INSERT INTO Visits (date, visitor, group_id) VALUES (${date}, ${userEmail}, ${groupId});`;

  req.result = await db.query(query);
  next();
});

module.exports.deleteVisit = asyncHandler(async (req, _res, next) => {
  const { visitId } = req.params;

  const query = sql`DELETE FROM Visits WHERE id=${visitId}`;

  await db.query(query);
  next();
});

module.exports.setVisitIdentifier = asyncHandler(async (req, _res, next) => {
  const { visitId } = req.params;

  const query = sql`UPDATE Visits SET notification_identifier = ${req.body.identifier} WHERE id = ${visitId};`;

  await db.query(query);
  next();
});

module.exports.recordVisit = asyncHandler(async (req, _res, next) => {
  const { visitId } = req.params;

  const tasksQuery = sql``;

  if (req.body.tasks && req.body.tasks.length > 0) {
    req.body.tasks.forEach((task) => {
      tasksQuery.append(`INSERT IGNORE INTO Tasks (meta_id, occurence_date, completed, visit_id)
                          VALUES (${task}, '${req.body.date}', 1, ${visitId});`);
    });

    await db.query(tasksQuery);
  }

  const completeVisitQuery = sql`UPDATE Visits SET completed = 1, visit_notes = ${req.body.notes} WHERE id=${visitId};`;

  await db.query(completeVisitQuery);

  next();
});

module.exports.getVisitsByDateRange = asyncHandler(async (req, _res, next) => {
  const { groupId } = req.params;
  const { start, end } = req.query;

  // TO-DO: validate variables

  const query = sql`SELECT DATE_FORMAT(Days.the_date, '%Y-%m-%d') AS date, COUNT(tasks.id) as taskCount, COUNT(completed_tasks.id) AS completedTaskCount,
      visits.id AS visitId, visits.visitor, visits.visit_notes, IFNULL(visits.completed, 0) AS visitCompleted, visits.notification_identifier,
      users.first_name, users.last_name, users.phone_num AS phone, users.profile_pic as profile_pic,
      gr.id as groupId, gr.name AS groupName, gr.timezone as timeZone

      FROM (SELECT DATE_SUB(${start}, INTERVAL 1 DAY) + INTERVAL (day) DAY AS the_date FROM Day_Indexes) Days
		JOIN \`Groups\` gr ON (gr.id = ${groupId})
		LEFT JOIN TaskMeta valid_tasks ON valid_tasks.group_id = gr.id

      LEFT JOIN RecurringPattern repeats ON repeats.task_id = valid_tasks.id 
      AND (DATE(valid_tasks.start_date) <= Days.the_date AND (valid_tasks.end_date IS NULL OR valid_tasks.end_date > Days.the_date))
		AND ((repeats.task_id = valid_tasks.id AND DATE(valid_tasks.start_date) = Days.the_date) 
         OR ( (repeats.month_of_year IS NULL OR repeats.month_of_year = MONTH(Days.the_date)) AND (repeats.week_of_month IS NULL OR repeats.week_of_month = FLOOR((DAYOFMONTH(Days.the_date) - 1) / 7) + 1) 
            AND ((repeats.day_of_week IS NULL) OR (repeats.day_of_week = DAYOFWEEK(Days.the_date)) OR (repeats.day_of_month = DAYOFMONTH(Days.the_date)))
         )
      )

      LEFT JOIN TaskMeta tasks ON tasks.id = valid_tasks.id AND (tasks.id = repeats.task_id OR DATE(tasks.start_date) = Days.the_date)
      LEFT JOIN Visits visits ON visits.date = Days.the_date AND visits.group_id = ${groupId}
      LEFT JOIN Tasks completed_tasks ON completed_tasks.meta_id = tasks.id AND completed_tasks.occurence_date = Days.the_date AND completed_tasks.completed = 1
      LEFT JOIN Users users ON users.email = visits.visitor

      WHERE Days.the_date BETWEEN ${start} AND ${end}
		GROUP BY Days.the_date;`;

  req.result = await db.query(query);
  next();
});
