const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const ResetToken = require('../models/ResetToken');
const { protect, authorize } = require('../middleware/authMiddleware');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

// Admin-only registration for first user as admin, then create other roles
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

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      name,
      role: userRole,
      isVerified: userRole === 'admin', // Auto-verify admins
      ...otherFields
    });

    await user.save();

    // Generate verification email token (only if not admin)
    let verificationToken = null;
    if (userRole !== 'admin') {
      verificationToken = crypto.randomBytes(32).toString('hex');
      const resetToken = new ResetToken({
        userId: user._id,
        token: verificationToken,
        type: 'emailVerification',
        expiresAt: Date.now() + 3600000 // 1 hour
      });
      await resetToken.save();

      // Send verification email
      try {
        await sendVerificationEmail(email, verificationToken, name);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail registration if email fails, but log it
      }
    }

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
      message: userRole === 'admin' 
        ? 'Admin registered successfully' 
        : 'Registration successful! Please verify your email.',
      token: userRole === 'admin' ? token : null,
      user: userResponse,
      requiresEmailVerification: userRole !== 'admin'
    });
  } 
  catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    // .select('+password') because password is normally excluded

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Your account has been deactivated. Contact admin.' 
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email before logging in' 
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id, role: user.role 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '7d' 
        }
    );

    // Remove password from response
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
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        message: 'No token, authorization denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id from token
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
  // With JWT, logout is handled client-side by deleting the token
  // But we can add a blacklist here if needed
  
  res.json({ 
    message: 'Logged out successfully' 
  });
});

// @desc Forgot password - send reset link
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const resetToken = new ResetToken({
      userId: user._id,
      token,
      type: 'passwordReset',
      expiresAt: Date.now() + 3600000 // 1 hour
    });
    await resetToken.save();

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, token, user.name);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Return success anyway, user can try resending
    }

    res.json({ 
      message: 'Password reset link has been sent to your email' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc Reset password with token
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

// @desc Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    const resetToken = await ResetToken.findOne({
      token,
      type: 'emailVerification',
      expiresAt: { $gt: Date.now() }
    });

    if (!resetToken) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    await User.findByIdAndUpdate(resetToken.userId, { isVerified: true });
    await ResetToken.findByIdAndDelete(resetToken._id);

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc Resend verification
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, isVerified: false });

    if (!user) {
      return res.status(400).json({ message: 'User not found or already verified' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const resetToken = new ResetToken({
      userId: user._id,
      token,
      type: 'emailVerification',
      expiresAt: Date.now() + 3600000 // 1 hour
    });
    await resetToken.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, token, user.name);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Return success anyway
    }

    res.json({ message: 'Verification link sent to your email' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;  
