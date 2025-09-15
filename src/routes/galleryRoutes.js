const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('../middlewares/authMiddleware');
const socketInjector = require('../middlewares/socketInjector');
const advancedResults = require('../middlewares/advancedResults');

const GalleryItem = require('../models/GalleryItem');
const { getGalleryItems, addGalleryItem } = require('../controllers/galleryController');

router.use(protect, socketInjector);

router.route('/')
  .get(advancedResults(GalleryItem, { path: 'device', select: 'deviceName' }), getGalleryItems)
  .post(addGalleryItem);

module.exports = router;
