// controllers/auth.controller.js
const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const foodPartnerModel = require('../models/foodpartner.model');

const COOKIE_NAME = 'token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// cookie options factory so clearCookie uses same options
function cookieOptions(req) {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,           // production must be HTTPS
    sameSite: 'none',         // required for cross-site cookies
    maxAge: COOKIE_MAX_AGE
  };
}

async function registerUser(req, res) {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'fullname, email and password are required' });
    }

    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ fullname, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie(COOKIE_NAME, token, cookieOptions(req));
    return res.status(201).json({
      message: 'User registered successfully',
      user: { _id: user._id, email: user.email, fullname: user.fullname }
    });
  } catch (err) {
    console.error('registerUser error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie(COOKIE_NAME, token, cookieOptions(req));
    return res.status(200).json({
      message: 'Login successful',
      user: { _id: user._id, email: user.email, fullname: user.fullname }
    });
  } catch (err) {
    console.error('loginUser error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function logoutUser(req, res) {
  try {
    // clear with same options so browser removes it
    res.clearCookie(COOKIE_NAME, cookieOptions(req));
    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    console.error('logoutUser error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function registerFoodPartner(req, res) {
  try {
    const { name, email, password, phone, address, contactName } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });
    if (isAccountAlreadyExists) {
      return res.status(400).json({ message: 'Account already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const foodPartner = new foodPartnerModel({
      name, email, password: hashedPassword, phone, address, contactName
    });

    await foodPartner.save();

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE_NAME, token, cookieOptions(req));

    return res.status(201).json({
      message: 'Food Partner registered successfully',
      foodPartner: { id: foodPartner._id, email: foodPartner.email, name: foodPartner.name }
    });
  } catch (err) {
    console.error('registerFoodPartner error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const foodPartner = await foodPartnerModel.findOne({ email });
    if (!foodPartner) return res.status(400).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE_NAME, token, cookieOptions(req));

    return res.status(200).json({
      message: 'Partner logged in successfully',
      foodPartner: { _id: foodPartner._id, email: foodPartner.email, name: foodPartner.name }
    });
  } catch (err) {
    console.error('loginFoodPartner error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function logoutFoodPartner(req, res) {
  try {
    res.clearCookie(COOKIE_NAME, cookieOptions(req));
    return res.status(200).json({ message: 'Food partner logged out successfully' });
  } catch (err) {
    console.error('logoutFoodPartner error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner
};
