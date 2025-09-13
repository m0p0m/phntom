const express = require('express');
const router = express.Router();
const { deleteFile } = require('../controllers/fileController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/:id')
  .delete(deleteFile);

module.exports = router;
