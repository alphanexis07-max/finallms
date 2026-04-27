import React, { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { api } from '../lib/api'

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let mounted = true
    const loadBlogs = async () => {
      try {
        setLoading(true)
        const res = await api('/lms/public/blogs?limit=100')
        if (!mounted) return
        const rows = Array.isArray(res?.items) ? res.items : []
        setBlogs(rows)
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Unable to load blogs.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadBlogs()
    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return blogs
    return blogs.filter((b) =>
      String(b?.title || '').toLowerCase().includes(q) ||
      String(b?.summary || '').toLowerCase().includes(q) ||
      String(b?.author_name || '').toLowerCase().includes(q),
    )
  }, [blogs, search])

  return (
    <div className="min-h-screen bg-[#f7efeb] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111b2f]">Blogs</h1>
          <p className="mt-2 text-sm text-slate-600">Read our latest articles, updates, and learning tips.</p>
        </div>

        <div className="mb-5">
          <div className="relative max-w-[380px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#0b8276]/30"
            />
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Loading blogs...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No blogs found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((blog) => (
              <article key={blog._id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                {blog.cover_image ? (
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    className="h-[190px] w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-[190px] w-full rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                    No cover image
                  </div>
                )}
                <h2 className="mt-4 line-clamp-2 text-xl font-bold text-[#111b2f]">{blog.title || 'Untitled Blog'}</h2>
                <p className="mt-1 text-xs text-slate-500">By {blog.author_name || 'Admin'}</p>
                <p className="mt-3 line-clamp-3 text-sm text-slate-600">{blog.summary || blog.content}</p>
                <p className="mt-3 whitespace-pre-line line-clamp-4 text-sm leading-6 text-slate-700">
                  {blog.content || ''}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
