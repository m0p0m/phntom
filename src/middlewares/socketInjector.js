// This middleware makes the `io` object available on the `req` object
// so that controllers can emit socket events.
// It retrieves the io instance from the app object, where it was attached in server.js

const socketInjector = (req, res, next) => {
    req.io = req.app.get('socketio');
    next();
};

module.exports = socketInjector;
