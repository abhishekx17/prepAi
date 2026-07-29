import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export async function startInterview({ jobTitle, jobDescription, resume, difficulty, focusArea }) {
  try {
    const response = await api.post('/api/interviews/start', {
      jobTitle,
      jobDescription,
      resume,
      difficulty,
      focusArea,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getInterview(id) {
  try {
    const response = await api.get(`/api/interviews/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function submitAnswer(id, { answer, code }) {
  try {
    const response = await api.post(`/api/interviews/${id}/answer`, {
      answer,
      code,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function requestHint(id, { userAnswerSoFar, userCodeSoFar }) {
  try {
    const response = await api.post(`/api/interviews/${id}/hint`, {
      userAnswerSoFar,
      userCodeSoFar,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getInterviewHistory() {
  try {
    const response = await api.get('/api/interviews/history');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function uploadResumeFile(file) {
  try {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
