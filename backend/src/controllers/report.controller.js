const interviewReportModel = require('../models/interviewReport.model');
const generateInterviewReport = require('../services/ai.service');
const { incrementUsage } = require('../middlewares/limit.middleware');

/**
 * @name generateReportController
 * @route POST /api/reports/generate
 * @description Generates a new interview report based on JD, resume, and self-description, then saves it to DB.
 * @access Private
 */
async function generateReportController(req, res) {
  const { jobDescription, resume, selfDescription } = req.body;

  if (!jobDescription) {
    return res.status(400).json({
      message: 'Job description is required to generate a report.',
    });
  }

  try {
    // Call Gemini AI service
    const reportData = await generateInterviewReport({
      resume: resume || '',
      selfDescription: selfDescription || '',
      jobDescription,
    });

    if (!reportData) {
      return res.status(500).json({
        message: 'Failed to generate interview report from AI service.',
      });
    }

    // Create report document linked to logged-in user
    const report = await interviewReportModel.create({
      userId: req.user.id,
      jobTitle: reportData.title || 'Untitled Role',
      jobDescription,
      resume: resume || '',
      selfDescription: selfDescription || '',
      matchScore: reportData.matchScore || 0,
      technicalQuestions: reportData.technicalQuestions || [],
      behavioralQuestions: reportData.behavioralQuestions || [],
      skillGaps: reportData.skillGaps || [],
      preparationPlan: reportData.preparationPlan || [],
    });

    // Increment usage metrics
    await incrementUsage(req.userDoc, 'resume');

    res.status(201).json({
      message: 'Interview report generated successfully',
      report,
    });
  } catch (error) {
    console.error('Error generating report:', error);
    try {
      const fs = require('fs');
      const path = require('path');
      fs.appendFileSync(path.join(__dirname, '../../error.log'), `\n[${new Date().toISOString()}] CONTROLLER ERROR: ${error.message}\n${error.stack}\n`, 'utf-8');
    } catch (e) {
      console.error('Failed to log error inside controller:', e.message);
    }
    res.status(500).json({
      message: 'An error occurred while generating the interview report.',
      error: error.message,
    });
  }
}

/**
 * @name getReportsController
 * @route GET /api/reports
 * @description Retrieves a list of saved reports for the authenticated user.
 * @access Private
 */
async function getReportsController(req, res) {
  try {
    const reports = await interviewReportModel
      .find({ userId: req.user.id })
      .select('jobTitle matchScore createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      reports,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({
      message: 'An error occurred while retrieving your reports.',
    });
  }
}

/**
 * @name getReportByIdController
 * @route GET /api/reports/:id
 * @description Retrieves details for a specific interview report.
 * @access Private
 */
async function getReportByIdController(req, res) {
  try {
    const report = await interviewReportModel.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: 'Interview report not found.',
      });
    }

    // Verify ownership
    if (report.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to view this report.',
      });
    }

    res.status(200).json({
      report,
    });
  } catch (error) {
    console.error('Error fetching report by ID:', error);
    res.status(500).json({
      message: 'An error occurred while retrieving the report details.',
    });
  }
}

/**
 * @name deleteReportController
 * @route DELETE /api/reports/:id
 * @description Deletes a specific interview report.
 * @access Private
 */
async function deleteReportController(req, res) {
  try {
    const report = await interviewReportModel.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        message: 'Interview report not found.',
      });
    }

    // Verify ownership
    if (report.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You are not authorized to delete this report.',
      });
    }

    await interviewReportModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Interview report deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({
      message: 'An error occurred while deleting the report.',
    });
  }
}

module.exports = {
  generateReportController,
  getReportsController,
  getReportByIdController,
  deleteReportController,
};
