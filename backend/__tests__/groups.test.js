const supertest = require('supertest');
const sql = require('sql-template-strings');
const rest_app = require('../src/rest-server');
const token = require('./token');
const db = require('../src/database');
const app = rest_app.CreateRESTServer();

const testUserEmail = 'testuserMessages@gmail.com';

describe('notes', () => {
    let groupId;
    const cookie = token.getToken(testUserEmail);
    const groupName = "Test_Group_ZXY4V";
    const visit_frequency = 3;
    const timezone = "America/Denver";
    const data = {
        name: groupName,
        visitFrequency: visit_frequency,
        timeZone: timezone,
        userId: testUserEmail
    };

    beforeAll(async () => {
        const userInsertQuery = sql`INSERT INTO Users (email, first_name, last_name, phone_num, curr_group)
                                    VALUES (${testUserEmail}, "test_first", "test_last", "999-999-9999", NULL);`;
        await db.query(userInsertQuery);

    });

    afterAll(async () => {
        const deleteMessagesQuery = sql`DELETE FROM Notes WHERE group_id = ${groupId}; `;
        await db.query(deleteMessagesQuery);
        const deleteUserQuery = sql`DELETE FROM Users WHERE email = ${testUserEmail};`;
        await db.query(deleteUserQuery);
        const deleteMemberQuery = sql`DELETE FROM GroupMembers where member_id = ${testUserEmail};`;
        await db.query(deleteMemberQuery);
        const deleteGroupQuery = sql`DELETE FROM \`Groups\` WHERE id = ${groupId};`;
        await db.query(deleteGroupQuery);
    });

    describe('Create a new group', () => {
        test('POST /groups/', async () => {
            const response = await supertest(app).post(`/groups/`).set('Authorization', `Bearer ${cookie}`).send(data);
            expect(response.status).toBe(200);
            console.log(response);
        });
    });
});