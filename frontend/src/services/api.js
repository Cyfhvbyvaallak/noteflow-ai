/**
 * NoteFlow AI - Frontend API Service Client
 */

const API_BASE = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`)
  : '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('noteflow_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorDetail = 'An unexpected error occurred.';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.message || JSON.stringify(errorJson);
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Authentication
  auth: {
    login: (email, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),
    register: (name, email, password) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      }),
    me: () => request('/auth/me'),
    forgotPassword: (email) =>
      request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
    logout: () => request('/auth/logout', { method: 'POST' })
  },

  // Dashboard
  dashboard: {
    getMetrics: () => request('/dashboard')
  },

  // Lectures
  lectures: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/lectures${query ? `?${query}` : ''}`);
    },
    get: (id) => request(`/lectures/${id}`),
    create: (data) =>
      request('/lectures', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    delete: (id) =>
      request(`/lectures/${id}`, {
        method: 'DELETE'
      }),
    regenerate: (id) =>
      request(`/lectures/${id}/regenerate`, {
        method: 'POST'
      })
  },

  // Speech-to-Text / Uploads
  transcription: {
    uploadAndProcess: (formData) =>
      request('/transcription', {
        method: 'POST',
        body: formData
      })
  },

  // AI Processing Engine
  ai: {
    summarize: (data) =>
      request('/ai/summarize', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    keyPoints: (data) =>
      request('/ai/key-points', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    revision: (data) =>
      request('/ai/revision', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    quiz: (data) =>
      request('/ai/quiz', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    fullProcess: (lectureId) =>
      request(`/ai/full-process/${lectureId}`, {
        method: 'POST'
      })
  },

  // Student Notes
  notes: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/notes${query ? `?${query}` : ''}`);
    },
    get: (id) => request(`/notes/${id}`),
    create: (data) =>
      request('/notes', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      request(`/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    toggleFavorite: (id) =>
      request(`/notes/${id}/favorite`, {
        method: 'PATCH'
      }),
    delete: (id) =>
      request(`/notes/${id}`, {
        method: 'DELETE'
      })
  },

  // Quizzes
  quizzes: {
    list: () => request('/quizzes'),
    get: (id) => request(`/quizzes/${id}`),
    submit: (id, answers) =>
      request(`/quizzes/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers })
      }),
    getHistory: () => request('/quizzes/attempts/history')
  },

  // Global Search
  search: {
    query: (q) => request(`/search?q=${encodeURIComponent(q)}`)
  },

  // Settings & System Status
  settings: {
    getStatus: () => request('/settings/status'),
    updateProfile: (data) =>
      request('/settings/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    changePassword: (data) =>
      request('/settings/change-password', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    deleteAccount: () =>
      request('/settings/account', {
        method: 'DELETE'
      })
  }
};
