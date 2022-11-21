const express = require('express')

const groupMiddleware = require('../middlewares/groups');
const notesMiddleware = require('../middlewares/notes');
const sharedMiddleware = require('../middlewares/shared');

const router = express.Router();

router.get('/group/:groupId',[
	groupMiddleware.checkIfGroupExists,
	notesMiddleware.getNotesByGroupId,
	sharedMiddleware.sendResult
]);

router.get('/:noteId',[
	notesMiddleware.getNoteByNoteId,
	sharedMiddleware.sendResult
]);

module.exports = router;