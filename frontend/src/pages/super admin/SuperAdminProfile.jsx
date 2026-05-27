import { createElement, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Users, BookOpen, Wallet, KeyRound } from 'lucide-react'
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
  if (!role) return 'Super Admin'
  return String(role)
    .split('_')
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatCurrency(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return 'INR 0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function getInitials(name) {
  const text = String(name || '').trim()
  if (!text) return 'SA'
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

function toTotal(payload) {
  if (!payload) return null
  if (typeof payload?.total === 'number' && Number.isFinite(payload.total)) return payload.total
  return toItems(payload).length
}

export default function SuperAdminProfile() {
  const navigate = useNavigate()
  const [me, setMe] = useState(null)
  const [stats, setStats] = useState({
    total_tenants: 0,
    total_users: 0,
    total_courses: 0,
    active_subscriptions: 0,
    total_revenue: 0,
    unread_notifications: 0,
  })
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
        const [profile, dashboard, tenantsData, adminUsers] = await Promise.all([
          api('/auth/me'),
          api('/lms/dashboard/super-admin').catch(() => ({})),
          api('/lms/tenants?limit=1').catch(() => null),
          api('/lms/users?role=admin&limit=500').catch(() => null),
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

        const tenantsTotal = toTotal(tenantsData)
        const adminItems = toItems(adminUsers)
        const tenantIdsFromAdmins = new Set(adminItems.map((item) => String(item?.tenant_id || '').trim()).filter(Boolean))
        const derivedTenantCount = Math.max(tenantsTotal ?? 0, tenantIdsFromAdmins.size)

        setStats({
          total_tenants: derivedTenantCount || dashboard?.total_tenants || 0,
          total_users: dashboard?.total_users ?? 0,
          total_courses: dashboard?.total_courses ?? dashboard?.active_courses ?? 0,
          active_subscriptions: dashboard?.active_subscriptions ?? 0,
          total_revenue: dashboard?.total_revenue ?? dashboard?.revenue ?? 0,
          unread_notifications: dashboard?.unread_notifications ?? 0,
        })
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Unable to load profile data.')
          setMe(null)
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

  const displayName = me?.full_name || me?.name || 'Super Admin'
  const displayRole = useMemo(() => formatRole(me?.role), [me])
  const phoneValue = me?.phone || me?.mobile || me?.phone_number || ''
  const avatarLabel = useMemo(() => getInitials(displayName), [displayName])
  const memberSince = formatDate(me?.created_at)
  const activePlan = me?.subscription_plan || me?.plan || 'Platform owner access'
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
                { label: 'Tenants', value: String(stats.total_tenants ?? 0) },
                { label: 'Users', value: String(stats.total_users ?? 0) },
                { label: 'Courses', value: String(stats.total_courses ?? 0) },
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
                  <h3 className="text-[18px] font-bold text-[#0f172a]">Platform achievements</h3>
                  <p className="mt-1 text-[13px] text-[#94a3b8]">Calculated from your super admin dashboard data.</p>
                </div>
                <button
                  type="button"
                  className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc]"
                >
                  Platform overview
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={Building2}
                  title={`${stats.total_tenants ?? 0} tenants`}
                  desc="Institutes currently onboarded on the platform."
                  iconBg="bg-sky-100 text-sky-600"
                />
                <StatCard
                  icon={Users}
                  title={`${stats.total_users ?? 0} users`}
                  desc="All active users across all tenant workspaces."
                  iconBg="bg-violet-100 text-violet-600"
                />
                <StatCard
                  icon={BookOpen}
                  title={`${stats.total_courses ?? 0} courses`}
                  desc="Total courses published platform-wide."
                  iconBg="bg-emerald-100 text-emerald-600"
                />
                <StatCard
                  icon={Wallet}
                  title={formatCurrency(stats.total_revenue)}
                  desc="Captured platform revenue from all tenants."
                  iconBg="bg-amber-100 text-amber-600"
                />
              </div>
            </section>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-[720px] max-h-[92vh] overflow-hidden rounded-[16px] bg-white shadow-2xl">
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
                  <span className="text-[12px] font-semibold text-[#0f172a]">Profile image</span>
                  <div className="rounded-[10px] border border-black/[0.08] bg-[#f8fafc] p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex items-center justify-center">
                        {uploadedImageUrl || form.profile_image_url ? (
                          <img
                            src={uploadedImageUrl || form.profile_image_url}
                            alt="Preview"
                            className="h-[110px] w-[110px] rounded-[10px] border border-black/[0.08] object-cover bg-white"
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
