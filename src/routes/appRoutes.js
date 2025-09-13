const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getInstalledApps,
  syncInstalledApps,
} = require('../controllers/appController');
const { protect } = require('../middlewares/authMiddleware');
const advancedResults = require('../middlewares/advancedResults');
const InstalledApp = require('../models/InstalledApp');

router.use(protect);

router.route('/')
    .get(advancedResults(InstalledApp), getInstalledApps);

router.route('/sync')
    .post(syncInstalledApps);

module.exports = router;
