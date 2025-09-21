// This middleware makes the `io` object available on the `req` object
// so that controllers can emit socket events.

const socketInjector = (io) => (req, res, next) => {
    req.io = io;
    next();
};

module.exports = socketInjector;
