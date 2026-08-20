const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('brihaspathi_access_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      // Token expired or invalid
      localStorage.removeItem('brihaspathi_access_token');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`API client note for ${endpoint}: Backend offline or unreachable. Using fallback state.`);
    return { success: false, error: { message: error.message } };
  }
}
