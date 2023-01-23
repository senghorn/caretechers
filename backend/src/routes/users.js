const express = require('express')

const usersMiddleware = require('../middlewares/users');
const sharedMiddleware = require('../middlewares/shared');

const router = express.Router();

router.get('/group/',[
	sharedMiddleware.sendResult
]);

router.post('/user/', [

	sharedMiddleware.sendNoResult
]);

module.exports = router; 