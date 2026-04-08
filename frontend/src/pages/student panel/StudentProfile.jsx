import { createElement, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Shield,
  Flame,
  Award,
  Target,
  KeyRound,
  History,
} from 'lucide-react'
import { api } from '../../lib/api'

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

function getInitials(name) {
  if (!name) return 'U'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function StudentProfile() {
  const navigate = useNavigate()
  const [me, setMe] = useState(null)
  const [stats, setStats] = useState({
    courses_in_progress: 0,
    live_classes_week: 0,
    quiz_attempts: 0,
    certificates_earned: 0,
    unread_notifications: 0,
  })
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    profile_image_url: '',
  })

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        const [profile, dashboard, notes] = await Promise.all([
          api('/auth/me'),
          api('/lms/dashboard/student').catch(() => ({})),
          api('/lms/notifications?limit=20').catch(() => ({ items: [] })),
        ])

        if (cancelled) return

        setMe(profile || null)
        setForm({
          full_name: profile?.full_name || profile?.name || '',
          email: profile?.email || '',
          phone: profile?.phone || profile?.mobile || profile?.phone_number || '',
          profile_image_url: profile?.profile_image_url || profile?.avatar_url || profile?.image_url || '',
        })
        setUploadedImageUrl('')
        setStats({
          courses_in_progress: dashboard?.courses_in_progress ?? 0,
          live_classes_week: dashboard?.live_classes_week ?? 0,
          quiz_attempts: dashboard?.quiz_attempts ?? 0,
          certificates_earned: dashboard?.certificates_earned ?? 0,
          unread_notifications: dashboard?.unread_notifications ?? 0,
        })
        setNotifications((notes?.items || []).slice(0, 6))
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Unable to load profile data.')
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

  const displayName = me?.full_name || me?.name || 'Learner'
  const displayRole = me?.role ? me.role.replace('_', ' ') : 'student'
  const phoneValue = me?.phone || me?.mobile || me?.phone_number || ''
  const avatarLabel = useMemo(() => getInitials(displayName), [displayName])
  const memberSince = formatDate(me?.created_at)
  const activePlan = me?.subscription_plan || me?.plan || 'Learner access'
  const profileImage = me?.profile_image_url || me?.avatar_url || me?.image_url || ''

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
        }),
      })
      // Re-fetch source of truth to keep UI synced with backend.
      const updated = await api('/auth/me')
      setMe(updated)
      setForm({
        full_name: updated?.full_name || updated?.name || '',
        email: updated?.email || '',
        phone: updated?.phone || updated?.mobile || updated?.phone_number || '',
        profile_image_url: updated?.profile_image_url || updated?.avatar_url || updated?.image_url || '',
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
                  alt={displayName}
                  className="h-[100px] w-[100px] rounded-full object-cover ring-4 ring-[#f3f4f6]"
                />
              ) : (
                <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gradient-to-br from-[#5b3df6] to-[#2dd4bf] text-[28px] font-bold text-white ring-4 ring-[#f3f4f6]">
                  {avatarLabel}
                </div>
              )}
              <h2 className="mt-4 text-[22px] font-bold text-[#0f172a]">{displayName}</h2>
              <p className="mt-1 text-[13px] text-[#64748b]">{displayRole}</p>
              <span className="mt-3 inline-flex rounded-full bg-[#2dd4bf]/25 px-3 py-1 text-[11px] font-semibold text-[#047857]">
                {activePlan}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                { label: 'Courses', value: String(stats.courses_in_progress ?? 0) },
                { label: 'Lives', value: String(stats.live_classes_week ?? 0) },
                { label: 'Certs', value: String(stats.certificates_earned ?? 0) },
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
                <DetailField label="Full name" value={me?.full_name} />
                <DetailField label="Display name" value={me?.display_name || displayName.split(' ')[0]} />
                <DetailField label="Email address" value={me?.email} />
                <DetailField label="Phone number" value={phoneValue} />
                <DetailField label="Role" value={displayRole} />
                <DetailField label="Tenant ID" value={me?.tenant_id} />
                <DetailField label="Account status" value={me?.is_active ? 'Active' : 'Inactive'} />
              </div>
            </section>

            <section className="rounded-[12px] bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a]">Learning achievements</h3>
                  <p className="mt-1 text-[13px] text-[#94a3b8]">Calculated from your dashboard data.</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/student-panel/certificates')}
                  className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc]"
                >
                  View certificates
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                  {
                    icon: Flame,
                    title: `${stats.courses_in_progress ?? 0} courses in progress`,
                    desc: 'Based on your enrollments.',
                    iconBg: 'bg-orange-100 text-orange-600',
                  },
                  {
                    icon: Award,
                    title: `${stats.certificates_earned ?? 0} certificates earned`,
                    desc: 'Completed programs from your account.',
                    iconBg: 'bg-violet-100 text-violet-600',
                  },
                  {
                    icon: Target,
                    title: `${stats.quiz_attempts ?? 0} quiz attempts`,
                    desc: 'Performance activity from student dashboard.',
                    iconBg: 'bg-emerald-100 text-emerald-600',
                  },
                ].map(({ icon, title, desc, iconBg }) => (
                  <div key={title} className="rounded-[10px] bg-[#f3f4f6] p-4">
                    <div className={`mb-3 inline-flex rounded-lg p-2 ${iconBg}`}>
                      {createElement(icon, { className: 'h-5 w-5' })}
                    </div>
                    <p className="text-[15px] font-bold text-[#0f172a]">{title}</p>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#64748b]">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[12px] bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a]">Recent activity</h3>
                  <p className="mt-1 text-[13px] text-[#94a3b8]">Latest notifications from backend.</p>
                </div>
                <button
                  type="button"
                  className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc]"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <History className="h-4 w-4" />
                    Open history
                  </span>
                </button>
              </div>

              <div className="divide-y divide-black/[0.06]">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div key={item._id || item.title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#e8f5ff] text-[#5b3df6]">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-[#0f172a]">{item.title || 'Notification'}</p>
                        <p className="mt-1 text-[12px] text-[#94a3b8]">{item.message || '-'}</p>
                      </div>
                      <span className="shrink-0 self-start rounded-full bg-[#f1f5f9] px-2.5 py-0.5 text-[11px] font-medium text-[#64748b]">
                        {item.created_at ? formatDate(item.created_at) : 'Recent'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-[13px] text-[#64748b]">No recent activity yet.</div>
                )}
              </div>
            </section>

            <section className="rounded-[12px] bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a]">Membership & account</h3>
                  <p className="mt-1 text-[13px] text-[#94a3b8]">Subscription and access details from your profile data.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/forgetpassword')}
                    className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc]"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <KeyRound className="h-4 w-4" />
                      Change password
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/student-panel/my-courses')}
                    className="rounded-[8px] bg-[#5b3df6] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#4a2ed8]"
                  >
                    Manage plan
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailField label="Current plan" value={me?.plan || me?.subscription_plan || 'Learner access'} />
                <DetailField label="Billing cycle" value={me?.billing_cycle} />
                <DetailField label="Courses in progress" value={String(stats.courses_in_progress ?? 0)} />
                <DetailField label="Unread alerts" value={String(stats.unread_notifications ?? 0)} />
              </div>
            </section>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-[560px] rounded-[16px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[18px] font-bold text-[#0f172a]">Edit personal details</h3>
                <p className="mt-1 text-[13px] text-[#64748b]">Update your profile info and image URL.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full border border-black/[0.1] px-3 py-1 text-[12px] font-semibold text-[#0f172a] hover:bg-[#f8fafc]"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-[12px] font-semibold text-[#0f172a]">Full name</span>
                <input
                  value={form.full_name}
                  onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
                  className="rounded-[8px] border border-black/[0.1] px-3 py-2.5 text-[13px] outline-none focus:border-[#5b3df6]"
                  type="text"
                  placeholder="Your full name"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[12px] font-semibold text-[#0f172a]">Email address</span>
                <input
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="rounded-[8px] border border-black/[0.1] px-3 py-2.5 text-[13px] outline-none focus:border-[#5b3df6]"
                  type="email"
                  placeholder="you@example.com"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[12px] font-semibold text-[#0f172a]">Phone number</span>
                <input
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  className="rounded-[8px] border border-black/[0.1] px-3 py-2.5 text-[13px] outline-none focus:border-[#5b3df6]"
                  type="text"
                  placeholder="Optional"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[12px] font-semibold text-[#0f172a]">Profile image</span>
                <div className="space-y-3">
                  {uploadedImageUrl || form.profile_image_url ? (
                    <div className="rounded-[8px] border border-black/[0.1] p-3">
                      <img
                        src={uploadedImageUrl || form.profile_image_url}
                        alt="Preview"
                        className="h-[120px] w-[120px] rounded-[8px] object-cover"
                      />
                      <p className="mt-2 text-[11px] text-[#64748b]">
                        {uploadedImageUrl ? 'New image selected (not saved yet)' : 'Current image'}
                      </p>
                    </div>
                  ) : null}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileSelect}
                    className="rounded-[8px] border border-black/[0.1] px-3 py-2.5 text-[13px] file:mr-3 file:rounded file:border-0 file:bg-[#5b3df6] file:px-3 file:py-1 file:text-[12px] file:font-semibold file:text-white hover:file:bg-[#4a2ed8]"
                  />
                  <p className="text-[11px] text-[#94a3b8]">Or paste image URL:</p>
                  <input
                    value={form.profile_image_url}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, profile_image_url: event.target.value }))
                    }
                    className="rounded-[8px] border border-black/[0.1] px-3 py-2.5 text-[13px] outline-none focus:border-[#5b3df6]"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </label>

              <div className="mt-2 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] hover:bg-[#f8fafc]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-[8px] bg-[#5b3df6] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#4a2ed8] disabled:cursor-not-allowed disabled:opacity-70"
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
