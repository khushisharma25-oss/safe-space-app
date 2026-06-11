const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔑 SIGNUP / REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User pehle se registered hai!" });

    // Password ko secure (Hash) karo
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, password: hashedPassword });
    await user.save();

    // Token generate karo
    const token = jwt.sign({ userId: user._id }, 'SHESHIELD_SECRET_KEY', { expiresIn: '7d' });
    res.status(201).json({ token, userId: user._id, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Registration me galti hui" });
  }
});

// 🔓 LOGIN ROUTE (Real verification)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Ghalat credentials!" });

    // Password verify karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Ghalat credentials!" });

    const token = jwt.sign({ userId: user._id }, 'SHESHIELD_SECRET_KEY', { expiresIn: '7d' });
    res.status(200).json({ token, userId: user._id, email: user.email });
  } catch (error) {
    res.status(500).json({ message: "Login me dikkat hui" });
  }
});

module.exports = router;