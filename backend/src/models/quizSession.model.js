const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      validate: {
        validator: function (v) {
          return v.length === 4;
        },
        message: 'A quiz question must have exactly 4 options.',
      },
      required: true,
    },
    correctOptionIndex: {
      type: Number,
      min: 0,
      max: 3,
      required: true,
    },
    userAnswerIndex: {
      type: Number,
      min: -1,
      max: 3,
      default: -1, // -1 indicates skipped or uncompleted
    },
    explanation: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const quizSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Low', 'Mid', 'High'],
      default: 'Mid',
    },
    numQuestions: {
      type: Number,
      default: 5,
    },
    questions: [quizQuestionSchema],
    score: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const quizSessionModel = mongoose.model('quizSession', quizSessionSchema);

module.exports = quizSessionModel;
