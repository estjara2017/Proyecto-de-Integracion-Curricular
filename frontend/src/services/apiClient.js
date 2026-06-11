const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token_elemental');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token_elemental');
      localStorage.removeItem('rol_elemental');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }

    throw new Error(data?.message || data?.error || 'Error de comunicacion con el servidor');
  }

  return data;
}

export { API_BASE_URL };
