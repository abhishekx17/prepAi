const express = require('express');
const cookieParse = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cookieParse());
app.use(
  cors({
    origin: 'http://localhost:5173',
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
