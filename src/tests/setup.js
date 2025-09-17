const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { startServer, io } = require('../server'); // No longer need app/server directly

let mongod;
let testServer;

global.serverAddress = '';

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Set the MONGO_URI for the in-memory server
  process.env.MONGO_URI = uri;
  // Use a different port for testing to avoid conflicts
  process.env.PORT = 0;

  // Start the server and get the instance
  testServer = await startServer();

  // Set global server address for tests to use
  global.serverAddress = `http://localhost:${testServer.address().port}`;
});

afterAll(async () => {
  if (testServer) {
    await new Promise(resolve => testServer.close(resolve));
  }
  if (io) {
    io.close();
  }
  if (mongod) {
    await mongod.stop();
  }
  await mongoose.disconnect();
});

beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});
