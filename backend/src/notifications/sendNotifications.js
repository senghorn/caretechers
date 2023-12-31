const db = require('../database');
const sql = require('sql-template-strings');
const { Expo } = require('expo-server-sdk');

const expo = new Expo();

// TO-DO: handle message receipt errors

// see info about push notification json bodies @ https://docs.expo.dev/push-notifications/sending-notifications/
module.exports.sendNotificationsToGroup = async (groupId, notification, toExclude) => {
  const query = sql`SELECT u.notification_identifier FROM GroupMembers gm JOIN Users u ON gm.member_id = u.email AND gm.active = 1 WHERE gm.group_id = ${groupId} AND u.notification_identifier IS NOT NULL `;
  const toAppend = toExclude ? ` AND u.email NOT IN (${toExclude});` : ';';
  query.append(toAppend);
  const toSendTo = await db.query(query);

  const messages = toSendTo.map((user) => {
    return { ...notification, to: user.notification_identifier };
  });

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);

        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  })();

  let receiptIds = [];
  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId];
          if (status === 'ok') {
            continue;
          } else if (status === 'error') {
            console.error(`There was an error sending a notification: ${message}`);
            if (details && details.error) {
              // The error codes are listed in the Expo documentation:
              // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
              // You must handle the errors appropriately.
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
};
