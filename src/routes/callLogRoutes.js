const express = require('express');
const router = express.Router();
const {
  getCallLogs,
  addCallLog,
} = require('../controllers/callLogController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(addCallLog);

const CallLog = require('../models/CallLog');
const advancedResults = require('../middlewares/advancedResults');

router.route('/:deviceId')
  .get(advancedResults(CallLog), getCallLogs);

module.exports = router;
