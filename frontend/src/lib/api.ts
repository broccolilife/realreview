const BASE = '/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = { ...(options.headers as Record<string, string> || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

export const api = {
  signup: (email: string, password: string) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request('/auth/me'),
  
  getBuildings: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/buildings${q}`);
  },
  getBuilding: (id: number) => {
    const token = getToken();
    return request(`/buildings/${id}${token ? `?token=${token}` : ''}`);
  },

  createReview: (data: any) =>
    request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  likeReview: (id: number) =>
    request(`/reviews/${id}/like`, { method: 'POST' }),
  getComments: (id: number) =>
    request(`/reviews/${id}/comments`),
  createComment: (id: number, text: string) =>
    request(`/reviews/${id}/comments`, { method: 'POST', body: JSON.stringify({ text }) }),
  
  uploadDocument: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return request('/verify/upload', { method: 'POST', body: form });
  },
};
