const express = require("express");

const measurementMiddleware = require("../middlewares/measurements");
const sharedMiddleware = require("../middlewares/shared");

const router = express.Router();

router.post("/:graphId", [
    measurementMiddleware.createNewHealthMeasurement,
    sharedMiddleware.sendNoResult,
  ]);

  module.exports = router;