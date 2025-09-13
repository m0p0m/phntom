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

router.route('/:deviceId')
  .get(getFiles);

module.exports = router;
