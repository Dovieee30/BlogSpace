import { Link } from 'react-router-dom'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function PostCard({ post }) {
  const excerpt = post.body?.length > 150 ? post.body.slice(0, 150) + '…' : post.body

  return (
    <Link to={`/post/${post.id}`} className="block card group cursor-pointer">
      {/* Color accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand-600 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity" />

      <div className="p-6">
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
  )
}
