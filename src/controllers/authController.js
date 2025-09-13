const jwt = require('jsonwebtoken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = (req, res) => {
  const { username, password } = req.body;

  // For this simple case, we are checking against credentials in the .env file
  // In a real-world application, you would check this against a user in the database
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === adminUsername && password === adminPassword) {
    const payload = {
      username: adminUsername,
      role: 'admin',
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    });

    res.json({
      message: 'Login successful',
      token: token,
    });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
};

module.exports = {
  loginUser,
};
