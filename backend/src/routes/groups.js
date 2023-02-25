const express = require('express')

const groupMiddleware = require('../middlewares/groups');
const sharedMiddleware = require('../middlewares/shared');

const router = express.Router();

router.post('/', [
	groupMiddleware.verifyGroupBody,
	groupMiddleware.createNewGroup,
	sharedMiddleware.sendResult
]);

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
 *             $ref: '#/components/schemas/Group'
 *     responses:
 *       204:
 *         description: The POST was successful, no content returned
 *       400:
 *         description: Body is formatted incorrectly
 *
 */

router.get('/:limit',[
	groupMiddleware.getGroups,
	sharedMiddleware.sendResult
]);
// testing fdajfljdalfdjal;fljs
module.exports = router;

  /**
 * @swagger
 * components:
 *   schemas:
 *     Group:
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