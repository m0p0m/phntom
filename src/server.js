const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const createApp = () => {
    const app = express();

    // Body parser
    app.use(express.json());

    // Cookie parser
    app.use(cookieParser());

    // View engine setup
    if (process.env.NODE_ENV !== 'test') {
        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, '../views'));
        // Set public folder
        app.use(express.static(path.join(__dirname, '../public')));
    }

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

    const authRoutes = require('./routes/authRoutes');
    const createDeviceRouter = require('./routes/deviceRoutes');
    const commandRoutes = require('./routes/commandRoutes');

    if (process.env.NODE_ENV !== 'test') {
        const viewRoutes = require('./routes/viewRoutes');
        app.use('/', viewRoutes);
    } else {
        app.get('/', (req, res) => {
            res.send('API is running for test...');
        });
    }

    // We need to create a server for socket.io, so we can't mount the device router here
    // We will mount it after creating the server

    app.use('/api/auth', authRoutes);
    app.use('/api/commands', commandRoutes);

    return app;
};

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // In a real app, you'd restrict this
        methods: ["GET", "POST"]
    }
});

// Socket.IO connection
require('./socket')(io);

// Mount the device router now that we have io
const createDeviceRouter = require('./routes/deviceRoutes');
app.use('/api/devices', createDeviceRouter(io));


const startServer = async () => {
    const PORT = process.env.PORT || 5000;
    await connectDB();
    const runningServer = server.listen(PORT, console.log(`Server running on port ${PORT}`));

    process.on('unhandledRejection', (err, promise) => {
        console.log(`Error: ${err.message}`);
        runningServer.close(() => process.exit(1));
    });

    return runningServer;
};

if (require.main === module) {
    startServer();
}

module.exports = { app, server, io, startServer, createApp };
