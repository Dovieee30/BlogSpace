import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import PostCard from '../components/PostCard'
import SearchBar from '../components/SearchBar'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-1 bg-gray-800" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-gray-800 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-full" />
        <div className="h-3 bg-gray-800 rounded w-5/6" />
        <div className="h-3 bg-gray-800 rounded w-4/6" />
        <div className="flex justify-between items-center pt-4 border-t border-gray-800 mt-4">
          <div className="h-3 bg-gray-800 rounded w-20" />
          <div className="h-3 bg-gray-800 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      setError(null)
      const { data, error } = await api.posts.getAll()
      if (error) {
        setError(error)
      } else {
        setPosts(data || [])
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  // Real-time filter by title
  const filteredPosts = posts.filter((p) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
          <span className="text-gradient">BlogSpace</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
          Discover stories, ideas, and expertise from writers on every topic.
        </p>
        {user && (
          <Link to="/create" className="btn-primary mt-5 inline-flex">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Write a Post
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="max-w-lg mx-auto mb-8">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Results summary */}
      {!loading && !error && searchQuery && (
        <p className="text-sm text-gray-500 text-center mb-4">
          {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="max-w-md mx-auto p-4 rounded-xl border border-red-800 bg-red-950/50 text-red-300 text-sm text-center">
          <strong>Error loading posts:</strong> {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Posts grid */}
      {!loading && !error && filteredPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-gray-300 font-semibold text-lg mb-1">
            {searchQuery ? 'No posts match your search' : 'No posts yet'}
          </h3>
          <p className="text-gray-500 text-sm">
            {searchQuery ? 'Try a different keyword.' : 'Be the first to write something!'}
          </p>
          {!user && !searchQuery && (
            <Link to="/login" className="btn-primary mt-5 inline-flex">Sign in to write</Link>
          )}
        </div>
      )}
    </main>
  )
}
