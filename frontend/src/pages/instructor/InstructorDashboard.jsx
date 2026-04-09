import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video, Calendar, FileText, GraduationCap } from 'lucide-react'
import { api } from '../../lib/api'
import useRealtime from '../../hooks/useRealtime'

const pillVariants = {
  success: 'bg-[#2dd4bf] text-[#023b33]',
  warning: 'bg-[#ffd966] text-[#4b2e00]',
  secondary: 'bg-[#e8f5ff] text-[#0f172a]',
}

function Pill({ type = 'secondary', children }) {
  return (
    <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${pillVariants[type]}`}>
      {children}
    </span>
  )
}

function BtnPrimary({ children, className = '', onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 h-[40px] px-[16px] rounded-[6px] text-[14px] font-medium bg-[#5b3df6] text-white hover:bg-[#4c2dd9] transition-colors cursor-pointer ${className}`}
    >
      {children}
    </button>
  )
}

function BtnOutline({ children, className = '', onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 h-[40px] px-[17px] rounded-[6px] text-[14px] font-medium bg-white text-[#0f172a] border border-black/[0.08] hover:bg-[#f1f5f9] transition-colors cursor-pointer whitespace-nowrap ${className}`}
    >
      {children}
    </button>
  )
}

function BtnOutlineSm({ children, className = '', onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 h-[36px] px-[12px] rounded-[6px] text-[13px] font-medium bg-white text-[#0f172a] border border-black/[0.08] hover:bg-[#f1f5f9] transition-colors cursor-pointer whitespace-nowrap ${className}`}
    >
      {children}
    </button>
  )
}

function IconBox({ icon }) {
  return (
    <div className="bg-[#e8f5ff] w-[42px] h-[42px] rounded-[6px] flex items-center justify-center flex-shrink-0 text-xl">
      {icon}
    </div>
  )
}

function Stat({ title, value, meta, icon, variant = 'secondary' }) {
  return (
    <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[19px] rounded-[8px]">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start">
          <div className="text-[13px] font-medium text-[#94a3b8] sm:text-[14px]">{title}</div>
          <div className="text-[28px] font-bold leading-tight tracking-[-0.6px] text-[#0f172a] sm:text-[30px]">{value}</div>
        </div>
        <div className="bg-[#e8f5ff] flex items-center justify-center relative rounded-[6px] shrink-0 size-[40px]">
          {icon}
        </div>
      </div>
      <Pill type={variant}>{meta}</Pill>
    </div>
  )
}

function SectionCard({ title, subtitle, actionLabel, onAction, children }) {
  return (
    <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
      <div className="px-[21px] pt-[21px] pb-[16px] flex flex-col justify-between items-start gap-4 sm:flex-row">
        <div>
          <h3 className="text-[18px] font-bold text-[#0f172a] m-0">{title}</h3>
          <p className="text-[13px] text-[#94a3b8] mt-[4px]">{subtitle}</p>
        </div>
        <BtnOutlineSm onClick={onAction} className="w-full justify-center sm:w-auto">{actionLabel}</BtnOutlineSm>
      </div>
      <div className="flex flex-col gap-[16px] px-[21px] pb-[21px]">{children}</div>
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div className="rounded-[6px] border border-dashed border-black/[0.08] bg-[#f8fafc] p-3 text-[13px] text-[#64748b]">
      {text}
    </div>
  )
}

export default function InstructorDashboard() {
  const navigate = useNavigate()
  const tenantId = localStorage.getItem('lms_tenant_id')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [me, setMe] = useState(null)
  const [dashboard, setDashboard] = useState({})
  const [courses, setCourses] = useState([])
  const [liveClasses, setLiveClasses] = useState([])
  const [events, setEvents] = useState([])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      const [meRes, dashboardRes, coursesRes, classesRes, eventsRes] = await Promise.all([
        api('/auth/me'),
        api('/lms/dashboard/instructor'),
        api('/lms/courses?limit=200'),
        api('/lms/live-classes?limit=200'),
        api('/lms/events?limit=200'),
      ])
      setMe(meRes || null)
      setDashboard(dashboardRes || {})
      setCourses(Array.isArray(coursesRes?.items) ? coursesRes.items : [])
      setLiveClasses(Array.isArray(classesRes?.items) ? classesRes.items : [])
      setEvents(Array.isArray(eventsRes?.items) ? eventsRes.items : [])
    } catch (err) {
      const message = err?.message || 'Failed to load dashboard data'
      setError(message)
      if (message.toLowerCase().includes('invalid token')) {
        navigate('/login', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useRealtime(tenantId ? `tenant:${tenantId}` : '', () => {
    fetchData()
  })

  const myInstructorId = me?._id || me?.id || ''

  const myCourses = useMemo(() => {
    const filtered = myInstructorId
      ? courses.filter((c) => String(c?.created_by || '') === String(myInstructorId))
      : courses
    return [...filtered]
      .sort((a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0))
      .slice(0, 4)
  }, [courses, myInstructorId])

  const myClasses = useMemo(() => {
    const filtered = myInstructorId
      ? liveClasses.filter((c) => String(c?.instructor_id || '') === String(myInstructorId))
      : liveClasses
    return [...filtered]
      .sort((a, b) => new Date(a?.start_at || 0) - new Date(b?.start_at || 0))
      .slice(0, 4)
  }, [liveClasses, myInstructorId])

  const upcomingEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => new Date(a?.starts_at || 0) - new Date(b?.starts_at || 0))
      .slice(0, 4)
  }, [events])

  const stats = [
    {
      id: 'sessions',
      title: 'Live Sessions This Week',
      value: String(dashboard.live_sessions_week ?? 0),
      icon: <Video className="h-[18px] w-[18px] text-[#5b3df6]" />,
      meta: 'From backend',
      variant: 'success',
    },
    {
      id: 'labs',
      title: 'Practical Lab Modules',
      value: String(dashboard.lab_modules ?? 0),
      icon: <GraduationCap className="h-[18px] w-[18px] text-[#5b3df6]" />,
      meta: 'From backend',
      variant: 'secondary',
    },
    {
      id: 'tests',
      title: 'Weekly MCQ Tests',
      value: String(dashboard.weekly_tests ?? 0),
      icon: <FileText className="h-[18px] w-[18px] text-[#5b3df6]" />,
      meta: 'From backend',
      variant: 'warning',
    },
    {
      id: 'events',
      title: 'Active School Events',
      value: String(dashboard.events ?? 0),
      icon: <Calendar className="h-[18px] w-[18px] text-[#5b3df6]" />,
      meta: 'From backend',
      variant: 'success',
    },
  ]

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading dashboard...</div>
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="mb-3 text-red-600">{error}</p>
        <button onClick={fetchData} className="rounded bg-[#5b3df6] px-4 py-2 text-sm text-white">Retry</button>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="bg-gradient-to-b flex h-full flex-col gap-[24px] from-[#f6f8fa] p-4 to-[#f7fcff] sm:p-6 lg:p-7">
        <section className="w-full shrink-0 rounded-[8px] border border-black/[0.08] border-solid bg-gradient-to-br from-white to-[#e8f5ff] px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <div className="flex flex-col items-start gap-[11px]">
            <div className="bg-[#ffd966] flex items-center px-[10px] py-[6.5px] rounded-[12px] shrink-0">
              <div className="text-[12px] font-medium text-[#4b2e00]">Live instructor insights</div>
            </div>
            <div className="text-[22px] font-bold leading-tight text-[#0f172a] sm:text-[26px] lg:text-[28px]">
              Real-time classes, courses, tests, and school events.
            </div>
            <div className="text-[13px] leading-relaxed text-[#94a3b8] sm:text-[14px]">
              This dashboard is now connected to backend APIs and refreshes on tenant realtime updates.
            </div>
          </div>
          <div className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <BtnPrimary onClick={() => navigate('/instructor/online-classes')} className="w-full justify-center sm:w-auto">Open Classes</BtnPrimary>
            <BtnOutline onClick={() => fetchData()} className="w-full justify-center sm:w-auto">Refresh Data</BtnOutline>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-x-[16px] gap-y-[16px] sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <Stat key={s.id} title={s.title} value={s.value} meta={s.meta} icon={s.icon} variant={s.variant} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-x-[24px] gap-y-[24px] xl:grid-cols-2">
          <SectionCard
            title="My Live Classes"
            subtitle="Upcoming and scheduled classes assigned to you"
            actionLabel="Manage"
            onAction={() => navigate('/instructor/online-classes')}
          >
            {myClasses.length === 0 ? (
              <EmptyState text="No live classes found." />
            ) : (
              myClasses.map((item) => (
                <div key={item._id} className="flex items-start gap-[16px] p-[16px] border border-black/[0.08] rounded-[6px]">
                  <IconBox icon="\uD83D\uDDA5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#0f172a] leading-snug">{item.title || 'Untitled class'}</div>
                    <div className="text-[13px] text-[#94a3b8] mt-[4px] leading-relaxed">
                      {item.start_at ? new Date(item.start_at).toLocaleString() : 'No schedule'}
                    </div>
                    <div className="mt-2"><Pill type="secondary">{item.status || 'upcoming'}</Pill></div>
                  </div>
                </div>
              ))
            )}
          </SectionCard>

          <SectionCard
            title="Weekly Tests"
            subtitle="Live count from instructor dashboard data"
            actionLabel="Create test"
            onAction={() => navigate('/instructor/weekly-tests')}
          >
            <div className="flex flex-col gap-[12px] rounded-[6px] border border-black/[0.08] p-[16px]">
              <div className="text-[14px] font-semibold text-[#0f172a] leading-snug">Total weekly tests created</div>
              <div className="text-[30px] font-bold text-[#0f172a] leading-tight">{dashboard.weekly_tests ?? 0}</div>
              <div><Pill type="warning">From backend</Pill></div>
            </div>
          </SectionCard>

          <SectionCard
            title="My Courses"
            subtitle="Latest courses published by you"
            actionLabel="View all"
            onAction={() => navigate('/instructor/my-courses')}
          >
            {myCourses.length === 0 ? (
              <EmptyState text="No courses found." />
            ) : (
              myCourses.map((item) => (
                <div key={item._id} className="flex items-start gap-[12px] p-[16px] border border-black/[0.08] rounded-[6px]">
                  <IconBox icon="\uD83D\uDCD8" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#0f172a] leading-snug mb-[4px]">{item.title || 'Untitled course'}</div>
                    <div className="text-[13px] text-[#94a3b8] leading-relaxed line-clamp-2">{item.description || 'No description'}</div>
                  </div>
                </div>
              ))
            )}
          </SectionCard>

          <SectionCard
            title="School Events"
            subtitle="Upcoming events from tenant feed"
            actionLabel="View all"
            onAction={() => fetchData()}
          >
            {upcomingEvents.length === 0 ? (
              <EmptyState text="No events found." />
            ) : (
              upcomingEvents.map((item) => (
                <div key={item._id} className="flex flex-col items-start gap-[12px] p-[16px] border border-black/[0.08] rounded-[6px] sm:flex-row sm:items-center">
                  <IconBox icon="\uD83D\uDDD3\uFE0F" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#0f172a] leading-snug">{item.title || 'Untitled event'}</div>
                    <div className="text-[13px] text-[#94a3b8] mt-[4px] leading-relaxed">
                      {item.starts_at ? new Date(item.starts_at).toLocaleString() : 'No schedule'}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Pill type="secondary">Upcoming</Pill>
                  </div>
                </div>
              ))
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
