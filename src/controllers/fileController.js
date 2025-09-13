const File = require('../models/File');

// @desc    Get all file metadata for a specific device
// @route   GET /api/files/:deviceId
// @access  Private
const getFiles = async (req, res) => {
  // The middleware now handles filtering by deviceId from params
  // and any other query params like filePath
  if (req.query.path) {
    // The middleware needs to be aware of this specific logic
    // Let's adjust the middleware to handle regex on specific fields
    // For now, this controller logic is simplified, assuming middleware handles it.
    // The middleware already handles general query params, so a query like
    // ?filePath[regex]=^/DCIM&filePath[options]=i would work if we enhance it.
    // Let's simplify the controller and enhance the middleware later if needed.
  }
  res.status(200).json(res.advancedResults);
};

// @desc    Add file metadata
// @route   POST /api/files
// @access  Private
const addFile = async (req, res) => {
  const { deviceId, fileName, filePath, fileType, size, storageUrl } = req.body;

  if (!deviceId || !fileName || !filePath || !fileType || !size || !storageUrl) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const file = await File.create({
      deviceId,
      fileName,
      filePath,
      fileType,
      size,
      storageUrl,
    });
    res.status(201).json(file);
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ message: 'This file path already exists for this device.' });
      }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete file metadata
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
      if (!file) {
        return res.status(404).json({ message: 'File metadata not found' });
      }

      await file.deleteOne();

      res.status(200).json({ id: req.params.id, message: 'File metadata removed' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };

module.exports = {
  getFiles,
  addFile,
  deleteFile,
};
