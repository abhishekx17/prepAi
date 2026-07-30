const express = require('express');
const cookieParse = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cookieParse());
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [];

const defaultOrigins = [
  'http://localhost:5173',
  'https://interview-ai-o51k.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.includes(origin) || 
                        defaultOrigins.includes(origin) || 
                        origin.endsWith('.vercel.app');
                        
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
const authMiddleware = require('./middlewares/auth.middleware');

/* using all the routes here */
app.use('/api/auth', authRouter);
app.use('/api/reports', authMiddleware.authUser, reportRouter);
app.use('/api/interviews', authMiddleware.authUser, interviewRouter);
app.use('/api/resume', authMiddleware.authUser, resumeRouter);
app.use('/api/quizzes', authMiddleware.authUser, quizRouter);

module.exports = app;
