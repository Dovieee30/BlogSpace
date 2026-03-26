// Central API client — all requests go through here
const API_BASE = 'http://localhost:3001/api'

// Save token after login
export function saveToken(token) {
  localStorage.setItem('blog_token', token)
}

// Get stored token
export function getToken() {
  return localStorage.getItem('blog_token')
}

// Remove token on logout
export function removeToken() {
  localStorage.removeItem('blog_token')
}

// Base fetch helper — returns { data, error }
async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
    const json = await res.json()
    if (!res.ok) return { data: null, error: json.error || 'Request failed' }
    return { data: json.data, error: null }
  } catch (err) {
    return { data: null, error: err.message }
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const api = {
  auth: {
    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

    signup: (email, password) =>
      request('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) }),
  },

  // ── Posts ───────────────────────────────────────────────────────────────────
  posts: {
    getAll: () => request('/posts'),
    getOne: (id) => request(`/posts/${id}`),

    create: (title, body, author) =>
      request('/posts', { method: 'POST', body: JSON.stringify({ title, body, author }) }),

    update: (id, fields) =>
      request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(fields) }),

    delete: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  },
}
