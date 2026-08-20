import { apiClient } from './client';

export const authApi = {
  login: (email, password) => apiClient('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (payload) => apiClient('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => apiClient('/auth/me')
};

export const productApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/products${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiClient(`/products/${id}`),
  create: (data) => apiClient('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiClient(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiClient(`/products/${id}`, { method: 'DELETE' }),
  listIdeas: () => apiClient('/products/ideas'),
  listRoadmaps: () => apiClient('/products/roadmaps')
};

export const tenderApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/tenders${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiClient(`/tenders/${id}`),
  analyze: (id) => apiClient(`/tenders/${id}/analyze`, { method: 'POST' }),
  search: (id, query) => apiClient(`/tenders/${id}/search`, { method: 'POST', body: JSON.stringify({ query }) })
};

export const vendorApi = {
  list: () => apiClient('/vendors'),
  recordEmail: (data) => apiClient('/vendors/email', { method: 'POST', body: JSON.stringify(data) }),
  listEmails: () => apiClient('/vendors/emails')
};

export const analyticsApi = {
  getOverview: () => apiClient('/analytics/overview')
};

export const aiApi = {
  chat: (message, context = {}) => apiClient('/ai/chat', { method: 'POST', body: JSON.stringify({ message, context }) })
};

export const searchApi = {
  globalSearch: (q) => apiClient(`/search?q=${encodeURIComponent(q)}`)
};
