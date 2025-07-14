const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, storeOTP, verifyOTP, sendSMS } = require('../utils/otp');
const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, phoneNumber: user.phoneNumber, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Request OTP for phone number
router.post('/request-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  
  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const otp = generateOTP();
    storeOTP(phoneNumber, otp);
    
    // Send OTP via SMS (mock implementation)
    await sendSMS(phoneNumber, `Your DIVI verification code is: ${otp}`);
    
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP and login/register
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp, name } = req.body;
  
  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  try {
    const otpResult = verifyOTP(phoneNumber, otp);
    
    if (!otpResult.success) {
      return res.status(400).json({ message: otpResult.message });
    }

    // Find or create user
    let user = await User.findOne({ phoneNumber });
    
    if (!user) {
      user = new User({
        phoneNumber,
        name: name || '',
        isVerified: true,
        isAdmin: phoneNumber === '9305960114' // Admin phone number
      });
      await user.save();
    } else {
      user.isVerified = true;
      if (name && !user.name) user.name = name;
      await user.save();
    }

    const token = generateToken(user);
    res.json({ 
      token, 
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create admin user route (for initial setup)
router.post('/create-admin', async (req, res) => {
  const { phoneNumber, name } = req.body;
  try {
    const adminExists = await User.findOne({ phoneNumber, isAdmin: true });
    if (adminExists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = new User({ 
      phoneNumber, 
      name, 
      isAdmin: true, 
      isVerified: true 
    });
    await admin.save();

    const token = generateToken(admin);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
