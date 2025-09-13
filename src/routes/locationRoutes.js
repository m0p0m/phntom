const express = require('express');
const router = express.Router();
const {
  updateLocation,
  getLatestLocation,
} = require('../controllers/locationController');
const { protect } = require('../middlewares/authMiddleware');

// Protect all routes
router.use(protect);

router.route('/')
  .post(updateLocation);

router.route('/:deviceId')
  .get(getLatestLocation);

module.exports = router;
