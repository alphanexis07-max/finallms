import React, { useEffect, useState } from 'react'
import {
  Search, Video, Calendar, Clock3, Users, PlayCircle, BookOpen,
  Star, ChevronRight, X, Check, Lock, CreditCard, CheckCircle2,
  CalendarDays, BarChart2, MessageSquare, Monitor, UserCheck,
  Link2, Clock, Wifi
} from 'lucide-react'
import { api, loadRazorpayScript } from '../../lib/api'
import useRealtime from '../../hooks/useRealtime'

const A1 = 'https://i.pravatar.cc/40?img=1'
const A2 = 'https://i.pravatar.cc/40?img=2'
const A3 = 'https://i.pravatar.cc/40?img=3'
const A4 = 'https://i.pravatar.cc/40?img=4'
const A5 = 'https://i.pravatar.cc/40?img=5'

const AVATARS = [A1, A2, A3, A4, A5]

const STATUS_CONFIG = {
  live: { label: 'Live', bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]', dot: 'bg-[#ef4444]' },
  upcoming: { label: 'Upcoming', bg: 'bg-[#fef9c3]', text: 'text-[#854d0e]', dot: 'bg-[#eab308]' },
  recent: { label: 'Completed', bg: 'bg-[#dcfce7]', text: 'text-[#14532d]', dot: 'bg-[#22c55e]' },
}

const FILTERS = ['All Sessions', 'Live Now', 'Upcoming', 'Complete', 'Enrolled']
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000

const LIVE_SUBSCRIPTION_TEMPLATES = [
  { key: 'demo', name: 'Demo', period: 'Demo', defaultFactor: 0.1 },
  { key: 'half', name: 'Half', period: 'Half (until half of the course is completed)', defaultFactor: 0.5 },
  { key: 'full', name: 'Full', period: 'Full (until the full course is completed)', defaultFactor: 1 },
]

function normalizePlanKey(name) {
  const normalized = String(name || '').trim().toLowerCase()
  if (!normalized) return ''
  if (normalized.includes('demo')) return 'demo'
  if (normalized.includes('half')) return 'half'
  if (normalized.includes('full')) return 'full'
  return ''
}

function normalizePlanPeriodText(value, key, fallback) {
  const raw = String(value || '').trim()
  if (!raw) return fallback

  const lower = raw.toLowerCase()
  if (lower.includes('half course complete hone tak')) {
    return 'Half (until half of the course is completed)'
  }
  if (lower.includes('full course complete hone tak')) {
    return 'Full (until the full course is completed)'
  }

  if (key === 'half' && lower === 'half') {
    return 'Half (until half of the course is completed)'
  }
  if (key === 'full' && lower === 'full') {
    return 'Full (until the full course is completed)'
  }

  return raw
}

function buildLiveSubscriptionPlans(rawPlans, classAmountValue) {
  const classAmount = Number(classAmountValue || 0)
  const sourceByKey = new Map()

  ;(rawPlans || []).forEach((plan) => {
    const key = normalizePlanKey(plan?.name)
    if (!key || sourceByKey.has(key)) return
    sourceByKey.set(key, plan)
  })

  return LIVE_SUBSCRIPTION_TEMPLATES.map((template) => {
    const source = sourceByKey.get(template.key)
    const rawPrice = Number(source?.price || 0)

    // If admin plan price is in 0-100 range, treat it as percent of live class amount.
    const factor = rawPrice > 0 && rawPrice <= 100 ? rawPrice / 100 : template.defaultFactor
    const computedAmount = classAmount > 0
      ? Math.max(0, Math.round(classAmount * factor))
      : Math.max(0, rawPrice)

    return {
      id: source?.id || source?._id || template.key,
      key: template.key,
      name: source?.name || template.name,
      period: normalizePlanPeriodText(source?.period || source?.billing_period, template.key, template.period),
      price: computedAmount,
      factor,
    }
  })
}

function getMinSubscriptionLabel(rawPlans, classAmountValue) {
  const plans = buildLiveSubscriptionPlans(rawPlans, classAmountValue)
  if (plans.length === 0) return null
  const minPrice = Math.min(...plans.map((p) => Number(p.price || 0)))
  return `from ₹${Number(minPrice || 0).toLocaleString('en-IN')}`
}

function parseServerDateAsUtc(value) {
  if (!value) return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  const raw = String(value).trim()
  if (!raw) return null

  const hasTimezone = /([zZ]|[+-]\d{2}:\d{2})$/.test(raw)
  if (hasTimezone) {
    const parsed = new Date(raw)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  // Legacy rows without timezone are treated as IST local wall time.
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?$/)
  if (!m) {
    const fallback = new Date(raw)
    return Number.isNaN(fallback.getTime()) ? null : fallback
  }

  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  const hour = Number(m[4])
  const minute = Number(m[5])
  const second = Number(m[6] || 0)
  const millisecond = Number(String(m[7] || '0').padEnd(3, '0'))
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second, millisecond) - IST_OFFSET_MS
  return new Date(utcMs)
}

function toIstDate(value) {
  const raw = parseServerDateAsUtc(value)
  if (!raw || Number.isNaN(raw.getTime())) return null
  return new Date(raw.getTime() + IST_OFFSET_MS)
}

function formatDateInIst(value) {
  const istDate = toIstDate(value)
  if (!istDate) return 'Not scheduled'
  const day = String(istDate.getUTCDate()).padStart(2, '0')
  const month = String(istDate.getUTCMonth() + 1).padStart(2, '0')
  const year = istDate.getUTCFullYear()
  return `${day}/${month}/${year}`
}

function formatTimeInIst(value) {
  const istDate = toIstDate(value)
  if (!istDate) return '-'
  let hour = istDate.getUTCHours()
  const minute = String(istDate.getUTCMinutes()).padStart(2, '0')
  const suffix = hour >= 12 ? 'pm' : 'am'
  hour = hour % 12
  if (hour === 0) hour = 12
  return `${String(hour).padStart(2, '0')}:${minute} ${suffix}`
}

function getSessionStatus(rawStatus, startAtValue, durationMinutes) {
  const status = String(rawStatus || '').toLowerCase()
  if (status === 'recent' || status === 'completed') return 'recent'
  if (status === 'cancelled') return 'recent'

  const startAt = parseServerDateAsUtc(startAtValue)
  const startMs = startAt ? startAt.getTime() : null
  if (!startMs) return status === 'live' ? 'live' : 'upcoming'

  const durationMs = Math.max(1, Number(durationMinutes || 60)) * 60 * 1000
  const endMs = startMs + durationMs
  const now = Date.now()

  if (status === 'live') {
    return now <= endMs ? 'live' : 'recent'
  }

  if (now > endMs) return 'recent'
  return 'upcoming'
}

function getObjectIdTimestampMs(value) {
  const raw = String(value || '').trim()
  if (!/^[a-f0-9]{24}$/i.test(raw)) return 0
  const seconds = Number.parseInt(raw.slice(0, 8), 16)
  return Number.isFinite(seconds) ? seconds * 1000 : 0
}

function getLiveClassSortTimestamp(row) {
  const directDate =
    parseServerDateAsUtc(row?.created_at) ||
    parseServerDateAsUtc(row?.createdAt) ||
    parseServerDateAsUtc(row?.updated_at) ||
    parseServerDateAsUtc(row?.updatedAt) ||
    parseServerDateAsUtc(row?.start_at)

  if (directDate && !Number.isNaN(directDate.getTime())) {
    return directDate.getTime()
  }

  return getObjectIdTimestampMs(row?._id)
}

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
function EnrollmentModal({ session, plans, me, onClose, onSuccess }) {
  const [step, setStep] = useState('details') // details | success
  const [selectedPlanId, setSelectedPlanId] = useState('')
  const [modalError, setModalError] = useState('')
  const [loading, setLoading] = useState(false)

  const normalizedPlans = buildLiveSubscriptionPlans(plans, session?.priceAmount)

  useEffect(() => {
    if (!selectedPlanId && normalizedPlans.length > 0) {
      setSelectedPlanId(normalizedPlans[0].id)
    }
  }, [normalizedPlans, selectedPlanId])

  const selectedPlan = normalizedPlans.find((p) => p.id === selectedPlanId) || null
  const classAmount = Number(session.priceAmount || 0)
  const payableAmount = Number(selectedPlan?.price || classAmount || 0)
  const payableLabel = `₹${Number(payableAmount || 0).toLocaleString('en-IN')}`

  const handlePay = async () => {
    setModalError('')
    setLoading(true)
    try {
      if (!me?._id) throw new Error('User not found')

      const amount = Number(payableAmount || 0)
      if (amount > 0) {
        const loaded = await loadRazorpayScript()
        if (!loaded) throw new Error('Razorpay SDK load failed')
        const order = await api('/lms/payments/order', {
          method: 'POST',
          body: JSON.stringify({
            amount,
            enrollment_type: 'live_class',
            target_id: String(session.id),
          }),
        })
        await new Promise((resolve, reject) => {
          const rz = new window.Razorpay({
            key: order.key_id || '',
            amount: order.amount,
            currency: order.currency || 'INR',
            name: 'LMS',
            description: session.title,
            order_id: order.order_id,
            handler: async (response) => {
              try {
                await api('/lms/payments/verify', {
                  method: 'POST',
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature || 'dev_signature',
                  }),
                })
                resolve(true)
              } catch (e) {
                reject(e)
              }
            },
            modal: {
              ondismiss: () => reject(new Error('Payment cancelled')),
            },
          })
          rz.open()
        })
      }

      await api('/lms/enrollments', {
        method: 'POST',
        body: JSON.stringify({
          course_id: session.courseId,
          student_id: me._id,
        }),
      })

      if (session.link) {
        onSuccess(session.id)
        onClose()
        window.open(session.link, '_blank', 'noopener,noreferrer')
        return
      }

      setStep('success')
    } catch (err) {
      setModalError(err?.message || 'Payment or enrollment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5" onClick={onClose}>
      <div className="flex max-h-[92vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[16px] bg-white shadow-2xl" onClick={e => e.stopPropagation()}>

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

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {/* Session Info */}
              <div className="rounded-[10px] bg-[#f8fafc] border border-black/[0.07] p-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: CalendarDays, label: 'Date', val: `${session.date} • ${session.time}` },
                    { icon: Clock3, label: 'Duration', val: session.duration },
                    { icon: Video, label: 'Platform', val: session.platform },
                    { icon: Users, label: 'Students', val: `${session.studentsEnrolled} enrolled` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      {React.createElement(item.icon, { className: 'h-4 w-4 text-[#5b3df6] shrink-0' })}
                      <div>
                        <p className="text-[10px] text-[#94a3b8]">{item.label}</p>
                        <p className="text-[12px] font-semibold text-[#0f172a]">{item.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What you get */}
              <div>
                <p className="text-[12px] font-semibold text-[#0f172a] mb-2">What will You get in this class ?</p>
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

              {/* Subscription Plans */}
              <div>
                <p className="text-[12px] font-semibold text-[#0f172a] mb-2">Choose subscription:</p>
                <div className="space-y-2">
                  {normalizedPlans.length > 0 ? (
                    normalizedPlans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`w-full rounded-[8px] border p-3 text-left transition-colors ${
                          selectedPlanId === plan.id
                            ? 'border-[#5b3df6] bg-[#f7f4ff]'
                            : 'border-black/[0.08] bg-white hover:bg-[#f8fafc]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-[12px] font-semibold text-[#0f172a]">{plan.name}</p>
                            <p className="text-[11px] text-[#64748b]">{plan.period}</p>
                          </div>
                          <p className="text-[14px] font-bold text-[#5b3df6]">₹{Number(plan.price || 0).toLocaleString('en-IN')}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-[8px] border border-dashed border-black/[0.14] bg-[#f8fafc] p-3 text-[12px] text-[#64748b]">
                      No active subscription plan found. Direct course price will be charged.
                    </div>
                  )}
                </div>
              </div>

              {modalError ? (
                <p className="text-[12px] text-red-600">{modalError}</p>
              ) : null}

              {/* Payment Summary */}
              <div>
                <p className="text-[12px] font-semibold text-[#0f172a] mb-2">Payment method:</p>
                <div className="inline-flex items-center gap-2 rounded-[8px] border border-black/[0.08] bg-white px-3 py-2 text-[12px] text-[#64748b]">
                  <CreditCard className="h-4 w-4" /> Razorpay secure checkout
                </div>
              </div>
            </div>

            {/* Price + Pay Button */}
            <div className="border-t border-black/[0.08] bg-white p-4 sm:p-5">
              <div className="flex flex-col gap-3 rounded-[10px] border border-[#5b3df6]/20 bg-[#f7f4ff] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] text-[#64748b]">Total amount</p>
                  <p className="text-[20px] font-bold text-[#5b3df6]">{payableLabel}</p>
                </div>
                <button
                  onClick={handlePay}
                  disabled={loading || (normalizedPlans.length > 0 && !selectedPlan)}
                  className="h-11 rounded-[10px] bg-[#5b3df6] px-6 text-[13px] font-semibold text-white hover:bg-[#4a2ed8] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard className="h-4 w-4" /> Pay {payableLabel} & Enroll</>
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
              ].map((item) => (
                <div key={item.label} className="rounded-[10px] bg-white/10 p-3">
                  {React.createElement(item.icon, { className: 'h-4 w-4 text-white/50' })}
                  <p className="mt-1 text-[16px] font-bold text-white">{item.value}</p>
                  <p className="text-[10px] text-white/50">{item.label}</p>
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
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-[10px] border border-black/[0.06] p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#f7f4ff]">
                      {React.createElement(item.icon, { className: 'h-4 w-4 text-[#5b3df6]' })}
                    </div>
                    <div>
                      <p className="text-[11px] text-[#94a3b8]">{item.label}</p>
                      <p className="text-[13px] font-semibold text-[#0f172a]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {session.link && (
                <div className="flex items-center gap-2 rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-3">
                  <Link2 className="h-4 w-4 text-[#5b3df6] shrink-0" />
                  <span className="text-[12px] text-[#5b3df6] truncate flex-1">{session.link}</span>
                  <button
                    onClick={() => {
                      window.location.href = session.link
                    }}
                    className="ml-auto shrink-0 rounded-[6px] bg-[#5b3df6] px-3 py-1 text-[11px] font-semibold text-white"
                  >
                    Open class
                  </button>
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
function SessionCard({ session, isEnrolled, onJoinClick, onEnrollClick, onRate, ratingValue, ratingSaving, enrollPriceLabel }) {
  const isLive = session.status === 'live'

  return (
    <div className={`group relative overflow-hidden rounded-[14px] border transition-all duration-200 hover:shadow-md ${isLive ? 'border-[#ef4444]/30 bg-[#fff5f5]' : 'border-black/[0.08] bg-white'}`}>
      {isLive && <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#ef4444] to-[#f97316]" />}

      <div className="p-4">
        {session.image ? (
          <img
            src={session.image}
            alt={session.title}
            className="mb-3 h-36 w-full rounded-[10px] border border-black/[0.08] object-cover"
          />
        ) : (
          <div className="mb-3 flex h-36 w-full items-center justify-center rounded-[10px] border border-dashed border-black/[0.12] bg-[#f8fafc] text-[11px] font-medium text-[#94a3b8]">
            No class image
          </div>
        )}

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
            <span>
              {Number(session.rating || 0) > 0
                ? `${session.rating}${session.ratingCount ? ` (${session.ratingCount})` : ''} rating`
                : 'Not rated'}
            </span>
          </div>
        </div>

        {isEnrolled && (
          <div className="mt-3 rounded-[8px] border border-black/[0.08] bg-[#fafcff] px-2.5 py-2">
            <p className="text-[10px] font-medium text-[#64748b]">Your class rating</p>
            <div className="mt-1 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onRate(session, value)}
                  disabled={ratingSaving}
                  className="rounded p-0.5 disabled:opacity-60"
                >
                  <Star className={`h-4 w-4 ${value <= Number(ratingValue || 0) ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#cbd5e1]'}`} />
                </button>
              ))}
            </div>
          </div>
        )}

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
                <Lock className="h-3.5 w-3.5" /> Enroll {enrollPriceLabel || session.price}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function StudentLiveClasses() {
  const [liveSessions, setLiveSessions] = useState([])
  const [me, setMe] = useState(null)
  const [enrolledSessionIds, setEnrolledSessionIds] = useState([])
  const [liveClassRatings, setLiveClassRatings] = useState({})
  const [ratingSavingFor, setRatingSavingFor] = useState('')
  const [subscriptionPlans, setSubscriptionPlans] = useState([])
  const tenantId = localStorage.getItem('lms_tenant_id')

  const handleRateLiveClass = async (session, rating) => {
    setRatingSavingFor(session.id)
    try {
      const saved = await api('/lms/ratings', {
        method: 'POST',
        body: JSON.stringify({
          target_type: 'live_class',
          target_id: session.id,
          rating,
        }),
      })
      setLiveClassRatings((prev) => ({ ...prev, [session.id]: Number(saved?.rating || rating) }))
    } catch {
      // Silent fail keeps page usable.
    } finally {
      setRatingSavingFor('')
    }
  }

  const loadLiveClasses = async () => {
    try {
      const [classesRes, coursesRes, plansRes, ratingsRes] = await Promise.all([
        api('/lms/live-classes?limit=300').catch(() => ({ items: [] })),
        api('/lms/courses?limit=500').catch(() => ({ items: [] })),
        api('/lms/plans?limit=300&active_only=true').catch(() => ({ items: [] })),
        api('/lms/ratings?mine=true&target_type=live_class&limit=500').catch(() => ({ items: [] })),
      ])

      const activePlans = (plansRes.items || []).filter((p) => Boolean(p?.active ?? true)).map((p) => ({
        id: p?._id,
        name: p?.name || 'Plan',
        period: p?.billing_period || 'monthly',
        price: Number(p?.price || 0),
      }))
      setSubscriptionPlans(activePlans)

      const ratingMap = {}
      for (const row of ratingsRes.items || []) {
        if (row?.target_id) ratingMap[row.target_id] = Number(row?.rating || 0)
      }
      setLiveClassRatings(ratingMap)

      const courseMap = new Map((coursesRes.items || []).map((c) => [c._id, c]))
      const currentStudentId = String(me?._id || me?.sub || '').trim()
      const enrolledSet = new Set()

      const rows = classesRes.items || []
      const mapped = rows.map((r, idx) => {
        const course = courseMap.get(r.course_id) || {}
        const startAt = parseServerDateAsUtc(r.start_at)
        const hasValidStart = !!startAt
        const attendeeIds = (r.attendee_ids || []).map((id) => String(id))
        if (currentStudentId && attendeeIds.includes(currentStudentId)) {
          enrolledSet.add(String(r._id))
        }
        const numericPrice = Number(r.amount ?? course.price ?? 0)
        const status = getSessionStatus(r.status, r.start_at, r.duration_minutes)
        const tags = [
          status === 'live' ? 'Live today' : status === 'recent' ? 'Completed' : 'Upcoming',
          course.title ? 'Course Linked' : 'Live Class',
        ]
        return {
          id: r._id,
          courseId: r.course_id,
          image: r.image_url || course.image_url || course.thumbnail_url || course.cover_image || '',
          title: r.title || 'Live Class',
          course: course.title || r.course_id || 'Course',
          instructor: r.instructor_id || 'Instructor',
          instructorAvatar: AVATARS[idx % AVATARS.length],
          instructorRole: 'Instructor',
          date: hasValidStart ? formatDateInIst(r.start_at) : 'Not scheduled',
          time: hasValidStart ? formatTimeInIst(r.start_at) : '-',
          duration: `${r.duration_minutes || 60} mins`,
          platform: (r.meeting_provider || 'Zoom').toString().toUpperCase(),
          status,
          link: r.join_url || '',
          topic: r.title || 'Session Topic',
          attendanceRate: 0,
          studentsEnrolled: attendeeIds.length,
          studentsPresent: 0,
          chatMessages: 0,
          currentSlide: '—',
          tags,
          price: `₹${numericPrice.toLocaleString('en-IN')}`,
          priceAmount: numericPrice,
          rating: Number(r.avg_rating || r.rating || 0) > 0 ? Number(r.avg_rating || r.rating || 0).toFixed(1) : '',
          ratingCount: Number(r.rating_count || 0),
          sortTimestamp: getLiveClassSortTimestamp(r),
        }
      }).sort((a, b) => Number(b.sortTimestamp || 0) - Number(a.sortTimestamp || 0))
      setEnrolledSessionIds([...enrolledSet])
      setLiveSessions(mapped)
    } catch {
      setLiveSessions([])
      setSubscriptionPlans([])
    }
  }

  useEffect(() => {
    let mounted = true
    api('/auth/me')
      .then((data) => {
        if (mounted) setMe(data)
      })
      .catch(() => {
        if (mounted) setMe(null)
      })

    const timer = setTimeout(() => {
      loadLiveClasses()
    }, 0)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (me?._id || me?.sub) {
      loadLiveClasses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me?._id, me?.sub])

  useRealtime(tenantId ? `tenant:${tenantId}` : '', () => loadLiveClasses())

  const [activeFilter, setActiveFilter] = useState('All Sessions')
  const [activeCourseFilter, setActiveCourseFilter] = useState('All Courses')
  const [search, setSearch] = useState('')
  const [enrollModal, setEnrollModal] = useState(null)   // session to enroll
  const [detailModal, setDetailModal] = useState(null)   // session to view detail

  const courseFilters = [...new Set(liveSessions.map((s) => String(s.course || '').trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
  const allCourseFilters = ['All Courses', ...courseFilters]

  const handleEnrollSuccess = (sessionId) => {
    const normalized = String(sessionId || '')
    if (!normalized) return
    setEnrolledSessionIds((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]))
  }

  const filtered = liveSessions.filter(s => {
    const selectedCourse = activeCourseFilter.trim().toLowerCase()
    const matchFilter =
      (activeFilter === 'All Sessions' && (s.status === 'live' || s.status === 'upcoming')) ||
      (activeFilter === 'Live Now' && s.status === 'live') ||
      (activeFilter === 'Upcoming' && s.status === 'upcoming') ||
      (activeFilter === 'Complete' && s.status === 'recent') ||
      (activeFilter === 'Enrolled' && enrolledSessionIds.includes(s.id))
    const matchCourse = selectedCourse === 'all courses' || s.course.toLowerCase() === selectedCourse
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.instructor.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchCourse && matchSearch
  })

  const liveCount = liveSessions.filter(s => s.status === 'live').length
  const recentCount = liveSessions.filter(s => s.status === 'recent').length
  const enrolledCount = enrolledSessionIds.length

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
              <p className="mt-2 text-[13px] text-[#94a3b8]">Join enrolled courses directly. For new courses, enroll and make payment — then join the class.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  `${liveCount} live now`,
                  `${enrolledCount} courses enrolled`,
                  `${liveSessions.length} total sessions`,
                ].map(t => (
                  <div key={t} className="inline-flex h-8 items-center rounded-[10px] border border-black/[0.08] bg-white px-3 text-[11px] font-medium text-[#0f172a]">{t}</div>
                ))}
              </div>
            </div>

            {/* Live now mini card */}
            {liveSessions.filter(s => s.status === 'live').map(s => (
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
                {enrolledSessionIds.includes(s.id) ? (
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
            <div className="relative sm:w-[220px]">
              <select
                value={activeCourseFilter}
                onChange={(e) => setActiveCourseFilter(e.target.value)}
                className="h-10 w-full appearance-none rounded-[8px] border border-black/[0.08] bg-white px-3 pr-8 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30"
              >
                {allCourseFilters.map((courseName) => (
                  <option key={courseName} value={courseName}>{courseName}</option>
                ))}
              </select>
              <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-[#94a3b8]" />
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
                  {f === 'Complete' && (
                    <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#16a34a] text-[9px] font-bold text-white">{recentCount}</span>
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
              {activeFilter === 'Enrolled'
                ? 'My Enrolled Sessions'
                : activeFilter === 'Complete'
                  ? 'Recently Completed Sessions'
                  : activeFilter === 'Live Now'
                    ? 'Live Sessions'
                    : activeFilter === 'All Sessions'
                      ? 'All Sessions'
                      : 'Upcoming Sessions'}
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
                  isEnrolled={enrolledSessionIds.includes(session.id)}
                  onJoinClick={(s) => setDetailModal(s)}
                  onEnrollClick={(s) => setEnrollModal(s)}
                  onRate={handleRateLiveClass}
                  ratingValue={liveClassRatings[session.id]}
                  ratingSaving={ratingSavingFor === session.id}
                  enrollPriceLabel={getMinSubscriptionLabel(subscriptionPlans, session.priceAmount)}
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
          plans={subscriptionPlans}
          me={me}
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
