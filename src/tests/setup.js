const mongoose = require('mongoose');
const connectDB = require('../config/db');

let testServer;
let io;

global.serverAddress = '';

beforeAll(async () => {
  // The MONGO_URI is now expected to be in the config.env file
  // Connect to the database
  await connectDB();

  // IMPORTANT: Require the server *after* the DB connection is established.
  const serverModule = require('../server');
  const server = serverModule.server;
  io = serverModule.io;

  testServer = server.listen(0, () => {
    const port = testServer.address().port;
    global.serverAddress = `http://localhost:${port}`;
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (io) {
    io.close();
  }
  if (testServer) {
    await new Promise(resolve => testServer.close(resolve));
  }
});

beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});
