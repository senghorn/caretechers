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

router.get('/search/:groupId/:searchString', [
	groupMiddleware.checkIfGroupExists,
	messagesMiddleware.checkIfSearchIsValid,
	messagesMiddleware.getMessagesBySearchString,
	sharedMiddleware.sendResult
]);

module.exports = router;

// SCHEMA DEFINITION
  /**
 * @swagger
 * components:
 *   schemas:
 *     Messages:
 *       type: object
 *       required:
 *         - sender
 *         - date_time
 *       properties:
 *         sender:
 *           type: string
 *           description: The email of the person who sent it
 *         date_time:
 *           type: datetime
 *           description: The date and time it was sent
 *           example: 2023-02-01 03:53:28
 *         content:
 *           type: string
 *           description: The content of the message
 *         group_id:
 *           type: integer
 *           description: The group the sender belongs to
 */

// Route Definitions

  /**
 * @swagger
 * tags:
 *   name: Messages
 * /messages/{groupId}:
 *   get:
 *     summary: Gets all messages for a group
 *     tags: [Messages]
 *     parameters: 
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the group the messages belong to
 *     responses:
 *       200:
 *         description: The list of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Messages'
 * /messages/users/{groupId}:
 *   get:
 *     summary: Gets all users in a group
 *     tags: [Messages]
 *     parameters: 
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: The list of users
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 email:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 phone_num:
 *                   type: string
 *                 group_id:
 *                   type: integer
 *                 profile_pic:  
 *                   type: string    
 * /messages/search/{groupId}/{searchString}:
 *   get:
 *     summary: Gets all messages that contain the searchString
 *     tags: [Messages]
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
 *         description: The updated measurement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Messages'
 */