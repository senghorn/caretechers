const express = require('express');

const groupMiddleware = require('../middlewares/groups');
const tasksMiddleware = require('../middlewares/tasks');
const sharedMiddleware = require('../middlewares/shared');

const router = express.Router();

router.get('/group/:groupId/task/:taskId', [
  groupMiddleware.checkIfGroupExists,
  tasksMiddleware.getTaskById,
  sharedMiddleware.sendResult,
]);

router.get('/:taskId/repeats', [tasksMiddleware.getTaskRepeats, sharedMiddleware.sendResult]);

router.get('/group/:groupId', [groupMiddleware.checkIfGroupExists, tasksMiddleware.getTasksByGroup, sharedMiddleware.sendResult]);

router.get('/group/:groupId/range', [
  groupMiddleware.checkIfGroupExists,
  tasksMiddleware.getTasksByDateRange,
  sharedMiddleware.sendResult,
]);

router.put('/:taskId', [tasksMiddleware.editTask, sharedMiddleware.sendResult]);

router.post('/group/:groupId', [
  groupMiddleware.checkIfGroupExists,
  tasksMiddleware.verifyTaskIsValid,
  tasksMiddleware.createTask,
  sharedMiddleware.sendNoResult,
]);

router.delete('/:taskId', [tasksMiddleware.deleteTask, sharedMiddleware.sendNoResult]);

module.exports = router;

// SCHEMA DEFINITION
  /**
 * @swagger
 * components:
 *   schemas:
 *     Tasks:
 *       type: object
 *       required:
 *         - id
 *         - group_id
 *         - title
 *         - start_date
 *       properties:
 *         id:
 *           type: integer
 *           description: The id of the task
 *         group_id:
 *           type: integer
 *           description: The group the task belongs to
*         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         start_date:
 *           type: date
 *           description: The date the task begins
 *           example: 1999-12-01
 *         end_date:
 *           type: date
 *           description: The date the task ends
 *           example: 1999-12-01
 */

// Route Definitions

  /**
 * @swagger
 * tags:
 *   name: Tasks
 * /tasks/group/{groupId}/task/{taskId}:
 *   get:
 *     summary: Gets a task by its ID
 *     tags: [Tasks]
 *     parameters: 
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: A single task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tasks'
 * /tasks/{taskId}/repeats:
 *   get:
 *     summary: Gets all instances of a repeating task
 *     tags: [Tasks]
 *     parameters: 
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: A single task
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tasks'
 * /tasks/group/{groupId}:
 *   get:
 *     summary: Gets all tasks that belong to this group
 *     tags: [Tasks]
 *     parameters: 
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: A List of tasks belonging to the group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tasks'
 *   post:
 *     summary: Creates a task
 *     tags: [Tasks]
 *     parameters: 
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               description:
 *                 type: string
 *               groupId:
 *                 type: integer
 *               repeat_pattern:
 *                 day_of_month:
 *                   type: integer
 *                 day_of_week:
 *                   type: integer
 *                 month_of_year:
 *                   type: integer
 *                 recurring_type:
 *                   type: string
 *                 separation_count:
 *                   type: integer
 *                 task_id:
 *                   type: integer
 *                 week_of_month:
 *                   type: integer
 *               start_date:
 *                 type: date
 *                 example: "1999-12-01"
 *               end_date:
 *                 type: date
 *                 example: "2023-12-27"
 *               title:
 *                 type: string
 *     responses:
 *       204:
 *         description: The POST was successful, no content returned
 * /tasks/{groupId}/range:
 *   get:
 *     summary: Gets all tasks for a group in a certain date range
 *     tags: [Tasks]
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tasks'
 * /tasks/{taskId}:
 *   put:
 *     summary: Updates this task
 *     tags: [Tasks]
 *     parameters: 
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               description:
 *                 type: string
 *               groupId:
 *                 type: integer
 *               repeat_pattern:
 *                 day_of_month:
 *                   type: integer
 *                 day_of_week:
 *                   type: integer
 *                 month_of_year:
 *                   type: integer
 *                 recurring_type:
 *                   type: string
 *                 separation_count:
 *                   type: integer
 *                 task_id:
 *                   type: integer
 *                 week_of_month:
 *                   type: integer
 *               start_date:
 *                 type: date
 *                 example: "1999-12-01"
 *               end_date:
 *                 type: date
 *                 example: "2023-12-27"
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tasks'
 *   delete:
 *     summary: Deletes this task
 *     tags: [Tasks]
 *     parameters: 
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: The DELETE was successful, no content returned
 */
