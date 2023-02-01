const express = require('express')

const groupMiddleware = require('../middlewares/groups');
const messagesMiddleware = require('../middlewares/messages');
const sharedMiddleware = require('../middlewares/shared');

const router = express.Router();

router.get('/:groupId', [
	groupMiddleware.checkIfGroupExists,
	messagesMiddleware.getMessagesByGroup,
	sharedMiddleware.sendResult
]);

router.get('/users/:groupId', [
	groupMiddleware.checkIfGroupExists,
	messagesMiddleware.getUsersInGroup,
	sharedMiddleware.sendResult
]);

module.exports = router;