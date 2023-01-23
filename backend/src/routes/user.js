const express = require('express')

const userMiddleware = require('../middlewares/user');
const sharedMiddleware = require('../middlewares/shared');

const router = express.Router();

router.get('/',[
	sharedMiddleware.sendResult
]);

router.post('/', [
	userMiddleware.verifyCreateUserBody,
	userMiddleware.createNewUser,
	sharedMiddleware.sendNoResult
]);

module.exports = router;
