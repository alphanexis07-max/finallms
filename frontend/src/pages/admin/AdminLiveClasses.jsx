import React, { useState } from 'react'
import {
  Search, Plus, Video, ChevronDown, ArrowLeft, X, CalendarDays, Clock3, Link2,
  Users, BookOpen, Wifi, WifiOff, Trash2, Filter, Eye, CheckCircle2, AlertCircle,
  PlayCircle, Clock, BarChart2, UserCheck, MessageSquare, Monitor
} from 'lucide-react'

const A1 = 'https://i.pravatar.cc/40?img=1'
const A2 = 'https://i.pravatar.cc/40?img=2'
const A3 = 'https://i.pravatar.cc/40?img=3'
const A4 = 'https://i.pravatar.cc/40?img=4'
const A5 = 'https://i.pravatar.cc/40?img=5'

const STUDENTS = [
  { name: 'Riya Mehta', avatar: 'https://i.pravatar.cc/32?img=10', status: 'present', joined: '4:01 PM' },
  { name: 'Aarav Shah', avatar: 'https://i.pravatar.cc/32?img=11', status: 'present', joined: '4:00 PM' },
  { name: 'Priya Nair', avatar: 'https://i.pravatar.cc/32?img=12', status: 'absent', joined: '—' },
  { name: 'Kabir Singh', avatar: 'https://i.pravatar.cc/32?img=13', status: 'present', joined: '4:03 PM' },
  { name: 'Ananya Roy', avatar: 'https://i.pravatar.cc/32?img=14', status: 'late', joined: '4:12 PM' },
  { name: 'Dev Patel', avatar: 'https://i.pravatar.cc/32?img=15', status: 'present', joined: '4:01 PM' },
  { name: 'Sneha Iyer', avatar: 'https://i.pravatar.cc/32?img=16', status: 'absent', joined: '—' },
  { name: 'Aryan Khanna', avatar: 'https://i.pravatar.cc/32?img=17', status: 'present', joined: '4:00 PM' },
]

const INITIAL_SESSIONS = [
  {
    id: 1,
    title: 'Math Mastery Live',
    course: 'Mathematics Level 3',
    instructor: 'Aisha Verma',
    instructorAvatar: A1,
    date: 'Today',
    time: '4:00 PM',
    duration: '60 mins',
    platform: 'Zoom',
    status: 'live',
    link: 'https://zoom.us/j/123456',
    topic: 'Quadratic Equations – Chapter 4',
    attendanceRate: 75,
    studentsEnrolled: 32,
    studentsPresent: 24,
    chatMessages: 18,
    currentSlide: 'Slide 7 / 20',
    screenShare: true,
    deleted: false,
  },
  {
    id: 2,
    title: 'Science Lab Workshop',
    course: 'Science Grade 8',
    instructor: 'Liam Carter',
    instructorAvatar: A2,
    date: 'Tomorrow',
    time: '11:00 AM',
    duration: '90 mins',
    platform: 'Google Meet',
    status: 'upcoming',
    link: '',
    topic: 'Chemical Bonding Lab Session',
    attendanceRate: 0,
    studentsEnrolled: 28,
    studentsPresent: 0,
    chatMessages: 0,
    currentSlide: '—',
    screenShare: false,
    deleted: false,
  },
  {
    id: 3,
    title: 'English Speaking Club',
    course: 'Creative English Level 1',
    instructor: 'Nadia Brown',
    instructorAvatar: A3,
    date: 'Fri',
    time: '5:30 PM',
    duration: '60 mins',
    platform: 'Zoom',
    status: 'upcoming',
    link: 'https://zoom.us/j/789012',
    topic: 'Public Speaking Techniques',
    attendanceRate: 0,
    studentsEnrolled: 20,
    studentsPresent: 0,
    chatMessages: 0,
    currentSlide: '—',
    screenShare: false,
    deleted: false,
  },
  {
    id: 4,
    title: 'Coding for Kids Bootcamp',
    course: 'Coding Beginners',
    instructor: 'Arjun Singh',
    instructorAvatar: A4,
    date: 'Sat',
    time: '10:00 AM',
    duration: '120 mins',
    platform: 'Zoom',
    status: 'recent',
    link: 'https://zoom.us/j/expired',
    topic: 'Loops & Conditions in Scratch',
    attendanceRate: 88,
    studentsEnrolled: 18,
    studentsPresent: 16,
    chatMessages: 42,
    currentSlide: 'Completed',
    screenShare: false,
    deleted: false,
  },
  {
    id: 5,
    title: 'Physics Fundamentals',
    course: 'Physics Grade 10',
    instructor: 'Sara Malik',
    instructorAvatar: A5,
    date: 'Wed',
    time: '3:00 PM',
    duration: '75 mins',
    platform: 'Google Meet',
    status: 'recent',
    link: 'https://meet.google.com/abc-xyz',
    topic: 'Newton\'s Laws of Motion',
    attendanceRate: 92,
    studentsEnrolled: 25,
    studentsPresent: 23,
    chatMessages: 31,
    currentSlide: 'Completed',
    screenShare: false,
    deleted: false,
  },
]

const STATUS_CONFIG = {
  live:     { label: 'Live', bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]', dot: 'bg-[#ef4444]' },
  upcoming: { label: 'Upcoming', bg: 'bg-[#fef9c3]', text: 'text-[#854d0e]', dot: 'bg-[#eab308]' },
  recent:   { label: 'Completed', bg: 'bg-[#dcfce7]', text: 'text-[#14532d]', dot: 'bg-[#22c55e]' },
  deleted:  { label: 'Deleted', bg: 'bg-[#f1f5f9]', text: 'text-[#64748b]', dot: 'bg-[#94a3b8]' },
}

const FILTERS = ['All Classes', 'Live', 'Upcoming', 'Recent', 'Deleted']

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${status === 'live' ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </span>
  )
}

function AttendanceDot({ status }) {
  const map = { present: 'bg-[#22c55e] text-[#14532d]', absent: 'bg-[#f1f5f9] text-[#64748b]', late: 'bg-[#fbbf24] text-[#78350f]' }
  const label = { present: 'Present', absent: 'Absent', late: 'Late' }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${map[status]}`}>
      {label[status]}
    </span>
  )
}

function ClassDetailModal({ session, onClose }) {
  const [activeTab, setActiveTab] = useState('overview')
  const tabs = ['overview', 'students', 'attendance']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5" onClick={onClose}>
      <div
        className="w-full max-w-[820px] max-h-[90vh] overflow-y-auto rounded-[16px] border border-black/[0.08] bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative rounded-t-[16px] p-5 sm:p-6 ${session.status === 'live' ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-white/10">
            <X className={`h-5 w-5 ${session.status === 'live' ? 'text-white/70' : 'text-[#94a3b8]'}`} />
          </button>
          <div className="flex items-start gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] ${session.status === 'live' ? 'bg-[#ef4444]' : 'bg-[#5b3df6]'}`}>
              <Video className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={session.status} />
                <span className={`text-[12px] ${session.status === 'live' ? 'text-white/50' : 'text-[#94a3b8]'}`}>{session.platform}</span>
              </div>
              <h2 className={`mt-1 text-[22px] font-bold ${session.status === 'live' ? 'text-white' : 'text-[#0f172a]'}`}>{session.title}</h2>
              <p className={`text-[13px] ${session.status === 'live' ? 'text-white/60' : 'text-[#64748b]'}`}>{session.topic}</p>
            </div>
          </div>

          {session.status === 'live' && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Users, label: 'Students Live', value: session.studentsPresent },
                { icon: BarChart2, label: 'Attendance', value: `${session.attendanceRate}%` },
                { icon: MessageSquare, label: 'Chat Msgs', value: session.chatMessages },
                { icon: Monitor, label: 'Current Slide', value: session.currentSlide },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-[10px] bg-white/10 p-3">
                  <Icon className="h-4 w-4 text-white/50" />
                  <p className="mt-1 text-[18px] font-bold text-white">{value}</p>
                  <p className="text-[10px] text-white/50">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-black/[0.07] px-5">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-3 text-[13px] font-medium capitalize border-b-2 transition-colors ${activeTab === t ? 'border-[#5b3df6] text-[#5b3df6]' : 'border-transparent text-[#94a3b8] hover:text-[#0f172a]'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6">

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { label: 'Course', value: session.course, icon: BookOpen },
                  { label: 'Instructor', value: session.instructor, icon: UserCheck },
                  { label: 'Date & Time', value: `${session.date} • ${session.time}`, icon: CalendarDays },
                  { label: 'Duration', value: session.duration, icon: Clock },
                  { label: 'Students Enrolled', value: session.studentsEnrolled, icon: Users },
                  { label: 'Platform', value: session.platform, icon: Video },
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

              {session.link && (
                <div className="flex items-center gap-2 rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-3">
                  <Link2 className="h-4 w-4 text-[#5b3df6] shrink-0" />
                  <span className="text-[12px] text-[#5b3df6] truncate">{session.link}</span>
                  <button className="ml-auto shrink-0 rounded-[6px] bg-[#5b3df6] px-3 py-1 text-[11px] font-semibold text-white">Open</button>
                </div>
              )}

              {(session.status === 'live' || session.status === 'recent') && (
                <div>
                  <p className="mb-2 text-[12px] font-semibold text-[#0f172a]">Attendance Overview</p>
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#f1f5f9]">
                      <div className="h-2.5 rounded-full bg-[#5b3df6] transition-all" style={{ width: `${session.attendanceRate}%` }} />
                    </div>
                    <span className="text-[13px] font-bold text-[#5b3df6]">{session.attendanceRate}%</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#94a3b8]">{session.studentsPresent} of {session.studentsEnrolled} students attended</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[14px] font-bold text-[#0f172a]">Enrolled Students ({STUDENTS.length})</p>
                <span className="text-[12px] text-[#64748b]">{STUDENTS.filter(s => s.status === 'present').length} present</span>
              </div>
              <div className="space-y-2">
                {STUDENTS.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-[10px] border border-black/[0.06] p-3">
                    <img src={s.avatar} alt={s.name} className="h-8 w-8 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold text-[#0f172a]">{s.name}</p>
                      <p className="text-[11px] text-[#94a3b8]">Joined: {s.joined}</p>
                    </div>
                    <AttendanceDot status={s.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div>
              <div className="mb-4 grid grid-cols-3 gap-3">
                {[
                  { label: 'Present', count: STUDENTS.filter(s => s.status === 'present').length, color: 'text-[#16a34a]', bg: 'bg-[#dcfce7]' },
                  { label: 'Late', count: STUDENTS.filter(s => s.status === 'late').length, color: 'text-[#b45309]', bg: 'bg-[#fef9c3]' },
                  { label: 'Absent', count: STUDENTS.filter(s => s.status === 'absent').length, color: 'text-[#dc2626]', bg: 'bg-[#fee2e2]' },
                ].map(({ label, count, color, bg }) => (
                  <div key={label} className={`rounded-[10px] ${bg} p-3 text-center`}>
                    <p className={`text-[24px] font-bold ${color}`}>{count}</p>
                    <p className={`text-[11px] font-medium ${color}`}>{label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {STUDENTS.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-[10px] border border-black/[0.06] p-3">
                    <img src={s.avatar} alt={s.name} className="h-7 w-7 rounded-full object-cover" />
                    <p className="flex-1 text-[13px] font-medium text-[#0f172a]">{s.name}</p>
                    <span className="text-[11px] text-[#94a3b8]">{s.joined}</span>
                    <AttendanceDot status={s.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SessionCard({ session, onClick, onDelete }) {
  const isLive = session.status === 'live'
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-[14px] border transition-all duration-200 hover:shadow-md ${isLive ? 'border-[#ef4444]/30 bg-[#fff5f5]' : 'border-black/[0.08] bg-white hover:border-[#5b3df6]/30'}`}
    >
      {isLive && (
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#ef4444] to-[#f97316]" />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <StatusBadge status={session.deleted ? 'deleted' : session.status} />
          <button
            onClick={e => { e.stopPropagation(); onDelete(session.id) }}
            className="opacity-0 group-hover:opacity-100 rounded-[6px] p-1 hover:bg-[#fee2e2] transition-all"
          >
            <Trash2 className="h-3.5 w-3.5 text-[#ef4444]" />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] ${isLive ? 'bg-[#ef4444]' : 'bg-[#f7f4ff]'}`}>
            <Video className={`h-4 w-4 ${isLive ? 'text-white' : 'text-[#5b3df6]'}`} />
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#0f172a] leading-tight">{session.title}</p>
            <p className="text-[11px] text-[#64748b]">{session.course}</p>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <img src={session.instructorAvatar} alt="" className="h-4 w-4 rounded-full" />
            <span>{session.instructor}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <CalendarDays className="h-3.5 w-3.5 text-[#94a3b8]" />
            <span>{session.date} • {session.time} • {session.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <Users className="h-3.5 w-3.5 text-[#94a3b8]" />
            <span>{session.studentsEnrolled} students enrolled</span>
          </div>
        </div>

        {(session.status === 'live' || session.status === 'recent') && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[#94a3b8]">Attendance</span>
              <span className="text-[11px] font-bold text-[#5b3df6]">{session.attendanceRate}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
              <div className={`h-1.5 rounded-full ${isLive ? 'bg-[#ef4444]' : 'bg-[#5b3df6]'}`} style={{ width: `${session.attendanceRate}%` }} />
            </div>
          </div>
        )}

        {isLive && (
          <div className="mt-3 flex items-center gap-1.5 rounded-[8px] bg-[#ef4444]/10 px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ef4444] animate-pulse" />
            <span className="text-[11px] font-semibold text-[#ef4444]">Live now • {session.studentsPresent} students in class</span>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] text-[#94a3b8]">{session.platform}</span>
          <span className="text-[11px] font-medium text-[#5b3df6] group-hover:underline">View details →</span>
        </div>
      </div>
    </div>
  )
}

export default function AdminLiveClasses() {
  const [activeView, setActiveView] = useState('list')
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false)
  const [sessions, setSessions] = useState(INITIAL_SESSIONS)
  const [activeFilter, setActiveFilter] = useState('All Classes')
  const [selectedSession, setSelectedSession] = useState(null)
  const [search, setSearch] = useState('')

  // New session form state
  const [form, setForm] = useState({
    title: '', course: 'Creative English Level 1', instructor: 'Aisha Verma',
    platform: 'Zoom', date: '', time: '', duration: '60 mins', link: '', topic: ''
  })

  const handleFormChange = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleCreateSession = () => {
    const newSession = {
      id: Date.now(),
      title: form.title || 'New Live Session',
      course: form.course,
      instructor: form.instructor,
      instructorAvatar: A1,
      date: form.date || 'TBD',
      time: form.time || 'TBD',
      duration: form.duration,
      platform: form.platform,
      status: 'upcoming',
      link: form.link,
      topic: form.topic || 'To be announced',
      attendanceRate: 0,
      studentsEnrolled: 0,
      studentsPresent: 0,
      chatMessages: 0,
      currentSlide: '—',
      screenShare: false,
      deleted: false,
    }
    setSessions(prev => [newSession, ...prev])
    setActiveView('list')
    setForm({ title: '', course: 'Creative English Level 1', instructor: 'Aisha Verma', platform: 'Zoom', date: '', time: '', duration: '60 mins', link: '', topic: '' })
  }

  const handleDelete = (id) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, deleted: true, status: 'deleted' } : s))
  }

  const filtered = sessions.filter(s => {
    const matchFilter =
      activeFilter === 'All Classes' ||
      (activeFilter === 'Live' && s.status === 'live') ||
      (activeFilter === 'Upcoming' && s.status === 'upcoming') ||
      (activeFilter === 'Recent' && s.status === 'recent') ||
      (activeFilter === 'Deleted' && s.status === 'deleted')
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.instructor.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  if (activeView === 'create') {
    return (
      <div className="min-h-full bg-[#f6f8fa] p-4 sm:p-5">
        <div className="mx-auto max-w-[1180px] rounded-[10px] border border-black/[0.08] bg-white p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button onClick={() => setActiveView('list')} className="inline-flex items-center gap-2 text-[13px] font-medium text-[#5b3df6]">
              <ArrowLeft className="h-4 w-4" /> Back to Live Classes
            </button>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button onClick={() => setActiveView('list')} className="h-9 rounded-[7px] border border-black/[0.08] bg-white px-3 text-[12px] font-semibold text-[#334155]">Cancel</button>
              <button onClick={handleCreateSession} className="h-9 rounded-[7px] bg-[#5b3df6] px-3 text-[12px] font-semibold text-white">Create Zoom Meeting</button>
            </div>
          </div>
          <p className="text-[12px] text-[#94a3b8]">Live Classes / Create Zoom Meeting</p>
          <h2 className="mt-1 text-[26px] font-bold text-[#0f172a] sm:text-[32px]">Create Zoom Meeting</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
            <section className="rounded-[8px] border border-black/[0.08] bg-white p-4">
              <h3 className="text-[18px] font-bold text-[#111827]">Batch Configuration</h3>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Session title *</label>
                  <input value={form.title} onChange={e => handleFormChange('title', e.target.value)} className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" placeholder="e.g. Math Mastery Live – Chapter 5" />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Topic</label>
                  <input value={form.topic} onChange={e => handleFormChange('topic', e.target.value)} className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" placeholder="e.g. Quadratic Equations" />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Course program</label>
                  <div className="relative">
                    <select value={form.course} onChange={e => handleFormChange('course', e.target.value)} className="h-10 w-full appearance-none rounded-[7px] border border-black/[0.08] px-3 text-[13px]">
                      <option>Creative English Level 1</option>
                      <option>Mathematics Level 3</option>
                      <option>Science Grade 8</option>
                      <option>Coding Beginners</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Instructor</label>
                  <div className="relative">
                    <select value={form.instructor} onChange={e => handleFormChange('instructor', e.target.value)} className="h-10 w-full appearance-none rounded-[7px] border border-black/[0.08] px-3 text-[13px]">
                      <option>Aisha Verma</option>
                      <option>Liam Carter</option>
                      <option>Nadia Brown</option>
                      <option>Arjun Singh</option>
                      <option>Sara Malik</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Class mode</label>
                  <div className="relative">
                    <select value={form.platform} onChange={e => handleFormChange('platform', e.target.value)} className="h-10 w-full appearance-none rounded-[7px] border border-black/[0.08] px-3 text-[13px]">
                      <option>Zoom</option>
                      <option>Google Meet</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Duration</label>
                  <div className="relative">
                    <select value={form.duration} onChange={e => handleFormChange('duration', e.target.value)} className="h-10 w-full appearance-none rounded-[7px] border border-black/[0.08] px-3 text-[13px]">
                      <option>30 mins</option>
                      <option>45 mins</option>
                      <option>60 mins</option>
                      <option>90 mins</option>
                      <option>120 mins</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Date</label>
                  <input type="date" value={form.date} onChange={e => handleFormChange('date', e.target.value)} className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Start time</label>
                  <input type="time" value={form.time} onChange={e => handleFormChange('time', e.target.value)} className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" />
                </div>
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-[12px] font-medium text-[#334155]">Meeting link</label>
                <input value={form.link} onChange={e => handleFormChange('link', e.target.value)} className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" placeholder="Paste Zoom/Meet URL" />
              </div>
            </section>
            <aside className="space-y-3">
              <section className="rounded-[8px] border border-black/[0.08] bg-white p-4">
                <h3 className="text-[16px] font-bold text-[#111827]">Session Summary</h3>
                <div className="mt-2 space-y-2 text-[12px] text-[#64748b]">
                  <p>Title: {form.title || '—'}</p>
                  <p>Course: {form.course}</p>
                  <p>Instructor: {form.instructor}</p>
                  <p>Platform: {form.platform}</p>
                  <p>Time: {form.time || '—'} • {form.duration}</p>
                  <p>Date: {form.date || '—'}</p>
                </div>
              </section>
              <section className="rounded-[8px] border border-black/[0.08] bg-white p-4">
                <h3 className="text-[16px] font-bold text-[#111827]">Checklist</h3>
                <ul className="mt-2 space-y-1.5">
                  {[
                    ['Session title', !!form.title],
                    ['Instructor assigned', true],
                    ['Time slot set', !!form.time],
                    ['Meeting link', !!form.link],
                  ].map(([label, done]) => (
                    <li key={label} className={`flex items-center gap-2 text-[12px] ${done ? 'text-[#16a34a]' : 'text-[#94a3b8]'}`}>
                      {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                      {label}
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#f6f8fa]">
      <div className="space-y-4 p-4 sm:p-5">

        {/* Hero */}
        <section className="rounded-[8px] border border-black/[0.08] bg-[#eaf2fb] p-4">
          <span className="inline-flex rounded-[12px] bg-[#ffd966] px-[10px] py-[5px] text-[11px] font-medium text-[#4b2e00]">Today's live teaching operations</span>
          <h2 className="mt-3 max-w-[700px] text-[26px] font-bold leading-tight text-[#0f172a]">Schedule, track, and manage every live session from one class operations workspace.</h2>
          <p className="mt-2 max-w-[700px] text-[14px] text-[#94a3b8]">Monitor upcoming Zoom and Meet sessions, manage teachers, review attendance, and quickly resolve link or timing issues before class starts.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => setActiveView('create')} className="inline-flex h-9 items-center gap-1 rounded-[7px] bg-[#5b3df6] px-3 text-[12px] font-semibold text-white">
              <Plus className="h-4 w-4" /> Create Zoom meeting
            </button>
            <button className="h-9 rounded-[7px] border border-black/[0.08] bg-white px-3 text-[12px] font-semibold text-[#111827]">This week</button>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Classes today', value: '12', badge: '+3 starting in 1 hour', bCls: 'bg-[#2dd4bf] text-[#023b33]' },
            { label: 'Attendance rate', value: '89%', badge: 'Up +5% from last week', bCls: 'bg-[#f0f4f8] text-[#64748b]' },
            { label: 'Links pending', value: '2', badge: 'Needs follow-up', bCls: 'bg-[#ffd966] text-[#4b2e00]' },
            { label: 'Faculty live now', value: '5', badge: 'All sessions stable', bCls: 'bg-[#2dd4bf] text-[#023b33]' },
          ].map(({ label, value, badge, bCls }) => (
            <div key={label} className="rounded-[8px] border border-black/[0.08] bg-white p-4">
              <p className="text-[11px] text-[#94a3b8]">{label}</p>
              <p className="mt-2 text-[32px] font-bold text-[#0f172a]">{value}</p>
              <span className={`mt-2 inline-flex rounded-[12px] px-2 py-1 text-[10px] font-medium ${bCls}`}>{badge}</span>
            </div>
          ))}
        </div>

        {/* Filters + Search + Cards */}
        <section className="rounded-[8px] border border-black/[0.08] bg-white p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-[20px] font-bold text-[#0f172a]">All Live Classes</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search classes..."
                  className="h-9 w-[200px] rounded-[7px] border border-black/[0.08] pl-9 pr-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30"
                />
              </div>
              <button
                onClick={() => setIsAddSessionOpen(true)}
                className="inline-flex h-9 items-center gap-1 rounded-[7px] bg-[#5b3df6] px-3 text-[12px] font-semibold text-white"
              >
                <Plus className="h-4 w-4" /> Add session
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="mb-4 flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`h-8 rounded-[8px] px-3 text-[12px] font-medium transition-colors ${activeFilter === f ? 'bg-[#5b3df6] text-white' : 'border border-black/[0.08] bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9]'}`}
              >
                {f}
                {f === 'Live' && <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#ef4444] text-[9px] font-bold text-white">{sessions.filter(s => s.status === 'live').length}</span>}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-[12px] border border-dashed border-black/[0.12] bg-[#fafcff] py-12 text-center">
              <Video className="mx-auto h-8 w-8 text-[#cbd5e1]" />
              <p className="mt-3 text-[14px] font-medium text-[#94a3b8]">No classes found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onClick={() => setSelectedSession(session)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Detail Modal */}
      {selectedSession && (
        <ClassDetailModal session={selectedSession} onClose={() => setSelectedSession(null)} />
      )}

      {/* Add Session Modal */}
      {isAddSessionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-[740px] rounded-[10px] border border-[#0ea5e9] bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-[#7dd3fc] px-4 py-4 sm:px-6 sm:py-5">
              <div>
                <h3 className="text-[26px] font-bold leading-none text-[#111827]">Add session</h3>
                <p className="mt-1 text-[14px] text-[#6b7280]">Schedule a new live class for an existing batch</p>
              </div>
              <button onClick={() => setIsAddSessionOpen(false)} className="text-[#94a3b8] hover:text-[#64748b]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
              <div>
                <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Session title *</label>
                <input value={form.title} onChange={e => handleFormChange('title', e.target.value)} className="h-10 w-full rounded-[8px] border border-black/[0.08] px-4 text-[13px]" placeholder="e.g. Math Mastery Live - Chapter 4" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Course / Batch *</label>
                  <div className="relative">
                    <select value={form.course} onChange={e => handleFormChange('course', e.target.value)} className="h-10 w-full appearance-none rounded-[8px] border border-black/[0.08] px-4 text-[13px]">
                      <option>Mathematics Level 3</option>
                      <option>Creative English Level 1</option>
                      <option>Science Grade 8</option>
                      <option>Coding Beginners</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Instructor *</label>
                  <div className="relative">
                    <select value={form.instructor} onChange={e => handleFormChange('instructor', e.target.value)} className="h-10 w-full appearance-none rounded-[8px] border border-black/[0.08] px-4 text-[13px]">
                      <option>Aisha Verma</option>
                      <option>Liam Carter</option>
                      <option>Nadia Brown</option>
                      <option>Arjun Singh</option>
                      <option>Sara Malik</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Date *</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    <input type="date" value={form.date} onChange={e => handleFormChange('date', e.target.value)} className="h-10 w-full rounded-[8px] border border-black/[0.08] py-2 pl-10 pr-3 text-[13px]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Start time *</label>
                  <div className="relative">
                    <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    <input type="time" value={form.time} onChange={e => handleFormChange('time', e.target.value)} className="h-10 w-full rounded-[8px] border border-black/[0.08] py-2 pl-10 pr-3 text-[13px]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Duration *</label>
                  <div className="relative">
                    <select value={form.duration} onChange={e => handleFormChange('duration', e.target.value)} className="h-10 w-full appearance-none rounded-[8px] border border-black/[0.08] px-4 text-[13px]">
                      <option>30 mins</option>
                      <option>45 mins</option>
                      <option>60 mins</option>
                      <option>90 mins</option>
                      <option>120 mins</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Platform *</label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    <select value={form.platform} onChange={e => handleFormChange('platform', e.target.value)} className="h-10 w-full appearance-none rounded-[8px] border border-black/[0.08] py-2 pl-10 pr-8 text-[13px]">
                      <option>Zoom</option>
                      <option>Google Meet</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Meeting Link</label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    <input value={form.link} onChange={e => handleFormChange('link', e.target.value)} className="h-10 w-full rounded-[8px] border border-black/[0.08] py-2 pl-10 pr-3 text-[13px]" placeholder="Paste Zoom/Meet URL" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[#7dd3fc] px-6 py-4">
              <button onClick={() => setIsAddSessionOpen(false)} className="h-10 rounded-[8px] border border-black/[0.08] bg-white px-5 text-[13px] font-semibold text-[#4b5563]">Cancel</button>
              <button
                onClick={() => {
                  const newSession = {
                    id: Date.now(),
                    title: form.title || 'New Live Session',
                    course: form.course,
                    instructor: form.instructor,
                    instructorAvatar: A1,
                    date: form.date || 'TBD',
                    time: form.time || 'TBD',
                    duration: form.duration,
                    platform: form.platform,
                    status: 'upcoming',
                    link: form.link,
                    topic: form.topic || 'To be announced',
                    attendanceRate: 0,
                    studentsEnrolled: 0,
                    studentsPresent: 0,
                    chatMessages: 0,
                    currentSlide: '—',
                    screenShare: false,
                    deleted: false,
                  }
                  setSessions(prev => [newSession, ...prev])
                  setIsAddSessionOpen(false)
                  setForm({ title: '', course: 'Creative English Level 1', instructor: 'Aisha Verma', platform: 'Zoom', date: '', time: '', duration: '60 mins', link: '', topic: '' })
                }}
                className="h-10 rounded-[8px] bg-[#5b3df6] px-5 text-[13px] font-semibold text-white"
              >
                Schedule session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
