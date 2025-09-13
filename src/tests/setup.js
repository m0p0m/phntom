const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri; // Use the in-memory database for tests
  await mongoose.connect(uri);
});

const { io } = require('../server');

afterAll(async () => {
  await mongoose.connection.disconnect();
  await mongod.stop();
  io.close(); // Close the socket server
});

// Optional: Clear all data between tests
beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
});
