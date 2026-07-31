const express = require('express');
const cookieParse = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cookieParse());
const normalizeOrigin = (url) => url.replace(/\/+$/, '').trim();
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(normalizeOrigin).filter(Boolean)
  : [];

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://prep-ai-pied-eta.vercel.app',
  'https://interview-ai-o51k.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);
      
      const isAllowed = allowedOrigins.includes(normalizedOrigin) ||
                        defaultOrigins.includes(normalizedOrigin) ||
                        normalizedOrigin.endsWith('.vercel.app');
                        
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

/* require all the routes here */
const authRouter = require('./routes/auth.routes');
const reportRouter = require('./routes/report.routes');
const interviewRouter = require('./routes/interview.routes');
const resumeRouter = require('./routes/resume.routes');
const quizRouter = require('./routes/quiz.routes');
const adminRouter = require('./routes/admin.routes');
const authMiddleware = require('./middlewares/auth.middleware');
const connectToDb = require('./config/database');

app.get('/', (req, res) => {
  res.status(200).json({ message: 'PrepAI backend is running' });
});

app.get('/api/health', async (req, res) => {
  try {
    await connectToDb();
    res.status(200).json({ ok: true, database: 'connected' });
  } catch (error) {
    res.status(503).json({ ok: false, database: 'unavailable', message: error.message });
  }
});

app.use(async (req, res, next) => {
  try {
    await connectToDb();
    next();
  } catch (error) {
    res.status(503).json({
      message: 'Database connection is unavailable. Check MONGO_URI and MongoDB Atlas network access.',
    });
  }
});

/* using all the routes here */
app.use('/api/auth', authRouter);
app.use('/api/reports', authMiddleware.authUser, reportRouter);
app.use('/api/interviews', authMiddleware.authUser, interviewRouter);
app.use('/api/resume', authMiddleware.authUser, resumeRouter);
app.use('/api/quizzes', authMiddleware.authUser, quizRouter);
app.use('/api/admin', adminRouter);

module.exports = app;
