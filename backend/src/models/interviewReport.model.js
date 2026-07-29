const mongoose = require('mongoose');

/**
 * - Job description : String
 * - resume text : String
 * - self description : String
 *
 * - matchScore : Number
 *
 * - Technical Questions : [{}]
 * - Behavioral questions : [{}]
 * - Skills gaps : [{}]
 * - preparation plan : [{}]
 */

const technicalQuestionsSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Technical question is required'],
    },
    intention: {
      type: String,
      required: [true, 'Intention is required'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
    },
  },
  { _id: false }
);

const BehavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Technical question is required'],
    },
    intention: {
      type: String,
      required: [true, 'Intention is required'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
    },
  },
  { _id: false }
);

const skillGapSchema = new mongoose.Schema(
  {
    skills: {
      type: 'String',
      required: [true, 'Skill is required'],
    },

    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: [true, 'Severity is required'],
    },
  },
  { _id: false }
);

const preparationPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, 'Day is required'],
  },
  focus: {
    type: String,
    required: [true, 'Focus is required'],
  },
  tasks: {
    type: String,
    required: [true, 'Task is required'],
  },
});

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
    },
    resume: {
      type: String,
    },
    selfDescription: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalQuestions: [technicalQuestionsSchema],
    behavioralQuestions: [BehavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
  },
  {
    timestamps: true,
  }
);

const interviewReportModel = mongoose.model('interviewReport', interviewReportSchema);

module.exports = interviewReportModel;
