require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const courseRoutes = require('./routes/courseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure database connection before processing API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({
      success: false,
      message: 'Database connection failed. Please verify MONGODB_URI credentials.',
      error: err.message
    });
  }
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Course Management API', timestamp: new Date() });
});
app.use('/api/courses', courseRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Start local server if not running in Vercel serverless environment
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/courses`);
    });
  }).catch((err) => {
    console.error('Error starting server:', err.message);
  });
}

module.exports = app;
