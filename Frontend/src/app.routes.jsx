import { createBrowserRouter } from 'react-router';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Protected from './features/auth/components/Protected';
import Dashboard from './features/ai/pages/Dashboard';
import ReportDetail from './features/ai/pages/ReportDetail';
import InterviewArena from './features/ai/pages/InterviewArena';
import InterviewResult from './features/ai/pages/InterviewResult';
import QuizArena from './features/ai/pages/QuizArena';
import QuizResult from './features/ai/pages/QuizResult';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
  {
    path: '/report/:id',
    element: (
      <Protected>
        <ReportDetail />
      </Protected>
    ),
  },
  {
    path: '/interview/:id',
    element: (
      <Protected>
        <InterviewArena />
      </Protected>
    ),
  },
  {
    path: '/interview/:id/result',
    element: (
      <Protected>
        <InterviewResult />
      </Protected>
    ),
  },
  {
    path: '/quiz',
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },

  {
    path: '/quiz/:id',
    element: (
      <Protected>
        <QuizArena />
      </Protected>
    ),
  },
  {
    path: '/quiz/:id/result',
    element: (
      <Protected>
        <QuizResult />
      </Protected>
    ),
  },
]);
