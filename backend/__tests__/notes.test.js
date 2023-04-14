const supertest = require('supertest');
const sql = require('sql-template-strings');
const rest_app = require('../src/rest-server');
const token = require('./token');
const db = require('../src/database');
const app = rest_app.CreateRESTServer();

const testUserEmail = 'testUserNotes@gmail.com';

describe('notes', () => {
  let groupId;
  let noteId;

  const cookie = token.getToken(testUserEmail);
  const noteContent = 'I love that ice-cream flavor';
  const noteTitle = 'Mint Chocolate';
  const searchString = 'Chocolate';
  beforeAll(async () => {
    const insertGroupQuery = sql`INSERT INTO \`Groups\` (name, visit_frequency, timezone, password) VALUES
                                 ("Test_Group_ZXY4V", 3, "America/Denver", SUBSTR(MD5(RAND()), 1, 15));`;
    const groupInsertResult = await db.query(insertGroupQuery);
    groupId = groupInsertResult.insertId;
    const userInsertQuery = sql`INSERT INTO Users (email, first_name, last_name, phone_num, curr_group)
                                VALUES (${testUserEmail}, "test_first", "test_last", "999-999-9999", ${groupId});`;
    await db.query(userInsertQuery);
    const memberInsertQuery = sql`INSERT INTO GroupMembers (member_id, group_id, active, admin_status) 
    VALUES (${testUserEmail}, ${groupId}, 1, 2)`;
    await db.query(memberInsertQuery);
    const insertNotesQuery = sql`INSERT INTO Notes(group_id, title, content, last_edited) VALUES
                                (${groupId}, ${noteTitle}, ${noteContent},'1999-02-23 03:01:01'); `;
    const response = await db.query(insertNotesQuery);
    noteId = response.insertId;
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


  describe('Get notes by group Id', () => {
    it('GET /notes/group/:groupId', async () => {
      const response = await supertest(app).get(`/notes/group/` + groupId).set('Authorization', `Bearer ${cookie}`).send();
      expect(response.status).toBe(200);
      expect(response.body[0].id).toBe(noteId);
    });

  });

  describe('Get note by note Id', () => {
    it('GET /notes/:noteId', async () => {
      const response = await supertest(app).get(`/notes/` + noteId).set('Authorization', `Bearer ${cookie}`).send();
      expect(response.status).toBe(200);
      expect(response.body.content).toBe(noteContent);
      expect(response.body.title).toBe(noteTitle);
    })
  });

  describe('Search note by group id and string', () => {
    it('GET /notes/search/:groupId/:searchString', async () => {
      const response = await supertest(app).get(`/notes/search/${groupId}/${searchString}`).set('Authorization', `Bearer ${cookie}`).send();
      expect(response.status).toBe(200);
      expect(response.body[0].content).toBe(noteContent);
    })
  });

});

//GROUP Tests
// describe('groups', () => {
//   describe('gets a groups password', () => {
//     describe('given group id', () => {
//       it('should return a 200', async () => {
//         const groupId = '9';
//         await supertest(app)
//           .get(`/groups/password/` + groupId)
//           .expect(200);
//       });
//     });
//   });

//   describe('get user and group info', () => {
//     describe('given a group id', () => {
//       it('should return a 200', async () => {
//         const groupId = '9';
//         await supertest(app)
//           .get(`/groups/info/` + groupId)
//           .expect(200);
//       });
//     });
//   });
// });

//GRAPH Tests
// describe('graphs', () => {
//   describe('route to get graphs for a group', () => {
//     describe('given group id', () => {
//       it('should return a 200', async () => {
//         const groupId = '9';
//         await supertest(app)
//           .get(`/graphs/` + groupId)
//           .expect(200);
//       });
//     });
//   });
// });

//MEASUREMENT Tests
// describe('measurements', () => {
//   describe('route to get measurements for a graph', () => {
//     describe('given group id', () => {
//       it('should return a 200', async () => {
//         const groupId = '9';
//         await supertest(app)
//           .get(`/measurements/` + groupId)
//           .expect(200);
//       });
//     });
//   });
// });