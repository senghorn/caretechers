
const express = require("express");

const graphMiddleware = require("../middlewares/graphs");
const groupMiddleware = require("../middlewares/groups");
const sharedMiddleware = require("../middlewares/shared");

const router = express.Router();

router.post("/", [
    graphMiddleware.verifyCreateHealthGraph,
    graphMiddleware.createNewHealthGraph,
    sharedMiddleware.sendNoResult,
  ]);

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
 *             $ref: '#/components/schemas/Graph'
 *     responses:
 *       204:
 *         description: The POST was successful, no content returned
 *       400:
 *         description: Body is formatted incorrectly
 *
 */

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

  /**
 * @swagger
 * components:
 *   schemas:
 *     Graph:
 *       type: object
 *       required:
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
 *           description: The graph title
 *         units:
 *           type: string
 *           description: The units of the graph (e.g. bpm, farenheit)
 */

