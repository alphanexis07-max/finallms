import React, { useState } from 'react'
import { Search, Bell, Video, Calendar, Clock3, Users, PlayCircle, Radio, BookOpen, Star, ChevronRight, Upload, Plus, GraduationCap, BookOpen as BookOpenIcon, Wallet, BarChart3, X, Check, Mail, Link } from 'lucide-react'

function Pill({ children, variant }) {
  const style =
    variant === 'live'
      ? 'bg-[#ffd966] text-[#4b2e00]'
      : variant === 'success'
        ? 'bg-[#2dd4bf] text-[#023b33]'
        : variant === 'primary'
          ? 'bg-[#5b3df6] text-white'
          : variant === 'warning'
            ? 'bg-[#ffd966] text-[#4b2e00]'
            : 'bg-[#e8f5ff] text-[#0f172a]'

  return <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${style}`}>{children}</span>
}

export default function StudentLiveClasses() {
  const [activeFilter, setActiveFilter] = useState('All sessions')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [confirmedSession, setConfirmedSession] = useState(null)

  const filters = ['All sessions', 'Live now', 'Workshops', 'Office hours', 'Frontend', 'Reserved']

  const sessions = [
    {
      id: 1,
      tags: ['Live today', 'Workshop', 'UI/UX'],
      badge: 'Seat reserved',
      badgeVariant: 'success',
      title: 'Design critique lab: portfolio storytelling',
      desc: 'Bring one case study draft and get live feedback on structure, outcomes, and how to connect design decisions to measurable business impact.',
      time: 'Today · 6:30 PM',
      duration: '60 min',
      format: 'Zoom classroom',
      capacity: '126 / 150 joined',
      mentor: 'Rina Kapoor',
      mentorRole: 'Career Coach · Mentor',
      mentorColor: '#e8f5ff',
      actions: [{ label: 'Add note', variant: 'outline' }, { label: 'Join class', variant: 'primary' }],
    },
    {
      id: 2,
      tags: ['Tomorrow', 'Masterclass', 'Frontend'],
      badge: 'Recommended',
      badgeVariant: 'primary',
      title: 'Frontend patterns clinic: layouts, semantics, and reusable components',
      desc: 'A practical walkthrough of semantic page structure, accessible components, and repeatable layout patterns for dashboard and product UI work.',
      time: 'Tue · 7:00 PM',
      duration: '75 min',
      format: 'Live coding room',
      capacity: '88 / 120 seats',
      mentor: 'Noah Bennett',
      mentorRole: 'Frontend Lead',
      mentorColor: '#e8f5ff',
      actions: [{ label: 'Preview agenda', variant: 'outline' }, { label: 'Reserve seat', variant: 'primary' }],
    },
    {
      id: 3,
      tags: ['Wed', 'Office hours', 'Product'],
      badge: '12 seats left',
      badgeVariant: 'warning',
      title: 'Metrics office hours: activation, retention, and experiment reviews',
      desc: 'Join a smaller interactive session to review metric trees, prioritize signals, and understand how product decisions connect to activation and retention goals.',
      time: 'Wed · 5:30 PM',
      duration: '45 min',
      format: 'Mentor office hours',
      capacity: '28 / 40 seats',
      mentor: 'Mateo Ruiz',
      mentorRole: 'Growth PM',
      mentorColor: '#e8f5ff',
      actions: [{ label: 'Session brief', variant: 'outline' }, { label: 'Reserve seat', variant: 'primary' }],
    },
    {
      id: 4,
      tags: ['Thu', 'Review', 'Design Systems'],
      badge: 'Saved',
      badgeVariant: 'secondary',
      title: 'Component review jam: tokens, naming, and contribution flow',
      desc: 'Watch a live teardown of component decisions, documentation practices, and contribution workflows for design systems that scale across multiple teams.',
      time: 'Thu · 8:00 PM',
      duration: '50 min',
      format: 'Panel walkthrough',
      capacity: '94 / 140 seats',
      mentor: 'Elena Brooks',
      mentorRole: 'Product Designer',
      mentorColor: '#e8f5ff',
      actions: [{ label: 'Save reminder', variant: 'outline' }, { label: 'Reserve seat', variant: 'primary' }],
    },
  ]

  const weekSchedule = [
    { day: 'Mon', date: 12, title: 'Design critique lab', detail: '6:30 PM · Reserved seat · Rina Kapoor' },
    { day: 'Tue', date: 13, title: 'Frontend patterns clinic', detail: '7:00 PM · Suggested session · Noah Bennett' },
    { day: 'Wed', date: 14, title: 'Metrics office hours', detail: '5:30 PM · 12 seats left · Mateo Ruiz' },
    { day: 'Thu', date: 15, title: 'Component review jam', detail: '8:00 PM · Saved reminder · Elena Brooks' },
  ]

  const mentors = [
    { name: 'Rina Kapoor', detail: 'Career sessions · 2 classes this week', rating: '4.9', color: '#e8f5ff' },
    { name: 'Noah Bennett', detail: 'Frontend labs · 1 live coding room', rating: '4.7', color: '#e8f5ff' },
    { name: 'Mateo Ruiz', detail: 'Metrics office hours · 3 open seats', rating: '4.6', color: '#e8f5ff' },
  ]

  const reminders = [
    { title: 'Upload one case study draft', detail: 'Needed for today\'s design critique lab to get live mentor feedback.' },
    { title: 'Review semantic HTML checklist', detail: 'Helpful prep for the frontend patterns clinic scheduled tomorrow.' },
    { title: 'Bring one experiment question', detail: 'Use the office hours slot to validate a metric, funnel, or activation hypothesis.' },
  ]

  const handleReserveClick = (session) => {
    setSelectedSession(session)
    setShowConfirmModal(true)
  }

  const handleConfirmReservation = () => {
    if (selectedSession) {
      setConfirmedSession(selectedSession.id)
      // Update the session badge to show it's reserved
      const updatedSession = { ...selectedSession, badge: 'Reserved', badgeVariant: 'success' }
      const index = sessions.findIndex(s => s.id === selectedSession.id)
      if (index !== -1) {
        sessions[index] = updatedSession
      }
    }
    setShowConfirmModal(false)
    setSelectedSession(null)
  }

  const handleCancelReservation = () => {
    setShowConfirmModal(false)
    setSelectedSession(null)
  }

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      {/* Confirmation Modal */}
      {showConfirmModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[480px] bg-white rounded-[16px] shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-black/[0.08]">
              <h2 className="text-[20px] font-bold text-[#0f172a]">Confirm reservation</h2>
              <button 
                onClick={handleCancelReservation}
                className="text-[#94a3b8] hover:text-[#0f172a] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5">
              <p className="text-[13px] text-[#64748b] mb-4">
                Secure your spot for this live session.
              </p>

              {/* Session Details */}
              <div className="bg-[#f8fafc] rounded-[12px] p-4 mb-5 border border-black/[0.08]">
                <h3 className="text-[16px] font-bold text-[#0f172a] mb-3">{selectedSession.title}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-[13px] text-[#64748b]">
                    <Calendar className="h-4 w-4 text-[#5b3df6]" />
                    <span>{selectedSession.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#64748b]">
                    <Clock3 className="h-4 w-4 text-[#5b3df6]" />
                    <span>{selectedSession.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#64748b]">
                    <Video className="h-4 w-4 text-[#5b3df6]" />
                    <span>{selectedSession.format}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-[#64748b]">
                    <Users className="h-4 w-4 text-[#5b3df6]" />
                    <span>{selectedSession.capacity}</span>
                  </div>
                </div>
              </div>

              {/* Mentor Info */}
              <div className="flex items-center gap-3 mb-5 p-3 bg-[#faf9ff] rounded-[10px] border border-[#5b3df6]/20">
                <div className="h-10 w-10 rounded-full bg-[#e8f5ff] flex items-center justify-center text-[14px] font-bold text-[#5b3df6]">
                  {selectedSession.mentor[0]}
                </div>
                <div>
                  <div className="font-semibold text-[14px] text-[#0f172a]">{selectedSession.mentor}</div>
                  <div className="text-[11px] text-[#94a3b8]">{selectedSession.mentorRole}</div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-[#5b3df6]" />
                  <h4 className="text-[13px] font-semibold text-[#0f172a]">Next steps</h4>
                </div>
                <p className="text-[12px] text-[#64748b] ml-6">
                  We'll email you the live room link and the semantic HTML checklist. Please review the checklist before joining the session.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t border-black/[0.08]">
                <button
                  onClick={handleCancelReservation}
                  className="flex-1 h-10 border border-black/[0.08] rounded-[8px] text-[13px] font-medium text-[#64748b] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReservation}
                  className="flex-1 h-10 bg-[#5b3df6] rounded-[8px] text-[13px] font-medium text-white hover:bg-[#4a2ed8] transition-colors"
                >
                  Confirm reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-b flex flex-col from-[#f6f8fa] gap-[24px] h-full p-[28px] to-[#f7fcff]">
        {/* Hero Banner */}
        <section className="border border-black/[0.08] border-solid content-stretch flex flex-col items-start pb-[23px] pt-[25px] px-[25px] relative rounded-[8px] shrink-0 w-full bg-gradient-to-br from-white to-[#e8f5ff]">
          <div className="flex items-start justify-between w-full">
            <div className="flex-1 pr-6">
              <div className="bg-[#ffd966] inline-flex items-center px-[10px] py-[6.5px] rounded-[12px] mb-[16px]">
                <Video className="h-[14px] w-[14px] mr-[6px] text-[#4b2e00]" />
                <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[#4b2e00] text-[12px]">
                  Instructor-led sessions
                </div>
              </div>
              <h1 className="text-[28px] font-bold text-[#0f172a] mb-[12px]">Join live classes, office hours, and mentor walkthroughs from one schedule.</h1>
              <p className="text-[14px] text-[#94a3b8]">
                Track upcoming sessions, reserve your seat, and revisit class notes across design, frontend, analytics, and career development. Everything is organized around your weekly learning plan.
              </p>
              <div className="mt-4 flex flex-wrap gap-[12px]">
                {['18 live sessions this week', '4 seats reserved today', 'Top tracks: UI/UX, Frontend, Product'].map(t => (
                  <div key={t} className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
                    <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">{t}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Live now card */}
            <div className="w-[280px] shrink-0 bg-white border border-black/[0.08] rounded-[8px] p-[20px]">
              <div className="flex items-center gap-[8px] mb-[12px]">
                <span className="h-[8px] w-[8px] rounded-full bg-[#ffd966] animate-pulse" />
                <span className="text-[12px] font-semibold text-[#ffd966]">Live now in 18 min</span>
              </div>
              <h3 className="font-bold text-[16px] text-[#0f172a] mb-[8px]">Design critique lab</h3>
              <p className="text-[12px] text-[#94a3b8] mb-[12px]">A focused mentor session reviewing portfolio storytelling, accessibility choices, and system thinking in product case studies.</p>
              <div className="space-y-[8px] text-[12px] text-[#94a3b8]">
                <div className="flex items-center gap-[8px]"><Calendar className="h-[14px] w-[14px]" /> Today · 6:30 PM</div>
                <div className="flex items-center gap-[8px]"><Users className="h-[14px] w-[14px]" /> 126 learners registered</div>
                <div className="flex items-center gap-[8px]"><Video className="h-[14px] w-[14px]" /> Zoom classroom · 60 min</div>
              </div>
              <button className="mt-[16px] w-full bg-[#5b3df6] flex items-center justify-center gap-[8px] h-[40px] rounded-[6px]">
                <PlayCircle className="h-[16px] w-[16px] text-white" />
                <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-white text-[14px]">Join waiting room</div>
              </button>
            </div>
          </div>
        </section>

        {/* Browse filters */}
        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="font-bold text-[18px] text-[#0f172a]">Browse live schedule</h2>
              <p className="text-[13px] text-[#94a3b8] mt-[4px]">Filter by track, type, mentor, or seat availability.</p>
            </div>
            <button className="border border-black/[0.08] flex items-center gap-[8px] h-[40px] justify-center px-[17px] py-[0.25px] rounded-[6px] shrink-0 bg-white">
              <Calendar className="h-[18px] w-[18px] text-[#0f172a]" />
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[14px]">Weekly view</div>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-[12px] w-full">
            <div className="flex-1 min-w-[240px] bg-white border border-black/[0.08] flex items-center gap-[10px] h-[40px] px-[15px] py-[0.25px] relative rounded-[6px]">
              <Search className="h-[18px] w-[18px] text-[#94a3b8]" />
              <input
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none"
                placeholder="Search by topic, mentor, or cohort"
              />
            </div>
            <div className="flex gap-[8px] flex-wrap">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`inline-flex h-[36px] items-center px-[16px] rounded-[12px] text-[12px] font-medium transition-colors ${
                    activeFilter === f ? 'bg-[#5b3df6] text-white' : 'bg-[#f1f5f9] text-[#0f172a] hover:bg-[#e8f5ff]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[1fr_300px]">
          {/* Sessions list */}
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[20px] text-[#0f172a]">Upcoming sessions</h2>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Built around your current courses and recent activity.</p>
              </div>
              <span className="text-[13px] text-[#94a3b8]">Showing 4 personalized sessions</span>
            </div>

            {sessions.map((s) => (
              <article key={s.id} className="bg-white border border-black/[0.08] border-solid rounded-[8px] p-[20px]">
                <div className="flex items-start justify-between gap-[12px] mb-[12px]">
                  <div className="flex flex-wrap gap-[8px]">
                    {s.tags.map((tag, i) => (
                      <span key={tag} className={`inline-flex h-[26px] items-center px-[10px] rounded-[10px] text-[11px] font-medium ${tag === 'Live today' ? 'bg-[#ffd966] text-[#4b2e00]' : 'bg-[#f1f5f9] text-[#0f172a]'}`}>
                        {tag === 'Live today' && <span className="mr-[4px]">●</span>}{tag}
                      </span>
                    ))}
                  </div>
                  <Pill variant={s.badgeVariant}>{s.badge}</Pill>
                </div>

                <h3 className="font-bold text-[18px] text-[#0f172a] leading-snug">{s.title}</h3>
                <p className="mt-[8px] text-[13px] text-[#94a3b8]">{s.desc}</p>

                <div className="mt-[16px] grid grid-cols-4 gap-[12px]">
                  {[['Time', s.time], ['Duration', s.duration], ['Format', s.format], ['Capacity', s.capacity]].map(([label, val]) => (
                    <div key={label} className="bg-[#f8fafc] rounded-[6px] px-[12px] py-[8px]">
                      <div className="text-[10px] text-[#94a3b8] mb-[4px]">{label}</div>
                      <div className="text-[12px] font-semibold text-[#0f172a]">{val}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-[16px] flex items-center justify-between">
                  <div className="flex items-center gap-[12px]">
                    <div className="h-[36px] w-[36px] rounded-[6px] flex items-center justify-center text-[14px] font-bold bg-[#e8f5ff] text-[#5b3df6]">
                      {s.mentor[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-[13px] text-[#0f172a]">{s.mentor}</div>
                      <div className="text-[11px] text-[#94a3b8]">{s.mentorRole}</div>
                    </div>
                  </div>
                  <div className="flex gap-[12px]">
                    {s.actions.map(a => (
                      <button
                        key={a.label}
                        onClick={() => {
                          if (a.label === 'Reserve seat') {
                            handleReserveClick(s)
                          }
                        }}
                        className={`h-[36px] px-[14px] rounded-[6px] text-[12px] font-medium ${
                          a.variant === 'primary' 
                            ? 'bg-[#5b3df6] text-white hover:bg-[#4a2ed8]' 
                            : 'border border-black/[0.08] bg-white text-[#0f172a] hover:bg-gray-50'
                        } transition-colors`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-[24px]">
            {/* This week */}
            <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
              <div>
                <h3 className="font-bold text-[18px] text-[#0f172a]">This week</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">A compact view of your reserved and suggested sessions.</p>
              </div>
              <div className="flex flex-col w-full gap-[12px]">
                {weekSchedule.map(item => (
                  <div key={item.date} className="flex items-start gap-[12px] rounded-[6px] border border-black/[0.08] bg-[#fafbfc] p-[12px]">
                    <div className="text-center shrink-0">
                      <div className="text-[10px] text-[#94a3b8] font-medium">{item.day}</div>
                      <div className="text-[14px] font-bold text-[#0f172a]">{item.date}</div>
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-[#0f172a]">{item.title}</div>
                      <div className="text-[11px] text-[#94a3b8] mt-[4px]">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular mentors */}
            <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
              <div>
                <h3 className="font-bold text-[18px] text-[#0f172a]">Popular mentors</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Recommended based on your current learning path.</p>
              </div>
              <div className="flex flex-col w-full gap-[12px]">
                {mentors.map(m => (
                  <div key={m.name} className="flex items-center gap-[12px] rounded-[6px] border border-black/[0.08] bg-[#fafbfc] p-[10px]">
                    <div className="h-[36px] w-[36px] rounded-[6px] flex items-center justify-center text-[12px] font-bold shrink-0 bg-[#e8f5ff] text-[#5b3df6]">
                      {m.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-[#0f172a]">{m.name}</div>
                      <div className="text-[11px] text-[#94a3b8] truncate">{m.detail}</div>
                    </div>
                    <span className="shrink-0 inline-flex h-[26px] items-center px-[10px] rounded-[10px] text-[11px] font-medium bg-[#e8f5ff] text-[#5b3df6]">{m.rating}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Class reminders */}
            <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
              <div>
                <h3 className="font-bold text-[18px] text-[#0f172a]">Class reminders</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Keep track of prep work before each session starts.</p>
              </div>
              <div className="flex flex-col w-full gap-[12px]">
                {reminders.map(r => (
                  <div key={r.title} className="rounded-[6px] border border-black/[0.08] bg-[#fafbfc] p-[12px]">
                    <div className="text-[12px] font-semibold text-[#0f172a]">{r.title}</div>
                    <div className="text-[11px] text-[#94a3b8] mt-[4px]">{r.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
