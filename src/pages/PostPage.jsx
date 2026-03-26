import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPost() {
      setLoading(true)
      const { data, error } = await api.posts.getOne(id)
      if (error) setError(error)
      else setPost(data)
      setLoading(false)
    }
    fetchPost()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-4">
        <div className="h-8 bg-gray-800 rounded-xl w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-1/3" />
        <div className="space-y-2 pt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-3 bg-gray-800 rounded ${i % 3 === 2 ? 'w-4/6' : 'w-full'}`} />
          ))}
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="p-6 rounded-2xl border border-red-800 bg-red-950/30 text-red-300">
          <p className="font-semibold mb-2">Post not found</p>
          <p className="text-sm text-red-400">{error}</p>
          <Link to="/" className="btn-secondary mt-4 inline-flex">← Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
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

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-50 leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
            {post.author ? post.author[0].toUpperCase() : '?'}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">{post.author || 'Anonymous'}</p>
            <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />

      {/* Body */}
      <article className="prose prose-invert prose-sm sm:prose-base max-w-none">
        {post.body.split('\n').map((para, idx) =>
          para.trim() ? (
            <p key={idx} className="text-gray-300 leading-relaxed mb-4 text-base">
              {para}
            </p>
          ) : (
            <br key={idx} />
          )
        )}
      </article>
    </main>
  )
}
