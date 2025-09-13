const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getGalleryItems,
  addGalleryItem,
} = require('../controllers/galleryController');
const { protect } = require('../middlewares/authMiddleware');

// Protect all routes
router.use(protect);

router.route('/')
  .post(addGalleryItem);

const GalleryItem = require('../models/GalleryItem');
const advancedResults = require('../middlewares/advancedResults');

router.route('/:deviceId')
  .get(advancedResults(GalleryItem), getGalleryItems);

module.exports = router;
