const userModel = require('../models/user.model');
const authRouter = require('../routes/auth.routes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlackListModel = require('../models/blacklist.model');
const { log } = require('debug/src/browser');

/**
 * @name registerUserController
 * @route POST /api/auth/register
 * @description Register a new user, expects username, email and password in the request body
 * @access Public
 */

async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: 'Please provide username, email and password',
    });
  }

  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: 'Account already exist with this email address or username',
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.cookie('token', token);

  res.status(201).json({
    message: 'user registered successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 *@name loginUserController
 @description login  user, expects email and password in the request body
 @access public
 */

async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: 'Invalid email or password',
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: 'Invalid email or password',
    });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.cookie('token', token);
  res.status(200).json({
    message: 'user loggedIn successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 *@name logoutUserController
 @description  clear token from user cookie and add the token in the blackList
 @access public
 */

async function logoutUserController(req, res) {
  console.log(req.cookies);
  const token = req.cookies.token;

  if (token) {
    await tokenBlackListModel.create({ token });
  }

  res.clearCookie('token');

  res.status(200).json({
    message: 'User logged out successfully',
  });
}

/**
 *@name logoutUserController
 @description  get the current logged in user details
 @access public
 */

async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
