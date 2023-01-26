const express = require("express");

const userMiddleware = require("../middlewares/user");
const sharedMiddleware = require("../middlewares/shared");

const router = express.Router();

router.get("/:userId", [
  userMiddleware.getUserByID,
  sharedMiddleware.sendResult,
]);

router.post("/:userId/group", [
  userMiddleware.verifyUserExists,
  userMiddleware.addUserToGroup,
  sharedMiddleware.sendNoResult,
]);

router.post("/", [
  userMiddleware.verifyCreateUserBody,
  userMiddleware.createNewUser,
  sharedMiddleware.sendNoResult,
]);

router.get("/groupId/:userId", [
  userMiddleware.getUserGroupByID,
  sharedMiddleware.sendResult,
]);

module.exports = router;
