const interviewSessionModel = require('../models/interviewSession.model');
const interviewService = require('../services/interview.service');

/**
 * @name startInterviewController
 * @route POST /api/interviews/start
 * @description Generates interview questions and creates a new session in DB.
 * @access Private
 */
async function startInterviewController(req, res) {
  const { jobTitle, jobDescription, resume, difficulty, focusArea } = req.body;

  if (!jobTitle || !jobDescription) {
    return res.status(400).json({
      message: 'Job Title and Job Description are required to start an interview.',
    });
  }

  try {
    // Generate questions using AI
    const questions = await interviewService.generateInterviewQuestions({
      jobTitle,
      jobDescription,
      resume: resume || '',
      difficulty: difficulty || 'Mid',
      focusArea: focusArea || 'Coding Heavy',
    });

    if (!questions || questions.length === 0) {
      return res.status(500).json({
        message: 'Failed to generate interview questions. Please try again.',
      });
    }

    // Save session in DB
    const session = await interviewSessionModel.create({
      userId: req.user.id,
      jobTitle,
      jobDescription,
      resume: resume || '',
      difficulty: difficulty || 'Mid',
      focusArea: focusArea || 'Coding Heavy',
      questions: questions.map((q) => ({
        question: q.question,
        type: q.type,
        codeTemplate: q.codeTemplate || '',
        userAnswer: '',
        userCode: '',
        hintsUsed: [],
        feedback: '',
        score: 0,
      })),
      currentQuestionIndex: 0,
      status: 'active',
    });

    res.status(201).json({
      message: 'Interview session started successfully',
      sessionId: session._id,
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    res.status(500).json({
      message: 'An error occurred while initiating the interview.',
      error: error.message,
    });
  }
}

/**
 * @name getInterviewController
 * @route GET /api/interviews/:id
 * @description Fetches interview session state. If active, returns only current question.
 * @access Private
 */
async function getInterviewController(req, res) {
  try {
    const session = await interviewSessionModel.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: 'Interview session not found.',
      });
    }

    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to view this session.',
      });
    }

    if (session.status === 'active') {
      const currentIdx = session.currentQuestionIndex;
      const question = session.questions[currentIdx];

      return res.status(200).json({
        status: session.status,
        jobTitle: session.jobTitle,
        difficulty: session.difficulty,
        focusArea: session.focusArea,
        currentQuestionIndex: currentIdx,
        totalQuestions: session.questions.length,
        question: {
          question: question.question,
          type: question.type,
          codeTemplate: question.codeTemplate,
          hintsUsed: question.hintsUsed,
        },
      });
    }

    // If completed, return full session details (including answers, scores, feedback)
    res.status(200).json({
      session,
    });
  } catch (error) {
    console.error('Error fetching interview:', error);
    res.status(500).json({
      message: 'An error occurred while fetching interview state.',
    });
  }
}

/**
 * @name submitAnswerController
 * @route POST /api/interviews/:id/answer
 * @description Saves candidate response for the current question and increments index. Runs evaluation on final answer.
 * @access Private
 */
async function submitAnswerController(req, res) {
  const { answer, code } = req.body;

  try {
    const session = await interviewSessionModel.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: 'Interview session not found.',
      });
    }

    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to submit answers for this session.',
      });
    }

    if (session.status !== 'active') {
      return res.status(400).json({
        message: 'This interview session has already been completed.',
      });
    }

    const currentIdx = session.currentQuestionIndex;

    // Save answer and code
    session.questions[currentIdx].userAnswer = answer || '';
    session.questions[currentIdx].userCode = code || '';

    // Move to next question
    session.currentQuestionIndex = currentIdx + 1;

    // If that was the last question, trigger full evaluation
    if (session.currentQuestionIndex >= session.questions.length) {
      session.status = 'completed';

      try {
        const evaluation = await interviewService.evaluateInterviewSession({
          jobTitle: session.jobTitle,
          jobDescription: session.jobDescription,
          resume: session.resume,
          questions: session.questions,
        });

        // Set scores and feedback back to questions
        evaluation.individualFeedback.forEach((f) => {
          if (session.questions[f.questionIndex]) {
            session.questions[f.questionIndex].score = f.score;
            session.questions[f.questionIndex].feedback = f.feedback;
          }
        });

        // Save overall evaluation
        session.evaluation = {
          score: evaluation.score || 0,
          recommendation: evaluation.recommendation || 'Hire',
          feedbackSummary: evaluation.feedbackSummary || '',
          roadmap: evaluation.roadmap || [],
        };
      } catch (aiErr) {
        console.error('AI Interview Evaluation Failed:', aiErr);
        // Fallback placeholder evaluation so database stays consistent
        session.evaluation = {
          score: 50,
          recommendation: 'Weak Hire',
          feedbackSummary: 'Completed but AI auto-evaluation met with a service error.',
          roadmap: [],
        };
      }
    }

    await session.save();

    res.status(200).json({
      message: session.status === 'completed' ? 'Interview completed and evaluated' : 'Answer submitted',
      status: session.status,
      nextQuestionIndex: session.currentQuestionIndex,
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({
      message: 'An error occurred while submitting your answer.',
    });
  }
}

/**
 * @name requestHintController
 * @route POST /api/interviews/:id/hint
 * @description Fetches an AI hint for the current active question.
 * @access Private
 */
async function requestHintController(req, res) {
  const { userAnswerSoFar, userCodeSoFar } = req.body;

  try {
    const session = await interviewSessionModel.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: 'Interview session not found.',
      });
    }

    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to access this session.',
      });
    }

    if (session.status !== 'active') {
      return res.status(400).json({
        message: 'Hints can only be requested for active interviews.',
      });
    }

    const currentIdx = session.currentQuestionIndex;
    const question = session.questions[currentIdx];

    const hint = await interviewService.generateHint({
      question: question.question,
      codeTemplate: question.codeTemplate,
      userAnswerSoFar: userAnswerSoFar || '',
      userCodeSoFar: userCodeSoFar || '',
    });

    // Record the hint in DB
    session.questions[currentIdx].hintsUsed.push(hint);
    await session.save();

    res.status(200).json({
      hint,
    });
  } catch (error) {
    console.error('Error requesting hint:', error);
    res.status(500).json({
      message: 'An error occurred while generating a hint.',
    });
  }
}

/**
 * @name getInterviewHistoryController
 * @route GET /api/interviews/history
 * @description Retrieves a list of mock interview logs.
 * @access Private
 */
async function getInterviewHistoryController(req, res) {
  try {
    const history = await interviewSessionModel
      .find({ userId: req.user.id })
      .select('jobTitle difficulty focusArea status evaluation.score createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      history,
    });
  } catch (error) {
    console.error('Error fetching interview history:', error);
    res.status(500).json({
      message: 'An error occurred while fetching your interview history.',
    });
  }
}

module.exports = {
  startInterviewController,
  getInterviewController,
  submitAnswerController,
  requestHintController,
  getInterviewHistoryController,
};
