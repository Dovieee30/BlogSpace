import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-gray-800/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            B
          </div>
          <span className="text-lg font-bold text-gradient hidden sm:block">BlogSpace</span>
        </Link>

        {/* Nav Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/create" className="btn-primary text-xs sm:text-sm">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Post
              </Link>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.email[0].toUpperCase()}
                  </div>
                  <span className="text-xs text-gray-300 max-w-[120px] truncate">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-xs sm:text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
