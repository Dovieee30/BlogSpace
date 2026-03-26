import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const navigate = useNavigate()
  const { user, signup } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

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
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setError(null)

    const { error: signupError } = await signup(form.email.trim(), form.password)
    setLoading(false)

    if (signupError) {
      setError(signupError)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center glass rounded-2xl p-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-2xl mx-auto mb-4">
            ✓
          </div>
          <h2 className="text-xl font-bold text-gray-100 mb-2">Check your email!</h2>
          <p className="text-gray-400 text-sm mb-6">
            We sent a confirmation link to <strong className="text-gray-200">{form.email}</strong>.
            Click it to activate your account, then sign in.
          </p>
          <Link to="/login" className="btn-primary inline-flex">Go to Login</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-xl shadow-brand-900/40">
            B
          </div>
          <h1 className="text-2xl font-bold text-gray-100">Create an account</h1>
          <p className="text-gray-400 text-sm mt-1">Join BlogSpace and start writing</p>
        </div>

        <div className="glass rounded-2xl p-7 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl border border-red-800 bg-red-950/50 text-red-300 text-sm">
                {error}
              </div>
            )}

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

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="input-field"
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
