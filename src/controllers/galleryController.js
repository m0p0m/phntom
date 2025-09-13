const GalleryItem = require('../models/GalleryItem');

// @desc    Get all gallery items for a specific device
// @route   GET /api/gallery/:deviceId
// @access  Private
const getGalleryItems = async (req, res) => {
  res.status(200).json(res.advancedResults);
};

// @desc    Add a gallery item
// @route   POST /api/gallery
// @access  Private
const addGalleryItem = async (req, res) => {
  const { deviceId, imageUrl, caption, takenAt, sourceApp } = req.body;

  if (!deviceId || !imageUrl) {
    return res.status(400).json({ message: 'Please provide a deviceId and imageUrl' });
  }

  try {
    const item = await GalleryItem.create({
      deviceId,
      imageUrl,
      caption,
      takenAt,
      sourceApp,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getGalleryItems,
  addGalleryItem,
};
