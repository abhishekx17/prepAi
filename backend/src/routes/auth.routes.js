const { Router } = require('express');
const authRouter = Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @route POST /api/auth/register
 * @description Registers user as unverified and sends registration OTP code
 * @access Public
 */
authRouter.post('/register', authController.registerUserController);

/**
 * @route POST /api/auth/verify-register-otp
 * @description Confirms OTP, activates account (isVerified = true) and logs in
 * @access Public
 */
authRouter.post('/verify-register-otp', authController.verifyRegisterOTPController);

/**
 * @route POST /api/auth/login
 * @description Verifies password, then triggers OTP code sent to user email
 * @access Public
 */
authRouter.post('/login', authController.loginUserController);

/**
 * @route POST /api/auth/verify-login-otp
 * @description Confirms OTP for credentials login and logs in
 * @access Public
 */
authRouter.post('/verify-login-otp', authController.verifyLoginOTPController);

/**
 * @route GET /api/auth/logout
 * @description clears token cookie
 * @access Public
 */
authRouter.get('/logout', authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @description retrieves active verified user info
 * @access Private
 */
authRouter.get('/get-me', authMiddleware.authUser, authController.getMeController);

/**
 * @route POST /api/auth/google
 * @description Direct login or register user with Google OAuth credentials
 * @access Public
 */
authRouter.post('/google', authController.googleLoginController);

module.exports = authRouter;
