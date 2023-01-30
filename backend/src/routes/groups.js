const express = require('express')

const groupMiddleware = require('../middlewares/groups');
const sharedMiddleware = require('../middlewares/shared');

const router = express.Router();

router.post('/', [
	groupsMiddleware.verifyGroupBody,
	groupsMiddleware.createNewGroup,
	sharedMiddleware.sendResult
]);

router.get('/:limit',[
	groupMiddleware.getGroups,
	sharedMiddleware.sendResult
]);

module.exports = router;
