const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const MAX_AVATAR_LENGTH = 1500000;

const trimString = (value = '') => (typeof value === 'string' ? value.trim() : '');

const isValidEmail = (email = '') => /^\S+@\S+\.\S+$/.test(email);

const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  campus: user.campus,
  avatarUrl: user.avatarUrl || '',
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const register = async (req, res, next) => {
  try {
    const name = trimString(req.body.name);
    const email = trimString(req.body.email).toLowerCase();
    const password = req.body.password || '';
    const campus = trimString(req.body.campus);
    const avatarUrl = trimString(req.body.avatarUrl);

    if (!name || !email || !password || !campus) {
      return res.status(400).json({ message: 'name, email, password, and campus are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    if (avatarUrl.length > MAX_AVATAR_LENGTH) {
      return res.status(400).json({ message: 'Profile image is too large. Please choose a smaller image.' });
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
      avatarUrl,
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

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const nextName = trimString(req.body.name);
    const nextEmail = trimString(req.body.email).toLowerCase();
    const nextCampus = trimString(req.body.campus);
    const nextAvatarUrl = trimString(req.body.avatarUrl);

    if (!nextName || !nextEmail || !nextCampus) {
      return res.status(400).json({ message: 'name, email, and campus are required.' });
    }

    if (!isValidEmail(nextEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (nextAvatarUrl.length > MAX_AVATAR_LENGTH) {
      return res.status(400).json({ message: 'Profile image is too large. Please choose a smaller image.' });
    }

    if (nextEmail !== user.email) {
      const existing = await User.findOne({ email: nextEmail, _id: { $ne: user._id } });
      if (existing) {
        return res.status(409).json({ message: 'Email is already registered.' });
      }
    }

    user.name = nextName;
    user.email = nextEmail;
    user.campus = nextCampus;
    user.avatarUrl = nextAvatarUrl;
    await user.save();

    return res.json({ user: serializeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const currentPassword = req.body.currentPassword || '';
    const newPassword = req.body.newPassword || '';

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login, me, updateProfile, updatePassword };
