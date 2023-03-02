const supertest = require('supertest');
const assert = require('assert');
const rest_app = require('../src/rest-server');

const app = rest_app.CreateRESTServer();

describe('groups', () => {
  describe('get groups route', () => {
    describe('given number of groups', () => {
      it('should return a 200', async () => {
        const groupId = '9';
        await supertest(app)
          .get(`/notes/group/` + groupId)
          .expect(200);
      });
    });
  });
});
