const express = require('express');
const router = express.Router();

// Middleware
const { protect } = require('../middlewares/authMiddleware');
const socketInjector = require('../middlewares/socketInjector');

// Controllers
const { getDevices, registerDevice, deviceHeartbeat } = require('../controllers/deviceController');

// Nested Routers
const appsRoutes = require('./appsRoutes');
const callLogRoutes = require('./callLogRoutes');
const galleryRoutes = require('./galleryRoutes');
const deviceFileRoutes = require('./deviceFileRoutes');
const deviceContactRoutes = require('./deviceContactRoutes');
// Note: Command routes are not nested under a device in the same way, they are separate.
// This is because a command can be fetched by its own ID without device context.
const deviceCommandRoutes = require('./deviceCommandRoutes');

// Protect all device routes and inject socket
router.use(protect, socketInjector);

// Main device routes
router.route('/').get(getDevices);
router.route('/register').post(registerDevice);
router.route('/heartbeat').post(deviceHeartbeat);

// --- Mount Nested Routers ---
router.use('/:deviceId/apps', appsRoutes);
router.use('/:deviceId/call-logs', callLogRoutes);
router.use('/:deviceId/gallery', galleryRoutes);
router.use('/:deviceId/files', deviceFileRoutes);
router.use('/:deviceId/contacts', deviceContactRoutes);
router.use('/:deviceId/commands', deviceCommandRoutes);

module.exports = router;
