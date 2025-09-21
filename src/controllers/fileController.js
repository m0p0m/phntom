const File = require('../models/File');
const Device = require('../models/Device');
const upload = require('../config/upload');

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
  req.body.device = req.params.deviceId;

  const device = await Device.findById(req.params.deviceId);
  if (!device) {
      return res.status(404).json({ message: 'Device not found' });
  }

  try {
    const file = await File.create(req.body);
    res.status(201).json(file);
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ message: 'This file path already exists for this device.' });
      }
    res.status(400).json({ message: 'Error adding file metadata', error: error.message });
  }
};

const fs = require('fs');
const path = require('path');

// @desc    Delete file metadata and the actual file
// @route   DELETE /api/devices/:deviceId/files/:fileId
// @access  Private
const deleteFile = async (req, res) => {
    try {
      const file = await File.findById(req.params.fileId);
      if (!file) {
        return res.status(404).json({ message: 'File metadata not found' });
      }

      // Optional: Check if the file belongs to the device in req.params.deviceId
      if (file.device.toString() !== req.params.deviceId) {
        return res.status(401).json({ message: 'Not authorized to delete this file' });
      }

      const filePath = path.join(__dirname, `../../${file.storageUrl}`);

      // Delete file from server
      fs.unlink(filePath, async (err) => {
        if (err) {
            // Log the error but don't block deletion of DB record if file is already gone
            console.error(`Could not delete file ${filePath}:`, err);
        }

        // Delete metadata from DB
        await file.deleteOne();
        res.status(200).json({ id: req.params.fileId, message: 'File metadata and file removed' });
      });

    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };

// @desc    Upload a file for a device
// @route   POST /api/devices/:deviceId/files/upload
// @access  Private
const uploadFile = (req, res) => {
    upload(req, res, async (err) => {
        if(err){
            return res.status(400).json({ message: err });
        }
        if(req.file == undefined){
            return res.status(400).json({ message: 'Error: No File Selected!' });
        }

        const { deviceId } = req.params;
        const { originalname, mimetype, size } = req.file;
        const { filePath } = req.body; // Get original path from body

        if (!filePath) {
            return res.status(400).json({ message: 'filePath is required in the multipart body' });
        }

        try {
            const device = await Device.findById(deviceId);
            if (!device) {
                return res.status(404).json({ message: 'Device not found' });
            }

            const fileMetadata = await File.create({
                device: deviceId,
                fileName: originalname,
                filePath: filePath,
                fileType: mimetype,
                size: size,
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
