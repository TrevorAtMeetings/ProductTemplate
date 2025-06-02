const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ 
      where: { email },
      raw: true // This will return plain object instead of Sequelize instance
    });
    console.log('Existing user query result:', existingUser);

    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    console.log('Creating new user with email:', email);
    const user = await User.create({ email, password });
    console.log('User created successfully:', {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST START ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password in login request');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    console.log('🔍 Finding user with email:', email);
    const user = await User.findOne({ 
      where: { email },
      raw: false // We need the instance methods for password validation
    });
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('User details:', {
        id: user.id,
        email: user.email,
        hasValidatePasswordMethod: typeof user.validatePassword === 'function'
      });
    }

    if (!user) {
      console.log('❌ No user found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate password
    console.log('🔒 Validating password for user:', email);
    try {
      const isValidPassword = await user.validatePassword(password);
      console.log('✅ Password validation result:', isValidPassword);

      if (!isValidPassword) {
        console.log('❌ Invalid password for user:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (passwordError) {
      console.error('❌ Password validation error:', passwordError);
      return res.status(500).json({ message: 'Error validating password' });
    }

    // Generate JWT token
    console.log('🎟️ Generating JWT token for user:', email);
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not set!');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for user:', email);
    console.log('=== LOGIN REQUEST END ===');
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    res.status(500).json({ 
      message: 'Error logging in', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router; 