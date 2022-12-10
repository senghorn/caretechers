const express = require('express')

const groupMiddleware = require('../middlewares/groups');
const tasksMiddleware = require('../middlewares/tasks');
const sharedMiddleware = require('../middlewares/shared');

const router = express.Router();

router.get('/group/:groupId',[
	groupMiddleware.checkIfGroupExists,
	tasksMiddleware.getTasksByGroup,
	sharedMiddleware.sendResult
]);

router.post('/group/:groupId', [
	groupMiddleware.checkIfGroupExists,
	tasksMiddleware.verifyTaskIsValid,
	tasksMiddleware.createNewTask,
	sharedMiddleware.sendNoResult
]);

module.exports = router;