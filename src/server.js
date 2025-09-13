const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//- ROUTES
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const contactRoutes = require('./routes/contacts');
const fileRoutes = require('./routes/files');
const commandRoutes = require('./routes/commandRoutes');
const locationRoutes = require('./routes/locationRoutes');


app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/commands', commandRoutes);
app.use('/api/location', locationRoutes);


const PORT = process.env.PORT || 5000;

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
