const supertest = require('supertest');
const assert = require('assert');
const rest_app = require('../src/rest-server');
const { format } = require('date-fns');
const db = require('../src/database');
const sql = require('sql-template-strings');
const getToken = require('./token');
const app = rest_app.CreateRESTServer();

const currentDate = format(new Date(), 'yyyy-MM-dd');
const testUserEmail = 'testuser@gmail.com';

describe('visits', () => {
  let groupId;
  let visitId;
  const token = getToken(testUserEmail);

  beforeAll(async () => {
    const insertGroupQuery = sql`INSERT INTO \`Groups\` (name, visit_frequency, timezone, password) VALUES
                                 ("Test_Group_ZXY4V", 3, "America/Denver", SUBSTR(MD5(RAND()), 1, 15));`;
    const groupInsertResult = await db.query(insertGroupQuery);
    groupId = groupInsertResult.insertId;
    const userInsertQuery = sql`INSERT INTO Users (email, first_name, last_name, phone_num, curr_group)
                                VALUES (${testUserEmail}, "test_first", "test_last", "999-999-9999", ${groupId});`;
    await db.query(userInsertQuery);
    const insertGroupMemberQuery = sql`INSERT INTO GroupMembers m (member_id, group_id, active, admin_status)
                                       VALUES (${testUserEmail}, ${groupId}, 1, 2);`;
    await db.query(insertGroupMemberQuery);
  });

  afterAll(async () => {
    const deleteVisitsQuery = sql`DELETE FROM Visits WHERE visitor = ${testUserEmail};`;
    await db.query(deleteVisitsQuery);
    const deleteUserQuery = sql`DELETE FROM Users WHERE email = ${testUserEmail} AND curr_group = ${groupId};`;
    await db.query(deleteUserQuery);
    const deleteGroupQuery = sql`DELETE FROM \`Groups\` WHERE id = ${groupId};`;
    await db.query(deleteGroupQuery);
  });

  describe('Create Visit', () => {
    test('POST /visits/group/:groupId', async () => {
      const body = { date: currentDate, userEmail: testUserEmail };
      const response = await supertest(app).post(`/visits/group/${groupId}`).set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(200);
      expect(response.body.affectedRows).toBe(1);
      visitId = response.body.insertId;
    });
  });

  describe('Check if visit is there', () => {
    test('GET /visits/group/:groupId', async () => {
      const response = await supertest(app).get(`/visits/group/${groupId}?start=${currentDate}&end=${currentDate}`);
      expect(response.body.length).toBe(1);
      expect(response.body[0].visitId).toBe(visitId);
      expect(response.body[0].groupId).toBe(groupId);
      expect(response.body[0].date).toBe(currentDate);
      expect(response.body[0].visitor).toBe(testUserEmail);
      expect(response.status).toBe(200);
    });
  });

  describe('Delete Visit', () => {
    test('DELETE /visits/:visitId', async () => {
      const response = await supertest(app).delete(`/visits/${visitId}`);
      expect(response.status).toBe(204);
      const getVisitResponse = await supertest(app).get(`/visits/group/${groupId}?start=${currentDate}&end=${currentDate}`);
      expect(getVisitResponse.body.length).toBe(1);
      expect(getVisitResponse.body[0].visitId).toBe(null);
      expect(getVisitResponse.body[0].visitor).toBe(null);
    });
  });

});
