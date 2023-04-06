const sql = require('sql-template-strings');
const db = require('../database');
const { sendNotificationsToGroup } = require('../notifications/sendNotifications');

async function notifyGroupsWithLackOfVisits() {
  console.log('[NOTIFY JOB] Sending group visit reminders');
  const query = sql`SELECT min(DATEDIFF(CURDATE(), v.date)) as daysSinceLastVisit, g.id, g.name, g.visit_frequency FROM \`Groups\` g 
                    LEFT JOIN Visits v ON g.id = v.group_id AND v.completed = 1 GROUP BY g.id;`;
  const result = await db.query(query);
  console.log('[NOTIFY JOB] finished group visit query for reminders');
  result.forEach((group) => {
    if (group.daysSinceLastVisit === null) {
      sendNotificationsToGroup(group.id, {
        title: `Be the first to visit your loved one`,
        body: 'Leaving a loved one alone for too long can be dangerous.',
        data: { url: 'Calendar' },
      });
    } else if (group.daysSinceLastVisit > group.visit_frequency) {
      sendNotificationsToGroup(group.id, {
        title: `DANGER: It's been ${group.daysSinceLastVisit} days since someone checked in`,
        body: 'Leaving a loved one alone for too long can be dangerous.',
        data: { url: 'Calendar' },
      });
    }
  });
  console.log('[NOTIFY JOB] notifications sent. Job done.');
}

module.exports = notifyGroupsWithLackOfVisits;
