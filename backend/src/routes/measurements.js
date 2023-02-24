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
