const express = require('express')

const groupsMiddleware = require('../middlewares/groups');
const sharedMiddleware = require('../middlewares/shared');

const router = express.Router();

router.post('/', [
	groupsMiddleware.verifyGroupBody,
	groupsMiddleware.createNewGroup,
	sharedMiddleware.sendResult
]);

module.exports = router;
