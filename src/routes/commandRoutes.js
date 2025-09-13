const express = require('express');
const router = express.Router();
const {
  queueCommand,
  getPendingCommands,
  updateCommandStatus,
} = require('../controllers/commandController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

// Admin queues a command for a device
router.post('/:deviceId', queueCommand);

// Device fetches its pending commands
router.get('/:deviceId/pending', getPendingCommands);

// Device updates a command's status
router.put('/:commandId', updateCommandStatus);


module.exports = router;
