import { useContext } from 'react';
import { AuthContext } from '../auth.context';
import { 
  login, 
  register, 
  logout, 
  verifyRegisterOTP, 
  getMe,
  forgotPassword,
  resetPassword
} from '../services/auth.api';

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
      return { success: false, error: 'Invalid response from server.' };
    } catch (err) {
      setUser(null);
      return { success: false, error: err?.response?.data?.message || 'Login failed. Please check your credentials.' };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register(username, email, password);
      if (data?.otpSent) {
        return { success: true, otpSent: true };
      }
      return { success: false, error: 'Invalid response from server.' };
    } catch (err) {
      setUser(null);
      return { success: false, error: err?.response?.data?.message || 'Registration failed. Email might already be registered.' };
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegisterOTP = async (email, otp) => {
    setLoading(true);
    try {
      const data = await verifyRegisterOTP(email, otp);
      if (data?.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: 'Invalid registration verification response.' };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Verification failed.' };
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

  const refreshUser = async () => {
    try {
      const data = await getMe();
      if (data?.user) {
        setUser(data.user);
        return data.user;
      }
    } catch (err) {
      console.error('Failed to refresh user context:', err);
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      const data = await forgotPassword(email);
      if (data?.success) {
        return { success: true };
      }
      return { success: false, error: 'Invalid response from server.' };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Failed to request reset OTP.' };
    }
  };

  const handleResetPassword = async ({ email, otp, newPassword }) => {
    try {
      const data = await resetPassword(email, otp, newPassword);
      if (data?.success) {
        return { success: true };
      }
      return { success: false, error: 'Invalid response from server.' };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Failed to update password.' };
    }
  };

  return { 
    user, 
    loading, 
    handleLogin, 
    handleRegister,
    handleVerifyRegisterOTP,
    handleLogout,
    refreshUser,
    handleForgotPassword,
    handleResetPassword
  };
};
