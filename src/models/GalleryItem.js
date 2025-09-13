const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Please add a device ID'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    caption: {
      type: String,
      trim: true,
    },
    sourceApp: {
      type: String,
      trim: true,
    },
    takenAt: {
      type: Date, // To store when the picture was taken
    }
  },
  {
    timestamps: true, // To store when the record was created/updated in our DB
  }
);

galleryItemSchema.index({ deviceId: 1, createdAt: -1 });

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
