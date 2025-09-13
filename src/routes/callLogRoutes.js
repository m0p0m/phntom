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

router.route('/:deviceId')
  .get(getCallLogs);

module.exports = router;
