const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  campus: user.campus,
  role: user.role,
  createdAt: user.createdAt,
});

const register = async (req, res, next) => {
  try {
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').toLowerCase().trim();
    const password = req.body.password || '';
    const campus = (req.body.campus || '').trim();

    if (!name || !email || !password || !campus) {
      return res.status(400).json({ message: 'name, email, password, and campus are required.' });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    // Bootstrap convenience: first account becomes admin for moderation setup.
    const role = (await User.estimatedDocumentCount()) === 0 ? 'admin' : 'user';

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      campus,
      role,
    });

    const token = generateToken(user._id.toString());

    return res.status(201).json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id.toString());

    return res.json({ token, user: serializeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res) => {
  return res.json({ user: serializeUser(req.user) });
};

module.exports = { register, login, me };
