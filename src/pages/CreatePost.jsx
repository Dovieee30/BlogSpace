import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function CreatePost() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({ title: '', body: '', author: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) {
      setError('Title and body are required.')
      return
    }

    setLoading(true)
    setError(null)

    const { error: insertError } = await api.posts.create(
      form.title.trim(),
      form.body.trim(),
      form.author.trim() || user?.email || 'Anonymous'
    )

    setLoading(false)
    if (insertError) {
      setError(insertError)
    } else {
      navigate('/')
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-brand-400 transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to posts
      </Link>

      <div className="glass rounded-2xl p-7 sm:p-8">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">New Post</h1>
            <p className="text-sm text-gray-400">Share your thoughts with the world</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error */}
          {error && (
            <div className="p-3.5 rounded-xl border border-red-800 bg-red-950/50 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="label">Title <span className="text-red-400">*</span></label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Your post title"
              className="input-field"
              required
            />
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="label">Your Name</label>
            <input
              id="author"
              name="author"
              type="text"
              value={form.author}
              onChange={handleChange}
              placeholder={user?.email || 'Anonymous'}
              className="input-field"
            />
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="label">Content <span className="text-red-400">*</span></label>
            <textarea
              id="body"
              name="body"
              value={form.body}
              onChange={handleChange}
              placeholder="Write your post content here…"
              rows={10}
              className="input-field resize-y min-h-[200px]"
              required
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing…
                </span>
              ) : (
                'Publish Post'
              )}
            </button>
            <Link to="/" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </main>
  )
}
