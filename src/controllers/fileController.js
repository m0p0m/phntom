const File = require('../models/File');

// @desc    Get all file metadata for a specific device
// @route   GET /api/files/:deviceId
// @access  Private
const getFiles = async (req, res) => {
  try {
    // Add filtering by path if provided as a query parameter
    const query = { deviceId: req.params.deviceId };
    if (req.query.path) {
      // Use a regex to find all files within a certain directory path
      query.filePath = { $regex: `^${req.query.path}`, $options: 'i' };
    }

    const files = await File.find(query).sort({ filePath: 1, fileName: 1 });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
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
