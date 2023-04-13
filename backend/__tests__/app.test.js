const supertest = require('supertest');
const assert = require('assert');
const rest_app = require('../src/rest-server');
const token = require('./token');
const app = rest_app.CreateRESTServer();


//NOTES Tests
describe('notes', () => {
  const groupId = '1';
  const noteId = '114'
  const searchString = 'Test';
  describe('get notes route', () => {
    it('given group id', async () => {

      await supertest(app)
        .get(`/notes/group/` + groupId)
        .expect(200);
    });

    it('given existing note id', async () => {
      await supertest(app)
        .get(`/notes/` + noteId)
        .expect(200);
    });

    it('given group id and string', async () => {
      await supertest(app)
        .get(`/notes/search/${groupId}/` + searchString)
        .expect(200);
    })

  });
});

//GROUP Tests
describe('groups', () => {
  describe('gets a groups password', () => {
    describe('given group id', () => {
      it('should return a 200', async () => {
        const groupId = '9';
        await supertest(app)
          .get(`/groups/password/` + groupId)
          .expect(200);
      });
    });
  });

  describe('get user and group info', () => {
    describe('given a group id', () => {
      it('should return a 200', async () => {
        const groupId = '9';
        await supertest(app)
          .get(`/groups/info/` + groupId)
          .expect(200);
      });
    });
  });
});

//GRAPH Tests
describe('graphs', () => {
  describe('route to get graphs for a group', () => {
    describe('given group id', () => {
      it('should return a 200', async () => {
        const groupId = '9';
        await supertest(app)
          .get(`/graphs/` + groupId)
          .expect(200);
      });
    });
  });
});

//MEASUREMENT Tests
describe('measurements', () => {
  describe('route to get measurements for a graph', () => {
    describe('given group id', () => {
      it('should return a 200', async () => {
        const groupId = '9';
        await supertest(app)
          .get(`/measurements/` + groupId)
          .expect(200);
      });
    });
  });
});