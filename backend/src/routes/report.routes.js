const { Router } = require('express');
const reportRouter = Router();
const reportController = require('../controllers/report.controller');
const { checkUsageLimit, checkGeminiRateLimit } = require('../middlewares/limit.middleware');

/**
 * @route POST /api/reports/generate
 * @description Generate a new interview report
 * @access Private
 */
reportRouter.post('/generate', checkUsageLimit('resume'), checkGeminiRateLimit, reportController.generateReportController);

/**
 * @route GET /api/reports
 * @description Get all reports for the current logged-in user
 * @access Private
 */
reportRouter.get('/', reportController.getReportsController);

/**
 * @route GET /api/reports/:id
 * @description Get details of a specific report
 * @access Private
 */
reportRouter.get('/:id', reportController.getReportByIdController);

/**
 * @route DELETE /api/reports/:id
 * @description Delete a specific report
 * @access Private
 */
reportRouter.delete('/:id', reportController.deleteReportController);

module.exports = reportRouter;
