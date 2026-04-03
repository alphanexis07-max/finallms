import React, { useState } from 'react'
import {
  Search, Video, Calendar, Clock3, Users, PlayCircle, BookOpen,
  Star, ChevronRight, X, Check, Lock, CreditCard, CheckCircle2,
  CalendarDays, BarChart2, MessageSquare, Monitor, UserCheck,
  Link2, Clock, Wifi
} from 'lucide-react'

const A1 = 'https://i.pravatar.cc/40?img=1'
const A2 = 'https://i.pravatar.cc/40?img=2'
const A3 = 'https://i.pravatar.cc/40?img=3'
const A4 = 'https://i.pravatar.cc/40?img=4'
const A5 = 'https://i.pravatar.cc/40?img=5'

// Student ke enrolled courses (yahan aap real data connect kar sakte ho)
const ENROLLED_COURSE_IDS = [1, 3] // student ne inhe enroll kiya hua hai

const LIVE_SESSIONS = [
  {
    id: 1,
    title: 'Math Mastery Live',
    course: 'Mathematics Level 3',
    instructor: 'Aisha Verma',
    instructorAvatar: A1,
    instructorRole: 'Mathematics Expert',
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
    tags: ['Live today', 'Mathematics', 'Chapter 4'],
    price: '₹1,299',
    rating: '4.9',
  },
  {
    id: 2,
    title: 'Science Lab Workshop',
    course: 'Science Grade 8',
    instructor: 'Liam Carter',
    instructorAvatar: A2,
    instructorRole: 'Science Specialist',
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
    tags: ['Tomorrow', 'Science', 'Lab'],
    price: '₹999',
    rating: '4.7',
  },
  {
    id: 3,
    title: 'English Speaking Club',
    course: 'Creative English Level 1',
    instructor: 'Nadia Brown',
    instructorAvatar: A3,
    instructorRole: 'Language Coach',
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
    tags: ['Fri', 'English', 'Speaking'],
    price: '₹799',
    rating: '4.8',
  },
  {
    id: 4,
    title: 'Coding for Kids Bootcamp',
    course: 'Coding Beginners',
    instructor: 'Arjun Singh',
    instructorAvatar: A4,
    instructorRole: 'Full Stack Developer',
    date: 'Sat',
    time: '10:00 AM',
    duration: '120 mins',
    platform: 'Zoom',
    status: 'upcoming',
    link: '',
    topic: 'Loops & Conditions in Scratch',
    attendanceRate: 0,
    studentsEnrolled: 18,
    studentsPresent: 0,
    chatMessages: 0,
    currentSlide: '—',
    tags: ['Sat', 'Coding', 'Beginner'],
    price: '₹1,499',
    rating: '4.6',
  },
  {
    id: 5,
    title: 'Physics Fundamentals',
    course: 'Physics Grade 10',
    instructor: 'Sara Malik',
    instructorAvatar: A5,
    instructorRole: 'Physics Educator',
    date: 'Wed',
    time: '3:00 PM',
    duration: '75 mins',
    platform: 'Google Meet',
    status: 'upcoming',
    link: 'https://meet.google.com/abc-xyz',
    topic: "Newton's Laws of Motion",
    attendanceRate: 0,
    studentsEnrolled: 25,
    studentsPresent: 0,
    chatMessages: 0,
    currentSlide: '—',
    tags: ['Wed', 'Physics', 'Grade 10'],
    price: '₹1,199',
    rating: '4.5',
  },
]

const STATUS_CONFIG = {
  live: { label: 'Live', bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]', dot: 'bg-[#ef4444]' },
  upcoming: { label: 'Upcoming', bg: 'bg-[#fef9c3]', text: 'text-[#854d0e]', dot: 'bg-[#eab308]' },
  recent: { label: 'Completed', bg: 'bg-[#dcfce7]', text: 'text-[#14532d]', dot: 'bg-[#22c55e]' },
}

const FILTERS = ['All Sessions', 'Live Now', 'Upcoming', 'Enrolled']

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${status === 'live' ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </span>
  )
}

// Payment/Enrollment Modal
function EnrollmentModal({ session, onClose, onSuccess }) {
  const [step, setStep] = useState('details') // details | payment | success
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [loading, setLoading] = useState(false)

  const handlePay = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('success')
    }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5" onClick={onClose}>
      <div className="w-full max-w-[500px] overflow-hidden rounded-[16px] bg-white shadow-2xl" onClick={e => e.stopPropagation()}>

        {step === 'success' ? (
          <div className="flex flex-col items-center p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dcfce7]">
              <CheckCircle2 className="h-8 w-8 text-[#16a34a]" />
            </div>
            <h2 className="mt-4 text-[22px] font-bold text-[#0f172a]">Enrollment Successful!</h2>
            <p className="mt-2 text-[13px] text-[#64748b]">You have successfully enrolled in <strong>{session.title}</strong>. Ab aap is class ko join kar sakte ho.</p>
            <div className="mt-5 w-full rounded-[10px] bg-[#f8fafc] p-4 text-left border border-black/[0.07]">
              <div className="flex items-center gap-2 text-[12px] text-[#64748b]">
                <CalendarDays className="h-4 w-4 text-[#5b3df6]" /> {session.date} • {session.time}
              </div>
              <div className="mt-2 flex items-center gap-2 text-[12px] text-[#64748b]">
                <Video className="h-4 w-4 text-[#5b3df6]" /> {session.platform} • {session.duration}
              </div>
            </div>
            <button
              onClick={() => { onSuccess(session.id); onClose() }}
              className="mt-5 w-full h-11 rounded-[10px] bg-[#5b3df6] text-[14px] font-semibold text-white hover:bg-[#4a2ed8] transition-colors"
            >
              {session.status === 'live' ? 'Join Class Now' : 'Go to My Sessions'}
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-black/[0.08] p-5">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#fef9c3] px-2.5 py-1 text-[11px] font-semibold text-[#854d0e]">
                  <Lock className="h-3 w-3" /> Enrollment Required
                </span>
                <h2 className="mt-2 text-[18px] font-bold text-[#0f172a]">{session.title}</h2>
                <p className="text-[12px] text-[#64748b]">{session.course} • {session.instructor}</p>
              </div>
              <button onClick={onClose} className="rounded-full p-1.5 hover:bg-gray-100">
                <X className="h-5 w-5 text-[#94a3b8]" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Session Info */}
              <div className="rounded-[10px] bg-[#f8fafc] border border-black/[0.07] p-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: CalendarDays, label: 'Date', val: `${session.date} • ${session.time}` },
                    { icon: Clock3, label: 'Duration', val: session.duration },
                    { icon: Video, label: 'Platform', val: session.platform },
                    { icon: Users, label: 'Students', val: `${session.studentsEnrolled} enrolled` },
                  ].map(({ icon: Icon, label, val }) => (
                    <div key={label} className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[#5b3df6] shrink-0" />
                      <div>
                        <p className="text-[10px] text-[#94a3b8]">{label}</p>
                        <p className="text-[12px] font-semibold text-[#0f172a]">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What you get */}
              <div>
                <p className="text-[12px] font-semibold text-[#0f172a] mb-2">Is class mein kya milega:</p>
                <div className="space-y-1.5">
                  {[
                    'Live interactive session with instructor',
                    'Class recording access (7 days)',
                    'Study material & notes download',
                    'Doubt clearing Q&A session',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2 text-[12px] text-[#64748b]">
                      <Check className="h-3.5 w-3.5 text-[#16a34a] shrink-0" /> {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <p className="text-[12px] font-semibold text-[#0f172a] mb-2">Payment method:</p>
                <div className="flex gap-2">
                  {['card', 'upi'].map(m => (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`flex-1 h-10 rounded-[8px] border text-[12px] font-medium transition-colors ${paymentMethod === m ? 'border-[#5b3df6] bg-[#f7f4ff] text-[#5b3df6]' : 'border-black/[0.08] text-[#64748b] hover:bg-gray-50'}`}
                    >
                      {m === 'card' ? '💳 Card' : '📱 UPI'}
                    </button>
                  ))}
                </div>
                {paymentMethod === 'card' ? (
                  <div className="mt-3 space-y-2">
                    <input className="h-10 w-full rounded-[8px] border border-black/[0.08] px-3 text-[13px]" placeholder="Card number" />
                    <div className="grid grid-cols-2 gap-2">
                      <input className="h-10 rounded-[8px] border border-black/[0.08] px-3 text-[13px]" placeholder="MM/YY" />
                      <input className="h-10 rounded-[8px] border border-black/[0.08] px-3 text-[13px]" placeholder="CVV" />
                    </div>
                  </div>
                ) : (
                  <input className="mt-3 h-10 w-full rounded-[8px] border border-black/[0.08] px-3 text-[13px]" placeholder="Enter UPI ID (e.g. name@upi)" />
                )}
              </div>

              {/* Price + Pay Button */}
              <div className="flex items-center justify-between rounded-[10px] bg-[#f7f4ff] border border-[#5b3df6]/20 px-4 py-3">
                <div>
                  <p className="text-[11px] text-[#64748b]">Total amount</p>
                  <p className="text-[20px] font-bold text-[#5b3df6]">{session.price}</p>
                </div>
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="h-11 rounded-[10px] bg-[#5b3df6] px-6 text-[13px] font-semibold text-white hover:bg-[#4a2ed8] transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {loading ? (
                    <><span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard className="h-4 w-4" /> Pay & Enroll</>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Class Detail Modal (enrolled students ke liye)
function ClassDetailModal({ session, onClose }) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5" onClick={onClose}>
      <div className="w-full max-w-[720px] max-h-[90vh] overflow-y-auto rounded-[16px] border border-black/[0.08] bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={`relative rounded-t-[16px] p-5 ${session.status === 'live' ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
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
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-[#dcfce7] text-[#14532d]`}>
                  <Check className="h-3 w-3" /> Enrolled
                </span>
              </div>
              <h2 className={`mt-1 text-[20px] font-bold ${session.status === 'live' ? 'text-white' : 'text-[#0f172a]'}`}>{session.title}</h2>
              <p className={`text-[12px] ${session.status === 'live' ? 'text-white/60' : 'text-[#64748b]'}`}>{session.topic}</p>
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
                  <p className="mt-1 text-[16px] font-bold text-white">{value}</p>
                  <p className="text-[10px] text-white/50">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-black/[0.07] px-5">
          {['overview', 'details'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-3 text-[13px] font-medium capitalize border-b-2 transition-colors ${activeTab === t ? 'border-[#5b3df6] text-[#5b3df6]' : 'border-transparent text-[#94a3b8] hover:text-[#0f172a]'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-5">
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
                  <span className="text-[12px] text-[#5b3df6] truncate flex-1">{session.link}</span>
                  <button className="ml-auto shrink-0 rounded-[6px] bg-[#5b3df6] px-3 py-1 text-[11px] font-semibold text-white">Open</button>
                </div>
              )}
              {/* Join Button */}
              {session.status === 'live' && (
                <button className="w-full h-11 rounded-[10px] bg-[#ef4444] text-[14px] font-semibold text-white flex items-center justify-center gap-2 hover:bg-[#dc2626] transition-colors">
                  <PlayCircle className="h-5 w-5" /> Join Live Class Now
                </button>
              )}
            </div>
          )}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-[10px] bg-[#faf9ff] border border-[#5b3df6]/20 p-4">
                <img src={session.instructorAvatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="text-[14px] font-bold text-[#0f172a]">{session.instructor}</p>
                  <p className="text-[12px] text-[#64748b]">{session.instructorRole}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-[#eab308] fill-[#eab308]" />
                    <span className="text-[12px] font-semibold text-[#0f172a]">{session.rating}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-[10px] bg-[#f8fafc] border border-black/[0.07] p-4">
                <p className="text-[13px] font-semibold text-[#0f172a] mb-2">Topic: {session.topic}</p>
                <p className="text-[12px] text-[#64748b]">Is session mein aap {session.topic} ke baare mein detail se sikhenge. Notes aur recording 7 din tak available rahegi.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Session Card
function SessionCard({ session, isEnrolled, onJoinClick, onEnrollClick }) {
  const isLive = session.status === 'live'

  return (
    <div className={`group relative overflow-hidden rounded-[14px] border transition-all duration-200 hover:shadow-md ${isLive ? 'border-[#ef4444]/30 bg-[#fff5f5]' : 'border-black/[0.08] bg-white'}`}>
      {isLive && <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#ef4444] to-[#f97316]" />}

      <div className="p-4">
        {/* Top: Status + Enrolled badge */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <StatusBadge status={session.status} />
          {isEnrolled ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-2.5 py-1 text-[10px] font-semibold text-[#14532d]">
              <Check className="h-3 w-3" /> Enrolled
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fef9c3] px-2.5 py-1 text-[10px] font-semibold text-[#854d0e]">
              <Lock className="h-3 w-3" /> Not Enrolled
            </span>
          )}
        </div>

        {/* Title */}
        <div className="mt-3 flex items-center gap-2">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] ${isLive ? 'bg-[#ef4444]' : 'bg-[#f7f4ff]'}`}>
            <Video className={`h-4 w-4 ${isLive ? 'text-white' : 'text-[#5b3df6]'}`} />
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#0f172a] leading-tight">{session.title}</p>
            <p className="text-[11px] text-[#64748b]">{session.course}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {session.tags.map(tag => (
            <span key={tag} className={`inline-flex h-[22px] items-center rounded-[8px] px-2 text-[10px] font-medium ${tag === 'Live today' ? 'bg-[#ffd966] text-[#4b2e00]' : 'bg-[#f1f5f9] text-[#64748b]'}`}>
              {tag}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <img src={session.instructorAvatar} alt="" className="h-4 w-4 rounded-full" />
            <span>{session.instructor} • {session.instructorRole}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <CalendarDays className="h-3.5 w-3.5 text-[#94a3b8]" />
            <span>{session.date} • {session.time} • {session.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <Users className="h-3.5 w-3.5 text-[#94a3b8]" />
            <span>{session.studentsEnrolled} students enrolled</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <Star className="h-3.5 w-3.5 text-[#eab308] fill-[#eab308]" />
            <span>{session.rating} rating</span>
          </div>
        </div>

        {/* Live Indicator */}
        {isLive && (
          <div className="mt-3 flex items-center gap-1.5 rounded-[8px] bg-[#ef4444]/10 px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ef4444] animate-pulse" />
            <span className="text-[11px] font-semibold text-[#ef4444]">Live now • {session.studentsPresent} students in class</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          {isEnrolled ? (
            <>
              <button
                onClick={() => onJoinClick(session)}
                className="flex-1 text-[12px] font-medium text-[#64748b] border border-black/[0.08] rounded-[8px] h-9 hover:bg-gray-50 transition-colors"
              >
                View Details
              </button>
              {isLive ? (
                <button
                  onClick={() => window.open(session.link, '_blank')}
                  className="flex-1 h-9 rounded-[8px] bg-[#ef4444] text-[12px] font-semibold text-white flex items-center justify-center gap-1.5 hover:bg-[#dc2626] transition-colors"
                >
                  <PlayCircle className="h-4 w-4" /> Join Class
                </button>
              ) : (
                <button
                  onClick={() => onJoinClick(session)}
                  className="flex-1 h-9 rounded-[8px] bg-[#5b3df6] text-[12px] font-semibold text-white flex items-center justify-center gap-1.5 hover:bg-[#4a2ed8] transition-colors"
                >
                  <CalendarDays className="h-4 w-4" /> Scheduled
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => onJoinClick(session)}
                className="flex-1 text-[12px] font-medium text-[#64748b] border border-black/[0.08] rounded-[8px] h-9 hover:bg-gray-50 transition-colors"
              >
                Preview
              </button>
              <button
                onClick={() => onEnrollClick(session)}
                className="flex-1 h-9 rounded-[8px] bg-[#5b3df6] text-[12px] font-semibold text-white flex items-center justify-center gap-1.5 hover:bg-[#4a2ed8] transition-colors"
              >
                <Lock className="h-3.5 w-3.5" /> Enroll {session.price}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function StudentLiveClasses() {
  const [activeFilter, setActiveFilter] = useState('All Sessions')
  const [search, setSearch] = useState('')
  const [enrolledIds, setEnrolledIds] = useState(ENROLLED_COURSE_IDS)
  const [enrollModal, setEnrollModal] = useState(null)   // session to enroll
  const [detailModal, setDetailModal] = useState(null)   // session to view detail

  const handleEnrollSuccess = (id) => {
    setEnrolledIds(prev => [...prev, id])
  }

  const filtered = LIVE_SESSIONS.filter(s => {
    const matchFilter =
      activeFilter === 'All Sessions' ||
      (activeFilter === 'Live Now' && s.status === 'live') ||
      (activeFilter === 'Upcoming' && s.status === 'upcoming') ||
      (activeFilter === 'Enrolled' && enrolledIds.includes(s.id))
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.instructor.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const liveCount = LIVE_SESSIONS.filter(s => s.status === 'live').length
  const enrolledCount = enrolledIds.length

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-7">

        {/* Hero Banner */}
        <section className="rounded-[10px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-[12px] bg-[#ffd966] px-3 py-1.5 text-[12px] font-medium text-[#4b2e00]">
                <Video className="h-3.5 w-3.5" /> Instructor-led Live Sessions
              </div>
              <h1 className="mt-3 text-[26px] font-bold leading-tight text-[#0f172a]">Join live classes, reserve seats, and grow your skills in real-time.</h1>
              <p className="mt-2 text-[13px] text-[#94a3b8]">Enrolled courses seedha join karo. Naye courses ke liye enroll aur payment karo — phir class join karo.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  `${liveCount} live now`,
                  `${enrolledCount} courses enrolled`,
                  `${LIVE_SESSIONS.length} total sessions`,
                ].map(t => (
                  <div key={t} className="inline-flex h-8 items-center rounded-[10px] border border-black/[0.08] bg-white px-3 text-[11px] font-medium text-[#0f172a]">{t}</div>
                ))}
              </div>
            </div>

            {/* Live now mini card */}
            {LIVE_SESSIONS.filter(s => s.status === 'live').map(s => (
              <div key={s.id} className="w-full shrink-0 rounded-[10px] border border-black/[0.08] bg-white p-4 lg:w-[270px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full bg-[#ef4444] animate-pulse" />
                  <span className="text-[12px] font-semibold text-[#ef4444]">Live right now</span>
                </div>
                <h3 className="font-bold text-[15px] text-[#0f172a]">{s.title}</h3>
                <p className="text-[11px] text-[#94a3b8] mt-1">{s.topic}</p>
                <div className="mt-3 space-y-1.5 text-[11px] text-[#64748b]">
                  <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {s.studentsPresent} students in class</div>
                  <div className="flex items-center gap-1.5"><Video className="h-3.5 w-3.5" /> {s.platform} • {s.duration}</div>
                </div>
                {enrolledIds.includes(s.id) ? (
                  <button
                    onClick={() => window.open(s.link, '_blank')}
                    className="mt-4 w-full h-10 rounded-[8px] bg-[#ef4444] text-[13px] font-semibold text-white flex items-center justify-center gap-2 hover:bg-[#dc2626] transition-colors"
                  >
                    <PlayCircle className="h-4 w-4" /> Join Class Now
                  </button>
                ) : (
                  <button
                    onClick={() => setEnrollModal(s)}
                    className="mt-4 w-full h-10 rounded-[8px] bg-[#5b3df6] text-[13px] font-semibold text-white flex items-center justify-center gap-2 hover:bg-[#4a2ed8] transition-colors"
                  >
                    <Lock className="h-4 w-4" /> Enroll to Join
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Filters + Search */}
        <div className="rounded-[10px] border border-black/[0.08] bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[18px] font-bold text-[#0f172a]">Browse Live Schedule</h2>
              <p className="text-[12px] text-[#94a3b8] mt-0.5">Filter by status, or search by topic, mentor, or course.</p>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-10 w-full rounded-[8px] border border-black/[0.08] pl-9 pr-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30"
                placeholder="Search by topic, mentor, or course..."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`h-9 rounded-[8px] px-3 text-[12px] font-medium transition-colors ${activeFilter === f ? 'bg-[#5b3df6] text-white' : 'border border-black/[0.08] bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9]'}`}
                >
                  {f}
                  {f === 'Live Now' && (
                    <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#ef4444] text-[9px] font-bold text-white">{liveCount}</span>
                  )}
                  {f === 'Enrolled' && (
                    <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#16a34a] text-[9px] font-bold text-white">{enrolledCount}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#0f172a]">
              {activeFilter === 'Enrolled' ? 'My Enrolled Sessions' : 'Upcoming Sessions'}
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
              {filtered.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  isEnrolled={enrolledIds.includes(session.id)}
                  onJoinClick={(s) => setDetailModal(s)}
                  onEnrollClick={(s) => setEnrollModal(s)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enrollment / Payment Modal */}
      {enrollModal && (
        <EnrollmentModal
          session={enrollModal}
          onClose={() => setEnrollModal(null)}
          onSuccess={handleEnrollSuccess}
        />
      )}

      {/* Class Detail Modal */}
      {detailModal && (
        <ClassDetailModal
          session={detailModal}
          onClose={() => setDetailModal(null)}
        />
      )}
    </div>
  )
}

