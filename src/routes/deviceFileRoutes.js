const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('../middlewares/authMiddleware');
const socketInjector = require('../middlewares/socketInjector');
const advancedResults = require('../middlewares/advancedResults');

const File = require('../models/File');
const { getFiles, addFile, uploadFile } = require('../controllers/fileController');

router.use(protect, socketInjector);

router.route('/')
  .get(advancedResults(File, { path: 'device', select: 'deviceName' }), getFiles)
  .post(addFile);

router.route('/upload')
    .post(uploadFile);

module.exports = router;
