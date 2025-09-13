// This middleware makes the `io` object available on the `req` object
// so that controllers can emit socket events.

const socketInjector = (req, res, next) => {
    const { io } = require('../server');
    req.io = io;
    next();
};

module.exports = socketInjector;
