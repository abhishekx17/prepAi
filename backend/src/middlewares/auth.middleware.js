const jwt = require('jsonwebtoken');
const tokenBlackListModel = require('../models/blacklist.model');

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: 'token not provided',
    });
  }

  const isTokenBlacklisted = await tokenBlackListModel.findOne({ token });

  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: 'token is invalid',
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: 'JWT_SECRET is not configured',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'invalid token',
    });
  }
}

const userModel = require('../models/user.model');

async function authAdmin(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: 'Unauthorized: authentication required',
    });
  }

  try {
    const user = await userModel.findById(req.user.id);
    if (!user || user.email !== 'abhishek.0x17@gmail.com') {
      return res.status(403).json({
        message: 'Forbidden: Admin access restricted to the official administrator email.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Server error verifying admin status',
      error: error.message,
    });
  }
}

module.exports = { authUser, authAdmin };
