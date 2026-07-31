const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Secure all admin endpoints - requires logged-in user with admin role
router.use(authMiddleware.authUser);
router.use(authMiddleware.authAdmin);

// Analytics
router.get('/stats', adminController.getStats);

// User Management
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.put('/users/:id/reset-usage', adminController.resetUserUsage);
router.delete('/users/:id', adminController.deleteUser);

// Interview Session Management
router.get('/interviews', adminController.getInterviews);
router.delete('/interviews/:id', adminController.deleteInterview);

// Quiz Session Management
router.get('/quizzes', adminController.getQuizzes);
router.delete('/quizzes/:id', adminController.deleteQuiz);

// Interview Report Management
router.get('/reports', adminController.getReports);
router.delete('/reports/:id', adminController.deleteReport);

module.exports = router;
