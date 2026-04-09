import React, { useEffect, useMemo, useState } from 'react'
import {
  PlayCircle,
  Users,
  Video,
  Search,
  CalendarDays,
  Clock,
  BarChart2,
  MessageSquare,
  Monitor,
  BookOpen,
  Link2,
  X,
  CheckCircle2,
  UserCheck,
} from 'lucide-react'
import { api } from '../../lib/api'

const isClassCreationManagedByAdmin = true
const FILTERS = ['All', 'Live Now', 'Upcoming', 'Completed']

const STATUS_CONFIG = {
  live: {
    label: 'Live',
    bg: 'bg-[#fee2e2]',
    text: 'text-[#991b1b]',
    dot: 'bg-[#ef4444]',
    pulse: true,
  },
  upcoming: {
    label: 'Upcoming',
    bg: 'bg-[#fef9c3]',
    text: 'text-[#854d0e]',
    dot: 'bg-[#eab308]',
    pulse: false,
  },
  completed: {
    label: 'Completed',
    bg: 'bg-[#dcfce7]',
    text: 'text-[#14532d]',
    dot: 'bg-[#22c55e]',
    pulse: false,
  },
}

function formatDayLabel(dateValue) {
  if (!dateValue) return 'Unscheduled'
  const date = new Date(dateValue)
  const now = new Date()

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'

  return date.toLocaleDateString(undefined, { weekday: 'long' })
}

function formatClockRange(dateValue, durationMins) {
  if (!dateValue) return '-'
  const start = new Date(dateValue)
  const end = new Date(start.getTime() + (Number(durationMins || 60) * 60 * 1000))

  const startText = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const endText = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${startText} to ${endText}`
}

function getDisplayStatus(rawStatus, startAt) {
  const status = String(rawStatus || 'upcoming').toLowerCase()
  if (status === 'cancelled') return 'upcoming'
  if (status === 'completed') return 'completed'
  if (!startAt) return 'upcoming'

  const now = Date.now()
  const start = new Date(startAt).getTime()
  const end = start + (60 * 60 * 1000)

  if (now >= start && now <= end) return 'live'
  if (now > end) return 'completed'
  return 'upcoming'
}

function toSession(item) {
  const enrolled = Array.isArray(item.attendee_ids) ? item.attendee_ids.length : 0
  const status = getDisplayStatus(item.status, item.start_at)
  const platform = item.meeting_provider ? String(item.meeting_provider).toUpperCase() : 'ZOOM'

  return {
    id: item._id,
    title: item.title || 'Untitled live class',
    course: item.course_id ? `Course ID: ${item.course_id}` : 'Course not assigned',
    time: formatDayLabel(item.start_at),
    clock: formatClockRange(item.start_at, item.duration_minutes),
    duration: `${item.duration_minutes || 60} mins`,
    platform,
    description: item.description || 'This session includes concept explanation, quick checks, and a summary before close.',
    status,
    cta: status === 'live' ? 'Open class room' : status === 'completed' ? 'View summary' : 'View details',
    link: item.join_url || '',
    studentsPresent: status === 'live' ? enrolled : 0,
    studentsEnrolled: enrolled,
    attendanceRate: enrolled > 0 ? 100 : 0,
    chatMessages: 0,
    currentSlide: status === 'completed' ? 'Completed' : 'Live board',
    tags: [formatDayLabel(item.start_at), platform, status === 'live' ? 'Live now' : status],
  }
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </span>
  )
}

function SessionDetailModal({ session, onClose }) {
  const isLive = session.status === 'live'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5" onClick={onClose}>
      <div
        className="w-full max-w-[680px] max-h-[90vh] overflow-y-auto rounded-[16px] border border-black/[0.08] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative rounded-t-[16px] p-5 ${isLive ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-white/10">
            <X className={`h-5 w-5 ${isLive ? 'text-white/70' : 'text-[#94a3b8]'}`} />
          </button>
          <div className="flex items-start gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] ${isLive ? 'bg-[#ef4444]' : 'bg-[#5b3df6]'}`}>
              <Video className="h-5 w-5 text-white" />
            </div>
            <div>
              <StatusBadge status={session.status} />
              <h2 className={`mt-1 text-[19px] font-bold leading-tight ${isLive ? 'text-white' : 'text-[#0f172a]'}`}>{session.title}</h2>
              <p className={`text-[12px] mt-0.5 ${isLive ? 'text-white/60' : 'text-[#64748b]'}`}>{session.course}</p>
            </div>
          </div>

          {isLive && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Users, label: 'Students Live', value: session.studentsPresent },
                { icon: BarChart2, label: 'Attendance', value: `${session.attendanceRate}%` },
                { icon: MessageSquare, label: 'Chat Msgs', value: session.chatMessages },
                { icon: Monitor, label: 'Current Slide', value: session.currentSlide },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-[10px] bg-white/10 p-3">
                  <Icon className="h-4 w-4 text-white/50" />
                  <p className="mt-1 text-[16px] font-bold text-white">{value}</p>
                  <p className="text-[10px] text-white/50">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { label: 'Course', value: session.course, icon: BookOpen },
              { label: 'Date & Time', value: `${session.time} - ${session.clock}`, icon: CalendarDays },
              { label: 'Duration', value: session.duration, icon: Clock },
              { label: 'Platform', value: session.platform, icon: Video },
              { label: 'Students Enrolled', value: session.studentsEnrolled, icon: Users },
              ...(isLive ? [{ label: 'Live Attendance', value: `${session.attendanceRate}%`, icon: BarChart2 }] : []),
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 rounded-[10px] border border-black/[0.06] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#f7f4ff]">
                  <Icon className="h-4 w-4 text-[#5b3df6]" />
                </div>
                <div>
                  <p className="text-[11px] text-[#94a3b8]">{label}</p>
                  <p className="text-[13px] font-semibold text-[#0f172a]">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[10px] bg-[#f8fafc] border border-black/[0.07] p-4">
            <p className="text-[12px] text-[#64748b]">{session.description}</p>
          </div>

          {session.link && (
            <div className="flex items-center gap-2 rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-3">
              <Link2 className="h-4 w-4 text-[#5b3df6] shrink-0" />
              <span className="text-[12px] text-[#5b3df6] truncate flex-1">{session.link}</span>
              <button
                onClick={() => window.open(session.link, '_blank')}
                className="ml-auto shrink-0 rounded-[6px] bg-[#5b3df6] px-3 py-1 text-[11px] font-semibold text-white"
              >
                Open
              </button>
            </div>
          )}

          {isLive && session.link && (
            <button
              onClick={() => window.open(session.link, '_blank')}
              className="w-full h-11 rounded-[10px] bg-[#ef4444] text-[14px] font-semibold text-white flex items-center justify-center gap-2 hover:bg-[#dc2626] transition-colors"
            >
              <PlayCircle className="h-5 w-5" /> Open Class Room
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function SessionCard({ session, onViewClick }) {
  const isLive = session.status === 'live'
  const isCompleted = session.status === 'completed'

  return (
    <div className={`group relative overflow-hidden rounded-[14px] border transition-all duration-200 hover:shadow-md ${isLive ? 'border-[#ef4444]/30 bg-[#fff5f5]' : 'border-black/[0.08] bg-white'}`}>
      {isLive && <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#ef4444] to-[#f97316]" />}
      {isCompleted && <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#16a34a] to-[#22c55e]" />}
      {!isLive && !isCompleted && <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#5b3df6] to-[#818cf8]" />}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <StatusBadge status={session.status} />
          <span className="inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-2.5 py-1 text-[10px] font-semibold text-[#14532d]">
            <UserCheck className="h-3 w-3" /> Instructor
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] ${isLive ? 'bg-[#ef4444]' : isCompleted ? 'bg-[#dcfce7]' : 'bg-[#f7f4ff]'}`}>
            <Video className={`h-4 w-4 ${isLive ? 'text-white' : isCompleted ? 'text-[#16a34a]' : 'text-[#5b3df6]'}`} />
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#0f172a] leading-tight">{session.title}</p>
            <p className="text-[11px] text-[#64748b]">{session.course}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {session.tags.map((tag) => (
            <span
              key={`${session.id}-${tag}`}
              className={`inline-flex h-[22px] items-center rounded-[8px] px-2 text-[10px] font-medium ${tag === 'Live now' ? 'bg-[#ffd966] text-[#4b2e00]' : 'bg-[#f1f5f9] text-[#64748b]'}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <CalendarDays className="h-3.5 w-3.5 text-[#94a3b8]" />
            <span>{session.time} - {session.clock}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <Users className="h-3.5 w-3.5 text-[#94a3b8]" />
            <span>{session.studentsEnrolled} students enrolled</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <Video className="h-3.5 w-3.5 text-[#94a3b8]" />
            <span>{session.platform} - {session.duration}</span>
          </div>
        </div>

        {isLive && (
          <div className="mt-3 flex items-center gap-1.5 rounded-[8px] bg-[#ef4444]/10 px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ef4444] animate-pulse" />
            <span className="text-[11px] font-semibold text-[#ef4444]">Live now - {session.studentsPresent} students in class</span>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onViewClick(session)}
            className="flex-1 text-[12px] font-medium text-[#64748b] border border-black/[0.08] rounded-[8px] h-9 hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
          {isLive && session.link ? (
            <button
              onClick={() => window.open(session.link, '_blank')}
              className="flex-1 h-9 rounded-[8px] bg-[#ef4444] text-[12px] font-semibold text-white flex items-center justify-center gap-1.5 hover:bg-[#dc2626] transition-colors"
            >
              <PlayCircle className="h-4 w-4" /> Open Classroom
            </button>
          ) : isCompleted ? (
            <button
              onClick={() => onViewClick(session)}
              className="flex-1 h-9 rounded-[8px] bg-[#16a34a] text-[12px] font-semibold text-white flex items-center justify-center gap-1.5 hover:bg-[#15803d] transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" /> View Summary
            </button>
          ) : (
            <button
              onClick={() => onViewClick(session)}
              className="flex-1 h-9 rounded-[8px] bg-[#5b3df6] text-[12px] font-semibold text-white flex items-center justify-center gap-1.5 hover:bg-[#4a2ed8] transition-colors"
            >
              <CalendarDays className="h-4 w-4" /> Scheduled
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function InstructorOnlineClasses() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [detailModal, setDetailModal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sessions, setSessions] = useState([])

  const loadSessions = async () => {
    try {
      setLoading(true)
      setError('')
      const [me, res] = await Promise.all([api('/auth/me'), api('/lms/live-classes?limit=300')])

      const possibleInstructorIds = [
        me?._id,
        me?.id,
        me?.sub,
      ]
        .map((x) => String(x || '').trim())
        .filter(Boolean)
      const items = Array.isArray(res?.items) ? res.items : []

      // Show only classes assigned to this instructor. Never fall back to all classes.
      const assigned = items.filter((x) => {
        const instructorId = String(x?.instructor_id || '').trim()
        return instructorId && possibleInstructorIds.includes(instructorId)
      })

      setSessions(assigned.map(toSession))
    } catch (err) {
      setError(err?.message || 'Failed to load online classes')
      setSessions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()
  }, [])

  const liveCount = sessions.filter((s) => s.status === 'live').length
  const upcomingCount = sessions.filter((s) => s.status === 'upcoming').length
  const completedCount = sessions.filter((s) => s.status === 'completed').length

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const matchFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Live Now' && s.status === 'live') ||
        (activeFilter === 'Upcoming' && s.status === 'upcoming') ||
        (activeFilter === 'Completed' && s.status === 'completed')
      const q = search.toLowerCase()
      const matchSearch =
        s.title.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q) ||
        s.platform.toLowerCase().includes(q)
      return matchFilter && matchSearch
    })
  }, [sessions, activeFilter, search])

  const liveSession = sessions.find((s) => s.status === 'live')

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-7">
        <section className="rounded-[10px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-[12px] bg-[#ffd966] px-3 py-1.5 text-[12px] font-medium text-[#4b2e00]">
                <Video className="h-3.5 w-3.5" /> Instructor Online Classes
              </div>
              <h1 className="mt-3 text-[26px] font-bold leading-tight text-[#0f172a]">
                Integrated Science Foundation - Online classes
              </h1>
              <p className="mt-2 text-[13px] text-[#94a3b8]">
                Manage upcoming live sessions and join your assigned Zoom classrooms directly.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  `${liveCount} live now`,
                  `${sessions.reduce((sum, s) => sum + Number(s.studentsEnrolled || 0), 0)} students this batch`,
                  `${sessions.length} total sessions`,
                  `${upcomingCount} upcoming sessions`,
                ].map((t) => (
                  <div key={t} className="inline-flex h-8 items-center rounded-[10px] border border-black/[0.08] bg-white px-3 text-[11px] font-medium text-[#0f172a]">{t}</div>
                ))}
              </div>

              {isClassCreationManagedByAdmin && (
                <div className="mt-4 rounded-[8px] border border-[#c7d2fe] bg-[#eef2ff] px-3 py-2 text-[12px] text-[#4338ca]">
                  Online class creation is admin-managed. You can join and conduct assigned sessions.
                </div>
              )}
            </div>

            {liveSession && (
              <div className="w-full shrink-0 rounded-[10px] border border-black/[0.08] bg-white p-4 lg:w-[270px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full bg-[#ef4444] animate-pulse" />
                  <span className="text-[12px] font-semibold text-[#ef4444]">Live right now</span>
                </div>
                <h3 className="font-bold text-[14px] text-[#0f172a] leading-snug">{liveSession.title}</h3>
                <p className="text-[11px] text-[#94a3b8] mt-1">{liveSession.course}</p>
                <div className="mt-3 space-y-1.5 text-[11px] text-[#64748b]">
                  <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {liveSession.studentsPresent} students in class</div>
                  <div className="flex items-center gap-1.5"><Video className="h-3.5 w-3.5" /> {liveSession.platform} - {liveSession.duration}</div>
                </div>
                {liveSession.link ? (
                  <button
                    onClick={() => window.open(liveSession.link, '_blank')}
                    className="mt-4 w-full h-10 rounded-[8px] bg-[#ef4444] text-[13px] font-semibold text-white flex items-center justify-center gap-2 hover:bg-[#dc2626] transition-colors"
                  >
                    <PlayCircle className="h-4 w-4" /> Open Class Room
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-black/[0.08] rounded-[10px] p-4">
            <p className="text-[11px] text-[#94a3b8] mb-1">Live attendance</p>
            <p className="text-[28px] font-bold text-[#0f172a]">{liveSession ? `${liveSession.attendanceRate}%` : '0%'}</p>
          </div>
          <div className="bg-white border border-black/[0.08] rounded-[10px] p-4">
            <p className="text-[11px] text-[#94a3b8] mb-1">Upcoming sessions</p>
            <p className="text-[28px] font-bold text-[#0f172a]">{upcomingCount}</p>
          </div>
          <div className="bg-white border border-black/[0.08] rounded-[10px] p-4 col-span-2 sm:col-span-1">
            <p className="text-[11px] text-[#94a3b8] mb-1">Classes completed</p>
            <p className="text-[28px] font-bold text-[#0f172a]">{completedCount}</p>
          </div>
        </div>

        <div className="rounded-[10px] border border-black/[0.08] bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[18px] font-bold text-[#0f172a]">Class Schedule</h2>
              <p className="text-[12px] text-[#94a3b8] mt-0.5">Filter sessions by status or search by title/platform.</p>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-[8px] border border-black/[0.08] pl-9 pr-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30"
                placeholder="Search by topic, platform, course..."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`h-9 rounded-[8px] px-3 text-[12px] font-medium transition-colors ${activeFilter === f ? 'bg-[#5b3df6] text-white' : 'border border-black/[0.08] bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9]'}`}
                >
                  {f}
                  {f === 'Live Now' && (
                    <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#ef4444] text-[9px] font-bold text-white">{liveCount}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[12px] border border-black/[0.08] bg-white py-14 text-center">
            <p className="text-[14px] font-medium text-[#94a3b8]">Loading sessions...</p>
          </div>
        ) : error ? (
          <div className="rounded-[12px] border border-red-200 bg-red-50 py-8 text-center">
            <p className="text-[13px] text-red-600">{error}</p>
            <button onClick={loadSessions} className="mt-3 h-9 rounded-[8px] bg-[#5b3df6] px-4 text-[12px] font-semibold text-white">Retry</button>
          </div>
        ) : (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#0f172a]">
                {activeFilter === 'All' ? 'All Sessions' : activeFilter === 'Live Now' ? 'Live Sessions' : activeFilter === 'Upcoming' ? 'Upcoming Sessions' : 'Completed Sessions'}
              </h2>
              <span className="text-[12px] text-[#94a3b8]">{filtered.length} sessions</span>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-[12px] border border-dashed border-black/[0.12] bg-white py-14 text-center">
                <Video className="mx-auto h-8 w-8 text-[#cbd5e1]" />
                <p className="mt-3 text-[14px] font-medium text-[#94a3b8]">No sessions found</p>
                <p className="text-[12px] text-[#cbd5e1] mt-1">Try a different filter or search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onViewClick={(s) => setDetailModal(s)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {detailModal && (
        <SessionDetailModal
          session={detailModal}
          onClose={() => setDetailModal(null)}
        />
      )}
    </div>
  )
}
