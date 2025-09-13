const express = require('express');
const router = express.Router();
const {
  getInstalledApps,
  syncInstalledApps,
} = require('../controllers/appController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/sync', syncInstalledApps);

router.get('/:deviceId', getInstalledApps);

module.exports = router;
