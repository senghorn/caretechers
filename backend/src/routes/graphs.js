
const express = require("express");

const graphMiddleware = require("../middlewares/graphs");
const groupMiddleware = require("../middlewares/groups");
const sharedMiddleware = require("../middlewares/shared");

const router = express.Router();

router.post("/", [
    graphMiddleware.verifyCreateHealthGraph,
    graphMiddleware.createNewHealthGraph,
    sharedMiddleware.sendResult,
  ]);

  router.get("/:groupId", [
    groupMiddleware.checkIfGroupExists,
	  graphMiddleware.getGraphsByGroupId,
	  sharedMiddleware.sendResult
  ]);

  router.delete('/:graphId', [
    graphMiddleware.deleteGraph,
    sharedMiddleware.sendNoResult
  ]);

  router.patch('/:graphId', [
    graphMiddleware.checkIfGraphExists,
    graphMiddleware.updateGraph,
    graphMiddleware.getGraphByGraphId,
    sharedMiddleware.sendResult
  ]);

  module.exports = router;

// SCHEMA DEFINITION
  /**
 * @swagger
 * components:
 *   schemas:
 *     Graphs:
 *       type: object
 *       required:
 *         - id
 *         - group_id
 *         - title
 *         - units
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the graph
 *         group_id:
 *           type: integer
 *           description: The id of the group that owns the graph
 *         title:
 *           type: string
 *           description: The title of the graph
 *         units:
 *           type: string
 *           description: The units of the graph
 */

// Route Definitions

  /**
 * @swagger
 * tags:
 *   name: Graphs
 * /graphs:
 *   post:
 *     summary: Create a new graph
 *     tags: [Graphs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               groupid:
 *                 type: integer
 *                 example: 9
 *               title:
 *                 type: string
 *                 example: Heart rate
 *               units:
 *                 type: string
 *                 example: bpm
 *     responses:
 *       204:
 *         description: The POST was successful, no content returned
 * /graphs/{groupId}:
 *   get:
 *     summary: Gets all graphs for the group
 *     tags: [Graphs]
 *     parameters: 
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the group owning the graphs
 *     responses:
 *       200:
 *         description: The list of Graphs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Graphs'
 * /graphs/{graphId}:
 *   delete:
 *     summary: Deletes this graph
 *     tags: [Graphs]
 *     parameters: 
 *       - in: path
 *         name: graphId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: The DELETE was successful, no content returned
 *   patch:
 *     summary: Updates this graph
 *     tags: [Graphs]
 *     parameters: 
 *       - in: path
 *         name: graphId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: The updated Graph
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Graphs'
 */

