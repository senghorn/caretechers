const db = require('../src/database');
const sql = require('sql-template-strings');


const seedMessages = async (day, testUserEmail) => {
    const groupId = 1;

    const insertTestMessagesQuery = sql`INSERT INTO Messages(sender, date_time, content, group_id, pin) VALUES
(${testUserEmail}, '2023-02-${day} 01:01:01', 'test message 1 ${day}', ${groupId}, 0),
(${testUserEmail}, '2023-02-${day} 02:01:01', 'test message 2 ${day}', ${groupId}, 0),
(${testUserEmail}, '2023-02-${day} 03:01:01', 'test message 3 ${day}', ${groupId}, 0),
(${testUserEmail}, '2023-02-${day} 04:01:01', 'test message 4 ${day}', ${groupId}, 0),
(${testUserEmail}, '2023-02-${day} 05:01:01', 'test message 5 ${day}', ${groupId}, 0);`;
    const response = await db.query(insertTestMessagesQuery);
    console.log(response);
}
const testUserEmail = "rithsenghorn@gmail.com";
const seedAllMessages = async () => {
    await seedMessages(1, testUserEmail);
    await seedMessages(2, testUserEmail);
    await seedMessages(3, testUserEmail);
    await seedMessages(4, testUserEmail);
    await seedMessages(5, testUserEmail);
    await seedMessages(6, testUserEmail);
    await seedMessages(7, testUserEmail);
    await seedMessages(8, testUserEmail);
    await seedMessages(9, testUserEmail);
    await seedMessages(10, testUserEmail);
    await seedMessages(11, testUserEmail);
    await seedMessages(12, testUserEmail);
    await seedMessages(13, testUserEmail);
    await seedMessages(14, testUserEmail);
    await seedMessages(15, testUserEmail);
    await seedMessages(16, testUserEmail);
    await seedMessages(17, testUserEmail);
    await seedMessages(18, testUserEmail);
    await seedMessages(19, testUserEmail);
    await seedMessages(20, testUserEmail);
}
seedAllMessages();