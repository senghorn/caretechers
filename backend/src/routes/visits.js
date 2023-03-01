const { Router } = require('express');

const visitsMiddleware = require('../middlewares/visits');
const groupMiddleware = require('../middlewares/groups');
const sharedMiddleware = require('../middlewares/shared');

const router = Router();

router.post('/group/:groupId', [groupMiddleware.checkIfGroupExists, visitsMiddleware.createVisit, sharedMiddleware.sendResult]);

router.get('/group/:groupId', [
  groupMiddleware.checkIfGroupExists,
  visitsMiddleware.getVisitsByDateRange,
  sharedMiddleware.sendResult,
]);

router.delete('/:visitId', [visitsMiddleware.deleteVisit, sharedMiddleware.sendNoResult]);

router.post('/:visitId/record', [visitsMiddleware.recordVisit, sharedMiddleware.sendNoResult]);

router.put('/:visitId/identifier', [visitsMiddleware.setVisitIdentifier, sharedMiddleware.sendNoResult]);

module.exports = router;

// SCHEMA DEFINITION
/**
 * @swagger
 * components:
 *   schemas:
 *     Visits:
 *       type: object
 *       required:
 *         - id
 *         - date
 *         - visitor
 *         - completed
 *         - group_id
 *       properties:
 *         id:
 *           type: integer
 *           description: The id of the vist
 *         group_id:
 *           type: integer
 *           description: The group the visit belongs to
 *         date:
 *           type: date
 *           description: The date the visit is scheduled for
 *           example: 1999-12-01
 *         visitor:
 *           type: string
 *           description: The email of the person who is assigned to visit
 *         completed:
 *           type: boolean
 *           description: Whether or not the visit happened
 *           example: True
 *         visit_notes:
 *           type: string
 *           description: Notes about the visit
 */

// Route Definitions

/**
 * @swagger
 * tags:
 *   name: Visits
 * /visits/group/{groupId}:
 *   get:
 *     summary: Gets all visits for a group in a date range
 *     tags: [Visits]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: The list of visits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Visits'
 *   post:
 *     summary: Creates a visit
 *     tags: [Visits]
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
 *               date:
 *                 type: date
 *                 example: 1999-12-01
 *               userEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: The new note
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Visits'
 */
