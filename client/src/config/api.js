// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  
  // Task endpoints
  TASKS: `${API_BASE_URL}/tasks`,
  TASK_BY_ID: (id) => `${API_BASE_URL}/tasks/${id}`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
};

export default API_BASE_URL;
