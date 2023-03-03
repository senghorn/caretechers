const supertest = require('supertest');
const rest_app = require('../src/rest-server');
const db = require('../src/database');
const sql = require('sql-template-strings');

const app = rest_app.CreateRESTServer();

const testUserEmail = 'testuserMessages@gmail.com';

describe('messages', () => {
  let groupId;
  let messageId;
  beforeAll(async () => {
    const insertGroupQuery = sql`INSERT INTO \`Groups\` (name, visit_frequency, timezone, password) VALUES
                                 ("Test_Group_ZXY4V", 3, "America/Denver", SUBSTR(MD5(RAND()), 1, 15));`;
    const groupInsertResult = await db.query(insertGroupQuery);
    groupId = groupInsertResult.insertId;
    const userInsertQuery = sql`INSERT INTO Users (email, first_name, last_name, phone_num, group_id)
                                VALUES (${testUserEmail}, "test_first", "test_last", "999-999-9999", ${groupId});`;
    await db.query(userInsertQuery);
	const insertTestMessagesQuery = sql`INSERT INTO Messages(sender, date_time, content, group_id, pin) VALUES
	(${testUserEmail}, '1999-02-23 01:01:01', 'test message 1', ${groupId}, 0),
	(${testUserEmail}, '1999-02-23 02:01:01', 'test message 2', ${groupId}, 0),
	(${testUserEmail}, '1999-02-23 03:01:01', 'test message 3', ${groupId}, 0);`;
	const response = await db.query(insertTestMessagesQuery);
	messageId =response.insertId;
  });

  afterAll(async () => {
	const deleteMessagesQuery = sql`DELETE FROM Messages WHERE sender = ${testUserEmail};`;
    await db.query(deleteMessagesQuery);
    const deleteUserQuery = sql`DELETE FROM Users WHERE email = ${testUserEmail} AND group_id = ${groupId};`;
    await db.query(deleteUserQuery);
    const deleteGroupQuery = sql`DELETE FROM \`Groups\` WHERE id = ${groupId};`;
    await db.query(deleteGroupQuery);
  });
  
  describe('Get messages by group ID', () => {
    test('GET /messages/:groupId', async () => {
      const response = await supertest(app).get(`/messages/${groupId}`).send();
      expect(response.status).toBe(200);
	  expect(response.body.length).toBe(3);
    });
  });

  describe('Pin a message', () => {
    test('POST /pin/:messageId', async () => {
      const response = await supertest(app).post(`/messages/pin/${messageId}`).send();
      expect(response.status).toBe(204);
    });
  });

  describe('Get pinned messages by group ID', () => {
    test('GET /pin/:groupId', async () => {
      const response = await supertest(app).get(`/messages/pin/${groupId}`).send();
      expect(response.status).toBe(200);
	  expect(response.body.length).toBe(1);
	  expect(response.body[0].id).toBe(messageId);
    });
  });
});