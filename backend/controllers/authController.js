const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Farm = require('../models/Farm');

const JWT_SECRET = process.env.JWT_SECRET || 'farmbora-secret-exhibition-key';

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, phone, password });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ user: { id: user._id, name, email, phone }, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone }, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const farm = await Farm.findOne({ userId: user._id });
    
    res.json({ user, farm });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user data', error: error.message });
  }
};
