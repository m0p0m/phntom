const GalleryItem = require('../models/GalleryItem');
const Device = require('../models/Device');

// @desc    Get all gallery items for a device
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
  req.body.device = req.params.deviceId;

  const device = await Device.findById(req.params.deviceId);
  if (!device) {
    return res.status(404).json({ message: `Device not found with id of ${req.params.deviceId}` });
  }

  try {
    const item = await GalleryItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Error adding gallery item', error: error.message });
  }
};

module.exports = {
  getGalleryItems,
  addGalleryItem,
};
