import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  withCredentials: true,
});

export async function startQuiz({ topic, difficulty, numQuestions }) {
  try {
    const response = await api.post('/api/quizzes/start', {
      topic,
      difficulty,
      numQuestions,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getQuiz(id) {
  try {
    const response = await api.get(`/api/quizzes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function submitQuiz(id, answers) {
  try {
    const response = await api.post(`/api/quizzes/${id}/submit`, {
      answers,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getQuizHistory() {
  try {
    const response = await api.get('/api/quizzes/history');
    return response.data;
  } catch (error) {
    throw error;
  }
}
