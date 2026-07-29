const { Router } = require('express');
const interviewRouter = Router();
const interviewController = require('../controllers/interview.controller');

/**
 * @route POST /api/interviews/start
 * @description Start a new mock interview session
 * @access Private
 */
interviewRouter.post('/start', interviewController.startInterviewController);

/**
 * @route GET /api/interviews/history
 * @description Get history of mock interviews
 * @access Private
 */
interviewRouter.get('/history', interviewController.getInterviewHistoryController);

/**
 * @route GET /api/interviews/:id
 * @description Fetch active question (if active) or full scorecard (if completed)
 * @access Private
 */
interviewRouter.get('/:id', interviewController.getInterviewController);

/**
 * @route POST /api/interviews/:id/answer
 * @description Submit candidate answer for the current question
 * @access Private
 */
interviewRouter.post('/:id/answer', interviewController.submitAnswerController);

/**
 * @route POST /api/interviews/:id/hint
 * @description Request an AI hint for the active question
 * @access Private
 */
interviewRouter.post('/:id/hint', interviewController.requestHintController);

module.exports = interviewRouter;
