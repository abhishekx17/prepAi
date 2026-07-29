const userModel = require('../models/user.model');

const TIER_LIMITS = {
  Free: {
    resumes: 5,
    interviews: 1,
    quizzes: 3,
  },
  Pro: {
    resumes: Infinity,
    interviews: Infinity,
    quizzes: Infinity,
  },
  Enterprise: {
    resumes: Infinity,
    interviews: Infinity,
    quizzes: Infinity,
  }
};

// Global rate limiting memory stores
const globalRequestTimestamps = [];
const userRequestTimestamps = {}; // Maps userId -> array of timestamps

/**
 * Middleware to check user usage limits (database counters)
 */
const checkUsageLimit = (actionType) => {
  return async (req, res, next) => {
    try {
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Initialize usage counters if missing
      const tier = user.tier || 'Free';
      if (!user.usage) {
        user.usage = { resumesAnalyzed: 0, interviewsStarted: 0, quizzesTaken: 0 };
      }

      const limits = TIER_LIMITS[tier] || TIER_LIMITS.Free;

      if (actionType === 'resume') {
        const count = user.usage.resumesAnalyzed || 0;
        if (count >= limits.resumes) {
          return res.status(403).json({
            message: `You have reached the maximum limit of ${limits.resumes} resume analyses on the ${tier} Tier. Please upgrade to Pro for unlimited access.`,
            limitReached: true
          });
        }
      } else if (actionType === 'interview') {
        const count = user.usage.interviewsStarted || 0;
        if (count >= limits.interviews) {
          return res.status(403).json({
            message: `You have reached the maximum limit of ${limits.interviews} mock interview on the ${tier} Tier. Please upgrade to Pro for unlimited access.`,
            limitReached: true
          });
        }
      } else if (actionType === 'quiz') {
        const count = user.usage.quizzesTaken || 0;
        if (count >= limits.quizzes) {
          return res.status(403).json({
            message: `You have reached the maximum limit of ${limits.quizzes} quizzes on the ${tier} Tier. Please upgrade to Pro for unlimited access.`,
            limitReached: true
          });
        }
      }

      // Attach user document to request so we can save update in the controller
      req.userDoc = user;
      next();
    } catch (error) {
      console.error('Usage limit middleware error:', error);
      res.status(500).json({ message: 'Error checking usage limits.' });
    }
  };
};

/**
 * Middleware to shield the backend against Gemini Free Tier API rate limits (15 RPM).
 */
const checkGeminiRateLimit = (req, res, next) => {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  const userId = req.user.id;

  // 1. Clean up & enforce global server rate limit (12 RPM for safety margin)
  while (globalRequestTimestamps.length > 0 && globalRequestTimestamps[0] < oneMinuteAgo) {
    globalRequestTimestamps.shift();
  }

  if (globalRequestTimestamps.length >= 12) {
    const oldestTimestamp = globalRequestTimestamps[0];
    const waitSeconds = Math.ceil((60000 - (now - oldestTimestamp)) / 1000);
    return res.status(429).json({
      message: `The server's AI service is experiencing high load (Gemini rate limits). Please wait ${waitSeconds} second(s) before trying again.`,
      rateLimitExceeded: true
    });
  }

  // 2. Clean up & enforce per-user rate limit (2 requests per minute to prevent user abuse)
  if (!userRequestTimestamps[userId]) {
    userRequestTimestamps[userId] = [];
  }
  
  // Keep only timestamps within last 60 seconds
  userRequestTimestamps[userId] = userRequestTimestamps[userId].filter(ts => ts > oneMinuteAgo);

  const userTier = req.userDoc?.tier || 'Free';
  const userRateLimit = userTier === 'Free' ? 2 : 5; // Free tier users restricted to 2/min; Pro to 5/min

  if (userRequestTimestamps[userId].length >= userRateLimit) {
    const oldestUserTimestamp = userRequestTimestamps[userId][0];
    const waitSeconds = Math.ceil((60000 - (now - oldestUserTimestamp)) / 1000);
    return res.status(429).json({
      message: `You are generating requests too quickly. Please wait ${waitSeconds} second(s) before sending another query.`,
      rateLimitExceeded: true
    });
  }

  // Record timestamps
  globalRequestTimestamps.push(now);
  userRequestTimestamps[userId].push(now);
  next();
};

const incrementUsage = async (userDoc, actionType) => {
  try {
    if (!userDoc.usage) {
      userDoc.usage = { resumesAnalyzed: 0, interviewsStarted: 0, quizzesTaken: 0 };
    }
    if (actionType === 'resume') {
      userDoc.usage.resumesAnalyzed = (userDoc.usage.resumesAnalyzed || 0) + 1;
    } else if (actionType === 'interview') {
      userDoc.usage.interviewsStarted = (userDoc.usage.interviewsStarted || 0) + 1;
    } else if (actionType === 'quiz') {
      userDoc.usage.quizzesTaken = (userDoc.usage.quizzesTaken || 0) + 1;
    }
    userDoc.markModified('usage');
    await userDoc.save();
  } catch (error) {
    console.error('Error incrementing usage:', error);
  }
};

module.exports = { checkUsageLimit, checkGeminiRateLimit, incrementUsage };
