const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
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
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');
const { getGalleryItems, addGalleryItem } = require('../controllers/galleryController');
const { getFiles, addFile, uploadFile, deleteFile } = require('../controllers/fileController');
const { getCallLogs, addCallLog } = require('../controllers/callLogController');
const { getInstalledApps, syncInstalledApps } = require('../controllers/appController');
const { updateLocation, getLatestLocation } = require('../controllers/locationController');

const createDeviceRouter = (io) => {
  const router = express.Router();

  // Protect all device routes
  router.use(protect);

  // Main device routes
  router.route('/').get(getDevices);
  router.route('/register').post(registerDevice(io));
  router.route('/heartbeat').post(deviceHeartbeat(io));

// --- Nested Routes ---

// Contacts
router.route('/:deviceId/contacts')
  .get(advancedResults(Contact, { path: 'device', select: 'deviceName' }), getContacts)
  .post(createContact);

router.route('/:deviceId/contacts/:contactId')
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

// Gallery
router.route('/:deviceId/gallery')
  .get(advancedResults(GalleryItem, { path: 'device', select: 'deviceName' }), getGalleryItems)
  .post(addGalleryItem);

// Files
router.route('/:deviceId/files')
  .get(advancedResults(File, { path: 'device', select: 'deviceName' }), getFiles)
  .post(addFile);
router.route('/:deviceId/files/upload').post(uploadFile);
router.route('/:deviceId/files/:fileId').delete(deleteFile);

// Call Logs
router.route('/:deviceId/call-logs')
  .get(advancedResults(CallLog, { path: 'device', select: 'deviceName' }), getCallLogs)
  .post(addCallLog);

// Installed Apps
router.route('/:deviceId/apps')
  .get(advancedResults(InstalledApp, { path: 'device', select: 'deviceName' }), getInstalledApps)
router.route('/:deviceId/apps/sync').post(syncInstalledApps);

// Location
router.route('/:deviceId/location')
  .get(getLatestLocation)
  .post(updateLocation);


  return router;
};

module.exports = createDeviceRouter;
