const express = require('express');
const router = express.Router({ mergeParams: true });

const { protect } = require('../middlewares/authMiddleware');
const socketInjector = require('../middlewares/socketInjector');

const { getPendingCommands, queueCommand } = require('../controllers/commandController');

router.use(protect, socketInjector);

router.route('/')
    .post(queueCommand);

router.route('/pending')
    .get(getPendingCommands);

module.exports = router;
