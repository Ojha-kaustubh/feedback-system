const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: getAuthHeaders(),
      ...(options.body && { body: JSON.stringify(options.body) })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: userData
    });
  },

  // Login user
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: credentials
    });
  },

  // Get user profile
  getProfile: async () => {
    return apiRequest('/auth/profile', {
      method: 'GET'
    });
  }
};

// Feedback API
export const feedbackAPI = {
  // Create new feedback
  create: async (feedbackData) => {
    return apiRequest('/feedback', {
      method: 'POST',
      body: feedbackData
    });
  },

  // Get public feedback (no auth required)
  getPublic: async (page = 1, limit = 10) => {
    return apiRequest(`/feedback/public?page=${page}&limit=${limit}`, {
      method: 'GET'
    });
  },

  // Get all feedback (admin only)
  getAll: async (page = 1, limit = 10) => {
    return apiRequest(`/feedback?page=${page}&limit=${limit}`, {
      method: 'GET'
    });
  },

  // Delete feedback (admin only)
  delete: async (id) => {
    return apiRequest(`/feedback/${id}`, {
      method: 'DELETE'
    });
  },

  // Get feedback statistics (admin only)
  getStats: async () => {
    return apiRequest('/feedback/stats', {
      method: 'GET'
    });
  }
};

// Health check
export const healthCheck = async () => {
  return apiRequest('/health', {
    method: 'GET'
  });
}; 