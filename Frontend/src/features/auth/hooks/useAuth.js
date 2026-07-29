import { useContext } from 'react';
import { AuthContext } from '../auth.context';
import { 
  login, 
  register, 
  logout, 
  verifyRegisterOTP, 
  verifyLoginOTP, 
  loginWithGoogle 
} from '../services/auth.api';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data?.otpSent) {
        return { success: true, otpSent: true };
      }
      return { success: false, error: 'Invalid response from server.' };
    } catch (err) {
      setUser(null);
      return { success: false, error: err?.response?.data?.message || 'Login failed. Please check your credentials.' };
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLoginOTP = async (email, otp) => {
    setLoading(true);
    try {
      const data = await verifyLoginOTP(email, otp);
      if (data?.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: 'Invalid login verification response.' };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Verification failed.' };
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

  const handleGoogleAuth = async (credential) => {
    setLoading(true);
    try {
      const data = await loginWithGoogle(credential);
      if (data?.user) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: 'Invalid Google login response.' };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Google authentication failed.' };
    } finally {
      setLoading(false);
    }
  };

  return { 
    user, 
    loading, 
    handleLogin, 
    handleVerifyLoginOTP,
    handleRegister,
    handleVerifyRegisterOTP,
    handleLogout,
    handleGoogleAuth
  };
};
