import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Persist liked post IDs in localStorage
function getLiked() {
  try { return JSON.parse(localStorage.getItem('liked_posts') || '{}') } catch { return {} }
}

export default function PostCard({ post }) {
  const excerpt = post.body?.length > 150 ? post.body.slice(0, 150) + '…' : post.body
  const [liked, setLiked] = useState(() => !!getLiked()[post.id])
  const [likeCount, setLikeCount] = useState(post.likes || 0)
  const [pop, setPop] = useState(false)

  async function handleLike(e) {
    e.preventDefault()
    e.stopPropagation()

    const wasLiked = liked
    const action = wasLiked ? 'unlike' : 'like'

    // Optimistic update
    setLiked(!wasLiked)
    setLikeCount((c) => Math.max(0, c + (wasLiked ? -1 : 1)))

    if (!wasLiked) {
      setPop(true)
      setTimeout(() => setPop(false), 300)
    }

    // Persist liked state in localStorage
    const stored = getLiked()
    if (wasLiked) delete stored[post.id]
    else stored[post.id] = true
    localStorage.setItem('liked_posts', JSON.stringify(stored))

    // Sync with server
    const { data, error } = await api.posts.like(post.id, action)
    if (!error && data) {
      setLikeCount(data.likes) // use server count as source of truth
    } else if (error) {
      // Revert on failure
      setLiked(wasLiked)
      setLikeCount((c) => Math.max(0, c + (wasLiked ? 1 : -1)))
      const revert = getLiked()
      if (wasLiked) revert[post.id] = true
      else delete revert[post.id]
      localStorage.setItem('liked_posts', JSON.stringify(revert))
    }
  }

  return (
    <div className="relative">
      {/* Heart + count — top-right corner */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
        <span className="text-xs font-medium text-gray-400 tabular-nums min-w-[16px] text-right">
          {likeCount > 0 ? likeCount : ''}
        </span>
        <button
          onClick={handleLike}
          aria-label={liked ? 'Unlike' : 'Like'}
          className="p-1.5 rounded-full transition-all hover:bg-white/5"
          style={{ transform: pop ? 'scale(1.4)' : 'scale(1)', transition: 'transform 0.15s ease' }}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill={liked ? '#ef4444' : 'none'}
            stroke={liked ? '#ef4444' : '#9ca3af'}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <Link to={`/post/${post.id}`} className="block card group cursor-pointer">
        {/* Color accent bar */}
        <div className="h-1 bg-gradient-to-r from-brand-600 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity" />

        <div className="p-6 pr-16">
          {/* Title */}
          <h2 className="text-lg font-bold text-gray-100 mb-2 line-clamp-2 group-hover:text-brand-400 transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
            {excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {post.author ? post.author[0].toUpperCase() : '?'}
              </div>
              <span className="text-xs font-medium text-gray-300 truncate max-w-[100px]">
                {post.author || 'Anonymous'}
              </span>
            </div>

            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(post.created_at)}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
