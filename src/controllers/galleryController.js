const GalleryItem = require('../models/GalleryItem');

// @desc    Get all gallery items for a specific device
// @route   GET /api/gallery/:deviceId
// @access  Private
const Device = require('../models/Device');

// @desc    Get all gallery items for a specific device
// @route   GET /api/devices/:deviceId/gallery
// @access  Private
const getGalleryItems = async (req, res) => {
  res.status(200).json(res.advancedResults);
};

// @desc    Add a gallery item for a specific device
// @route   POST /api/devices/:deviceId/gallery
// @access  Private
const addGalleryItem = async (req, res) => {
  const { imageUrl, caption, takenAt, sourceApp } = req.body;
  const { deviceId } = req.params;

  if (!imageUrl) {
    return res.status(400).json({ message: 'Please provide an imageUrl' });
  }

  try {
    const device = await Device.findById(deviceId);
    if (!device) {
        return res.status(404).json({ message: 'Device not found' });
    }

    const item = await GalleryItem.create({
      device: deviceId,
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
