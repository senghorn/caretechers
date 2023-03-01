const express = require('express')

const groupMiddleware = require('../middlewares/groups');
const sharedMiddleware = require('../middlewares/shared');

const router = express.Router();

router.post('/', [
	groupMiddleware.verifyGroupBody,
	groupMiddleware.createNewGroup,
	sharedMiddleware.sendResult
]);

router.get('/password/:groupId',[
	groupMiddleware.checkIfGroupExists,
	groupMiddleware.getGroupPassword,
	sharedMiddleware.sendResult
]);

router.patch('/passreset/:groupId',[
	groupMiddleware.checkIfGroupExists,
	groupMiddleware.resetPassword,
	groupMiddleware.getGroupPassword,
	sharedMiddleware.sendResult
]);

router.get('/info/:groupId',[
	groupMiddleware.checkIfGroupExists,
	groupMiddleware.getGroupInfo,
	sharedMiddleware.sendResult
]);

module.exports = router;

// SCHEMA DEFINITION
  /**
 * @swagger
 * components:
 *   schemas:
 *     Groups:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - visit_frequency
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the group
 *         name:
 *           type: string
 *           description: The name of the group
 *         visit_frequency:
 *           type: integer
 *           description: The frequency that the group wants to visit their elderly loved one
 *         timezone:
 *           type: string
 *           description: The timezone at which the elderly loved one lives
 *         password:
 *           type: string
 *           description: The password used to join the group
 */

// Route Definitions

  /**
 * @swagger
 * tags:
 *   name: Groups
 * /groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               groupid:
 *                 type: integer
 *                 example: 9
 *     responses:
 *       204:
 *         description: The POST was successful, no content returned
 * /groups/password/{groupId}:
 *   get:
 *     summary: Gets the group password
 *     tags: [Groups]
 *     parameters: 
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: The group password
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 password:
 *                   type: string
* /groups/passreset/{groupId}:
 *   patch:
 *     summary: Updates the group password
 *     tags: [Groups]
 *     parameters: 
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: The group password
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 password:
 *                   type: string
 */