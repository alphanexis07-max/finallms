import { createElement, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, FileText, KeyRound, Video, Award, Target } from 'lucide-react'
import { api } from '../../lib/api'

const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-[#e8f5ff] text-[#0f172a]',
    green: 'bg-[#2dd4bf]/25 text-[#047857]',
    purple: 'bg-[#ede7ff] text-[#4c2dd9]',
  }
  return (
    <span className={`inline-flex h-[28px] items-center rounded-[12px] px-[10px] text-[12px] font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-[10px] bg-[#f3f4f6] px-3 py-2.5">
      <p className="text-[11px] font-medium text-[#94a3b8]">{label}</p>
      <p className="mt-0.5 text-[13px] font-semibold text-[#0f172a]">{value || '-'}</p>
    </div>
  )
}

function DetailField({ label, value }) {
  return (
    <div className="rounded-[10px] bg-[#f3f4f6] px-3 py-2.5">
      <p className="text-[11px] font-medium text-[#94a3b8]">{label}</p>
      <p className="mt-0.5 text-[13px] font-semibold text-[#0f172a]">{value || '-'}</p>
    </div>
  )
}

function StatCard({ icon, title, desc, iconBg }) {
  return (
    <div className="rounded-[10px] bg-[#f3f4f6] p-4">
      <div className={`mb-3 inline-flex rounded-lg p-2 ${iconBg}`}>
        {createElement(icon, { className: 'h-5 w-5' })}
      </div>
      <p className="text-[15px] font-bold text-[#0f172a]">{title}</p>
      <p className="mt-2 text-[12px] leading-relaxed text-[#64748b]">{desc}</p>
    </div>
  )
}

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatRole(role) {
  if (!role) return 'Instructor'
  return String(role)
    .split('_')
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(' ')
}

function getInitials(name) {
  const text = String(name || '').trim()
  if (!text) return 'IN'
  const parts = text.split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] || ''
  const second = parts[1]?.[0] || parts[0]?.[1] || ''
  return `${first}${second}`.toUpperCase()
}

function toItems(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  return []
}

function getUserIds(profile) {
  return new Set([
    String(profile?._id || ''),
    String(profile?.id || ''),
    String(profile?.sub || ''),
  ].filter(Boolean))
}

export default function InstructorProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')

  const [me, setMe] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [courses, setCourses] = useState([])
  const [liveClasses, setLiveClasses] = useState([])
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    profile_image_url: '',
    bank_account_holder: '',
    bank_name: '',
    bank_account_number: '',
    bank_ifsc: '',
    bank_upi_id: '',
  })

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        const [profile, dashboardData, instructorCourseData, tenantCourseData, classData] = await Promise.all([
          api('/auth/me'),
          api('/lms/dashboard/instructor').catch(() => ({})),
          api('/instructor/courses').catch(() => []),
          api('/lms/courses?limit=200').catch(() => ({ items: [] })),
          api('/lms/live-classes?limit=100').catch(() => ({ items: [] })),
        ])

        if (cancelled) return

        setMe(profile || null)
        setForm({
          full_name: profile?.full_name || profile?.name || '',
          email: profile?.email || '',
          phone: profile?.phone || profile?.mobile || profile?.phone_number || '',
          profile_image_url: profile?.profile_image_url || profile?.avatar_url || profile?.image_url || '',
          bank_account_holder: profile?.bank_account_holder || '',
          bank_name: profile?.bank_name || '',
          bank_account_number: profile?.bank_account_number || '',
          bank_ifsc: profile?.bank_ifsc || '',
          bank_upi_id: profile?.bank_upi_id || '',
        })
        setUploadedImageUrl('')
        setDashboard(dashboardData || {})

        const userIds = getUserIds(profile)
        const instructorCourses = toItems(instructorCourseData)
        const tenantCourses = toItems(tenantCourseData).filter((item) => {
          const createdBy = String(item?.created_by || '')
          const instructorId = String(item?.instructor_id || '')
          return (createdBy && userIds.has(createdBy)) || (instructorId && userIds.has(instructorId))
        })

        const mergedCourses = [...instructorCourses, ...tenantCourses]
        const uniqueCourses = Array.from(
          new Map(
            mergedCourses.map((item, index) => [String(item?._id || item?.id || `${item?.title || 'course'}-${index}`), item]),
          ).values(),
        )
        setCourses(uniqueCourses)

        const classItems = Array.isArray(classData?.items) ? classData.items : Array.isArray(classData) ? classData : []
        const assignedClasses = classItems.filter((item) => {
          const instructorId = String(item?.instructor_id || '')
          const createdBy = String(item?.created_by || '')
          return (instructorId && userIds.has(instructorId)) || (createdBy && userIds.has(createdBy))
        })
        setLiveClasses(assignedClasses)
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Unable to load profile data.')
          setMe(null)
          setDashboard(null)
          setCourses([])
          setLiveClasses([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [])

  const profileName = me?.full_name || me?.name || me?.username || 'Instructor'
  const roleText = useMemo(() => formatRole(me?.role), [me])
  const avatarLabel = useMemo(() => getInitials(profileName), [profileName])
  const profileImage = me?.profile_image_url || me?.avatar_url || me?.image_url || ''
  const phoneValue = me?.phone || me?.mobile || me?.phone_number || ''
  const activePlan = me?.subscription_plan || me?.plan || 'Instructor access'
  const memberSince = formatDate(me?.created_at)
  const bankAccountNumber = me?.bank_account_number || ''
  const maskedBankAccount = bankAccountNumber ? `XXXXXX${bankAccountNumber.slice(-4)}` : '-'
  const classStats = useMemo(() => {
    const now = Date.now()
    let live = 0
    let upcoming = 0
    let completed = 0

    liveClasses.forEach((item) => {
      const start = new Date(item?.start_at || item?.start_time || 0).getTime()
      const end = item?.duration_minutes ? start + Number(item.duration_minutes) * 60000 : NaN

      if (!Number.isNaN(start) && !Number.isNaN(end)) {
        if (start <= now && now <= end) live += 1
        else if (start > now) upcoming += 1
        else completed += 1
      }
    })

    return { live, upcoming, completed }
  }, [liveClasses])

  async function handleSaveProfile(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const imageToSave = uploadedImageUrl || form.profile_image_url
      await api('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          mobile: form.phone.trim(),
          phone_number: form.phone.trim(),
          profile_image_url: imageToSave,
          bank_account_holder: form.bank_account_holder.trim(),
          bank_name: form.bank_name.trim(),
          bank_account_number: form.bank_account_number.trim(),
          bank_ifsc: form.bank_ifsc.trim().toUpperCase(),
          bank_upi_id: form.bank_upi_id.trim(),
        }),
      })

      const updated = await api('/auth/me')
      setMe(updated)
      setForm({
        full_name: updated?.full_name || updated?.name || '',
        email: updated?.email || '',
        phone: updated?.phone || updated?.mobile || updated?.phone_number || '',
        profile_image_url: updated?.profile_image_url || updated?.avatar_url || updated?.image_url || '',
        bank_account_holder: updated?.bank_account_holder || '',
        bank_name: updated?.bank_name || '',
        bank_account_number: updated?.bank_account_number || '',
        bank_ifsc: updated?.bank_ifsc || '',
        bank_upi_id: updated?.bank_upi_id || '',
      })
      setUploadedImageUrl('')
      setIsEditing(false)
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(err?.message || 'Unable to update profile.')
    } finally {
      setSaving(false)
    }
  }

  function handleImageFileSelect(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result
      if (typeof dataUrl === 'string') {
        setUploadedImageUrl(dataUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-full bg-[#f3f4f6]">
      <div className="p-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 lg:flex-row lg:items-start">
          <aside className="w-full shrink-0 rounded-[12px] bg-white p-6 shadow-sm lg:w-[300px]">
            <div className="flex flex-col items-center text-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={profileName}
                  className="h-[100px] w-[100px] rounded-full object-cover ring-4 ring-[#f3f4f6]"
                />
              ) : (
                <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gradient-to-br from-[#5b3df6] to-[#2dd4bf] text-[28px] font-bold text-white ring-4 ring-[#f3f4f6]">
                  {avatarLabel}
                </div>
              )}
              <h2 className="mt-4 text-[22px] font-bold text-[#0f172a]">{profileName}</h2>
              <p className="mt-1 text-[13px] text-[#64748b]">{roleText}</p>
              <span className="mt-3 inline-flex rounded-full bg-[#2dd4bf]/25 px-3 py-1 text-[11px] font-semibold text-[#047857]">
                {activePlan}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                { label: 'Courses', value: String(courses.length ?? 0) },
                { label: 'Lives', value: String(classStats.live ?? 0) },
                { label: 'Tests', value: String(dashboard?.weekly_tests ?? 0) },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-[8px] bg-[#f3f4f6] px-2 py-2.5 text-center">
                  <p className="text-[10px] font-medium text-[#94a3b8]">{label}</p>
                  <p className="mt-0.5 text-[18px] font-bold text-[#0f172a]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              <InfoBox label="Email" value={me?.email} />
              <InfoBox label="Phone" value={phoneValue} />
              <InfoBox label="Joined" value={memberSince} />
            </div>

            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={() => navigate('/forgetpassword')}
                className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-black/[0.1] bg-white py-2.5 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc]"
              >
                <KeyRound className="h-4 w-4 text-[#64748b]" />
                Change password
              </button>
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-6">
            <section className="rounded-[12px] bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a]">Personal details</h3>
                  <p className="mt-1 text-[13px] text-[#94a3b8]">Information pulled from your account.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc]"
                >
                  Edit profile
                </button>
              </div>

              {error ? <p className="mb-3 text-[13px] text-red-600">{error}</p> : null}
              {success ? <p className="mb-3 text-[13px] text-emerald-700">{success}</p> : null}
              {loading ? <p className="mb-3 text-[13px] text-[#64748b]">Loading profile...</p> : null}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailField label="Full name" value={me?.full_name || me?.name} />
                <DetailField label="Display name" value={me?.display_name || profileName.split(' ')[0]} />
                <DetailField label="Email address" value={me?.email} />
                <DetailField label="Phone number" value={phoneValue} />
                <DetailField label="Role" value={roleText} />
                <DetailField label="Tenant ID" value={me?.tenant_id} />
                <DetailField label="Account status" value={me?.is_active ? 'Active' : 'Inactive'} />
              </div>
            </section>

            <section className="rounded-[12px] bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a]">Teaching achievements</h3>
                  <p className="mt-1 text-[13px] text-[#94a3b8]">Calculated from your instructor dashboard data.</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/instructor/my-courses')}
                  className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc]"
                >
                  Manage courses
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <StatCard
                  icon={BookOpen}
                  title={`${courses.length ?? 0} courses managed`}
                  desc="Based on your instructor course list."
                  iconBg="bg-blue-100 text-blue-600"
                />
                <StatCard
                  icon={Video}
                  title={`${dashboard?.live_sessions_week ?? classStats.live ?? 0} live sessions`}
                  desc="Live teaching activity from backend data."
                  iconBg="bg-orange-100 text-orange-600"
                />
                <StatCard
                  icon={Target}
                  title={`${dashboard?.weekly_tests ?? 0} weekly tests`}
                  desc="Assessment activity linked to your instructor account."
                  iconBg="bg-emerald-100 text-emerald-600"
                />
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <StatCard
                  icon={Award}
                  title={`${dashboard?.lab_modules ?? 0} lab modules`}
                  desc="Practical modules available in your workspace."
                  iconBg="bg-violet-100 text-violet-600"
                />
                <StatCard
                  icon={FileText}
                  title={`${dashboard?.events ?? 0} school events`}
                  desc="Campus and platform events from the dashboard."
                  iconBg="bg-yellow-100 text-yellow-600"
                />
              </div>
            </section>
            <section className="rounded-[12px] bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a]">Bank details for payout</h3>
                  <p className="mt-1 text-[13px] text-[#94a3b8]">Admin commission cut hone ke baad payment aapke account me transfer karne ke liye.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc]"
                >
                  Update bank details
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailField label="Account holder" value={me?.bank_account_holder} />
                <DetailField label="Bank name" value={me?.bank_name} />
                <DetailField label="Account number" value={maskedBankAccount} />
                <DetailField label="IFSC code" value={me?.bank_ifsc} />
                <DetailField label="UPI ID" value={me?.bank_upi_id} />
                <DetailField label="Payout status" value={me?.bank_account_number ? 'Ready for payout' : 'Pending bank details'} />
              </div>
            </section>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="max-h-[92vh] w-full max-w-[720px] overflow-hidden rounded-[16px] bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-5 py-4 sm:px-6">
              <div>
                <h3 className="text-[20px] font-bold text-[#0f172a]">Edit personal details</h3>
                <p className="mt-1 text-[13px] text-[#64748b]">Update your profile information and avatar.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full border border-black/[0.1] px-3 py-1 text-[12px] font-semibold text-[#0f172a] hover:bg-[#f8fafc]"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex max-h-[calc(92vh-70px)] flex-col">
              <div className="grid gap-5 overflow-y-auto px-5 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-[12px] font-semibold text-[#0f172a]">Full name</span>
                    <input
                      value={form.full_name}
                      onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
                      className="rounded-[10px] border border-black/[0.1] px-3 py-2.5 text-[13px] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                      type="text"
                      placeholder="Your full name"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[12px] font-semibold text-[#0f172a]">Email address</span>
                    <input
                      value={form.email}
                      onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                      className="rounded-[10px] border border-black/[0.1] px-3 py-2.5 text-[13px] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                      type="email"
                      placeholder="you@example.com"
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-[12px] font-semibold text-[#0f172a]">Phone number</span>
                  <input
                    value={form.phone}
                    onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                    className="rounded-[10px] border border-black/[0.1] px-3 py-2.5 text-[13px] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                    type="text"
                    placeholder="Optional"
                  />
                </label>

                <div className="grid gap-3">
                  <span className="text-[12px] font-semibold text-[#0f172a]">Bank details for payout</span>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 sm:col-span-2">
                      <span className="text-[12px] font-semibold text-[#0f172a]">Account holder name</span>
                      <input
                        value={form.bank_account_holder}
                        onChange={(event) => setForm((prev) => ({ ...prev, bank_account_holder: event.target.value }))}
                        className="rounded-[10px] border border-black/[0.1] px-3 py-2.5 text-[13px] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                        type="text"
                        placeholder="Name as per bank account"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-[12px] font-semibold text-[#0f172a]">Bank name</span>
                      <input
                        value={form.bank_name}
                        onChange={(event) => setForm((prev) => ({ ...prev, bank_name: event.target.value }))}
                        className="rounded-[10px] border border-black/[0.1] px-3 py-2.5 text-[13px] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                        type="text"
                        placeholder="Bank name"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-[12px] font-semibold text-[#0f172a]">IFSC code</span>
                      <input
                        value={form.bank_ifsc}
                        onChange={(event) => setForm((prev) => ({ ...prev, bank_ifsc: event.target.value.toUpperCase() }))}
                        className="rounded-[10px] border border-black/[0.1] px-3 py-2.5 text-[13px] uppercase outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                        type="text"
                        placeholder="e.g. HDFC0001234"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-[12px] font-semibold text-[#0f172a]">Account number</span>
                      <input
                        value={form.bank_account_number}
                        onChange={(event) => setForm((prev) => ({ ...prev, bank_account_number: event.target.value }))}
                        className="rounded-[10px] border border-black/[0.1] px-3 py-2.5 text-[13px] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                        type="text"
                        placeholder="Account number"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-[12px] font-semibold text-[#0f172a]">UPI ID (optional)</span>
                      <input
                        value={form.bank_upi_id}
                        onChange={(event) => setForm((prev) => ({ ...prev, bank_upi_id: event.target.value }))}
                        className="rounded-[10px] border border-black/[0.1] px-3 py-2.5 text-[13px] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                        type="text"
                        placeholder="name@bank"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid gap-3">
                  <span className="text-[12px] font-semibold text-[#0f172a]">Profile image</span>
                  <div className="rounded-[10px] border border-black/[0.08] bg-[#f8fafc] p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex items-center justify-center">
                        {uploadedImageUrl || form.profile_image_url ? (
                          <img
                            src={uploadedImageUrl || form.profile_image_url}
                            alt="Preview"
                            className="h-[110px] w-[110px] rounded-[10px] border border-black/[0.08] bg-white object-cover"
                          />
                        ) : (
                          <div className="flex h-[110px] w-[110px] items-center justify-center rounded-[10px] border border-dashed border-black/[0.15] bg-white text-[11px] text-[#94a3b8]">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileSelect}
                          className="w-full rounded-[10px] border border-black/[0.1] bg-white px-3 py-2.5 text-[13px] file:mr-3 file:rounded file:border-0 file:bg-[#5b3df6] file:px-3 file:py-1 file:text-[12px] file:font-semibold file:text-white hover:file:bg-[#4a2ed8]"
                        />
                        <p className="text-[11px] text-[#64748b]">
                          {uploadedImageUrl ? 'New image selected. Click Save changes to apply.' : 'Upload an image or use a direct URL below.'}
                        </p>
                        <input
                          value={form.profile_image_url}
                          onChange={(event) => setForm((prev) => ({ ...prev, profile_image_url: event.target.value }))}
                          className="w-full rounded-[10px] border border-black/[0.1] bg-white px-3 py-2.5 text-[13px] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                          type="url"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-wrap justify-end gap-3 border-t border-black/[0.06] bg-white px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-[10px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] hover:bg-[#f8fafc]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-[10px] bg-[#5b3df6] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#4a2ed8] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
