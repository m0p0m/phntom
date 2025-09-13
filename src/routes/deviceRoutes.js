const express = require('express');
const router = express.Router();

// Middleware
const { protect } = require('../middlewares/authMiddleware');
const socketInjector = require('../middlewares/socketInjector');
const advancedResults = require('../middlewares/advancedResults');

// Models
const Device = require('../models/Device');
const Contact = require('../models/Contact');
const GalleryItem = require('../models/GalleryItem');
const File = require('../models/File');
const CallLog = require('../models/CallLog');
const InstalledApp = require('../models/InstalledApp');

// Controllers
const { getDevices, registerDevice, deviceHeartbeat } = require('../controllers/deviceController');
const { getContacts, createContact } = require('../controllers/contactController');
const { getGalleryItems, addGalleryItem } = require('../controllers/galleryController');
const { getFiles, addFile, uploadFile } = require('../controllers/fileController');
const { getCallLogs, addCallLog } = require('../controllers/callLogController');
const { getInstalledApps, syncInstalledApps } = require('../controllers/appController');

// Protect all device routes and inject socket
router.use(protect, socketInjector);

// Main device routes
router.route('/').get(getDevices);
router.route('/register').post(registerDevice);
router.route('/heartbeat').post(deviceHeartbeat);

// --- Nested Routes ---

// Contacts
router.route('/:deviceId/contacts')
  .get(advancedResults(Contact, { path: 'device', select: 'deviceName' }), getContacts)
  .post(createContact);

// Gallery
router.route('/:deviceId/gallery')
  .get(advancedResults(GalleryItem, { path: 'device', select: 'deviceName' }), getGalleryItems)
  .post(addGalleryItem);

// Files
router.route('/:deviceId/files')
  .get(advancedResults(File, { path: 'device', select: 'deviceName' }), getFiles)
  .post(addFile);
router.route('/:deviceId/files/upload').post(uploadFile);

// Call Logs
router.route('/:deviceId/call-logs')
  .get(advancedResults(CallLog, { path: 'device', select: 'deviceName' }), getCallLogs)
  .post(addCallLog);

// Installed Apps
router.route('/:deviceId/apps')
  .get(advancedResults(InstalledApp, { path: 'device', select: 'deviceName' }), getInstalledApps)
router.route('/:deviceId/apps/sync').post(syncInstalledApps);


module.exports = router;
