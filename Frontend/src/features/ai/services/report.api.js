import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export async function generateReport(jobDescription, resume, selfDescription) {
  try {
    const response = await api.post('/api/reports/generate', {
      jobDescription,
      resume,
      selfDescription,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getReports() {
  try {
    const response = await api.get('/api/reports');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getReportById(id) {
  try {
    const response = await api.get(`/api/reports/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteReport(id) {
  try {
    const response = await api.delete(`/api/reports/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
