const express = require('express');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

//- ROUTES

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/location', require('./routes/locationRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));
app.use('/api/apps', require('./routes/appRoutes'));


const PORT = process.env.PORT || 5000;

if (require.main === module) {
  const server = app.listen(
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

module.exports = app;
