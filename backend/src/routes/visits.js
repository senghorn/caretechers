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

module.exports = router;
