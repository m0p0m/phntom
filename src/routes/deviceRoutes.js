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

// Re-route into other resource routers
const contactRouter = require('./contactRoutes');
const galleryRouter = require('./galleryRoutes');
const fileRouter = require('./fileRoutes');

router.use('/:deviceId/contacts', contactRouter);
router.use('/:deviceId/gallery', galleryRouter);
router.use('/:deviceId/files', fileRouter);

const callLogRouter = require('./callLogRoutes');
router.use('/:deviceId/call-logs', callLogRouter);

const appRouter = require('./appRoutes');
router.use('/:deviceId/apps', appRouter);

module.exports = router;
