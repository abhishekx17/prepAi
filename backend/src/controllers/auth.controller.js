const userModel = require('../models/user.model');
const otpModel = require('../models/otp.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlackListModel = require('../models/blacklist.model');
const nodemailer = require('nodemailer');

/**
 * Helper to generate and send/log OTP
 */
async function generateAndSendOTP(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Reset previous OTPs for this email address in database
  await otpModel.deleteMany({ email });
  await otpModel.create({ email, otp });

  // Print to server console for testing/development
  console.log(`
================================================
[PREPAI EMAIL OTP CODE]
To: ${email}
Subject: PrepAI Verification OTP Code
OTP Code: ${otp}
================================================
  `);

  // SMTP Sending Block with robust trim/quote-stripping
  const cleanEnvVal = (val) => {
    if (!val) return '';
    return val.replace(/"/g, '').replace(/'/g, '').trim();
  };

  const user_email = cleanEnvVal(process.env.SMTP_USER || process.env.EMAIL_USER);
  const user_pass = cleanEnvVal(process.env.SMTP_PASS || process.env.EMAIL_PASS);
  const host = cleanEnvVal(process.env.SMTP_HOST) || 'smtp.gmail.com';
  const port = parseInt(cleanEnvVal(process.env.SMTP_PORT) || '587', 10);

  if (user_email && user_pass) {
    try {
      let transporterOpts = {};
      if (host.includes('gmail.com')) {
        transporterOpts = {
          service: 'gmail',
          auth: {
            user: user_email,
            pass: user_pass,
          },
        };
      } else {
        transporterOpts = {
          host: host,
          port: port,
          secure: port === 465,
          auth: {
            user: user_email,
            pass: user_pass,
          },
        };
      }

      const transporter = nodemailer.createTransport(transporterOpts);

      await transporter.sendMail({
        from: `"PrepAI Auth" <${user_email}>`,
        to: email,
        subject: 'PrepAI Verification OTP Code',
        text: `Your PrepAI verification OTP code is: ${otp}. It will expire in 5 minutes.`,
        html: `
          <div style="font-family: sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 480px; margin: 0 auto; background-color: #ffffff;">
            <h2 style="color: #0284c7; margin-top: 0;">PrepAI Verification</h2>
            <p style="font-size: 14px; color: #334155; line-height: 1.5;">Your PrepAI verification OTP code is:</p>
            <div style="font-size: 28px; font-weight: 800; letter-spacing: 4px; color: #0f172a; background-color: #f8fafc; padding: 12px; border-radius: 8px; text-align: center; margin: 18px 0; border: 1px solid #e2e8f0;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin-bottom: 0;">This code will expire in 5 minutes. If you did not request this, you can ignore this email safely.</p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.error('SMTP sending failed, falling back to console log:', mailErr);
    }
  }
}

/**
 * @name registerUserController
 * @route POST /api/auth/register
 * @description Registers an unverified user account and sends verification OTP code.
 * @access Public
 */
async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: 'Please provide username, email and password',
    });
  }

  try {
    // 1. Check if username is taken by any other user
    const isUsernameTaken = await userModel.findOne({ username, email: { $ne: email } });
    if (isUsernameTaken) {
      return res.status(400).json({
        message: 'Username already taken.',
      });
    }

    // 2. Check if account already exists with this email address
    let user = await userModel.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({
        message: 'Account already exists with this email address.',
      });
    }

    const hash = await bcrypt.hash(password, 10);

    if (user && !user.isVerified) {
      // Overwrite/update unverified user info in case they changed it
      user.username = username;
      user.password = hash;
      await user.save();
    } else {
      // Create new unverified user
      user = await userModel.create({
        username,
        email,
        password: hash,
        isVerified: false,
      });
    }

    // Send verification code
    await generateAndSendOTP(email);

    res.status(200).json({
      otpSent: true,
      message: 'Verification OTP sent successfully.',
    });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({
      message: 'An error occurred during registration.',
      error: error.message,
    });
  }
}

/**
 * @name verifyRegisterOTPController
 * @route POST /api/auth/verify-register-otp
 * @description Confirms OTP from DB, marks account as isVerified: true, and issues session cookie
 * @access Public
 */
async function verifyRegisterOTPController(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP verification code are required.' });
  }

  try {
    const verifiedOTP = await otpModel.findOne({ email, otp });

    if (!verifiedOTP) {
      return res.status(400).json({ message: 'Invalid or expired verification code.' });
    }

    // Find the unverified user and activate them
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    user.isVerified = true;
    await user.save();

    // Clean up OTP codes
    await otpModel.deleteMany({ email });

    // Generate JWT cookie
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token);
    res.status(200).json({
      message: 'OTP verified and registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration OTP verification failed:', error);
    res.status(500).json({ message: 'Verification error occurred.' });
  }
}

/**
 * @name loginUserController
 * @route POST /api/auth/login
 * @description Verifies password, then triggers OTP code sent to user email.
 * @access Public
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user || !user.isVerified) {
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

    // Trigger email verification OTP
    await generateAndSendOTP(email);

    res.status(200).json({
      otpSent: true,
      message: 'Verification code sent to your email.',
    });
  } catch (error) {
    console.error('Login credentials check failed:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
}

/**
 * @name verifyLoginOTPController
 * @route POST /api/auth/verify-login-otp
 * @description Confirms OTP from DB for credentials login, then issues session cookie
 * @access Public
 */
async function verifyLoginOTPController(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP verification code are required.' });
  }

  try {
    const verifiedOTP = await otpModel.findOne({ email, otp });

    if (!verifiedOTP) {
      return res.status(400).json({ message: 'Invalid or expired verification code.' });
    }

    const user = await userModel.findOne({ email, isVerified: true });
    if (!user) {
      return res.status(404).json({ message: 'Account not found or unverified.' });
    }

    // Clean up OTP codes
    await otpModel.deleteMany({ email });

    // Generate JWT cookie
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token);
    res.status(200).json({
      message: 'Verification successful. Logged in successfully.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login OTP verification failed:', error);
    res.status(500).json({ message: 'Verification error occurred.' });
  }
}

/**
 * @name logoutUserController
 * @route GET /api/auth/logout
 * @description clears token cookie
 * @access Public
 */
async function logoutUserController(req, res) {
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
 * @name getMeController
 * @route GET /api/auth/get-me
 * @description retrieves active verified user info
 * @access Private
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

/**
 * @name googleLoginController
 * @route POST /api/auth/google
 * @description Direct sign-in/up for Google accounts (marked as isVerified: true immediately)
 * @access Public
 */
async function googleLoginController(req, res) {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Google credential token is required.' });
  }

  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    
    if (!response.ok) {
      return res.status(400).json({ message: 'Google authentication verification failed.' });
    }

    const payload = await response.json();

    // Verify token audience matches our client ID (optional quotes stripped)
    const backendClientId = (process.env.GOOGLE_CLIENT_ID || '').replace(/"/g, '').trim();
    if (backendClientId && payload.aud !== backendClientId) {
      return res.status(400).json({ message: 'Google authentication audience mismatch.' });
    }

    if (!payload.email) {
      return res.status(400).json({ message: 'No email scope associated with Google token.' });
    }

    const email = payload.email;

    // Check if account already exists
    let user = await userModel.findOne({ email });

    if (!user) {
      // Register verified user with Google details
      let baseUsername = (payload.name || email.split('@')[0]).replace(/\s+/g, '').toLowerCase();
      let username = baseUsername + Math.floor(1000 + Math.random() * 9000);
      let isUsernameExist = await userModel.findOne({ username });
      while (isUsernameExist) {
        username = baseUsername + Math.floor(1000 + Math.random() * 9000);
        isUsernameExist = await userModel.findOne({ username });
      }

      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await userModel.create({
        username,
        email,
        password: dummyPassword,
        isVerified: true, // Google already verified their email address
      });
    } else if (!user.isVerified) {
      // If user was previously unverified in database, activate them immediately
      user.isVerified = true;
      await user.save();
    }

    // Generate JWT cookie
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token);
    res.status(200).json({
      message: 'Google login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Google Auth Controller Error:', error);
    res.status(500).json({ message: 'An error occurred during Google authentication.' });
  }
}

module.exports = {
  registerUserController,
  verifyRegisterOTPController,
  loginUserController,
  verifyLoginOTPController,
  logoutUserController,
  getMeController,
  googleLoginController,
};
