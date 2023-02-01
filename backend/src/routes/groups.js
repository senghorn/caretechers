const express = require('express')

const groupMiddleware = require('../middlewares/groups');
const sharedMiddleware = require('../middlewares/shared');

const router = express.Router();

router.post('/', [
	groupMiddleware.verifyGroupBody,
	groupMiddleware.createNewGroup,
	sharedMiddleware.sendResult
]);

router.get('/:limit',[
	groupMiddleware.getGroups,
	sharedMiddleware.sendResult
]);
// testing fdajfljdalfdjal;fljs
module.exports = router;
