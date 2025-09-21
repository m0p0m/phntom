const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Body parser
app.use(express.json());

// Set security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100 // 100 requests per 10 mins
});
app.use('/api/', limiter);


// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In a real app, you'd restrict this
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection
require('./socket')(io);

//- ROUTES
const authRoutes = require('./routes/authRoutes');
const createDeviceRouter = require('./routes/deviceRoutes');
const commandRoutes = require('./routes/commandRoutes');

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/devices', createDeviceRouter(io)); // Pass io to the router factory
app.use('/api/commands', commandRoutes);


const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  await connectDB();
  const runningServer = server.listen(PORT, console.log(`Server running on port ${PORT}`));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    runningServer.close(() => process.exit(1));
  });

  return runningServer;
};

if (require.main === module) {
  startServer();
}

module.exports = { app, server, io, startServer }; // Export for testing and modular use
