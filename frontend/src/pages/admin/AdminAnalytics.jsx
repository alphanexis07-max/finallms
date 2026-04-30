import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../../lib/api'
import useRealtime from '../../hooks/useRealtime'

function Stat({ label, value, chip, chipCls }) {
  return (
    <div className="rounded-[10px] border border-black/[0.07] bg-white p-[18px] shadow-sm transition-shadow hover:shadow-md">
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#94a3b8]">{label}</p>
      <p className="mt-2 text-[32px] font-bold leading-none text-[#111827]">{value}</p>
      {chip ? (
        <span className={`mt-3 inline-flex rounded-[20px] px-[10px] py-[4px] text-[10px] font-semibold ${chipCls}`}>
          {chip}
        </span>
      ) : null}
    </div>
  )
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_INDEX_TO_LABEL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function AdminAnalytics() {
  const tenantId = localStorage.getItem('lms_tenant_id')
  const [dashboard, setDashboard] = useState({})
  const [courses, setCourses] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [trendFilter, setTrendFilter] = useState('weekly') // 'weekly' | 'monthly' | 'by-course'

  const load = async () => {
    try {
      setLoading(true)
      setError('')
      const [d, c, p] = await Promise.all([
        api('/lms/dashboard/admin').catch(() => ({})),
        api('/lms/courses?limit=300').catch(() => ({ items: [] })),
        api('/lms/payments?limit=500').catch(() => ({ items: [] })),
      ])
      setDashboard(d || {})
      setCourses(c.items || [])
      setPayments(p.items || [])
    } catch (err) {
      setDashboard({})
      setCourses([])
      setPayments([])
      setError(err?.message || 'Unable to load analytics.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])
  useRealtime(tenantId ? `tenant:${tenantId}` : '', () => load())

  const capturedPayments = useMemo(() => payments.filter((p) => p.status === 'captured'), [payments])
  const failedPayments = useMemo(() => payments.filter((p) => p.status === 'failed'), [payments])
  const totalCaptured = useMemo(
    () => capturedPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [capturedPayments],
  )
  const successRate = useMemo(
    () => (payments.length ? Math.round((capturedPayments.length / payments.length) * 100) : 0),
    [payments, capturedPayments],
  )
  const avgOrderValue = useMemo(
    () => (capturedPayments.length ? Math.round(totalCaptured / capturedPayments.length) : 0),
    [capturedPayments, totalCaptured],
  )

  // --- Weekly chart data ---
  const weeklyData = useMemo(() => {
    const today = new Date()
    const buckets = {}
    DAY_LABELS.forEach((l) => { buckets[l] = 0 })
    capturedPayments.forEach((p) => {
      const d = p.created_at ? new Date(p.created_at) : null
      if (!d || Number.isNaN(d.getTime())) return
      const diffDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays < 0 || diffDays > 6) return
      const lbl = DAY_INDEX_TO_LABEL[d.getDay()]
      if (lbl in buckets) buckets[lbl] += Number(p.amount || 0)
    })
    const values = DAY_LABELS.map((l) => buckets[l])
    const maxValue = Math.max(...values, 1)
    return DAY_LABELS.map((label, idx) => ({
      label,
      value: values[idx],
      height: Math.max(12, Math.round((values[idx] / maxValue) * 100)),
    }))
  }, [capturedPayments])

  // --- Monthly chart data ---
  const monthlyData = useMemo(() => {
    const buckets = {}
    MONTH_LABELS.forEach((l) => { buckets[l] = 0 })
    capturedPayments.forEach((p) => {
      const d = p.created_at ? new Date(p.created_at) : null
      if (!d || Number.isNaN(d.getTime())) return
      const lbl = MONTH_LABELS[d.getMonth()]
      buckets[lbl] += Number(p.amount || 0)
    })
    const values = MONTH_LABELS.map((l) => buckets[l])
    const maxValue = Math.max(...values, 1)
    return MONTH_LABELS.map((label, idx) => ({
      label,
      value: values[idx],
      height: Math.max(12, Math.round((values[idx] / maxValue) * 100)),
    }))
  }, [capturedPayments])

  // --- By-course chart data ---
  const topCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
      .slice(0, 6)
      .map((c) => ({
        name: c.title,
        shortName: c.title?.length > 10 ? c.title.slice(0, 10) + '…' : c.title,
        type: c.course_type || 'n/a',
        price: Number(c.price || 0),
        youtube: Boolean(c.youtube_url),
      }))
  }, [courses])

  const byCourseData = useMemo(() => {
    const maxPrice = Math.max(...topCourses.map((c) => c.price), 1)
    return topCourses.map((c) => ({
      label: c.shortName,
      value: c.price,
      height: Math.max(12, Math.round((c.price / maxPrice) * 100)),
    }))
  }, [topCourses])

  // Active chart data and peak
  const activeChartData = trendFilter === 'weekly' ? weeklyData : trendFilter === 'monthly' ? monthlyData : byCourseData
  const peakBar = activeChartData.reduce((a, b) => (a.value > b.value ? a : b), { label: '-', value: 0 })

  const learnerSegments = useMemo(() => {
    const total = payments.length || 1
    const paid = Math.round((capturedPayments.length / total) * 100)
    const failed = Math.round((failedPayments.length / total) * 100)
    const pending = Math.max(0, 100 - paid - failed)
    return { paid, pending, failed }
  }, [payments, capturedPayments, failedPayments])

  const insights = useMemo(() => [
    ['Course inventory', `You currently have ${courses.length} courses and ${Number(dashboard.total_live_classes || 0)} live classes listed.`],
    ['Revenue conversion', `Payment success rate is ${successRate}%, with captured revenue at Rs. ${totalCaptured.toLocaleString('en-IN')}.`],
    ['Order value trend', `Average captured order value is Rs. ${avgOrderValue.toLocaleString('en-IN')}.`],
  ], [courses, dashboard, successRate, totalCaptured, avgOrderValue])

  const FILTER_BUTTONS = [
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'by-course', label: 'By course' },
  ]

  return (
    <div className="min-h-full bg-[#f6f8fa]">
      <div className="space-y-4 p-4 sm:p-5">

        {error ? (
          <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-[12px] text-red-700">{error}</div>
        ) : null}

        {/* Hero banner */}
        <section className="grid grid-cols-1 gap-3 rounded-[12px] border border-black/[0.07] bg-gradient-to-br from-[#eaf2fb] to-[#e8eaf6] p-5 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <span className="inline-flex rounded-[20px] bg-[#ffd966] px-[12px] py-[5px] text-[11px] font-semibold text-[#4b2e00]">
              Analytics overview
            </span>
            <h2 className="mt-3 max-w-[760px] text-[26px] font-bold leading-tight text-[#0f172a]">
              Track course performance, learner engagement, and revenue momentum from one analytics workspace.
            </h2>
            <p className="mt-2 max-w-[760px] text-[13px] text-[#64748b]">
              Review weekly trends, spot drop-offs early, and compare top-performing programs without leaving the dashboard.
            </p>
          </div>
          <div className="space-y-2">
            <div className="rounded-[10px] border border-black/[0.07] bg-white p-4 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#94a3b8]">Total payment records</p>
              <p className="text-[40px] font-bold leading-none text-[#111827]">{loading ? '—' : payments.length}</p>
            </div>
            <div className="rounded-[10px] border border-black/[0.07] bg-white p-4 shadow-sm">
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#94a3b8]">Warnings</p>
              <p className="text-[20px] font-bold text-[#ef4444]">{failedPayments.length} failed payments</p>
            </div>
          </div>
        </section>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Students" value={Number(dashboard.total_students || 0).toLocaleString('en-IN')} chip="From dashboard" chipCls="bg-[#ccfbf1] text-[#0b7d66]" />
          <Stat label="Instructors" value={Number(dashboard.total_instructors || 0).toLocaleString('en-IN')} chip="From dashboard" chipCls="bg-[#ccfbf1] text-[#0b7d66]" />
          <Stat label="Courses" value={Number(dashboard.total_courses || 0).toLocaleString('en-IN')} chip={`${courses.length} listed`} chipCls="bg-[#f0f4f8] text-[#64748b]" />
          <Stat
            label="Revenue from enrollments"
            value={`Rs. ${Number(totalCaptured || dashboard.total_revenue || 0).toLocaleString('en-IN')}`}
            chip={`${successRate}% success`}
            chipCls="bg-[#fef9c3] text-[#7a5a00]"
          />
        </div>

        {/* Performance trend + Learner segments + Scorecards */}
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.6fr_1fr]">

          {/* Performance trend */}
          <section className="rounded-[12px] border border-black/[0.07] h-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-[20px] font-bold text-[#111827]">Performance trend</h3>
                <p className="text-[12px] text-[#94a3b8]">
                  {trendFilter === 'weekly' && 'Enrollment and engagement trend across the last 7 days.'}
                  {trendFilter === 'monthly' && 'Monthly captured revenue distribution across the year.'}
                  {trendFilter === 'by-course' && 'Revenue contribution by top courses.'}
                </p>
              </div>
              {/* ✅ Working filter buttons */}
              <div className="flex flex-wrap gap-1.5">
                {FILTER_BUTTONS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setTrendFilter(key)}
                    className={`rounded-[8px] border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                      trendFilter === key
                        ? 'border-[#5b3df6] bg-[#5b3df6] text-white'
                        : 'border-black/[0.08] bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex h-[180px] items-end justify-between rounded-[10px] bg-[#f8fafc] px-3 pb-4 pt-3">
              {activeChartData.map((bar) => (
                <div key={bar.label} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                  <div
                    className="w-full max-w-[36px] rounded-t-[5px] bg-gradient-to-b from-[#f7b267] to-[#5b3df6] transition-all duration-500"
                    style={{ height: `${bar.height}px` }}
                  />
                  <span className="text-[8px] text-[#94a3b8] sm:text-[9px]">{bar.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-[8px] bg-[#f8fafc] p-3">
                <p className="text-[10px] text-[#94a3b8]">
                  {trendFilter === 'by-course' ? 'Top course' : 'Peak day'}
                </p>
                <p className="text-[16px] font-bold text-[#111827]">{peakBar.label}</p>
              </div>
              <div className="rounded-[8px] bg-[#f8fafc] p-3">
                <p className="text-[10px] text-[#94a3b8]">Success rate</p>
                <p className="text-[16px] font-bold text-[#111827]">{successRate}%</p>
              </div>
              <div className="rounded-[8px] bg-[#f8fafc] p-3">
                <p className="text-[10px] text-[#94a3b8]">Avg order value</p>
                <p className="text-[16px] font-bold text-[#111827]">Rs. {avgOrderValue.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </section>

          <div className="space-y-3">
            {/* Learner segments */}
            <section className="rounded-[12px] border border-black/[0.07] bg-white p-4 shadow-sm">
              <h3 className="text-[18px] font-bold text-[#111827]">Learner segments</h3>
              <p className="text-[11px] text-[#94a3b8]">Payment status distribution across all transactions.</p>
              <div className="mx-auto mt-3 flex w-full justify-center">
                <div
                  className="grid h-[120px] w-[120px] place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(
                      #5b3df6 0 ${learnerSegments.paid}%,
                      #cbd5e1 ${learnerSegments.paid}% ${learnerSegments.paid + learnerSegments.pending}%,
                      #f7b267 ${learnerSegments.paid + learnerSegments.pending}% 100%
                    )`,
                  }}
                >
                  <div className="grid h-[80px] w-[80px] place-items-center rounded-full bg-white text-center">
                    <div>
                      <p className="text-[28px] font-bold leading-none text-[#111827]">{learnerSegments.paid}%</p>
                      <p className="text-[9px] text-[#94a3b8]">captured</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-[#5b3df6]"><span className="inline-block h-2 w-2 rounded-full bg-[#5b3df6]" /> Captured</span>
                  <span className="font-semibold text-[#111827]">{learnerSegments.paid}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-[#94a3b8]"><span className="inline-block h-2 w-2 rounded-full bg-[#cbd5e1]" /> Pending/Other</span>
                  <span className="font-semibold text-[#111827]">{learnerSegments.pending}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-[#f7b267]"><span className="inline-block h-2 w-2 rounded-full bg-[#f7b267]" /> Failed</span>
                  <span className="font-semibold text-[#111827]">{learnerSegments.failed}%</span>
                </div>
              </div>
            </section>

            {/* Course scorecards */}
            <section className="rounded-[12px] border border-black/[0.07] bg-white p-4 shadow-sm">
              <h3 className="text-[18px] font-bold text-[#111827]">Course scorecards</h3>
              <p className="text-[11px] text-[#94a3b8]">Price-based ranking of top programs.</p>
              {topCourses.length === 0 ? (
                <p className="mt-3 text-[11px] text-[#94a3b8]">No courses available.</p>
              ) : (
                topCourses.map((c) => {
                  const pct = Math.max(5, Math.min(100, c.price ? Math.round((c.price / Math.max(topCourses[0]?.price || 1, 1)) * 100) : 5))
                  return (
                    <div key={c.name} className="mt-3">
                      <div className="mb-1 flex justify-between text-[11px]">
                        <span className="font-medium text-[#374151]">{c.name}</span>
                        <span className="text-[#5b3df6] font-semibold">{pct}%</span>
                      </div>
                      <div className="h-[6px] rounded-full bg-[#eef2ff]">
                        <div className="h-[6px] rounded-full bg-[#5b3df6] transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })
              )}
            </section>
          </div>
        </div>

        {/* Course performance table + Key insights */}
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.6fr_1fr]">
          <section className="rounded-[12px] border border-black/[0.07] bg-white p-5 shadow-sm">
            <h3 className="text-[20px] font-bold text-[#111827]">Course performance table</h3>
            <p className="mb-3 text-[12px] text-[#94a3b8]">Compare engagement, completion, and revenue by course.</p>
            <div className="overflow-x-auto rounded-[8px] border border-black/[0.07]">
              <table className="w-full min-w-[560px] text-left text-[11px]">
                <thead className="bg-[#f8fafc] text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                  <tr>
                    <th className="px-3 py-2.5">Course</th>
                    <th className="px-3 py-2.5">Learners</th>
                    <th className="px-3 py-2.5">Completion</th>
                    <th className="px-3 py-2.5">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topCourses.length === 0 ? (
                    <tr><td colSpan={4} className="p-3 text-[11px] text-[#94a3b8]">No course data available.</td></tr>
                  ) : topCourses.map((c) => {
                    const score = Math.max(5, Math.min(100, c.price ? Math.round((c.price / Math.max(topCourses[0]?.price || 1, 1)) * 100) : 5))
                    return (
                      <tr key={c.name} className="border-t border-black/[0.05] transition-colors hover:bg-[#fafbff]">
                        <td className="px-3 py-2.5">
                          <p className="font-semibold text-[#111827]">{c.name}</p>
                          <p className="text-[10px] text-[#94a3b8]">Type: {c.type}</p>
                        </td>
                        <td className="px-3 py-2.5 text-[#374151]">{c.youtube ? '🎬 Has video' : 'No video'}</td>
                        <td className="px-3 py-2.5">
                          <span className={`rounded-[12px] px-2 py-1 font-semibold ${
                            score >= 80 ? 'bg-[#ccfbf1] text-[#0b7d66]'
                            : score >= 50 ? 'bg-[#fef9c3] text-[#7a5a00]'
                            : 'bg-[#f0f4f8] text-[#64748b]'
                          }`}>
                            {score}%
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-semibold text-[#111827]">Rs. {c.price.toLocaleString('en-IN')}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-[12px] border border-black/[0.07] bg-white p-5 shadow-sm">
            <h3 className="text-[20px] font-bold text-[#111827]">Key insights</h3>
            <p className="mb-3 text-[12px] text-[#94a3b8]">Which changes matter this week</p>
            <div className="space-y-2">
              {insights.map(([t, d]) => (
                <div key={t} className="rounded-[10px] border border-black/[0.06] bg-[#f8fafc] p-3 transition-colors hover:bg-[#f1f5f9]">
                  <p className="text-[12px] font-semibold text-[#111827]">{t}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#64748b]">{d}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  )
}