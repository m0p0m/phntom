const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getFiles,
  addFile,
  deleteFile,
  uploadFile,
} = require('../controllers/fileController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/upload')
    .post(uploadFile);

router.route('/')
  .post(addFile);

router.route('/:id')
  .delete(deleteFile);

const File = require('../models/File');
const advancedResults = require('../middlewares/advancedResults');

router.route('/:deviceId')
  .get(advancedResults(File), getFiles);

module.exports = router;
