const express = require('express');
const router = express.Router();
const {
  getDevices,
  registerDevice,
  deviceHeartbeat,
} = require('../controllers/deviceController');
const { protect } = require('../middlewares/authMiddleware');
const socketInjector = require('../middlewares/socketInjector');

// Protect all routes and inject socket.io
router.use(protect, socketInjector);

router.route('/')
  .get(getDevices);

router.route('/register')
  .post(registerDevice);

router.route('/heartbeat')
  .post(deviceHeartbeat);

module.exports = router;
