const supertest = require('supertest');
const rest_app = require('../src/rest-server');
const db = require('../src/database');
const sql = require('sql-template-strings');

const app = rest_app.CreateRESTServer();

const testUserEmail = 'testUserUser@gmail.com';

describe('user', () => {
  let groupId;
  beforeAll(async () => {
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
  });

  describe('Create new user', () => {
	test('POST /user', async () => {
		const response = await supertest(app).post(`/user/`).send({
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
      const response = await supertest(app).get(`/user/${testUserEmail}`).send();
      expect(response.status).toBe(200);
	  expect(response.body.first_name).toBe('test_first');
	  expect(response.body.last_name).toBe('test_last');
	  expect(response.body.phone_num).toBe('999-999-9999');
    });
  });
  
  describe('Get user info by user ID should fail if user doesn\'t exist', () => {
    test('GET /user/:userId', async () => {
      const response = await supertest(app).get(`/user/fake@fake.org`).send();
      expect(response.status).toBe(404);
    });
  });

});