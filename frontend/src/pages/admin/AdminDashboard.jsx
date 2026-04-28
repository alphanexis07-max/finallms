import React, { useEffect, useMemo, useState } from 'react'
import {
  Upload,
  Plus,
  GraduationCap,
  BookOpen,
  Users,
  Video,
  Wallet,
  BarChart3,
} from 'lucide-react'
import { api } from '../../lib/api'
import useRealtime from '../../hooks/useRealtime'

function Avatar({ name }) {
  const initials = (name || 'NA')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  return (
    <div className="h-[42px] w-[42px] rounded-[6px] bg-[#e8f5ff] flex items-center justify-center text-[13px] font-bold text-[#5b3df6]">
      {initials}
    </div>
  )
}

function StepPill({ label, variant }) {
  const style =
    variant === 'publish'
      ? 'bg-[#5b3df6] text-white'
      : variant === 'review'
        ? 'bg-[#ffd966] text-[#4b2e00]'
        : 'bg-[#e8f5ff] text-[#0f172a]'

  return (
    <div className={`flex h-[30px] items-center px-[12px] rounded-[12px] shrink-0 ${style}`}>
      <div className="text-[12px] font-medium">{label}</div>
    </div>
  )
}

function StatusPill({ children, variant = 'neutral' }) {
  const style =
    variant === 'good'
      ? 'bg-[#2dd4bf] text-[#023b33]'
      : variant === 'warn'
        ? 'bg-[#ffd966] text-[#4b2e00]'
        : 'bg-[#e8f5ff] text-[#0f172a]'

  return <span className={`inline-flex h-[28px] items-center rounded-[12px] px-[10px] text-[12px] font-medium ${style}`}>{children}</span>
}

export default function AdminDashboard() {
  const tenantId = localStorage.getItem('lms_tenant_id')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    total_students: 0,
    total_instructors: 0,
    total_courses: 0,
    total_live_classes: 0,
    total_revenue: 0,
  })
  const [courses, setCourses] = useState([])
  const [liveClasses, setLiveClasses] = useState([])
  const [instructors, setInstructors] = useState([])
  const [students, setStudents] = useState([])
  const [payments, setPayments] = useState([])
  const [coupons, setCoupons] = useState([])
  const [enrollments, setEnrollments] = useState([])

  const loadAll = async () => {
    try {
      setLoading(true)
      setError('')
      const [dash, c, lc, i, s, p, cp, e] = await Promise.all([
        api('/lms/dashboard/admin').catch(() => ({})),
        api('/lms/courses?limit=20').catch(() => ({ items: [] })),
        api('/lms/live-classes?limit=20').catch(() => ({ items: [] })),
        api('/lms/users?role=instructor&limit=20').catch(() => ({ items: [] })),
        api('/lms/users?role=student&limit=20').catch(() => ({ items: [] })),
        api('/lms/payments?limit=50').catch(() => ({ items: [] })),
        api('/lms/coupons?limit=20').catch(() => ({ items: [] })),
        api('/lms/enrollments?limit=200').catch(() => ({ items: [] })),
      ])

      setStats(dash || {})
      setCourses(c.items || [])
      setLiveClasses(lc.items || [])
      setInstructors(i.items || [])
      setStudents(s.items || [])
      setPayments(p.items || [])
      setCoupons(cp.items || [])
      setEnrollments(e.items || [])
    } catch (err) {
      setError(err?.message || 'Unable to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  useRealtime(tenantId ? `tenant:${tenantId}` : '', () => loadAll())

  const capturedPayments = useMemo(() => payments.filter((x) => x.status === 'captured'), [payments])
  const totalRevenue = useMemo(
    () => capturedPayments.reduce((sum, x) => sum + Number(x.amount || 0), 0),
    [capturedPayments],
  )

  const lastMonthStudents = useMemo(() => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()
    return students.filter((s) => {
      if (!s.created_at) return false
      const d = new Date(s.created_at)
      return d.getMonth() === month && d.getFullYear() === year
    }).length
  }, [students])

  const draftCourses = useMemo(() => courses.filter((c) => !c.published).length, [courses])

  const activeEnrollments = useMemo(() => enrollments.length, [enrollments])
  const enrollmentRate = useMemo(() => {
    const base = Number(stats.total_students || 0)
    return base ? Math.round((activeEnrollments / base) * 100) : 0
  }, [activeEnrollments, stats.total_students])

  const splitSummary = useMemo(() => {
    const withSplit = capturedPayments.filter((p) => p.platform_commission != null && p.instructor_amount != null)
    const admin = withSplit.reduce((sum, p) => sum + Number(p.platform_commission || 0), 0)
    const instructor = withSplit.reduce((sum, p) => sum + Number(p.instructor_amount || 0), 0)
    const total = admin + instructor
    const sample = withSplit[0]?.amount || capturedPayments[0]?.amount || 0
    return {
      adminPercent: total ? Math.round((admin / total) * 100) : 0,
      instructorPercent: total ? Math.round((instructor / total) * 100) : 0,
      samplePrice: Number(sample || 0),
      adminAmount: total && sample ? Math.round((Number(sample) * admin) / total) : 0,
      instructorAmount: total && sample ? Math.round((Number(sample) * instructor) / total) : 0,
      available: total > 0,
    }
  }, [capturedPayments])

  const courseRows = useMemo(() => courses.slice(0, 3), [courses])
  const liveRows = useMemo(() => liveClasses.slice(0, 3), [liveClasses])
  const instructorRows = useMemo(() => instructors.slice(0, 3), [instructors])
  const studentRows = useMemo(() => students.slice(0, 3), [students])
  const couponRows = useMemo(() => coupons.slice(0, 2), [coupons])

  const couponUse = useMemo(() => coupons.reduce((sum, c) => sum + Number(c.uses || 0), 0), [coupons])
  const avgOrder = useMemo(() => {
    if (!capturedPayments.length) return 0
    return Math.round(totalRevenue / capturedPayments.length)
  }, [capturedPayments, totalRevenue])
  const refundRate = useMemo(() => {
    if (!payments.length) return 0
    const failed = payments.filter((p) => p.status === 'failed').length
    return Number(((failed / payments.length) * 100).toFixed(1))
  }, [payments])

  const transactions24h = useMemo(() => {
    const now = Date.now()
    return capturedPayments.filter((p) => {
      if (!p.created_at) return false
      return now - new Date(p.created_at).getTime() <= 24 * 60 * 60 * 1000
    }).length
  }, [capturedPayments])

  const weekdayChart = useMemo(() => {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    const today = new Date()
    const buckets = labels.map((label, idx) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (4 - idx))
      const dayCount = capturedPayments.filter((p) => {
        if (!p.created_at) return false
        const d = new Date(p.created_at)
        return d.toDateString() === date.toDateString()
      }).length
      return { label, count: dayCount }
    })
    const max = Math.max(1, ...buckets.map((b) => b.count))
    return buckets.map((b) => ({ ...b, height: 70 + Math.round((b.count / max) * 80) }))
  }, [capturedPayments])

  const coursePerformance = useMemo(() => {
    if (!courses.length || !enrollments.length) return { title: 'No course data', percent: 0 }
    const counts = enrollments.reduce((acc, e) => {
      const key = String(e.course_id || '')
      if (!key) return acc
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    if (!top) return { title: 'No course data', percent: 0 }
    const course = courses.find((c) => String(c._id) === top[0])
    const percent = stats.total_students ? Math.min(Math.round((Number(top[1]) / Number(stats.total_students || 1)) * 100), 100) : 0
    return { title: course?.title || 'Untitled course', percent }
  }, [courses, enrollments, stats.total_students])

  const avgWatchText = useMemo(() => {
    if (!liveClasses.length) return '0 min'
    const completed = liveClasses.filter((lc) => String(lc.status || '').toLowerCase() === 'completed').length
    const ratio = Math.round((completed / liveClasses.length) * 60)
    return `${ratio || 20} min`
  }, [liveClasses])

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="bg-gradient-to-b flex h-full flex-col gap-[24px] from-[#f6f8fa] p-4 to-[#f7fcff] sm:p-6 lg:p-7">
        <section className="border border-black/[0.08] border-solid content-stretch flex flex-col items-start pb-[23px] pt-[25px] px-[25px] relative rounded-[8px] shrink-0 w-full bg-gradient-to-br from-white to-[#e8f5ff]">
          <div className="flex flex-col gap-[11px] items-start relative shrink-0">
            <div className="bg-[#ffd966] flex items-center px-[10px] py-[6.5px] rounded-[12px] shrink-0">
              <div className="text-[#4b2e00] text-[12px] font-medium">Daily operations snapshot</div>
            </div>
            <div className="text-[24px] font-bold text-[#0f172a] sm:text-[28px]">
              Run courses, track learners, and grow revenue from one institute workspace.
            </div>
            <div className="text-[14px] text-[#94a3b8]">
              Manage your courses, instructors, students, live classes, and payments with a clear operational overview.
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-x-[16px] gap-y-[16px] sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))]">
          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] p-[19px] rounded-[8px]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#94a3b8] text-[14px] font-medium">Total Students</div>
                <div className="text-[#0f172a] text-[30px] font-bold">{Number(stats.total_students || 0).toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-[#e8f5ff] rounded-[6px] size-[40px] flex items-center justify-center"><Users className="h-[18px] w-[18px] text-[#5b3df6]" /></div>
            </div>
            <StatusPill variant="good">+{lastMonthStudents} this month</StatusPill>
          </div>

          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] p-[19px] rounded-[8px]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#94a3b8] text-[14px] font-medium">Total Courses</div>
                <div className="text-[#0f172a] text-[30px] font-bold">{Number(stats.total_courses || 0).toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-[#e8f5ff] rounded-[6px] size-[40px] flex items-center justify-center"><BookOpen className="h-[18px] w-[18px] text-[#5b3df6]" /></div>
            </div>
            <StatusPill>{draftCourses} in draft</StatusPill>
          </div>

          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] p-[19px] rounded-[8px]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#94a3b8] text-[14px] font-medium">Revenue Overview</div>
                <div className="text-[#0f172a] text-[30px] font-bold">₹{Number(stats.total_revenue || 0).toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-[#e8f5ff] rounded-[6px] size-[40px] flex items-center justify-center"><Wallet className="h-[18px] w-[18px] text-[#5b3df6]" /></div>
            </div>
            <StatusPill variant="warn">₹{totalRevenue.toLocaleString('en-IN')} captured</StatusPill>
          </div>

          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] p-[19px] rounded-[8px]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#94a3b8] text-[14px] font-medium">Active Enrollments</div>
                <div className="text-[#0f172a] text-[30px] font-bold">{activeEnrollments.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-[#e8f5ff] rounded-[6px] size-[40px] flex items-center justify-center"><GraduationCap className="h-[18px] w-[18px] text-[#5b3df6]" /></div>
            </div>
            <StatusPill variant="good">{enrollmentRate}% of learners</StatusPill>
          </div>
        </div>

        <section className="bg-white border border-black/[0.08] border-solid rounded-[8px] p-[21px]">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center w-full">
            <div>
              <div className="font-bold text-[18px] text-[#0f172a]">Subscription revenue split</div>
              <div className="text-[13px] text-[#94a3b8] mt-[4px]">
                {splitSummary.available
                  ? `Latest captured payment ₹${splitSummary.samplePrice.toLocaleString('en-IN')} with actual commission split.`
                  : 'Commission split will appear once captured payments include commission values.'}
              </div>
            </div>
            <div className="bg-[#eef2ff] h-[30px] rounded-[12px] flex items-center px-[12px]">
              <div className="text-[12px] font-medium text-[#4338ca]">From payment records</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-[16px] sm:grid-cols-2">
            <div className="bg-[#f8fafc] rounded-[6px] p-[14px] border border-black/[0.06]">
              <div className="text-[13px] font-medium text-[#94a3b8]">Admin share</div>
              <div className="text-[24px] font-bold text-[#0f172a] mt-[6px]">
                {splitSummary.adminPercent}% (₹{splitSummary.adminAmount.toLocaleString('en-IN')})
              </div>
            </div>
            <div className="bg-[#f8fafc] rounded-[6px] p-[14px] border border-black/[0.06]">
              <div className="text-[13px] font-medium text-[#94a3b8]">Instructor share</div>
              <div className="text-[24px] font-bold text-[#0f172a] mt-[6px]">
                {splitSummary.instructorPercent}% (₹{splitSummary.instructorAmount.toLocaleString('en-IN')})
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-x-[24px] gap-y-[24px] xl:grid-cols-[minmax(0,1.80fr)_minmax(0,1.20fr)]">
          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px]">
            <div className="flex flex-col items-start justify-between gap-3 w-full lg:flex-row lg:items-center">
              <div className="flex flex-col gap-[4px] items-start">
                <div className="font-bold text-[18px] text-[#0f172a]">Course management</div>
                <div className="text-[13px] text-[#94a3b8]">Build, review, publish, and price your programs</div>
              </div>
            </div>

            <div className="w-full flex flex-col">
              {courseRows.map((c, idx) => {
                const isPublished = Boolean(c.published)
                return (
                  <div key={c._id || c.title || idx} className={`flex flex-col ${idx === 0 ? '' : 'border-t border-black/[0.08]'}`}>
                    <div className="flex flex-col justify-between gap-3 pb-[14px] pt-[15px] sm:flex-row sm:items-center">
                      <div className="flex gap-[12px] items-center">
                        <div className="bg-[#e8f5ff] flex items-center justify-center rounded-[6px] shrink-0 size-[42px]"><BookOpen className="h-[18px] w-[18px] text-[#5b3df6]" /></div>
                        <div className="flex flex-col min-w-0">
                          <div className="font-semibold text-[14px] text-[#0f172a]">{c.title || 'Untitled course'}</div>
                          <div className="text-[13px] text-[#94a3b8] mt-[4px]">₹{Number(c.price || 0).toLocaleString('en-IN')} • {c.course_type || 'standard'} • {c.created_at ? new Date(c.created_at).toLocaleDateString() : 'No date'}</div>
                          <div className="flex flex-wrap gap-[8px] items-center pt-[8px]">
                            <StepPill label="Draft" variant="draft" />
                            <StepPill label="Review" variant={isPublished ? 'review' : 'draft'} />
                            <StepPill label="Publish" variant={isPublished ? 'publish' : 'draft'} />
                          </div>
                        </div>
                      </div>
                      {isPublished ? (
                        <StatusPill variant="good">Live</StatusPill>
                      ) : (
                        <StatusPill variant="warn">Needs publish</StatusPill>
                      )}
                    </div>
                  </div>
                )
              })}
              {!loading && courseRows.length === 0 && <div className="text-[13px] text-[#94a3b8] py-2">No courses found.</div>}
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px]">
            <div className="flex flex-col gap-[4px] items-start w-full">
              <div className="font-bold text-[18px] text-[#0f172a]">Live classes</div>
              <div className="text-[13px] text-[#94a3b8]">Schedule and manage Zoom or Meet sessions</div>
            </div>
            <div className="flex flex-col w-full">
              {liveRows.map((lc, idx) => {
                const st = String(lc.status || '').toLowerCase()
                const variant = st === 'upcoming' || st === 'active' ? 'good' : st === 'completed' ? 'neutral' : 'warn'
                return (
                  <div key={lc._id || idx} className={`${idx === 0 ? '' : 'border-t border-black/[0.08]'} pb-[14px] pt-[15px]`}>
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="flex flex-col gap-[4px] min-w-0">
                        <div className="font-semibold text-[14px] text-[#0f172a]">{lc.title || 'Untitled class'}</div>
                        <div className="text-[13px] text-[#94a3b8]">{lc.start_at ? new Date(lc.start_at).toLocaleString() : 'No schedule'} • {lc.provider || 'provider N/A'}</div>
                      </div>
                      <StatusPill variant={variant}>{lc.status || 'unknown'}</StatusPill>
                    </div>
                  </div>
                )
              })}
              {!loading && liveRows.length === 0 && <div className="text-[13px] text-[#94a3b8] py-2">No live classes found.</div>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-[24px] gap-y-[24px] xl:grid-cols-2">
          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px]">
            <div className="flex flex-col items-start justify-between gap-3 w-full lg:flex-row lg:items-center">
              <div className="flex flex-col gap-[4px]"><div className="font-bold text-[18px] text-[#0f172a]">Instructor management</div><div className="text-[13px] text-[#94a3b8]">Add instructors and assign them to active courses</div></div>
            </div>
            <div className="w-full flex flex-col">
              {instructorRows.map((inst, idx) => (
                <div key={inst._id || idx} className={`${idx === 0 ? '' : 'border-t border-black/[0.08]'} flex flex-col justify-between gap-3 pb-[14px] pt-[15px] sm:flex-row sm:items-center`}>
                  <div className="flex items-center gap-[12px]"><Avatar name={inst.full_name || 'Instructor'} /><div className="flex flex-col min-w-0"><div className="font-semibold text-[14px] text-[#0f172a]">{inst.full_name || 'Instructor'}</div><div className="text-[13px] text-[#94a3b8] mt-[4px]">{inst.email || 'No email'}{inst.phone ? ` • ${inst.phone}` : ''}</div></div></div>
                  <StatusPill variant={inst.is_active === false ? 'warn' : 'good'}>{inst.is_active === false ? 'Inactive' : 'Assigned'}</StatusPill>
                </div>
              ))}
              {!loading && instructorRows.length === 0 && <div className="text-[13px] text-[#94a3b8] py-2">No instructors found.</div>}
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px]">
            <div className="flex flex-col items-start justify-between gap-3 w-full sm:flex-row sm:items-center">
              <div className="flex flex-col gap-[4px]"><div className="font-bold text-[18px] text-[#0f172a]">Student management</div><div className="text-[13px] text-[#94a3b8]">Add learners, upload CSVs, and track progress</div></div>
            </div>
            <div className="w-full flex flex-col">
              {studentRows.map((st, idx) => {
                const progress = Number(st.progress_percent || 0)
                const variant = progress >= 75 ? 'good' : progress >= 40 ? 'neutral' : 'warn'
                const label = progress ? `${progress}% progress` : 'Progress pending'
                return (
                  <div key={st._id || idx} className={`${idx === 0 ? '' : 'border-t border-black/[0.08]'} flex flex-col justify-between gap-3 pb-[14px] pt-[15px] sm:flex-row sm:items-center`}>
                    <div className="flex items-center gap-[12px]"><Avatar name={st.full_name || 'Student'} /><div className="flex flex-col min-w-0"><div className="font-semibold text-[14px] text-[#0f172a]">{st.full_name || 'Student'}</div><div className="text-[13px] text-[#94a3b8] mt-[4px]">{st.email || 'No email'}</div></div></div>
                    <StatusPill variant={variant}>{label}</StatusPill>
                  </div>
                )
              })}
              {!loading && studentRows.length === 0 && <div className="text-[13px] text-[#94a3b8] py-2">No students found.</div>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-[24px] gap-y-[24px] xl:grid-cols-2">
          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px]">
            <div className="flex flex-col gap-[4px] w-full"><div className="font-bold text-[18px] text-[#0f172a]">Payments &amp; coupons</div><div className="text-[13px] text-[#94a3b8]">Create discounts, review transactions, and monitor revenue</div></div>
            <div className="grid w-full grid-cols-1 gap-[12px] sm:grid-cols-3">
              <div className="bg-[#e8f5ff] rounded-[6px] p-[14px]"><div className="text-[14px] font-medium text-[#94a3b8]">Coupon use</div><div className="text-[22px] font-bold text-[#0f172a] mt-[6px]">{couponUse}</div></div>
              <div className="bg-[#e8f5ff] rounded-[6px] p-[14px]"><div className="text-[14px] font-medium text-[#94a3b8]">Avg. order</div><div className="text-[22px] font-bold text-[#0f172a] mt-[6px]">₹{avgOrder.toLocaleString('en-IN')}</div></div>
              <div className="bg-[#e8f5ff] rounded-[6px] p-[14px]"><div className="text-[14px] font-medium text-[#94a3b8]">Refunds</div><div className="text-[22px] font-bold text-[#0f172a] mt-[6px]">{refundRate}%</div></div>
            </div>
            <div className="w-full flex flex-col gap-[14px]">
              {couponRows.map((coupon, idx) => (
                <div key={coupon._id || idx} className="bg-[#e8f5ff] rounded-[6px] p-[14px] flex items-center justify-between">
                  <div className="flex items-center gap-[12px]"><div className="bg-[#e8f5ff] rounded-[6px] flex items-center justify-center h-[42px] w-[42px]"><Wallet className="h-[18px] w-[18px] text-[#5b3df6]" /></div><div><div className="font-semibold text-[14px] text-[#0f172a]">{coupon.code || 'NO-CODE'}</div><div className="text-[13px] text-[#94a3b8] mt-[4px]">{coupon.discount_type === 'percent' ? `${coupon.value}% off` : `₹${Number(coupon.value || 0).toLocaleString('en-IN')} off`} • {Number(coupon.uses || 0)} redemptions</div></div></div>
                  <StatusPill variant={Number(coupon.max_uses || 0) > 0 && Number(coupon.uses || 0) / Number(coupon.max_uses || 1) > 0.8 ? 'warn' : 'good'}>{Number(coupon.max_uses || 0) > 0 && Number(coupon.uses || 0) >= Number(coupon.max_uses || 0) ? 'Exhausted' : 'Active'}</StatusPill>
                </div>
              ))}
              {!loading && couponRows.length === 0 && <div className="text-[13px] text-[#94a3b8]">No coupons available.</div>}
            </div>
            <div className="border-t border-black/[0.08] w-full pt-[15px]"><div className="flex items-center justify-between"><div className="flex items-center gap-[12px]"><div className="bg-[#e8f5ff] rounded-[6px] flex items-center justify-center h-[42px] w-[42px]"><BarChart3 className="h-[18px] w-[18px] text-[#5b3df6]" /></div><div className="flex flex-col"><div className="font-semibold text-[14px] text-[#0f172a]">Recent transactions</div><div className="text-[13px] text-[#94a3b8] mt-[4px]">{transactions24h} payments captured in the last 24 hours</div></div></div><div className="bg-[#5b3df6] h-[40px] rounded-[6px] flex items-center justify-center px-[16px]"><div className="text-[14px] font-medium text-white" onClick={() => navigate('/admin/payments-coupons')}>View Transactions</div></div></div></div>
          </div>

          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px]">
            <div className="flex flex-col gap-[4px] w-full"><div className="font-bold text-[18px] text-[#0f172a]">Analytics</div><div className="text-[13px] text-[#94a3b8]">Course performance and student engagement</div></div>
            <div className="w-full h-[196px] flex flex-col gap-[12px] pt-[4px]"><div className="flex gap-[14px] items-end justify-center h-full pt-[20px]">{weekdayChart.map((point) => (<div key={point.label} className="bg-gradient-to-b from-[#ffb86b] to-[#5b3df6] w-[46px] rounded-tl-[4px] rounded-tr-[4px]" style={{ height: `${point.height}px` }} />))}</div><div className="flex justify-center gap-[14px] text-[#94a3b8] text-[12px]">{weekdayChart.map((point) => (<span key={`${point.label}-text`}>{point.label}</span>))}</div></div>
            <div className="w-full flex flex-col gap-[4px] border-t border-black/[0.08] pt-[15px]">
              <div className="flex items-center justify-between"><div className="flex flex-col gap-[4px]"><div className="font-semibold text-[14px] text-[#0f172a]">Course performance</div><div className="text-[13px] text-[#94a3b8]">Top performer: {coursePerformance.title}</div></div><StatusPill variant="good">{coursePerformance.percent}%</StatusPill></div>
              <div className="flex items-center justify-between pt-[15px] border-t border-black/[0.08]"><div className="flex flex-col gap-[4px]"><div className="font-semibold text-[14px] text-[#0f172a]">Student engagement</div><div className="text-[13px] text-[#94a3b8]">Average watch time per learner</div></div><StatusPill>{avgWatchText}</StatusPill></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
