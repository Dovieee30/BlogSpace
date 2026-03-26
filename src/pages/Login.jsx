import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Redirect if already logged in
  if (user) {
    navigate('/', { replace: true })
    return null
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: loginError } = await login(form.email.trim(), form.password)

    setLoading(false)
    if (loginError) {
      setError(loginError)
    } else {
      navigate('/')
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-xl shadow-brand-900/40">
            B
          </div>
          <h1 className="text-2xl font-bold text-gray-100">Welcome back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your BlogSpace account</p>
        </div>

        <div className="glass rounded-2xl p-7 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl border border-red-800 bg-red-950/50 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
                autoComplete="current-password"
                required
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
            Create one
          </Link>
        </p>

        <div className="text-center mt-4">
          <Link to="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
