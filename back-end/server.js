const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Connect to Database
const connectDB = require('./config/db');
connectDB();

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connection.once('open', async () => {
    try {
      const users = await User.find();
      console.log('All users:', users);
    } catch (err) {
      console.error('Failed to query users:', err);
    }
  });
  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));