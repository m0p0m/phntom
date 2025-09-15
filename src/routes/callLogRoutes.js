const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('../middlewares/authMiddleware');
const socketInjector = require('../middlewares/socketInjector');
const advancedResults = require('../middlewares/advancedResults');

const CallLog = require('../models/CallLog');
const { getCallLogs, addCallLog } = require('../controllers/callLogController');

router.use(protect, socketInjector);

router.route('/')
  .get(advancedResults(CallLog, { path: 'device', select: 'deviceName' }), getCallLogs)
  .post(addCallLog);

module.exports = router;
