const File = require('../models/File');

const Device = require('../models/Device');

// @desc    Get all file metadata for a specific device
// @route   GET /api/devices/:deviceId/files
// @access  Private
const getFiles = async (req, res) => {
  res.status(200).json(res.advancedResults);
};

// @desc    Add file metadata for a specific device
// @route   POST /api/devices/:deviceId/files
// @access  Private
const addFile = async (req, res) => {
  const { fileName, filePath, fileType, size, storageUrl } = req.body;
  const { deviceId } = req.params;

  if (!fileName || !filePath || !fileType || !size || !storageUrl) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const device = await Device.findById(deviceId);
    if (!device) {
        return res.status(404).json({ message: 'Device not found' });
    }

    const file = await File.create({
      device: deviceId,
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

const upload = require('../config/upload');

const uploadFile = (req, res) => {
    upload(req, res, async (err) => {
        if(err){
            return res.status(400).json({ message: err });
        }
        if(req.file == undefined){
            return res.status(400).json({ message: 'Error: No File Selected!' });
        }

        const { deviceId } = req.params;
        const { originalname, mimetype, size, path: filePathOnServer } = req.file;

        try {
            const device = await Device.findById(deviceId);
            if (!device) {
                return res.status(404).json({ message: 'Device not found' });
            }

            const fileMetadata = await File.create({
                device: deviceId,
                fileName: originalname,
                // We'll use the server path as the 'filePath' for now
                // In a real system, this might be different
                filePath: `/${originalname}`,
                fileType: mimetype,
                size: size,
                // The URL to access the file on our server
                storageUrl: `/uploads/${req.file.filename}`
            });

            res.status(201).json({
                message: 'File uploaded successfully',
                file: fileMetadata
            });

        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    });
};

module.exports = {
  getFiles,
  addFile,
  deleteFile,
  uploadFile,
};
