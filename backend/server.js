const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' })); // Limit JSON payload size to reduce memory usage

// Connect to MongoDB with optimized options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 5, // Limit connection pool size
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/items', require('./routes/items'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/chat', require('./routes/chat'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
