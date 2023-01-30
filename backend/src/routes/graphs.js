const express = require("express");

const graphMiddleware = require("../middlewares/graphs");
const sharedMiddleware = require("../middlewares/shared");

const router = express.Router();

router.post("/", [
    graphMiddleware.verifyCreateHealthGraph,
    graphMiddleware.createNewHealthGraph,
    sharedMiddleware.sendNoResult,
  ]);

  module.exports = router;