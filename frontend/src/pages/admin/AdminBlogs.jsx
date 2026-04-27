import React, { useMemo, useState, useEffect } from 'react'
import { Plus, Search, Trash2, Pencil, X } from 'lucide-react'
import { api } from '../../lib/api'

const EMPTY_FORM = {
  title: '',
  summary: '',
  content: '',
  cover_image: '',
  author_name: '',
  tags: '',
  published: true,
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlogId, setEditingBlogId] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)

  const loadBlogs = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api('/lms/blogs?limit=200')
      setBlogs(Array.isArray(res?.items) ? res.items : [])
    } catch (err) {
      setError(err?.message || 'Unable to load blogs.')
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBlogs()
  }, [])

  const filteredBlogs = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return blogs
    return blogs.filter((b) =>
      String(b?.title || '').toLowerCase().includes(q) ||
      String(b?.summary || '').toLowerCase().includes(q) ||
      String(b?.author_name || '').toLowerCase().includes(q),
    )
  }, [blogs, search])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingBlogId('')
    setIsModalOpen(false)
  }

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditingBlogId('')
    setIsModalOpen(true)
  }

  const openEdit = (blog) => {
    setForm({
      title: blog?.title || '',
      summary: blog?.summary || '',
      content: blog?.content || '',
      cover_image: blog?.cover_image || '',
      author_name: blog?.author_name || '',
      tags: Array.isArray(blog?.tags) ? blog.tags.join(', ') : '',
      published: blog?.published !== false,
    })
    setEditingBlogId(blog?._id || '')
    setIsModalOpen(true)
  }

  const saveBlog = async () => {
    const title = form.title.trim()
    const content = form.content.trim()
    if (!title || !content) {
      setError('Title and content are required.')
      return
    }

    setSaving(true)
    setError('')
    const payload = {
      title,
      summary: form.summary.trim(),
      content,
      cover_image: form.cover_image.trim(),
      author_name: form.author_name.trim() || 'Admin',
      tags: form.tags.split(',').map((x) => x.trim()).filter(Boolean),
      published: !!form.published,
    }

    try {
      if (editingBlogId) {
        await api(`/lms/blogs/${editingBlogId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
      } else {
        await api('/lms/blogs', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }
      await loadBlogs()
      resetForm()
    } catch (err) {
      setError(err?.message || 'Unable to save blog.')
    } finally {
      setSaving(false)
    }
  }

  const removeBlog = async (id) => {
    const ok = window.confirm('Delete this blog?')
    if (!ok) return
    setError('')
    try {
      await api(`/lms/blogs/${id}`, { method: 'DELETE' })
      await loadBlogs()
    } catch (err) {
      setError(err?.message || 'Unable to delete blog.')
    }
  }

  const handleCoverImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, cover_image: reader.result }))
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-full bg-[#f6f8fa] p-4 sm:p-5">
      <section className="rounded-[10px] border border-black/[0.08] bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[24px] font-bold text-[#0f172a]">Blogs</h2>
            <p className="text-[13px] text-[#64748b]">Create and publish blogs for your website.</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> New Blog
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs..."
              className="h-10 w-full rounded-[8px] border border-black/[0.08] pl-9 pr-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30"
            />
          </div>
        </div>

        {error ? (
          <div className="mb-3 rounded-[8px] border border-[#fecaca] bg-[#fff1f2] p-3 text-[12px] text-[#991b1b]">{error}</div>
        ) : null}

        {loading ? (
          <div className="rounded-[10px] border border-dashed border-black/[0.12] bg-[#fafcff] py-12 text-center text-[13px] text-[#94a3b8]">
            Loading blogs...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-black/[0.12] bg-[#fafcff] py-12 text-center text-[13px] text-[#94a3b8]">
            No blogs found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article key={blog._id} className="overflow-hidden rounded-[10px] border border-black/[0.08] bg-white">
                {blog.cover_image ? (
                  <img src={blog.cover_image} alt={blog.title} className="h-40 w-full object-cover" />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center bg-[#f8fafc] text-[12px] text-[#94a3b8]">No cover image</div>
                )}
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${blog.published ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#f1f5f9] text-[#475569]'}`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-[11px] text-[#94a3b8]">{blog.author_name || 'Admin'}</span>
                  </div>
                  <h3 className="line-clamp-2 text-[16px] font-bold text-[#0f172a]">{blog.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[12px] text-[#64748b]">{blog.summary || blog.content}</p>
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(blog)} className="inline-flex h-8 items-center gap-1 rounded-[7px] border border-black/[0.08] px-2.5 text-[12px] font-semibold text-[#334155]">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button onClick={() => removeBlog(blog._id)} className="inline-flex h-8 items-center gap-1 rounded-[7px] border border-[#fecaca] bg-[#fff1f2] px-2.5 text-[12px] font-semibold text-[#b91c1c]">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/35 p-3 sm:p-5" onClick={resetForm}>
          <div className="my-4 w-full max-w-[760px] rounded-[10px] border border-black/[0.08] bg-white shadow-2xl sm:my-8" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-black/[0.08] bg-white px-4 py-4 sm:px-6">
              <div>
                <h3 className="text-[22px] font-bold text-[#0f172a]">{editingBlogId ? 'Edit Blog' : 'Create Blog'}</h3>
                <p className="text-[12px] text-[#64748b]">This blog will be shown in public Blogs page.</p>
              </div>
              <button onClick={resetForm} className="text-[#94a3b8] hover:text-[#64748b]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
              <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Blog title *" className="h-10 w-full rounded-[8px] border border-black/[0.08] px-3 text-[13px]" />
              <input value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} placeholder="Short summary" className="h-10 w-full rounded-[8px] border border-black/[0.08] px-3 text-[13px]" />
              <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} placeholder="Blog content *" rows={8} className="w-full rounded-[8px] border border-black/[0.08] px-3 py-2 text-[13px]" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input value={form.author_name} onChange={(e) => setForm((p) => ({ ...p, author_name: e.target.value }))} placeholder="Author name (optional)" className="h-10 w-full rounded-[8px] border border-black/[0.08] px-3 text-[13px]" />
                <div className="flex items-center rounded-[8px] border border-black/[0.08] px-3 text-[12px] text-[#64748b]">
                  Cover image upload is optional
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#475569]">Upload cover image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  className="w-full rounded-[8px] border border-black/[0.08] px-3 py-2 text-[12px] file:mr-3 file:rounded-[6px] file:border-0 file:bg-[#5b3df6] file:px-3 file:py-1.5 file:font-medium file:text-white"
                />
                {form.cover_image ? (
                  <img src={form.cover_image} alt="Cover preview" className="mt-2 h-32 w-full rounded-[8px] border border-black/[0.08] object-cover sm:w-64" />
                ) : null}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} placeholder="Tags (comma separated)" className="h-10 w-full rounded-[8px] border border-black/[0.08] px-3 text-[13px]" />
                <label className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-black/[0.08] px-3 text-[13px] text-[#334155]">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))} />
                  Publish now
                </label>
              </div>
            </div>
            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-black/[0.08] bg-white px-4 py-4 sm:px-6">
              <button onClick={resetForm} className="h-10 rounded-[8px] border border-black/[0.08] bg-white px-4 text-[13px] font-semibold text-[#334155]">Cancel</button>
              <button onClick={saveBlog} disabled={saving} className="h-10 rounded-[8px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white disabled:opacity-70">
                {saving ? 'Saving...' : editingBlogId ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
