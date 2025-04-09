// server/routes/auth.js (updated)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
// server/routes/auth.js - login route with detailed logging
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
     
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    

    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match');
      
      // For debugging only - Test with plaintext (not recommended for production)
      if (password === user.password) {
        console.log('WARNING: Password matches as plaintext - not hashed properly!');
      }
      
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    
    // Update last active timestamp
    user.lastActive = Date.now();
    await User.updateOne({ _id: user._id }, { $set: { lastActive: Date.now() } });
    
    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    
    jwt.sign(
      payload,
      'your_jwt_secret',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// server/routes/auth.js - add diagnostic endpoint
// @route   POST api/auth/test-password-hash
// @desc    Test password hashing (admin only)
// @access  Private/Admin
router.post('/test-password-hash', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { plainPassword } = req.body;
    
    if (!plainPassword) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    // Hash the password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hash1 = await bcrypt.hash(plainPassword, salt);
    
    // Hash it again (to simulate double hashing)
    const salt2 = await bcrypt.genSalt(10);
    const hash2 = await bcrypt.hash(hash1, salt2);
    
    // Test comparisons
    const normalComparison = await bcrypt.compare(plainPassword, hash1);
    const doubleHashComparison = await bcrypt.compare(plainPassword, hash2);
    const intermediateComparison = await bcrypt.compare(hash1, hash2);
    
    res.json({
      plainPassword,
      firstHash: hash1,
      secondHash: hash2,
      normalComparison,
      doubleHashComparison,
      intermediateComparison
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;