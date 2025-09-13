const express = require('express');
const router = express.Router();
const {
  getFiles,
  addFile,
  deleteFile,
} = require('../controllers/fileController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .post(addFile);

router.route('/:id')
  .delete(deleteFile);

const File = require('../models/File');
const advancedResults = require('../middlewares/advancedResults');

router.route('/:deviceId')
  .get(advancedResults(File), getFiles);

module.exports = router;
