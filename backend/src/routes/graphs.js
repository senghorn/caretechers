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

  router.get("/:groupId", [
    groupMiddleware.checkIfGroupExists,
	  graphMiddleware.getGraphsByGroupId,
	  sharedMiddleware.sendResult
  ]);

  module.exports = router;