import { useContext } from 'react';
import { AuthContext } from '../auth.context';
import { login, register, logout } from '../services/auth.api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data?.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: 'Invalid server response structure.' };
    } catch (err) {
      setUser(null);
      return { success: false, error: err?.response?.data?.message || 'Login failed. Please verify your credentials.' };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register(username, email, password);
      if (data?.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: 'Registration succeeded but session could not be established.' };
    } catch (err) {
      setUser(null);
      return { success: false, error: err?.response?.data?.message || 'Registration failed. Email might already be registered.' };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch {
      setUser(null);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return { user, loading, handleLogin, handleLogout, handleRegister };
};
