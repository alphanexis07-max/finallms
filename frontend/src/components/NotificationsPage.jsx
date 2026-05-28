import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, BookOpen, Calendar, CheckCheck, CreditCard, FileCheck2, Sparkles, Trash2, UserRound } from 'lucide-react'
import { api } from '../lib/api'
import useRealtime from '../hooks/useRealtime'

const roleConfig = {
  student: {
    badge: 'Student notifications',
    heading: 'Stay updated on classes, assignments, certificates, and fees.',
    description: 'Use this feed for live class alerts, submission feedback, achievement notices, and payment updates.',
    allowedPrefix: '/student-panel',
    fallback: {
      course: '/student-panel/my-courses',
      live_class: '/student-panel/live-classes',
      payment: '/student-panel/invoices',
      assignment: '/student-panel/tests',
      certificate: '/student-panel/certificates',
    },
  },
  instructor: {
    badge: 'Instructor notifications',
    heading: 'Track student submissions, class updates, and course activity.',
    description: 'Use this feed for teaching alerts, enrollment changes, and live class updates.',
    allowedPrefix: '/instructor',
    fallback: {
      course: '/instructor/my-courses',
      live_class: '/instructor/online-classes',
      payment: '/instructor/dashboard',
      assignment: '/instructor/weekly-tests',
      certificate: '/instructor/student-insights',
    },
  },
  admin: {
    badge: 'Admin notifications',
    heading: 'Track tenant updates, approvals, and school operations in one place.',
    description: 'Review operational alerts, student activity, course events, and payment updates for your institute.',
    allowedPrefix: '/admin',
    fallback: {
      course: '/admin/course-management',
      live_class: '/admin/live-classes',
      payment: '/admin/payments-coupons',
      assignment: '/admin/weekly-tests',
      certificate: '/admin/student-management',
      instructor: '/admin/instructor-management',
    },
  },
  superadmin: {
    badge: 'Platform notifications',
    heading: 'Monitor tenant activity, payments, and platform-wide updates.',
    description: 'Review important platform events and revenue activity across institutes.',
    allowedPrefix: '/superadmin',
    fallback: {
      course: '/superadmin/dashboard',
      live_class: '/superadmin/dashboard',
      payment: '/superadmin/revenue',
      assignment: '/superadmin/reports',
      certificate: '/superadmin/dashboard',
      instructor: '/superadmin/tenant-management',
    },
  },
}

function normalizeNotificationId(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  const objectIdMatch = raw.match(/[a-f0-9]{24}/i)
  return objectIdMatch ? objectIdMatch[0] : raw
}

function iconFor(item) {
  const kind = String(item.entityType || item.type || '').toLowerCase()
  if (kind.includes('live') || kind.includes('class')) return Calendar
  if (kind.includes('payment')) return CreditCard
  if (kind.includes('assessment') || kind.includes('assignment') || kind.includes('test')) return FileCheck2
  if (kind.includes('achievement') || kind.includes('certificate')) return Award
  if (kind.includes('instructor') || kind.includes('user')) return UserRound
  return BookOpen
}

function timeAgo(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const seconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000))
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function normalizeNotification(n) {
  const meta = n?.meta || {}
  const entityType = n?.entity_type || meta.entity_type || ''
  const courseTitle = meta.course_title || n?.course_title || ''
  const liveClassTitle = meta.live_class_title || n?.live_class_title || ''
  const itemTitle = meta.item_title || meta.title || ''

  return {
    id: normalizeNotificationId(n?._id || n?.id),
    title: n?.title || 'Notification',
    message: n?.message || '',
    type: n?.type || entityType || 'course',
    entityType,
    courseId: n?.course_id || meta.course_id || '',
    liveClassId: n?.live_class_id || meta.live_class_id || '',
    redirectUrl: n?.redirect_url || meta.redirect_url || '',
    entityLabel: liveClassTitle || courseTitle || itemTitle,
    createdAt: n?.created_at || n?.createdAt,
    unread: !n?.read,
  }
}

function getFallbackKey(item) {
  const value = `${item.entityType} ${item.type}`.toLowerCase()
  if (value.includes('payment')) return 'payment'
  if (value.includes('live') || value.includes('class')) return 'live_class'
  if (value.includes('assignment') || value.includes('assessment') || value.includes('test')) return 'assignment'
  if (value.includes('certificate') || value.includes('achievement')) return 'certificate'
  if (value.includes('instructor') || value.includes('user')) return 'instructor'
  return 'course'
}

function resolveRedirect(item, config) {
  const redirect = String(item.redirectUrl || '').trim()
  if (redirect && redirect.startsWith(config.allowedPrefix)) return redirect
  return config.fallback[getFallbackKey(item)] || config.allowedPrefix
}

export default function NotificationsPage({ role = 'student' }) {
  const navigate = useNavigate()
  const config = roleConfig[role] || roleConfig.student
  const [tab, setTab] = useState('all')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const tenantId = localStorage.getItem('lms_tenant_id')

  const load = () =>
    api('/lms/notifications')
      .then((res) => {
        const data = res.items || res || []
        setItems(data.map(normalizeNotification))
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  useRealtime(tenantId ? `tenant:${tenantId}` : '', () => load())

  const filtered = useMemo(() => (tab === 'unread' ? items.filter((item) => item.unread) : items), [tab, items])
  const unreadCount = useMemo(() => items.filter((item) => item.unread).length, [items])
  const latestNotification = useMemo(() => items[0] || null, [items])

  const deleteNotification = async (event, item) => {
    event.stopPropagation()
    if (!window.confirm('Delete this notification?')) return

    try {
      await api(`/lms/notifications/${encodeURIComponent(item.id)}`, { method: 'DELETE' })
    } catch (err) {
      if (!String(err?.message || '').toLowerCase().includes('not found')) {
        window.alert('Unable to delete notification right now.')
        return
      }
    }
    setItems((prev) => prev.filter((x) => x.id !== item.id))
  }

  return (
    <div className="relative min-h-full overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(91,61,246,0.09),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(45,212,191,0.12),_transparent_24%),linear-gradient(180deg,_#f8fbff_0%,_#f5f8ff_100%)]">
      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#ede7ff]/60 blur-3xl" />
      <div className="pointer-events-none absolute right-[-70px] top-56 h-72 w-72 rounded-full bg-[#d9fbf5]/70 blur-3xl" />

      <div className="relative space-y-4 p-4 sm:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[18px] border border-[#e8edf3] bg-white/85 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-6 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <span className="inline-flex items-center gap-1.5 rounded-[999px] border border-[#e7e1ff] bg-[#f6f2ff] px-3 py-1 text-[11px] font-semibold text-[#5b3df6]">
                <Sparkles className="h-3.5 w-3.5" />
                {config.badge}
              </span>
              <h2 className="mt-3 max-w-[760px] text-[34px] font-black leading-[1.02] tracking-[-0.04em] text-[#0f172a] sm:text-[42px] lg:text-[48px]">
                {config.heading}
              </h2>
              <p className="mt-3 max-w-[860px] text-[13px] leading-6 text-[#64748b] sm:text-[14px]">{config.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:min-w-[320px]">
              <div className="rounded-[14px] border border-[#ece7ff] bg-[#faf8ff] p-4 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b7cf6]">Total</div>
                <div className="mt-2 text-[28px] font-bold text-[#0f172a]">{items.length}</div>
              </div>
              <div className="rounded-[14px] border border-[#d7f5ef] bg-[#f3fffd] p-4 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#12a38a]">Unread</div>
                <div className="mt-2 text-[28px] font-bold text-[#0f172a]">{unreadCount}</div>
              </div>
              <div className="rounded-[14px] border border-[#e8edf3] bg-white p-4 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#94a3b8]">Latest</div>
                <div className="mt-2 line-clamp-2 text-[13px] font-semibold text-[#0f172a]">{latestNotification?.title || 'No recent notification'}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[18px] border border-[#e8edf3] bg-white/90 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3 border-b border-[#eef2f7] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {['all', 'unread'].map((key) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`rounded-[999px] px-3.5 py-2 text-[12px] font-semibold capitalize transition-colors ${tab === key ? 'bg-[#5b3df6] text-white shadow-sm' : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e9edf5]'}`}
                >
                  {key}
                </button>
              ))}
            </div>
            <button
              onClick={() => api('/lms/notifications/read-all', { method: 'PATCH' }).then(load).catch(() => {})}
              className="inline-flex items-center gap-1.5 self-start rounded-[10px] border border-black/[0.08] bg-white px-3.5 py-2 text-[12px] font-semibold text-[#0f172a] transition-colors hover:bg-[#f8fafc]"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          </div>

          <div className="space-y-3">
            {loading && <p className="rounded-[12px] border border-dashed border-[#dfe6f2] bg-[#fbfdff] px-4 py-6 text-[12px] text-[#94a3b8]">Loading notifications...</p>}
            {!loading && filtered.length === 0 && (
              <div className="rounded-[14px] border border-dashed border-[#dfe6f2] bg-[#fbfdff] p-6 text-[13px] text-[#64748b]">No notifications found.</div>
            )}
            {filtered.map((item) => {
              const Icon = iconFor(item)
              const target = resolveRedirect(item, config)
              return (
                <article
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(target)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(target)
                    }
                  }}
                  className={`group flex cursor-pointer items-start justify-between rounded-[16px] border p-4 transition-all duration-200 ${
                    item.unread
                      ? 'border-[#cfc4ff] bg-gradient-to-r from-[#f7f3ff] to-[#fcfbff] shadow-[0_10px_28px_rgba(91,61,246,0.07)]'
                      : 'border-[#e8edf3] bg-white hover:border-[#d8e1ee] hover:shadow-[0_8px_22px_rgba(15,23,42,0.04)]'
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3.5">
                    <div className={`rounded-[12px] p-2.5 ring-1 ${item.unread ? 'bg-[#ede7ff] ring-[#d9d1ff]' : 'bg-[#f8fafc] ring-[#e8edf3]'}`}>
                      <Icon className={`h-4.5 w-4.5 ${item.unread ? 'text-[#5b3df6]' : 'text-[#64748b]'}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-[#0f172a]">{item.title}</h3>
                        {item.unread && <span className="rounded-full bg-[#5b3df6] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">New</span>}
                      </div>
                      {item.entityLabel ? <p className="mt-1 text-[12px] font-semibold text-[#334155]">{item.entityLabel}</p> : null}
                      <p className="mt-1 max-w-[820px] text-[13px] leading-6 text-[#64748b]">{item.message}</p>
                      <p className="mt-2 text-[11px] font-medium text-[#94a3b8]">{timeAgo(item.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {item.unread && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#5b3df6] shadow-[0_0_0_4px_rgba(91,61,246,0.12)]" />}
                    <button title="Delete notification" className="rounded p-1 hover:bg-red-50" onClick={(event) => deleteNotification(event, item)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
