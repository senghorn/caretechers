const { Router } = require('express');

const visitsMiddleware = require('../middlewares/visits');
const groupMiddleware = require('../middlewares/groups');
const sharedMiddleware = require('../middlewares/shared');

const router = Router();

router.get('/group/:groupId', [
  groupMiddleware.checkIfGroupExists,
  visitsMiddleware.getTasksByDateRange,
  sharedMiddleware.sendResult,
]);

module.exports = router;
