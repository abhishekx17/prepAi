import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

export async function register(username, email, password) {
  try {
    const response = await api.post('/api/auth/register', { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function verifyRegisterOTP(email, otp) {
  try {
    const response = await api.post('/api/auth/verify-register-otp', { email, otp });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function login(email, password) {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    const response = await api.get('/api/auth/logout', {});
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getMe() {
  try {
    const response = await api.get('/api/auth/get-me', {});
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function forgotPassword(email) {
  try {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(email, otp, newPassword) {
  try {
    const response = await api.post('/api/auth/reset-password', { email, otp, newPassword });
    return response.data;
  } catch (error) {
    throw error;
  }
}

