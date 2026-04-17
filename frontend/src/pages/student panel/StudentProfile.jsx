import { createElement, useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Shield,
  Flame,
  Award,
  Target,
  KeyRound,
  History,
  Loader2,
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

function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-64 bg-gray-200 rounded-lg"></div>
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

// Cache keys for localStorage
const CACHE_KEYS = {
  PROFILE: 'student_profile_cache',
  DASHBOARD: 'student_dashboard_cache',
  NOTIFICATIONS: 'student_notifications_cache',
  CACHE_TIME: 'student_cache_timestamp'
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function sanitizeUserForStorage(user) {
  if (!user || typeof user !== 'object') return null
  const image =
    typeof user.profile_image_url === 'string' && user.profile_image_url.startsWith('data:')
      ? ''
      : (user.profile_image_url || user.avatar_url || user.image_url || '')
  return {
    _id: user._id || user.sub || '',
    sub: user.sub || user._id || '',
    full_name: user.full_name || user.name || '',
    name: user.name || user.full_name || '',
    email: user.email || '',
    phone: user.phone || user.mobile || user.phone_number || '',
    mobile: user.mobile || user.phone || '',
    phone_number: user.phone_number || user.phone || '',
    role: user.role || '',
    tenant_id: user.tenant_id || '',
    subscription_plan: user.subscription_plan || user.plan || '',
    plan: user.plan || user.subscription_plan || '',
    profile_image_url: image,
    avatar_url: image,
    image_url: image,
    created_at: user.created_at || '',
    is_active: Boolean(user.is_active),
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (err) {
    if (err?.name === 'QuotaExceededError') {
      localStorage.removeItem(key)
    }
    return false
  }
}

function getStoredUserFallback() {
  try {
    const raw = localStorage.getItem('lms_user')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

export default function StudentProfile() {
  const navigate = useNavigate()
  const [me, setMe] = useState(() => getStoredUserFallback())
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

  // Load cached data immediately
  const loadCachedData = useCallback(() => {
    try {
      const cacheTime = localStorage.getItem(CACHE_KEYS.CACHE_TIME)
      const isCacheValid = cacheTime && (Date.now() - parseInt(cacheTime)) < CACHE_DURATION
      
      if (isCacheValid) {
        const cachedProfile = localStorage.getItem(CACHE_KEYS.PROFILE)
        const cachedDashboard = localStorage.getItem(CACHE_KEYS.DASHBOARD)
        const cachedNotifications = localStorage.getItem(CACHE_KEYS.NOTIFICATIONS)
        
        if (cachedProfile) {
          const profile = JSON.parse(cachedProfile)
          setMe(profile)
          setForm({
            full_name: profile?.full_name || profile?.name || '',
            email: profile?.email || '',
            phone: profile?.phone || profile?.mobile || profile?.phone_number || '',
            profile_image_url: profile?.profile_image_url || profile?.avatar_url || profile?.image_url || '',
          })
        }
        
        if (cachedDashboard) {
          const dashboard = JSON.parse(cachedDashboard)
          setStats({
            courses_in_progress: dashboard?.courses_in_progress ?? 0,
            live_classes_week: dashboard?.live_classes_week ?? 0,
            quiz_attempts: dashboard?.quiz_attempts ?? 0,
            certificates_earned: dashboard?.certificates_earned ?? 0,
            unread_notifications: dashboard?.unread_notifications ?? 0,
          })
        }
        
        if (cachedNotifications) {
          const notes = JSON.parse(cachedNotifications)
          setNotifications((notes?.items || []).slice(0, 6))
        }
        
        return true
      }
      const fallbackUser = getStoredUserFallback()
      if (fallbackUser) {
        setMe(fallbackUser)
        setForm({
          full_name: fallbackUser?.full_name || fallbackUser?.name || '',
          email: fallbackUser?.email || '',
          phone: fallbackUser?.phone || fallbackUser?.mobile || fallbackUser?.phone_number || '',
          profile_image_url: fallbackUser?.profile_image_url || fallbackUser?.avatar_url || fallbackUser?.image_url || '',
        })
      }
    } catch (err) {
      console.warn('Failed to load cache:', err)
    }
    return false
  }, [])

  // Save data to cache
  const saveToCache = useCallback((profile, dashboard, notifications) => {
    try {
      if (profile) {
        const compactProfile = sanitizeUserForStorage(profile)
        if (compactProfile) safeSetStorage(CACHE_KEYS.PROFILE, JSON.stringify(compactProfile))
      }
      if (dashboard) safeSetStorage(CACHE_KEYS.DASHBOARD, JSON.stringify(dashboard))
      if (notifications) safeSetStorage(CACHE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))
      safeSetStorage(CACHE_KEYS.CACHE_TIME, Date.now().toString())
    } catch (err) {
      console.warn('Failed to save cache:', err)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    let timeoutId = null
    let hardStopId = null

    // Load cached data first for instant display
    const hasCache = loadCachedData()
    
    if (hasCache) {
      // Set a timeout to still show loading state briefly if needed
      timeoutId = setTimeout(() => {
        if (!cancelled && loading) {
          setLoading(false)
        }
      }, 500)
    }
    // Never keep skeleton forever when backend is slow.
    hardStopId = setTimeout(() => {
      if (!cancelled) setLoading(false)
    }, 12000)

    const loadData = async () => {
      try {
        // Use Promise.allSettled to handle individual failures
        const results = await Promise.allSettled([
          api('/auth/me'),
          api('/lms/dashboard/student'),
          api('/lms/notifications?limit=20')
        ])

        if (cancelled) return

        const [profileResult, dashboardResult, notesResult] = results
        
        let newProfile = null
        let newDashboard = {}
        let newNotifications = []

        // Handle profile data
        if (profileResult.status === 'fulfilled') {
          newProfile = profileResult.value
          setMe(newProfile)
          const compactUser = sanitizeUserForStorage(newProfile)
          if (compactUser) {
            safeSetStorage('lms_user', JSON.stringify(compactUser))
          }
          setForm({
            full_name: newProfile?.full_name || newProfile?.name || '',
            email: newProfile?.email || '',
            phone: newProfile?.phone || newProfile?.mobile || newProfile?.phone_number || '',
            profile_image_url: newProfile?.profile_image_url || newProfile?.avatar_url || newProfile?.image_url || '',
          })
        } else if (profileResult.status === 'rejected') {
          console.error('Profile fetch failed:', profileResult.reason)
          const fallbackUser = getStoredUserFallback()
          if (fallbackUser) {
            setMe(fallbackUser)
          } else if (!hasCache) {
            setError('Unable to load profile data.')
          }
        }

        // Handle dashboard data
        if (dashboardResult.status === 'fulfilled') {
          newDashboard = dashboardResult.value
          setStats({
            courses_in_progress: newDashboard?.courses_in_progress ?? 0,
            live_classes_week: newDashboard?.live_classes_week ?? 0,
            quiz_attempts: newDashboard?.quiz_attempts ?? 0,
            certificates_earned: newDashboard?.certificates_earned ?? 0,
            unread_notifications: newDashboard?.unread_notifications ?? 0,
          })
        }

        // Handle notifications
        if (notesResult.status === 'fulfilled') {
          newNotifications = notesResult.value
          setNotifications((newNotifications?.items || []).slice(0, 6))
        }

        // Save to cache
        saveToCache(newProfile, newDashboard, newNotifications)
        
        // Clear any pending timeout
        if (timeoutId) clearTimeout(timeoutId)
        if (hardStopId) clearTimeout(hardStopId)
        if (!cancelled) setLoading(false)
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load data:', err)
          if (!hasCache) {
            setError(err?.message || 'Unable to load profile data.')
          }
          if (timeoutId) clearTimeout(timeoutId)
          if (hardStopId) clearTimeout(hardStopId)
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
      if (hardStopId) clearTimeout(hardStopId)
    }
  }, [loadCachedData, saveToCache])

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
      
      // Re-fetch source of truth to keep UI synced with backend
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
      
      // Update cache
      saveToCache(updated, null, null)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err?.message || 'Unable to update profile.')
      setTimeout(() => setError(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  function handleImageFileSelect(event) {
    const file = event.target.files?.[0]
    if (!file) return

    // Compress image if too large
    if (file.size > 1024 * 1024) { // If larger than 1MB
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          let width = img.width
          let height = img.height
          const maxDimension = 800
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height * maxDimension) / width
              width = maxDimension
            } else {
              width = (width * maxDimension) / height
              height = maxDimension
            }
          }
          
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
          setUploadedImageUrl(dataUrl)
        }
        img.src = e.target?.result
      }
      reader.readAsDataURL(file)
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result
        if (typeof dataUrl === 'string') {
          setUploadedImageUrl(dataUrl)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading && !me && !notifications.length) {
    return (
      <div className="min-h-full bg-[#f3f4f6]">
        <div className="p-6">
          <div className="mx-auto max-w-[1200px]">
            <SkeletonLoader />
          </div>
        </div>
      </div>
    )
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
                  loading="lazy"
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
                className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-black/[0.1] bg-white py-2.5 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc] transition-colors"
              >
                <KeyRound className="h-4 w-4 text-[#64748b]" />
                Change password
              </button>
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-6">
            {/* Personal Details Section */}
            <section className="rounded-[12px] bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a]">Personal details</h3>
                  <p className="mt-1 text-[13px] text-[#94a3b8]">Information pulled from your account.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc] transition-colors"
                >
                  Edit profile
                </button>
              </div>

              {error && <p className="mb-3 text-[13px] text-red-600">{error}</p>}
              {success && <p className="mb-3 text-[13px] text-emerald-700">{success}</p>}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailField label="Full name" value={me?.full_name} />
                <DetailField label="Display name" value={me?.display_name || displayName.split(' ')[0]} />
                <DetailField label="Email address" value={me?.email} />
                <DetailField label="Phone number" value={phoneValue} />
                <DetailField label="Role" value={displayRole} />
                <DetailField label="Account status" value={me?.is_active ? 'Active' : 'Inactive'} />
              </div>
            </section>

            {/* Learning Achievements Section */}
            <section className="rounded-[12px] bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a]">Learning achievements</h3>
                  <p className="mt-1 text-[13px] text-[#94a3b8]">Calculated from your dashboard data.</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/student-panel/certificates')}
                  className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc] transition-colors"
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
                  <div key={title} className="rounded-[10px] bg-[#f3f4f6] p-4 transition-all hover:shadow-md">
                    <div className={`mb-3 inline-flex rounded-lg p-2 ${iconBg}`}>
                      {createElement(icon, { className: 'h-5 w-5' })}
                    </div>
                    <p className="text-[15px] font-bold text-[#0f172a]">{title}</p>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#64748b]">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Activity Section */}
            <section className="rounded-[12px] bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a]">Recent activity</h3>
                  <p className="mt-1 text-[13px] text-[#94a3b8]">Latest notifications from backend.</p>
                </div>
                <button
                  type="button"
                  className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc] transition-colors"
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

            {/* Membership Section */}
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
                    className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc] transition-colors"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <KeyRound className="h-4 w-4" />
                      Change password
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/student-panel/my-courses')}
                    className="rounded-[8px] bg-[#5b3df6] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#4a2ed8] transition-colors"
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

      {/* Edit Profile Modal */}
      {isEditing && (
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
                className="rounded-full border border-black/[0.1] px-3 py-1 text-[12px] font-semibold text-[#0f172a] hover:bg-[#f8fafc] transition-colors"
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
                            loading="lazy"
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
                          className="w-full rounded-[10px] border border-black/[0.1] bg-white px-3 py-2.5 text-[13px] file:mr-3 file:rounded file:border-0 file:bg-[#5b3df6] file:px-3 file:py-1 file:text-[12px] file:font-semibold file:text-white hover:file:bg-[#4a2ed8] file:transition-colors"
                        />
                        <p className="text-[11px] text-[#64748b]">
                          {uploadedImageUrl ? 'New image selected. Click Save changes to apply.' : 'Upload an image or use a direct URL below.'}
                        </p>
                        <input
                          value={form.profile_image_url}
                          onChange={(event) =>
                            setForm((prev) => ({ ...prev, profile_image_url: event.target.value }))
                          }
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
                  className="rounded-[10px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] hover:bg-[#f8fafc] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-[10px] bg-[#5b3df6] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#4a2ed8] disabled:cursor-not-allowed disabled:opacity-70 transition-colors"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    'Save changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}