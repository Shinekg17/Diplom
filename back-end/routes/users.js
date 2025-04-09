// server/routes/users.js (updated)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/create
// @desc    Create user (admin only)
// @access  Private/Admin
// server/routes/users.js - create user route
router.post('/create', auth, async (req, res) => {
  try {
    console.log('Create user request received');
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { username, email, password, role } = req.body;
    
    // Validate inputs
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    console.log('Creating user:', { username, email, role });
    
    // Check if user already exists
    let existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Хэрэглэгч аль хэдийн үүссэн' });
    }
    
    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('Password hashed successfully');
    
    // Create user document
    const userData = {
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
      createdBy: req.user.id
    };
    
    // Insert directly to avoid any middleware
    const user = await User.create(userData);
    
    console.log('User created successfully:', user._id);
    
    // Return user info without password
    const userToReturn = await User.findById(user._id).select('-password');
    res.json(userToReturn);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   PUT api/users/:id
// @desc    Update user (admin only)
// @access  Private/Admin
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { username, email, role, password } = req.body;
    
    // Find user
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email or username is being changed and already exists
    if (email !== user.email || username !== user.username) {
      const existingUser = await User.findOne({
        $or: [
          { email, _id: { $ne: req.params.id } },
          { username, _id: { $ne: req.params.id } }
        ]
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: existingUser.email === email ? 'Аль хэдиийн бүртгэгдсэн и-мэйл байна.' : 'Аль хэдиийн бүртгэгдсэн хэрэглэгчийн нэр байна.'
        });
      }
    }
    
    // Update basic info
    user.username = username;
    user.email = email;
    user.role = role;
    
    // Update password if provided
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    
    await user.save();
    
    // Return updated user (without password)
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user (admin only)
// @access  Private/Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Prevent self-deletion
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Та өөрийн эрхээ устгах боломжгүй' });
    }
    
    // Find and delete user
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Хэрэглэгч олдсонгүй' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Хэрэглэгч амжилттай устлаа' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/fix-password', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const { userId, plainPassword } = req.body;
    
    if (!userId || !plainPassword) {
      return res.status(400).json({ message: 'User ID and plain password are required' });
    }
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Directly hash the plain password 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    // Update user's password directly in the database to avoid pre-save hooks
    await User.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } }
    );
    
    // Test login
    const updatedUser = await User.findById(userId);
    const passwordMatches = await bcrypt.compare(plainPassword, updatedUser.password);
    
    return res.json({ 
      success: true, 
      message: 'Password fixed',
      passwordMatches
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/report', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Зөвшөөрөлгүй хүсэлт' });
    }
    
    // Find all users with selected fields
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
      
    // Add activity calculation (optional)
    const usersWithActivity = users.map(user => {
      const lastActive = user.lastActive ? new Date(user.lastActive) : null;
      const now = new Date();
      const activity = lastActive ? Math.floor((now - lastActive) / (1000 * 60 * 60 * 24)) : null;
      
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastActive: user.lastActive,
        daysInactive: activity
      };
    });
    
    res.json(usersWithActivity);
  } catch (error) {
    console.error('Тайлан гаргах үед алдаа гарлаа:', error);
    res.status(500).json({ message: 'Серверийн алдаа' });
  }
});


module.exports = router;