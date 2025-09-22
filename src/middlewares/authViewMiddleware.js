const jwt = require('jsonwebtoken');

module.exports = {
  ensureAuth: function (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect('/');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.redirect('/');
    }
  }
};
