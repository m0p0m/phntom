const express = require('express');
const router = express.Router();
const {
  getGalleryItems,
  addGalleryItem,
} = require('../controllers/galleryController');
const { protect } = require('../middlewares/authMiddleware');

// Protect all routes
router.use(protect);

router.route('/')
  .post(addGalleryItem);

router.route('/:deviceId')
  .get(getGalleryItems);

module.exports = router;
