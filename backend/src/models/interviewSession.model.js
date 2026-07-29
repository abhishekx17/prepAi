const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['coding', 'conceptual', 'behavioral'],
      required: true,
    },
    codeTemplate: {
      type: String,
      default: '',
    },
    userAnswer: {
      type: String,
      default: '',
    },
    userCode: {
      type: String,
      default: '',
    },
    hintsUsed: {
      type: [String],
      default: [],
    },
    feedback: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const roadmapItemSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    suggestion: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Junior', 'Mid', 'Senior'],
      default: 'Mid',
    },
    focusArea: {
      type: String,
      enum: ['Coding Heavy', 'System Design', 'Behavioral'],
      default: 'Coding Heavy',
    },
    questions: [interviewQuestionSchema],
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed'],
      default: 'active',
    },
    evaluation: {
      score: {
        type: Number,
        default: 0,
      },
      recommendation: {
        type: String,
        default: '',
      },
      feedbackSummary: {
        type: String,
        default: '',
      },
      roadmap: [roadmapItemSchema],
    },
  },
  {
    timestamps: true,
  }
);

const interviewSessionModel = mongoose.model('interviewSession', interviewSessionSchema);

module.exports = interviewSessionModel;
