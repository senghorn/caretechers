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

router.get('/search/:groupId/:searchString', [
	groupMiddleware.checkIfGroupExists,
	notesMiddleware.checkIfSearchIsValid,
	notesMiddleware.getNotesBySearchString,
	sharedMiddleware.sendResult
]);

module.exports = router;


// SCHEMA DEFINITION
  /**
 * @swagger
 * components:
 *   schemas:
 *     Notes:
 *       type: object
 *       required:
 *         - id
 *         - group_id
 *         - title
 *         - last_edited
 *       properties:
 *         id:
 *           type: integer
 *           description: The id of the note
 *         group_id:
 *           type: integer
 *           description: The group the note belongs to
*         title:
 *           type: string
 *           description: The title of the note
 *         content:
 *           type: string
 *           description: The content of the notes
 *         last_edited:
 *           type: datetime
 *           description: The date and time it was last edited
 *           example: 2023-02-01 03:53:28
 */

// Route Definitions

  /**
 * @swagger
 * tags:
 *   name: Notes
 * /notes/group/{groupId}:
 *   get:
 *     summary: Gets all notes for a group
 *     tags: [Notes]
 *     parameters: 
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the group the notes belong to
 *     responses:
 *       200:
 *         description: The list of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notes'
 *   post:
 *     summary: Creates a note
 *     tags: [Notes]
 *     parameters: 
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: The new note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notes'
 * /notes/{noteId}:
 *   get:
 *     summary: Gets a note based on its ID
 *     tags: [Notes]
 *     parameters: 
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: The new note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notes'
 *   patch:
 *     summary: Updates this note
 *     tags: [Notes]
 *     parameters: 
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notes'
 *   delete:
 *     summary: Deletes this note
 *     tags: [Notes]
 *     parameters: 
 *       - in: path
 *         name: noteId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: The DELETE was successful, no content returned
 * /notes/search/{groupId}/{searchString}:
 *   get:
 *     summary: Searches for a groups notes that contain searchString
 *     tags: [Notes]
 *     parameters: 
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: searchString
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A list of notes containing the searchString
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notes'
 */