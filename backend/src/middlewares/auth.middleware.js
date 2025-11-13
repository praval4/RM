const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodpartner.model');

async function authUserMiddleware(req, res, next) {
  try {
   
    const cookieToken = req.cookies?.token || req.cookies?.authToken;

    
    const authHeader = req.headers?.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    const token = cookieToken || bearerToken;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: token missing' });
    }

    // verify token (adjust secret)
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

    // attach user to request (lookup from DB)
    const user = await userModel.findById(payload.sub || payload.id || payload._id).lean();
    if (!user) return res.status(401).json({ message: 'Unauthorized: user not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('authUserMiddleware error', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

// ---------------------------
// FOOD PARTNER AUTH MIDDLEWARE
// ---------------------------
async function authFoodPartnerMiddleware(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Please login first" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded food partner token:", decoded);

    // 🔑 Use decoded.id (not decoded._id)
    const foodPartner = await foodPartnerModel.findById(decoded.id || decoded._id);

    if (!foodPartner) {
      return res.status(401).json({ message: "Food partner not found" });
    }

    req.foodPartner = foodPartner; // ✅ attach authenticated partner
    next();
  } catch (err) {
    console.error("Food partner auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = {
  authUserMiddleware,
  authFoodPartnerMiddleware
};
