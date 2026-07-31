const userModel = require('../models/user.model');
const interviewSessionModel = require('../models/interviewSession.model');
const quizSessionModel = require('../models/quizSession.model');
const interviewReportModel = require('../models/interviewReport.model');

/**
 * @name getStats
 * @description Retrieves aggregated stats for the dashboard.
 */
async function getStats(req, res) {
  try {
    const totalUsers = await userModel.countDocuments();
    const verifiedUsers = await userModel.countDocuments({ isVerified: true });
    
    // Tier aggregation
    const tierAggregate = await userModel.aggregate([
      { $group: { _id: '$tier', count: { $sum: 1 } } }
    ]);
    const tiers = { Free: 0, Pro: 0, Enterprise: 0 };
    tierAggregate.forEach(item => {
      if (item._id && tiers[item._id] !== undefined) {
        tiers[item._id] = item.count;
      }
    });

    // Role aggregation
    const roleAggregate = await userModel.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    const roles = { user: 0, admin: 0 };
    roleAggregate.forEach(item => {
      if (item._id && roles[item._id] !== undefined) {
        roles[item._id] = item.count;
      }
    });

    // Total usages
    const usageAggregate = await userModel.aggregate([
      {
        $group: {
          _id: null,
          resumesAnalyzed: { $sum: '$usage.resumesAnalyzed' },
          interviewsStarted: { $sum: '$usage.interviewsStarted' },
          quizzesTaken: { $sum: '$usage.quizzesTaken' }
        }
      }
    ]);
    const usage = usageAggregate[0] || { resumesAnalyzed: 0, interviewsStarted: 0, quizzesTaken: 0 };

    // Interview session metrics
    const totalInterviews = await interviewSessionModel.countDocuments();
    const activeInterviews = await interviewSessionModel.countDocuments({ status: 'active' });
    const completedInterviews = await interviewSessionModel.countDocuments({ status: 'completed' });
    
    const interviewScoreAgg = await interviewSessionModel.aggregate([
      { $match: { 'evaluation.score': { $gt: 0 } } },
      { $group: { _id: null, avgScore: { $avg: '$evaluation.score' } } }
    ]);
    const avgInterviewScore = interviewScoreAgg[0] ? Math.round(interviewScoreAgg[0].avgScore * 10) / 10 : 0;

    // Quiz session metrics
    const totalQuizzes = await quizSessionModel.countDocuments();
    const completedQuizzes = await quizSessionModel.countDocuments({ status: 'completed' });
    
    const quizScoreAgg = await quizSessionModel.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);
    const avgQuizScore = quizScoreAgg[0] ? Math.round(quizScoreAgg[0].avgScore * 10) / 10 : 0;

    // Reports count
    const totalReports = await interviewReportModel.countDocuments();

    // Recent activity (e.g. last 5 created interview sessions)
    const recentInterviews = await interviewSessionModel.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentQuizzes = await quizSessionModel.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          unverified: totalUsers - verifiedUsers,
          tiers,
          roles,
        },
        usage,
        interviews: {
          total: totalInterviews,
          active: activeInterviews,
          completed: completedInterviews,
          avgScore: avgInterviewScore
        },
        quizzes: {
          total: totalQuizzes,
          completed: completedQuizzes,
          avgScore: avgQuizScore
        },
        reports: {
          total: totalReports
        },
        recentInterviews: recentInterviews.map(i => ({
          id: i._id,
          username: i.userId?.username || 'Deleted User',
          jobTitle: i.jobTitle,
          difficulty: i.difficulty,
          status: i.status,
          createdAt: i.createdAt
        })),
        recentQuizzes: recentQuizzes.map(q => ({
          id: q._id,
          username: q.userId?.username || 'Deleted User',
          topic: q.topic,
          difficulty: q.difficulty,
          status: q.status,
          score: q.score,
          createdAt: q.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, message: 'Server error generating stats', error: error.message });
  }
}

/**
 * @name getUsers
 * @description Retrieves a paginated list of users with filtering and searching.
 */
async function getUsers(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = String(req.query.search || '').trim();
    const tier = req.query.tier;
    const role = req.query.role;
    const isVerified = req.query.isVerified;

    const query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (tier && ['Free', 'Pro', 'Enterprise'].includes(tier)) {
      query.tier = tier;
    }

    if (role && ['user', 'admin'].includes(role)) {
      query.role = role;
    }

    if (isVerified !== undefined && isVerified !== '') {
      query.isVerified = isVerified === 'true';
    }

    const skip = (page - 1) * limit;

    const users = await userModel.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit);

    const total = await userModel.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error fetching users', error: error.message });
  }
}

/**
 * @name updateUser
 * @description Updates details of a user.
 */
async function updateUser(req, res) {
  const { id } = req.params;
  const { username, email, tier, role, isVerified } = req.body;

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (username) user.username = username.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (tier && ['Free', 'Pro', 'Enterprise'].includes(tier)) user.tier = tier;
    if (role && ['user', 'admin'].includes(role)) user.role = role;
    if (isVerified !== undefined) user.isVerified = !!isVerified;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        tier: user.tier,
        role: user.role,
        isVerified: user.isVerified,
        usage: user.usage
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server error updating user', error: error.message });
  }
}

/**
 * @name resetUserUsage
 * @description Resets or overrides a user's usage counts.
 */
async function resetUserUsage(req, res) {
  const { id } = req.params;
  const { resumesAnalyzed, interviewsStarted, quizzesTaken } = req.body;

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.usage = {
      resumesAnalyzed: resumesAnalyzed !== undefined ? parseInt(resumesAnalyzed, 10) : 0,
      interviewsStarted: interviewsStarted !== undefined ? parseInt(interviewsStarted, 10) : 0,
      quizzesTaken: quizzesTaken !== undefined ? parseInt(quizzesTaken, 10) : 0
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Usage reset successfully',
      usage: user.usage
    });
  } catch (error) {
    console.error('Error resetting usage:', error);
    res.status(500).json({ success: false, message: 'Server error resetting usage', error: error.message });
  }
}

/**
 * @name deleteUser
 * @description Deletes a user and cascade deletes all their data.
 */
async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Protect against self-deletion
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'Self-deletion is forbidden.' });
    }

    // Cascade deletions
    await interviewSessionModel.deleteMany({ userId: user._id });
    await quizSessionModel.deleteMany({ userId: user._id });
    await interviewReportModel.deleteMany({ userId: user._id });

    // Delete user
    await userModel.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: 'User and all associated sessions/reports deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error deleting user', error: error.message });
  }
}

/**
 * @name getInterviews
 * @description Fetches all interview sessions.
 */
async function getInterviews(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const difficulty = req.query.difficulty;
    const focusArea = req.query.focusArea;
    const status = req.query.status;
    const search = String(req.query.search || '').trim();

    const query = {};

    if (difficulty && ['Junior', 'Mid', 'Senior'].includes(difficulty)) {
      query.difficulty = difficulty;
    }
    if (focusArea && ['Coding Heavy', 'System Design', 'Behavioral'].includes(focusArea)) {
      query.focusArea = focusArea;
    }
    if (status && ['pending', 'active', 'completed'].includes(status)) {
      query.status = status;
    }
    if (search) {
      query.jobTitle = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const interviews = await interviewSessionModel.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await interviewSessionModel.countDocuments(query);

    res.status(200).json({
      success: true,
      interviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({ success: false, message: 'Server error fetching interviews', error: error.message });
  }
}

/**
 * @name deleteInterview
 * @description Deletes an interview session.
 */
async function deleteInterview(req, res) {
  const { id } = req.params;

  try {
    const session = await interviewSessionModel.findByIdAndDelete(id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Interview session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting interview:', error);
    res.status(500).json({ success: false, message: 'Server error deleting interview', error: error.message });
  }
}

/**
 * @name getQuizzes
 * @description Fetches quiz sessions.
 */
async function getQuizzes(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const difficulty = req.query.difficulty;
    const status = req.query.status;
    const search = String(req.query.search || '').trim();

    const query = {};

    if (difficulty && ['Low', 'Mid', 'High'].includes(difficulty)) {
      query.difficulty = difficulty;
    }
    if (status && ['active', 'completed'].includes(status)) {
      query.status = status;
    }
    if (search) {
      query.topic = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const quizzes = await quizSessionModel.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await quizSessionModel.countDocuments(query);

    res.status(200).json({
      success: true,
      quizzes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ success: false, message: 'Server error fetching quizzes', error: error.message });
  }
}

/**
 * @name deleteQuiz
 * @description Deletes a quiz session.
 */
async function deleteQuiz(req, res) {
  const { id } = req.params;

  try {
    const quiz = await quizSessionModel.findByIdAndDelete(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz session not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Quiz session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ success: false, message: 'Server error deleting quiz', error: error.message });
  }
}

/**
 * @name getReports
 * @description Fetches all interview reports.
 */
async function getReports(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = String(req.query.search || '').trim();

    const query = {};

    if (search) {
      query.jobTitle = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const reports = await interviewReportModel.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await interviewReportModel.countDocuments(query);

    res.status(200).json({
      success: true,
      reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ success: false, message: 'Server error fetching reports', error: error.message });
  }
}

/**
 * @name deleteReport
 * @description Deletes an interview report.
 */
async function deleteReport(req, res) {
  const { id } = req.params;

  try {
    const report = await interviewReportModel.findByIdAndDelete(id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ success: false, message: 'Server error deleting report', error: error.message });
  }
}

module.exports = {
  getStats,
  getUsers,
  updateUser,
  resetUserUsage,
  deleteUser,
  getInterviews,
  deleteInterview,
  getQuizzes,
  deleteQuiz,
  getReports,
  deleteReport
};
