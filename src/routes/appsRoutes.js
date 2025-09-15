const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('../middlewares/authMiddleware');
const socketInjector = require('../middlewares/socketInjector');
const advancedResults = require('../middlewares/advancedResults');

const InstalledApp = require('../models/InstalledApp');
const { getInstalledApps, syncInstalledApps } = require('../controllers/appController');

router.use(protect, socketInjector);

router.route('/')
  .get(advancedResults(InstalledApp, { path: 'device', select: 'deviceName' }), getInstalledApps);

router.route('/sync')
  .post(syncInstalledApps);

module.exports = router;
