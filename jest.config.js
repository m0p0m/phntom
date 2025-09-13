// Force load env vars at the very beginning
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './config.env') });

module.exports = {
  testEnvironment: 'node',
  // setupFiles is no longer needed as we are loading env here
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  testTimeout: 30000 // Increase default timeout for all tests
};
