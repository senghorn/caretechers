const supertest = require('supertest');
const rest_app = require('../src/rest-server');
const db = require('../src/database');
const sql = require('sql-template-strings');
const token = require('./token');
const app = rest_app.CreateRESTServer();

const testUserEmail = 'testUserUsers@gmail.com';

describe('user', () => {
  let groupId;
  const cookie = token.getToken(testUserEmail);
  beforeAll(async () => {
    const deleteExistingUserQuery = sql`DELETE FROM Users WHERE email = ${testUserEmail};`;
    await db.query(deleteExistingUserQuery);
    const insertGroupQuery = sql`INSERT INTO \`Groups\` (name, visit_frequency, timezone, password) VALUES
                                 ("Test_Group_ZXY4V", 3, "America/Denver", SUBSTR(MD5(RAND()), 1, 15));`;
    const groupInsertResult = await db.query(insertGroupQuery);
    groupId = groupInsertResult.insertId;
  });

  afterAll(async () => {
    const deleteUserQuery = sql`DELETE FROM Users WHERE email = ${testUserEmail} AND curr_group = ${groupId};`;
    await db.query(deleteUserQuery);
    const deleteGroupQuery = sql`DELETE FROM \`Groups\` WHERE id = ${groupId};`;
    await db.query(deleteGroupQuery);
    const deleteGroupMemberQuery = sql`DELETE FROM GroupMembers WHERE member_id =${testUserEmail}`;
    await db.query(deleteGroupMemberQuery);
  });

  describe('Create new user', () => {
    test('POST /user', async () => {
      const response = await supertest(app).post(`/user/`).set('Authorization', `Bearer ${cookie}`).send({
        email: testUserEmail,
        firstName: 'test_first',
        lastName: 'test_last',
        phoneNum: '999-999-9999',
        groupId,
        profilePic: 'test'
      });
      expect(response.status).toBe(204);
    });
  })

  describe('Get user info by user ID', () => {
    test('GET /user/:userId', async () => {
      const response = await supertest(app).get(`/user/${testUserEmail}`).set('Authorization', `Bearer ${cookie}`).send();
      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe('test_first');
      expect(response.body.last_name).toBe('test_last');
      expect(response.body.phone_num).toBe('999-999-9999');
    });
  });

  describe('Get user info by user ID should fail if user doesn\'t exist', () => {
    test('GET /user/:userId', async () => {
      const response = await supertest(app).get(`/user/fake@fake.org`).set('Authorization', `Bearer ${cookie}`).send();
      expect(response.status).toBe(404);
    });
  });

});