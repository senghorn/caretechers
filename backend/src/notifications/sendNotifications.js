const db = require('../database');
const sql = require('sql-template-strings');

// see info about push notification json bodies @ https://docs.expo.dev/push-notifications/sending-notifications/
module.exports.sendNotificationsToGroup = async (groupId, notification, toExclude = []) => {
  console.log(groupId);
  console.log(notification);
  console.log(toExclude);

  const query = sql`SELECT notification_identifier FROM Users WHERE group_id = ${groupId} AND notification_identifier IS NOT NULL;`;
  const toSendTo = await db.query(query);

  const messages = toSendTo.map((user) => {
    return { ...notification, to: user.notification_identifier };
  });

  console.log(messages);
};
