const express = require('express');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Set static folder
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//- ROUTES

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/location', require('./routes/locationRoutes'));
app.use('/api/commands', require('./routes/commandRoutes'));
app.use('/api/devices', require('./routes/deviceRoutes'));


const PORT = process.env.PORT || 5000;

const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In a real app, you'd restrict this
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection
require('./socket')(io);


if (require.main === module) {
  server.listen(
    PORT,
    console.log(`Server running on port ${PORT}`)
  );

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
}

module.exports = { app, server, io }; // Export server and io for testing
