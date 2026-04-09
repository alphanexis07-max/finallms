import React, { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CalendarDays, Clock3, Link2, Plus, Video, X } from 'lucide-react'
import { api } from '../../lib/api'
import useRealtime from '../../hooks/useRealtime'

export default function AdminLiveClasses() {
  const tenantId = localStorage.getItem('lms_tenant_id')
  const [currentUser, setCurrentUser] = useState(null)
  const [classes, setClasses] = useState([])
  const [instructors, setInstructors] = useState([])
  const [students, setStudents] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [hostMode, setHostMode] = useState('self')
  const [loadingData, setLoadingData] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [regeneratingId, setRegeneratingId] = useState('')
  const [actionError, setActionError] = useState('')
  const [form, setForm] = useState({
    title: '',
    course_id: '',
    instructor_id: '',
    attendee_ids: [],
    start_at: '',
    duration_minutes: 60,
    amount: '',
    image_url: '',
  })

  const loadClasses = async () => {
    try {
      const res = await api('/lms/live-classes?limit=200')
      setClasses(res.items || [])
    } catch {
      setClasses([])
    }
  }

  const loadLookups = async () => {
    setLoadingData(true)
    try {
      const [me, instructorsRes, studentsRes] = await Promise.all([
        api('/auth/me'),
        api('/lms/users?role=instructor&limit=200'),
        api('/lms/users?role=student&limit=500'),
      ])
      setCurrentUser(me)
      setInstructors(instructorsRes.items || [])
      setStudents(studentsRes.items || [])
    } catch {
      setCurrentUser(null)
      setInstructors([])
      setStudents([])
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    loadClasses()
    loadLookups()
  }, [])

  useRealtime(tenantId ? `tenant:${tenantId}` : '', (payload) => {
    if (payload?.type?.startsWith('live_class.')) loadClasses()
  })

  const stats = useMemo(() => {
    const total = classes.length
    const upcoming = classes.filter((c) => c.status === 'upcoming').length
    const cancelled = classes.filter((c) => c.status === 'cancelled').length
    const today = classes.filter((c) => {
      if (!c.start_at) return false
      const d = new Date(c.start_at)
      const n = new Date()
      return d.toDateString() === n.toDateString()
    }).length
    return { total, upcoming, cancelled, today }
  }, [classes])

  const createClass = async () => {
    setCreateError('')
    const title = form.title.trim()
    const courseId = form.course_id.trim()
    const imageUrl = form.image_url.trim()
    const assignedInstructor = form.instructor_id.trim()
    const instructorId = hostMode === 'self' ? currentUser?._id || '' : assignedInstructor

    if (!title || !courseId || !form.start_at) {
      setCreateError('Please fill title, course ID and start date/time.')
      return
    }
    if (!instructorId) {
      setCreateError('Please choose who will host this class.')
      return
    }

    try {
      setCreating(true)
      await api('/lms/live-classes', {
        method: 'POST',
        body: JSON.stringify({
          title,
          course_id: courseId,
          instructor_id: instructorId,
          attendee_ids: form.attendee_ids,
          start_at: new Date(form.start_at).toISOString(),
          duration_minutes: Number(form.duration_minutes) || 60,
          amount: Number(form.amount || 0),
          image_url: imageUrl,
          repeat_daily: false,
        }),
      })
      setShowCreate(false)
      setForm({
        title: '',
        course_id: '',
        instructor_id: '',
        attendee_ids: [],
        start_at: '',
        duration_minutes: 60,
        amount: '',
        image_url: '',
      })
      await loadClasses()
    } catch (error) {
      setCreateError(error?.message || 'Unable to create live class. Check Zoom credentials and try again.')
    } finally {
      setCreating(false)
    }
  }

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((f) => ({ ...f, image_url: reader.result }))
      }
    }
    reader.readAsDataURL(file)
  }

  const cancelClass = async (id) => {
    setActionError('')
    await api(`/lms/live-classes/${id}`, { method: 'DELETE' }).catch(() => {})
    loadClasses()
  }

  const regenerateZoom = async (id) => {
    try {
      setActionError('')
      setRegeneratingId(id)
      await api(`/lms/live-classes/${id}/regenerate-zoom`, { method: 'POST' })
      await loadClasses()
    } catch (error) {
      setActionError(error?.message || 'Unable to regenerate Zoom link.')
    } finally {
      setRegeneratingId('')
    }
  }

  return (
    <div className="min-h-full bg-[radial-gradient(1200px_400px_at_100%_-20%,#d9ccff_0%,#f7fafd_50%,#f7fafd_100%)] p-4 sm:p-6">
      <section className="rounded-[16px] border border-black/[0.06] bg-white p-5 shadow-[0_14px_40px_-28px_rgba(31,41,55,0.45)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[28px] font-black tracking-[-0.02em] text-[#0f172a]">Live Classes Studio</h1>
            <p className="text-[13px] text-[#64748b]">Create classes, auto-generate Zoom links, and assign sessions instantly.</p>
          </div>
          <button onClick={() => { setCreateError(''); setShowCreate(true) }} className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#4f46e5] px-4 text-[13px] font-semibold text-white shadow-[0_10px_24px_-14px_rgba(79,70,229,0.9)] transition hover:bg-[#4338ca]">
            <Plus className="h-4 w-4" />
            Create Class
          </button>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total" value={stats.total} />
        <Stat label="Today" value={stats.today} />
        <Stat label="Upcoming" value={stats.upcoming} />
        <Stat label="Cancelled" value={stats.cancelled} />
      </div>

      <section className="mt-4 rounded-[16px] border border-black/[0.06] bg-white p-4 shadow-[0_14px_40px_-28px_rgba(31,41,55,0.45)]">
        <div className="mb-3 text-[14px] font-semibold text-[#0f172a]">Class List ({classes.length})</div>
        {actionError ? (
          <div className="mb-3 flex items-start gap-2 rounded-[10px] border border-[#fecaca] bg-[#fff1f2] p-3 text-[12px] text-[#991b1b]">
            <AlertCircle className="mt-[1px] h-4 w-4 shrink-0" />
            <p>{actionError}</p>
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((c) => (
            <div key={c._id} className="flex h-full flex-col rounded-[12px] border border-black/[0.07] bg-white p-3 shadow-[0_10px_24px_-20px_rgba(2,6,23,0.6)]">
              {c.image_url ? (
                <img
                  src={c.image_url}
                  alt={c.title}
                  className="h-32 w-full rounded-[10px] border border-black/[0.08] object-cover"
                />
              ) : (
                <div className="flex h-32 w-full items-center justify-center rounded-[10px] border border-dashed border-black/[0.12] bg-[#f8fafc] text-[11px] font-medium text-[#94a3b8]">
                  No class image
                </div>
              )}

              <div className="mt-3">
                <div className="line-clamp-2 text-[15px] font-semibold text-[#0f172a]">{c.title}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#475569]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f5f9] px-2 py-1"><CalendarDays className="h-3 w-3" />{c.start_at ? new Date(c.start_at).toLocaleString() : '-'}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f5f9] px-2 py-1"><Video className="h-3 w-3" />{c.status || 'upcoming'}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f5f9] px-2 py-1"><Clock3 className="h-3 w-3" />{c.duration_minutes || 60} mins</span>
                  <span className="inline-flex items-center rounded-full bg-[#eef2ff] px-2 py-1 font-semibold text-[#4338ca]">Amount: {Number(c.amount || 0).toFixed(2)}</span>
                </div>
                {c.zoom_error ? (
                  <p className="mt-2 text-[11px] text-[#b45309]">Zoom issue: {c.zoom_error}</p>
                ) : null}
              </div>

              <div className="mt-4 flex items-center gap-2">
                {c.join_url ? (
                  <a className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#c7d2fe] bg-[#eef2ff] px-3 text-[12px] font-medium text-[#4338ca]" href={c.join_url} target="_blank" rel="noreferrer">
                    <Link2 className="h-3 w-3" />
                    Join Link
                  </a>
                ) : (
                  <span className="text-[11px] text-[#64748b]">No join link</span>
                )}
              </div>

              <div className="mt-2 flex items-center gap-2">
                {!c.join_url ? (
                  <button
                    onClick={() => regenerateZoom(c._id)}
                    disabled={regeneratingId === c._id}
                    className="h-8 rounded-[8px] border border-[#c7d2fe] bg-[#eef2ff] px-3 text-[12px] font-medium text-[#4338ca] hover:bg-[#e0e7ff] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {regeneratingId === c._id ? 'Generating...' : 'Regenerate Zoom Link'}
                  </button>
                ) : null}
                <button onClick={() => cancelClass(c._id)} className="h-8 rounded-[8px] border border-black/[0.08] px-3 text-[12px] font-medium text-[#b91c1c] hover:bg-[#fff1f2]">
                  Cancel
                </button>
              </div>
            </div>
          ))}
          {classes.length === 0 && <p className="text-[12px] text-[#64748b]">No live classes found.</p>}
        </div>
      </section>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-[760px] rounded-[18px] bg-white p-6 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-[22px] font-black tracking-[-0.02em] text-[#0f172a]">Create Live Class</h2>
                <p className="text-[12px] text-[#64748b]">Zoom link is generated automatically on submit.</p>
              </div>
              <button onClick={() => setShowCreate(false)} className="rounded-full p-1 hover:bg-black/[0.06]"><X className="h-5 w-5 text-[#64748b]" /></button>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <InputLabel label="Class Title">
                  <input
                    placeholder="Advanced React Session"
                    className="h-11 w-full rounded-[10px] border border-black/[0.08] px-3 text-[13px] outline-none focus:border-[#4f46e5]"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </InputLabel>

                <InputLabel label="Course ID">
                  <input
                    placeholder="course_123"
                    className="h-11 w-full rounded-[10px] border border-black/[0.08] px-3 text-[13px] outline-none focus:border-[#4f46e5]"
                    value={form.course_id}
                    onChange={(e) => setForm((f) => ({ ...f, course_id: e.target.value }))}
                  />
                </InputLabel>

                <InputLabel label="Amount">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="h-11 w-full rounded-[10px] border border-black/[0.08] px-3 text-[13px] outline-none focus:border-[#4f46e5]"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  />
                </InputLabel>

                <div>
                  <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#475569]">Who will host?</p>
                  <div className="grid grid-cols-2 gap-2 rounded-[12px] bg-[#f1f5f9] p-1">
                    <button
                      type="button"
                      onClick={() => setHostMode('self')}
                      className={`h-10 rounded-[10px] text-[12px] font-semibold transition ${hostMode === 'self' ? 'bg-white text-[#0f172a] shadow' : 'text-[#64748b]'}`}
                    >
                      I will host
                    </button>
                    <button
                      type="button"
                      onClick={() => setHostMode('assign')}
                      className={`h-10 rounded-[10px] text-[12px] font-semibold transition ${hostMode === 'assign' ? 'bg-white text-[#0f172a] shadow' : 'text-[#64748b]'}`}
                    >
                      Assign Instructor
                    </button>
                  </div>
                </div>

                {hostMode === 'assign' ? (
                  <InputLabel label="Select Instructor">
                    <select
                      className="h-11 w-full rounded-[10px] border border-black/[0.08] px-3 text-[13px] outline-none focus:border-[#4f46e5]"
                      value={form.instructor_id}
                      onChange={(e) => setForm((f) => ({ ...f, instructor_id: e.target.value }))}
                    >
                      <option value="">Choose instructor</option>
                      {instructors.map((u) => (
                        <option key={u._id} value={u._id}>{u.full_name || u.email}</option>
                      ))}
                    </select>
                  </InputLabel>
                ) : (
                  <p className="rounded-[10px] border border-[#cbd5e1] bg-[#f8fafc] p-3 text-[12px] text-[#334155]">
                    Class host: <span className="font-semibold">{currentUser?.full_name || currentUser?.email || 'Current admin'}</span>
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <InputLabel label="Class image">
                  <div className="space-y-2">
                    {form.image_url ? (
                      <img
                        src={form.image_url}
                        alt="Class preview"
                        className="h-24 w-36 rounded-[8px] border border-black/[0.08] object-cover"
                      />
                    ) : null}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="w-full rounded-[10px] border border-black/[0.08] px-3 py-2 text-[12px] file:mr-3 file:rounded file:border-0 file:bg-[#4f46e5] file:px-3 file:py-1 file:text-white"
                    />
                    <input
                      type="url"
                      placeholder="or paste image URL"
                      className="h-11 w-full rounded-[10px] border border-black/[0.08] px-3 text-[13px] outline-none focus:border-[#4f46e5]"
                      value={form.image_url}
                      onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                    />
                  </div>
                </InputLabel>

                <InputLabel label="Start Date & Time">
                  <input
                    type="datetime-local"
                    className="h-11 w-full rounded-[10px] border border-black/[0.08] px-3 text-[13px] outline-none focus:border-[#4f46e5]"
                    value={form.start_at}
                    onChange={(e) => setForm((f) => ({ ...f, start_at: e.target.value }))}
                  />
                </InputLabel>

                <InputLabel label="Duration (minutes)">
                  <input
                    type="number"
                    min="15"
                    className="h-11 w-full rounded-[10px] border border-black/[0.08] px-3 text-[13px] outline-none focus:border-[#4f46e5]"
                    value={form.duration_minutes}
                    onChange={(e) => setForm((f) => ({ ...f, duration_minutes: Number(e.target.value || 60) }))}
                  />
                </InputLabel>

                <div>
                  <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#475569]">Invite Students</p>
                  <div className="max-h-[190px] overflow-y-auto rounded-[10px] border border-black/[0.08] p-2">
                    {loadingData ? (
                      <p className="p-2 text-[12px] text-[#64748b]">Loading users...</p>
                    ) : students.length === 0 ? (
                      <p className="p-2 text-[12px] text-[#64748b]">No students found.</p>
                    ) : (
                      students.map((s) => (
                        <label key={s._id} className="flex cursor-pointer items-center gap-2 rounded-[8px] p-2 hover:bg-[#f8fafc]">
                          <input
                            type="checkbox"
                            checked={form.attendee_ids.includes(s._id)}
                            onChange={(e) => {
                              const checked = e.target.checked
                              setForm((f) => ({
                                ...f,
                                attendee_ids: checked
                                  ? [...f.attendee_ids, s._id]
                                  : f.attendee_ids.filter((id) => id !== s._id),
                              }))
                            }}
                          />
                          <span className="text-[12px] text-[#334155]">{s.full_name || s.email}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {createError ? (
              <div className="mt-3 flex items-start gap-2 rounded-[10px] border border-[#fecaca] bg-[#fff1f2] p-3 text-[12px] text-[#991b1b]">
                <AlertCircle className="mt-[1px] h-4 w-4 shrink-0" />
                <p>{createError}</p>
              </div>
            ) : null}

            <div className="mt-4 flex gap-2">
              <button onClick={() => setShowCreate(false)} className="h-10 flex-1 rounded-[10px] border border-black/[0.08] text-[12px] font-semibold text-[#334155]">Cancel</button>
              <button onClick={createClass} disabled={creating} className="h-10 flex-1 rounded-[10px] bg-[#4f46e5] text-[12px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                {creating ? 'Creating...' : 'Create & Generate Zoom Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-[14px] border border-black/[0.06] bg-white p-4 shadow-[0_14px_30px_-30px_rgba(2,6,23,0.7)]">
      <div className="text-[12px] uppercase tracking-[0.06em] text-[#64748b]">{label}</div>
      <div className="mt-1 text-[28px] font-black tracking-[-0.02em] text-[#0f172a]">{value}</div>
    </div>
  )
}

function InputLabel({ label, children }) {
  return (
    <label>
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#475569]">{label}</p>
      {children}
    </label>
  )
}
