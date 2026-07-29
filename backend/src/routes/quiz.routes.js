const { Router } = require('express');
const quizRouter = Router();
const quizController = require('../controllers/quiz.controller');
const { checkUsageLimit, checkGeminiRateLimit } = require('../middlewares/limit.middleware');

/**
 * @route POST /api/quizzes/start
 * @description Start a new multiple choice quiz session
 * @access Private
 */
quizRouter.post('/start', checkUsageLimit('quiz'), checkGeminiRateLimit, quizController.startQuizController);

/**
 * @route GET /api/quizzes/history
 * @description Retrieve the history of completed quizzes
 * @access Private
 */
quizRouter.get('/history', quizController.getQuizHistoryController);

/**
 * @route GET /api/quizzes/:id
 * @description Fetch quiz session questions (sanitized if active) or results (if completed)
 * @access Private
 */
quizRouter.get('/:id', quizController.getQuizController);

/**
 * @route POST /api/quizzes/:id/submit
 * @description Submit selected answers for grading and evaluation
 * @access Private
 */
quizRouter.post('/:id/submit', quizController.submitQuizAnswersController);

module.exports = quizRouter;
