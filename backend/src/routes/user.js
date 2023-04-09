const express = require('express');

const userMiddleware = require('../middlewares/user');
const sharedMiddleware = require('../middlewares/shared');

const router = express.Router();

router.get('/:userId', [userMiddleware.getUserByID, sharedMiddleware.sendResult]);

router.post('/:userId/group', [userMiddleware.verifyUserExists, userMiddleware.addUserToGroup, sharedMiddleware.sendNoResult]);

router.post('/', [userMiddleware.verifyCreateUserBody, userMiddleware.createNewUser, sharedMiddleware.sendNoResult]);

router.get('/groups/:userId', [userMiddleware.getAllUserGroups, sharedMiddleware.sendResult]);

router.get('/currentGroup/:userId', [userMiddleware.getUserCurrGroupByID, sharedMiddleware.sendResult]);

router.patch('/currentGroup/:userId', [userMiddleware.setUserCurrGroup, sharedMiddleware.sendNoResult]);

router.get('/fetch/userInfo', [userMiddleware.getUserByToken, sharedMiddleware.sendResult]);

router.patch('/:userId', [userMiddleware.verifyCreateUserBody, userMiddleware.editUser, sharedMiddleware.sendNoResult]);

router.delete('/:userId/:groupId', [userMiddleware.removeUserFromGroup, sharedMiddleware.sendNoResult]);

router.put('/:userId/identifier', [userMiddleware.setUserNotificationIdentifier, sharedMiddleware.sendNoResult]);

router.post('/:userId/group/join', [userMiddleware.verifyUserExists, userMiddleware.addUserToGroupWithNameAndPassword, sharedMiddleware.sendNoResult]);

router.patch('/adminStatus/:userId', [userMiddleware.verifyUserExists, userMiddleware.changeUserAdminStatus, sharedMiddleware.sendNoResult]);

router.get('/adminStatus/:userId', [userMiddleware.verifyUserExists, userMiddleware.getUserAdminStatus, sharedMiddleware.sendResult]);

module.exports = router;

// SCHEMA DEFINITION
/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - email
 *         - first_name
 *         - last_name
 *         - phone_num
 *       properties:
 *         email:
 *           type: string
 *           description: The users email
 *         first_name:
 *           type: string
 *           description: The users first name
 *         last_name:
 *           type: string
 *           description: The users last name
 *         phone_num:
 *           type: string
 *           description: The users phone number
 *         group_id:
 *           type: integer
 *           description: The id of the group the user belongs to
 *         profile_pic:
 *           type: string
 *           description: A link to the users profile picture
 */

// Route Definitions

/**
 * @swagger
 * tags:
 *   name: Users
 * /users/{userId}:
 *   get:
 *     summary: Gets a user by their email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *   patch:
 *     summary: Updates a users info
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNum:
 *                 type: string
 *               groupId:
 *                 type: integer
 *               profilePic:
 *                 type: string
 *     responses:
 *       204:
 *         description: The PATCH was successful, no content returned
 * /users/{userId}/group:
 *   post:
 *     summary: Add a user to a group
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               groupId:
 *                 type: integer
 *     responses:
 *       204:
 *         description: The POST was successful, no content returned
 * /users:
 *   post:
 *     summary: Creates a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNum:
 *                 type: string
 *               groupId:
 *                 type: integer
 *               profilePic:
 *                 type: string
 *     responses:
 *       204:
 *         description: The POST was successful, no content returned
 * /users/groupId/{userId}:
 *   get:
 *     summary: Gets a user to find their groupId
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: The user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 * /users/{userId}/{groupId}:
 *   delete:
 *     summary: Removes this user from their group
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: The DELETE was successful, no content returned
 */
