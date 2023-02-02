const express = require('express');

const groupMiddleware = require('../middlewares/groups');
const tasksMiddleware = require('../middlewares/tasks');
const sharedMiddleware = require('../middlewares/shared');

const router = express.Router();

router.get('/group/:groupId/task/:taskId', [
  groupMiddleware.checkIfGroupExists,
  tasksMiddleware.getTaskById,
  sharedMiddleware.sendResult,
]);

router.get('/:taskId/repeats', [tasksMiddleware.getTaskRepeats, sharedMiddleware.sendResult]);

router.get('/group/:groupId', [groupMiddleware.checkIfGroupExists, tasksMiddleware.getTasksByGroup, sharedMiddleware.sendResult]);

router.get('/group/:groupId/range', [
  groupMiddleware.checkIfGroupExists,
  tasksMiddleware.getTasksByDateRange,
  sharedMiddleware.sendResult,
]);

router.post('/group/:groupId', [
  groupMiddleware.checkIfGroupExists,
  tasksMiddleware.verifyTaskIsValid,
  tasksMiddleware.createNewTask2,
  sharedMiddleware.sendNoResult,
]);

router.delete('/:taskId', [tasksMiddleware.deleteTask, sharedMiddleware.sendNoResult]);

module.exports = router;
