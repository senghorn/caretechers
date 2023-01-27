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

router.post('/group/:groupId',[
	groupMiddleware.checkIfGroupExists,
	notesMiddleware.checkIfNoteIsValid,
	notesMiddleware.createNewNote,
	sharedMiddleware.sendResult
]);

router.get('/:noteId',[
	notesMiddleware.getNoteByNoteId,
	sharedMiddleware.sendResult
]);

router.patch('/:noteId', [
	notesMiddleware.checkIfNoteExists,
	notesMiddleware.updateNote,
	notesMiddleware.getNoteByNoteId,
	sharedMiddleware.sendResult
]);

router.delete('/:noteId', [
	notesMiddleware.deleteNote,
	sharedMiddleware.sendNoResult
]);

module.exports = router;