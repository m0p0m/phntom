const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { app, server, io } = require('../server');

let mongod;
let testServer;

global.serverAddress = '';

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;

  // This connectDB call is now redundant because we connect right after, but it's harmless
  // In a larger refactor, we might make connectDB return the connection instead of being global
  const connectDB = require('../config/db');
  await connectDB();

  testServer = server.listen(0, () => {
    global.serverAddress = `http://localhost:${testServer.address().port}`;
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
  io.close();
  await new Promise(resolve => testServer.close(resolve));
});

beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});
