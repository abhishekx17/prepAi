import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './app.routes.jsx';
import { AuthProvider } from './features/auth/auth.context.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const App = () => {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const root = document.documentElement;
    if (savedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
