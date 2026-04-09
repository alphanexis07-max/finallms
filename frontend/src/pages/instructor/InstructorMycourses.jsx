import React, { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Plus,
  BookOpen,
  Users,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  X,
  Clock,
  AlertCircle,
  Video,
  Link as LinkIcon,
} from 'lucide-react'
import { api } from '../../lib/api'

function getYoutubeVideoId(url) {
  if (!url) return ''

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0] || ''
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const fromQuery = parsed.searchParams.get('v')
      if (fromQuery) return fromQuery

      const parts = parsed.pathname.split('/').filter(Boolean)
      if (parts[0] === 'embed' || parts[0] === 'shorts') {
        return parts[1] || ''
      }
    }
  } catch {
    const cleaned = String(url).trim().replace(/[?#].*$/, '')
    return cleaned.split('/').filter(Boolean).pop() || ''
  }

  return ''
}

function Pill({ children, variant }) {
  const styles = {
    published: 'bg-emerald-100 text-emerald-700',
    draft: 'bg-gray-100 text-gray-600',
    review: 'bg-amber-100 text-amber-700',
    archived: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium ${styles[variant] || styles.draft}`}>
      {children}
    </span>
  )
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white border border-black/[0.08] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] text-[#94a3b8]">{label}</span>
        <div className="p-2 rounded-lg bg-[#ede9ff]">
          <Icon className="h-4 w-4 text-[#5b3df6]" />
        </div>
      </div>
      <p className="text-[28px] font-bold text-[#0f172a]">{value}</p>
    </div>
  )
}

function SimpleCreateCourseForm({ onBack, onCreate, loading: parentLoading }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    youtube_url: '',
    course_type: 'free',
    price: '',
  })
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title.trim()) {
      setError('Course title is required.')
      return
    }

    if (!form.youtube_url.trim()) {
      setError('YouTube URL is required.')
      return
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/).+/
    if (!youtubeRegex.test(form.youtube_url.trim())) {
      setError('Please enter a valid YouTube URL.')
      return
    }

    if (form.course_type === 'paid' && Number(form.price || 0) <= 0) {
      setError('Please enter a valid paid course price.')
      return
    }

    setError('')
    try {
      await onCreate(form)
      onBack()
    } catch {
      // Keep user on form when API fails.
    }
  }

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="p-4 pb-12 sm:p-6 sm:pb-16 lg:p-8">
        <section
          className="relative overflow-hidden rounded-lg border border-black/[0.08] p-6"
          style={{ background: 'linear-gradient(127.823deg, rgb(255,255,255) 0%, rgb(232,245,255) 100%)' }}
        >
          <div className="flex flex-col gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-[12px] text-[#94a3b8] hover:text-[#5b3df6] transition-colors w-fit"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
              Back to My Courses
            </button>

            <span className="inline-flex w-fit rounded-xl bg-[#ffd966] px-2.5 py-1.5 text-[11.915px] font-medium text-[#4b2e00]">Quick Create</span>
            <h2 className="max-w-[650px] text-[24px] font-bold leading-[1.2] text-[#0f172a] sm:text-[27.801px]">
              Add Course from YouTube
            </h2>
            <p className="max-w-[650px] text-[13.9px] text-[#94a3b8]">
              Paste your YouTube video link and add basic course details. The course will be created instantly.
            </p>
          </div>
        </section>

        <div className="mt-8">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border border-black/[0.08] p-6 space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                  <p className="text-[13px] text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1">
                  YouTube Video Link <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                  <input
                    name="youtube_url"
                    value={form.youtube_url}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                    className="w-full pl-9 pr-3 py-2 rounded-[8px] border border-black/[0.08] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                  />
                </div>
                <p className="text-[11px] text-[#94a3b8] mt-1">Paste any YouTube video URL (public or unlisted)</p>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Complete Web Development Bootcamp"
                  className="w-full px-3 py-2 rounded-[8px] border border-black/[0.08] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="What will students learn in this course?"
                  className="w-full px-3 py-2 rounded-[8px] border border-black/[0.08] text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0f172a] mb-1">Course Type</label>
                  <select
                    name="course_type"
                    value={form.course_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-[8px] border border-black/[0.08] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                    <option value="demo">Demo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#0f172a] mb-1">
                    Price {form.course_type === 'paid' && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#94a3b8]">₹</span>
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      placeholder={form.course_type === 'paid' ? 'Enter price' : '0'}
                      className="w-full pl-7 pr-3 py-2 rounded-[8px] border border-black/[0.08] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                    />
                  </div>
                </div>
              </div>

              {form.youtube_url && (
                <div className="mt-4 p-4 bg-[#f8fafc] rounded-lg border border-black/[0.08]">
                  <p className="text-[12px] font-medium text-[#0f172a] mb-2">Preview:</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#ede9ff] flex items-center justify-center">
                      <Video className="h-6 w-6 text-[#5b3df6]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-[#0f172a]">{form.title || 'Course Title'}</p>
                      <p className="text-[11px] text-[#94a3b8] truncate">{form.youtube_url}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 h-10 border border-black/[0.08] rounded-[8px] text-[13px] font-medium text-[#64748b] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={parentLoading}
                  className="flex-1 h-10 bg-[#5b3df6] rounded-[8px] text-[13px] font-medium text-white hover:bg-[#4a2ed8] disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {parentLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Course
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function EditCourseModal({ course, onClose, onSave }) {
  const [form, setForm] = useState({
    title: course.title,
    description: course.description || '',
    course_type: course.course_type || 'free',
    youtube_url: course.youtube_url || '',
    price: course.price || '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError('Course title is required.')
      return
    }
    if (!form.youtube_url.trim()) {
      setError('YouTube URL is required.')
      return
    }
    setError('')
    setLoading(true)
    await onSave(form)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[calc(100%-1.5rem)] sm:w-[560px] max-h-[90vh] overflow-y-auto bg-white rounded-[16px] shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-black/[0.08]">
          <h2 className="text-[18px] font-bold text-[#0f172a]">Edit Course</h2>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#0f172a]"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-[12px] text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-semibold text-[#0f172a] mb-1">YouTube URL</label>
            <input name="youtube_url" value={form.youtube_url} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." className="w-full rounded-[8px] border border-black/[0.08] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]" />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#0f172a] mb-1">Course Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full rounded-[8px] border border-black/[0.08] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]" />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#0f172a] mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full rounded-[8px] border border-black/[0.08] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#0f172a] mb-1">Course Type</label>
              <select name="course_type" value={form.course_type} onChange={handleChange} className="w-full rounded-[8px] border border-black/[0.08] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]">
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="demo">Demo</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#0f172a] mb-1">Price</label>
              <input name="price" value={form.price} onChange={handleChange} placeholder="0" className="w-full rounded-[8px] border border-black/[0.08] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-black/[0.08]">
          <button onClick={onClose} className="flex-1 h-10 border border-black/[0.08] rounded-[8px] text-[13px] font-medium text-[#64748b] hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 h-10 bg-[#5b3df6] rounded-[8px] text-[13px] font-medium text-white hover:bg-[#4a2ed8] disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InstructorMycourses() {
  const [allCourses, setAllCourses] = useState([])
  const [myCourses, setMyCourses] = useState([])
  const [showCreatePage, setShowCreatePage] = useState(false)
  const [editCourse, setEditCourse] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentUserId, setCurrentUserId] = useState('')

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError('')
      const [me, response] = await Promise.all([
        api('/auth/me'),
        api('/lms/courses?limit=300'),
      ])

      const userId = String(me?._id || '')
      const list = Array.isArray(response?.items) ? response.items : []
      const mine = userId ? list.filter((c) => String(c?.created_by || '') === userId) : list

      setCurrentUserId(userId)
      setAllCourses(list)
      setMyCourses(mine)
    } catch (err) {
      setError(err?.message || 'Unable to load courses.')
      setAllCourses([])
      setMyCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const handleCreate = async (formData) => {
    setLoading(true)
    try {
      setError('')
      await api('/lms/courses', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description || '',
          price: Number(formData.price || 0),
          course_type: formData.course_type || 'free',
          youtube_url: formData.youtube_url?.trim() || '',
        }),
      })
      await loadCourses()
    } catch (err) {
      setError(err?.message || 'Unable to create course.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEdit = async (form) => {
    setLoading(true)
    try {
      setError('')
      await api(`/lms/courses/${editCourse._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description || '',
          price: Number(form.price || 0),
          course_type: form.course_type,
          youtube_url: form.youtube_url?.trim() || '',
        }),
      })
      await loadCourses()
      setEditCourse(null)
    } catch (err) {
      setError(err?.message || 'Unable to update course.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setLoading(true)
    try {
      setError('')
      await api(`/lms/courses/${id}`, { method: 'DELETE' })
      await loadCourses()
      setDeleteId(null)
    } catch (err) {
      setError(err?.message || 'Unable to delete course.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = useMemo(() => {
    return myCourses.filter((c) => {
      const matchSearch = c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchFilter = filterStatus === 'all' || c.course_type === filterStatus
      return matchSearch && matchFilter
    })
  }, [myCourses, searchTerm, filterStatus])

  const getYoutubeThumbnail = (url) => {
    const videoId = getYoutubeVideoId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : ''
  }

  const stats = {
    total: myCourses.length,
    paid: myCourses.filter((c) => c.course_type === 'paid').length,
    free: myCourses.filter((c) => c.course_type === 'free').length,
    totalStudents: myCourses.reduce((s, c) => s + (c.students_count || 0), 0),
  }

  if (showCreatePage) {
    return (
      <SimpleCreateCourseForm onBack={() => setShowCreatePage(false)} onCreate={handleCreate} loading={loading} />
    )
  }

  return (
    <div className="min-h-full bg-[#f6f8fa]">
      <div className="space-y-4 p-4 sm:p-5">
        <section className="rounded-[12px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] p-6">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
            <div>
              <div className="inline-flex items-center gap-2 rounded-[12px] bg-[#ffd966] px-3 py-1.5 mb-4">
                <BookOpen className="h-4 w-4 text-[#4b2e00]" />
                <span className="text-[12px] font-medium text-[#4b2e00]">Instructor Workspace</span>
              </div>
              <h1 className="text-[26px] font-bold leading-tight text-[#0f172a] sm:text-[32px]">My Course Management</h1>
              <p className="mt-2 max-w-[560px] text-[13px] text-[#94a3b8]">
                Add courses by pasting YouTube links. Manage, edit, and track your courses in one place.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowCreatePage(true)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-[#5b3df6] px-4 py-2 rounded-[8px] text-[13px] font-semibold text-white hover:bg-[#4a2ed8] transition-colors disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" /> Add Courses
                </button>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-[13px] text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="My Courses" value={stats.total} icon={BookOpen} />
          <StatCard label="Paid Courses" value={stats.paid} icon={CheckCircle} />
          <StatCard label="Free Courses" value={stats.free} icon={Users} />
          <StatCard label="Total Students" value={stats.totalStudents} icon={Users} />
        </div>

        <div className="bg-white border border-black/[0.08] rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-black/[0.08] rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'free', 'paid', 'demo'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors ${
                    filterStatus === s ? 'bg-[#5b3df6] text-white' : 'bg-gray-100 text-[#64748b] hover:bg-gray-200'
                  }`}
                >
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course) => (
            <div key={course._id} className="bg-white border border-black/[0.08] rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-40 bg-gradient-to-br from-[#5b3df6]/20 to-[#ede9ff] flex items-center justify-center">
                {course.youtube_url ? (
                  <img
                    src={getYoutubeThumbnail(course.youtube_url)}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80'
                    }}
                  />
                ) : (
                  <Video className="h-12 w-12 text-[#5b3df6] opacity-50" />
                )}
                <div className="absolute top-3 right-3">
                  <Pill variant={course.course_type === 'paid' ? 'published' : course.course_type === 'free' ? 'draft' : 'review'}>
                    {course.course_type}
                  </Pill>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="text-[15px] font-bold text-[#0f172a] line-clamp-1 flex-1">{course.title}</h3>
                </div>
                <p className="text-[12px] text-[#94a3b8] line-clamp-2 mb-3">{course.description || 'No description'}</p>
                <div className="flex flex-wrap gap-3 mb-3 text-[11px] text-[#94a3b8]">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(course.created_at || course.createdAt || Date.now()).toLocaleDateString()}</span>
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{course.students_count || 0} students</span>
                </div>
                <div className="mb-2">
                  {course.youtube_url && (
                    <a href={course.youtube_url} target="_blank" rel="noreferrer" className="text-[11px] text-[#5b3df6] hover:underline truncate block">
                      Watch on YouTube →
                    </a>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-black/[0.08]">
                  <span className="text-[12px] font-semibold text-[#0f172a]">₹{Number(course.price || 0)}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => setEditCourse(course)} className="p-1.5 text-[#64748b] hover:text-[#5b3df6] hover:bg-[#ede7ff] rounded-md transition-colors" title="Edit"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteId(course._id)} className="p-1.5 text-[#64748b] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    <button className="p-1.5 text-[#64748b] hover:text-[#5b3df6] hover:bg-[#ede7ff] rounded-md transition-colors" title="View"><Eye className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-12">
            <Video className="h-12 w-12 text-[#94a3b8] mx-auto mb-3" />
            <p className="text-[14px] text-[#94a3b8]">No courses found</p>
            <button onClick={() => setShowCreatePage(true)} className="mt-3 text-[13px] text-[#5b3df6] hover:text-[#4a2ed8] font-medium">Add your first course from YouTube</button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5b3df6] mx-auto" />
            <p className="mt-3 text-[13px] text-[#94a3b8]">Loading...</p>
          </div>
        )}
      </div>

      {editCourse && <EditCourseModal course={editCourse} onClose={() => setEditCourse(null)} onSave={handleSaveEdit} />}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[380px] bg-white rounded-[16px] shadow-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3"><AlertCircle className="h-6 w-6 text-red-500" /></div>
            <h3 className="text-[17px] font-bold text-[#0f172a] mb-2">Delete Course?</h3>
            <p className="text-[13px] text-[#64748b] mb-5">This action cannot be undone. All course data will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 h-10 border border-black/[0.08] rounded-[8px] text-[13px] font-medium text-[#64748b] hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} disabled={loading} className="flex-1 h-10 bg-red-500 rounded-[8px] text-[13px] font-medium text-white hover:bg-red-600 disabled:opacity-50">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
