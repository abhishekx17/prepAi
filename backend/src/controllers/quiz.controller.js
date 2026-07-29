const quizSessionModel = require('../models/quizSession.model');
const quizService = require('../services/quiz.service');
const { incrementUsage } = require('../middlewares/limit.middleware');

/**
 * @name startQuizController
 * @route POST /api/quizzes/start
 * @description Generates MCQ questions and saves an active quiz session.
 * @access Private
 */
async function startQuizController(req, res) {
  const { topic, difficulty, numQuestions } = req.body;

  if (!topic) {
    return res.status(400).json({
      message: 'Topic is required to start a quiz.',
    });
  }

  try {
    const questions = await quizService.generateQuizQuestions({
      topic,
      difficulty: difficulty || 'Mid',
      numQuestions: numQuestions || 5,
    });

    if (!questions || questions.length === 0) {
      return res.status(500).json({
        message: 'Failed to generate quiz questions. Please try again.',
      });
    }

    const session = await quizSessionModel.create({
      userId: req.user.id,
      topic,
      difficulty: difficulty || 'Mid',
      numQuestions: questions.length,
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
        userAnswerIndex: -1,
        explanation: q.explanation || '',
      })),
      score: 0,
      status: 'active',
    });

    // Increment user usage metrics
    await incrementUsage(req.userDoc, 'quiz');

    res.status(201).json({
      message: 'Quiz session started successfully',
      sessionId: session._id,
    });
  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({
      message: 'An error occurred while initiating the quiz.',
      error: error.message,
    });
  }
}

/**
 * @name getQuizController
 * @route GET /api/quizzes/:id
 * @description Fetches quiz session details. Sanitizes active sessions.
 * @access Private
 */
async function getQuizController(req, res) {
  try {
    const session = await quizSessionModel.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: 'Quiz session not found.',
      });
    }

    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to view this quiz.',
      });
    }

    if (session.status === 'active') {
      // Strip answers and explanations to prevent cheating via devtools inspect
      const sanitizedQuestions = session.questions.map((q) => ({
        question: q.question,
        options: q.options,
      }));

      return res.status(200).json({
        status: session.status,
        topic: session.topic,
        difficulty: session.difficulty,
        numQuestions: session.numQuestions,
        questions: sanitizedQuestions,
      });
    }

    // If completed, return full session details (including answers and grades)
    res.status(200).json({
      session,
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({
      message: 'An error occurred while retrieving the quiz details.',
    });
  }
}

/**
 * @name submitQuizAnswersController
 * @route POST /api/quizzes/:id/submit
 * @description Grades the quiz answers, saves results, and finishes session.
 * @access Private
 */
async function submitQuizAnswersController(req, res) {
  const { answers } = req.body; // Array of selected option indices (0-3)

  if (!Array.isArray(answers)) {
    return res.status(400).json({
      message: 'Answers must be submitted as an array of indices.',
    });
  }

  try {
    const session = await quizSessionModel.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: 'Quiz session not found.',
      });
    }

    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to submit answers for this quiz.',
      });
    }

    if (session.status !== 'active') {
      return res.status(400).json({
        message: 'This quiz session has already been completed.',
      });
    }

    let correctCount = 0;

    // Grade answers
    session.questions.forEach((q, idx) => {
      const selection = typeof answers[idx] === 'number' ? answers[idx] : -1;
      q.userAnswerIndex = selection;
      
      if (selection === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    session.score = correctCount;
    session.status = 'completed';
    await session.save();

    res.status(200).json({
      message: 'Quiz graded and submitted successfully.',
      session,
    });
  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    res.status(500).json({
      message: 'An error occurred while submitting your quiz answers.',
    });
  }
}

/**
 * @name getQuizHistoryController
 * @route GET /api/quizzes/history
 * @description Retrieves previous completed quiz scores for the logged-in user.
 * @access Private
 */
async function getQuizHistoryController(req, res) {
  try {
    const history = await quizSessionModel
      .find({ userId: req.user.id })
      .select('topic difficulty numQuestions score status createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      history,
    });
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    res.status(500).json({
      message: 'An error occurred while retrieving your quiz logs.',
    });
  }
}

module.exports = {
  startQuizController,
  getQuizController,
  submitQuizAnswersController,
  getQuizHistoryController,
};
