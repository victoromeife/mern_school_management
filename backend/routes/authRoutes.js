const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const ResetToken = require('../models/ResetToken');
const { protect, authorize } = require('../middleware/authMiddleware');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

router.get('/admin-exists', async (req, res) => {
  try {
    const adminExists = await User.exists({ role: 'admin' });
    return res.json({ exists: Boolean(adminExists) });
  } catch (error) {
    console.error('Admin exists check error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin-only registration for first user as admin
router.post('/admin-register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(403).json({ 
        message: 'Admin already exists. Cannot create another admin.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      name,
      role: 'admin',
      isVerified: true,
      isActive: true
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '7d' 
      }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      user: userResponse
    });
  } 
  catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Regular registration - NO EMAIL VERIFICATION
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, role, ...otherFields } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if this is the first user (make them admin)
    const userCount = await User.countDocuments();
    const userRole = userCount === 0 ? 'admin' : (role || 'student');

    // Create new user - auto verified
    const user = new User({
      username,
      email,
      password: hashedPassword,
      name,
      role: userRole,
      isVerified: true,
      isActive: true,
      ...otherFields
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '7d' 
      }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: userResponse,
      requiresEmailVerification: false
    });
  } 
  catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login - NO EMAIL VERIFICATION CHECK
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Your account has been deactivated. Contact admin.' 
      });
    }

    // Email verification check REMOVED - users can login immediately

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    const token = jwt.sign(
      { 
        userId: user._id, role: user.role 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '7d' 
      }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });

  } 
  catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        message: 'No token, authorization denied' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId)
      .select('-password')
      .populate('subjects')
      .populate('class')
      .populate('grade');

    if (!user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ 
      message: 'Token is not valid' 
    });
  }
});

router.post('/logout', (req, res) => {
  res.json({ 
    message: 'Logged out successfully' 
  });
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const resetToken = new ResetToken({
      userId: user._id,
      token,
      type: 'passwordReset',
      expiresAt: Date.now() + 3600000
    });
    
    // Delete old token if exists
    await ResetToken.deleteOne({ userId: user._id, type: 'passwordReset' });
    await resetToken.save();

    res.json({ 
      message: 'Password reset link has been sent to your email' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const resetToken = await ResetToken.findOne({
      token,
      type: 'passwordReset',
      expiresAt: { $gt: Date.now() }
    });

    if (!resetToken) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(resetToken.userId, { password: hashedPassword });
    await ResetToken.findByIdAndDelete(resetToken._id);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify email - kept for compatibility but not used
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    res.json({ message: 'Email verification is disabled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Resend verification - kept for compatibility
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    res.json({ message: 'Email verification is disabled' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;