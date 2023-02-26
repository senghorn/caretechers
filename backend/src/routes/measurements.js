const express = require("express");

const measurementMiddleware = require("../middlewares/measurements");
const graphMiddleware = require("../middlewares/graphs");
const sharedMiddleware = require("../middlewares/shared");

const router = express.Router();

router.post("/:graphId", [
    measurementMiddleware.createNewHealthMeasurement,
    sharedMiddleware.sendNoResult,
  ]);

router.get("/:graphId", [
    graphMiddleware.checkIfGraphExists,
	  measurementMiddleware.getMeasurementsByGraphId,
	  sharedMiddleware.sendResult
  ]);

router.delete('/:graphId/:timestamp', [
  graphMiddleware.checkIfGraphExists,
  measurementMiddleware.deleteMeasurement,
  sharedMiddleware.sendNoResult
]);

router.patch('/:graphId/:timestamp', [
  graphMiddleware.checkIfGraphExists,
	measurementMiddleware.updateMeasurement,
	measurementMiddleware.getMeasurementByDateAndGraphId,
	sharedMiddleware.sendResult
]);

module.exports = router;

// SCHEMA DEFINITION
  /**
 * @swagger
 * components:
 *   schemas:
 *     Measurements:
 *       type: object
 *       required:
 *         - date
 *         - measurement
 *         - graph_id
 *       properties:
 *         date:
 *           type: date
 *           description: The date this measurement was made
 *           example: 12-01-1999
 *         measurement:
 *           type: decimal
 *           description: The measurement
 *           example: 1.9
 *         graph_id:
 *           type: integer
 *           description: The graph this measurement belongs to
 */

// Route Definitions

  /**
 * @swagger
 * tags:
 *   name: Measurements
 * /measurements/{graphId}:
 *   post:
 *     summary: Create a new measurement
 *     tags: [Measurements]
 *     parameters: 
 *       - in: path
 *         name: graphId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the graph this measurement belongs to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               measurement:
 *                 type: decimal
 *                 example: 1.9
 *               date:
 *                 type: date
 *                 example: 12-01-1999
 *     responses:
 *       204:
 *         description: The POST was successful, no content returned
 *   get:
 *     summary: Gets all measurements for a graph
 *     tags: [Measurements]
 *     parameters: 
 *       - in: path
 *         name: graphId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the graph this measurement belongs to
 *     responses:
 *       200:
 *         description: The list of measurements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Measurements'
 * /measurements/{graphId}/{timestamp}:
 *   delete:
 *     summary: Deletes this measurement
 *     tags: [Measurements]
 *     parameters: 
 *       - in: path
 *         name: graphId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the graph this measurement belongs to
 *       - in: path
 *         name: timestamp
 *         schema:
 *           type: date
 *         required: true
 *         description: Date of this measurement
 *     responses:
 *       204:
 *         description: The DELETE was successful, no content returned
 *   patch:
 *     summary: Updates this measurement
 *     tags: [Measurements]
 *     parameters: 
 *       - in: path
 *         name: graphId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the graph this measurement belongs to
 *       - in: path
 *         name: timestamp
 *         schema:
 *           type: date
 *         required: true
 *         description: Date of this measurement
 *     responses:
 *       200:
 *         description: The updated measurement
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Measurements'
 */
