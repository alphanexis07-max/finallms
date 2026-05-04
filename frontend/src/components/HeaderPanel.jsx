import React, { useEffect, useMemo, useState } from 'react'
import { Search, Bell, Menu } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import useRealtime from '../hooks/useRealtime'

function Avatar({ src, alt = '', name = '', className = '' }) {
  const initials = useMemo(() => {
    const parts = String(name || alt || 'U')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
    const first = parts[0]?.[0] || 'U'
    const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : ''
    return `${first}${second}`.toUpperCase()
  }, [alt, name])

  if (src) {
    return <img src={src} alt={alt} className={`h-[36px] w-[36px] rounded-[6px] object-cover ${className}`} />
  }

  return (
    <div
      aria-label={alt}
      className={`flex h-[36px] w-[36px] items-center justify-center rounded-[6px] bg-[#0f172a] text-[12px] font-semibold text-white ${className}`}
    >
      {initials}
    </div>
  )
}

const getPageTitle = (pathname) => {
  // Superadmin routes
  if (pathname === '/superadmin') return 'Overview'
  if (pathname === '/superadmin/dashboard') return 'Dashboard'
  if (pathname === '/superadmin/tenant-management') return 'Tenant Management'
  if (pathname === '/superadmin/revenue') return 'Revenue'
  if (pathname === '/superadmin/user-management') return 'User Management'
  if (pathname === '/superadmin/reports') return 'Reports'
  if (pathname === '/superadmin/plans-billing') return 'Plans & Billing'
  if (pathname === '/superadmin/platform-settings') return 'Platform Settings'
  if (pathname === '/superadmin/notifications') return 'Notifications'
  if (pathname === '/superadmin/profile') return 'Super Admin Profile'

  // Admin routes
  if (pathname === '/admin') return 'Dashboard Overview'
  if (pathname === '/admin/course-management') return 'Course Management'
  if (pathname === '/admin/instructor-management') return 'Instructor Management'
  if (pathname === '/admin/student-management') return 'Student Management'

  if (pathname === '/admin/weekly-tests') return 'Weekly Tests'
  if (pathname === '/admin/payments-coupons') return 'Payments & Coupons'
  if (pathname === '/admin/live-classes') return 'Live Classes'
  if (pathname === '/admin/e-library') return 'E-Library'
  if (pathname === '/admin/subscription') return 'Subscriptions'
  if (pathname === '/admin/analytics') return 'Analytics'
  if (pathname === '/admin/notifications') return 'Notifications'
  if (pathname === '/admin/profile') return 'Admin Profile'

  // Instructor routes
  if (pathname === '/instructor') return 'Dashboard Overview'
  if (pathname === '/instructor/my-courses') return 'My Courses'
  if (pathname === '/instructor/online-classes') return 'Online Classes'
  if (pathname === '/instructor/weekly-tests') return 'Weekly Tests'
  if (pathname === '/instructor/school-events') return 'School Events'
  if (pathname === '/instructor/student-insights') return 'Student Insights'
  if (pathname === '/instructor/analytics') return 'Analytics'
  if (pathname === '/instructor/notifications') return 'Notifications'
  if (pathname === '/instructor/profile') return 'Instructor Profile'

  // Student routes
  if (pathname === '/student-panel' || pathname === '/student-panel/dashboard') return 'Dashboard Overview'
  if (pathname === '/student-panel/profile') return 'Student Profile'
  if (pathname === '/student-panel/continue-learning') return 'Continue Learning'
  if (pathname === '/student-panel/my-courses') return 'My Courses'
  if (pathname === '/student-panel/progress-overview') return 'Progress Overview'
  if (pathname === '/student-panel/browse-courses') return 'Browse Courses'
  if (pathname === '/student-panel/e-library') return 'E-Library'
  if (pathname === '/student-panel/live-classes') return 'Live Classes'
  if (pathname === '/student-panel/school-events') return 'School Events'
  if (pathname === '/student-panel/certificates') return 'Certificates'
  if (pathname === '/student-panel/notifications') return 'Notifications'

  // Default fallback
  return 'Dashboard'
}

const roleLabelMap = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  sub_admin: 'Sub Admin',
  instructor: 'Instructor',
  student: 'Student',
}

const panelLabelMap = {
  super_admin: 'Super Admin Panel',
  admin: 'Admin Panel',
  sub_admin: 'Admin Panel',
  instructor: 'Instructor Panel',
  student: 'Student Panel',
}

const getRoleFromPath = (pathname) => {
  if (pathname.includes('/superadmin')) return 'super_admin'
  if (pathname.includes('/admin')) return 'admin'
  if (pathname.includes('/instructor')) return 'instructor'
  if (pathname.includes('/student-panel') || pathname.includes('/student')) return 'student'
  return ''
}

const formatRole = (role) => roleLabelMap[role] || role || 'User'
const formatPanelLabel = (role, fallback = 'LMS') => panelLabelMap[role] || fallback

function getCachedUser() {
  try {
    const raw = localStorage.getItem('lms_user')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

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
    role: user.role || '',
    tenant_id: user.tenant_id || '',
    profile_image_url: image,
    avatar_url: image,
    image_url: image,
  }
}

export default function HeaderPanel({ onMenuToggle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(() => getCachedUser())
  const [unreadCount, setUnreadCount] = useState(0)

  const routeRole = getRoleFromPath(location.pathname)
  const storedRole = localStorage.getItem('lms_role') || ''
  const resolvedRole = currentUser?.role || storedRole || routeRole
  const tenantId = localStorage.getItem('lms_tenant_id') || ''
  const currentUserId = String(currentUser?._id || currentUser?.sub || '').trim()

  const panelLabel = formatPanelLabel(resolvedRole)
  const userName = currentUser?.full_name || currentUser?.email || 'User'
  const userRole = formatRole(resolvedRole)
  const placeholderText =
    resolvedRole === 'super_admin'
      ? 'Search tenants, reports, or plans'
      : resolvedRole === 'instructor'
        ? 'Search courses, students, or materials'
        : resolvedRole === 'student'
          ? 'Search modules, tests...'
          : 'Search students, courses, or classes'

  // Get the current page title
  const pageTitle = getPageTitle(location.pathname)

  let profilePath = '/profile'
  let notificationPath = ''
  if (resolvedRole === 'super_admin') {
    profilePath = '/superadmin/profile'
    notificationPath = '/superadmin/notifications'
  } else if (resolvedRole === 'admin' || resolvedRole === 'sub_admin') {
    profilePath = '/admin/profile'
    notificationPath = '/admin/notifications'
  } else if (resolvedRole === 'instructor') {
    profilePath = '/instructor/profile'
    notificationPath = '/instructor/notifications'
  } else if (resolvedRole === 'student') {
    profilePath = '/student-panel/profile'
    notificationPath = '/student-panel/notifications'
  }

  const loadUnreadCount = () =>
    api('/lms/notifications?skip=0&limit=200')
      .then((res) => {
        const items = res?.items || []
        const unread = items.reduce((count, item) => count + (item?.read ? 0 : 1), 0)
        setUnreadCount(unread)
      })
      .catch(() => {
        setUnreadCount(0)
      })

  useEffect(() => {
    let isMounted = true

    const loadCurrentUser = async () => {
      try {
        const data = await api('/auth/me')
        if (isMounted) {
          setCurrentUser(data)
          const compact = sanitizeUserForStorage(data)
          if (compact) {
            try {
              localStorage.setItem('lms_user', JSON.stringify(compact))
            } catch {
              // Ignore storage errors; UI still has live data.
            }
          }
        }
      } catch {
        if (isMounted) setCurrentUser(getCachedUser())
      }
    }

    if (localStorage.getItem('lms_token')) {
      loadCurrentUser()
      loadUnreadCount()
    } else {
      setUnreadCount(0)
    }

    return () => {
      isMounted = false
    }
  }, [location.pathname])

  const notificationRoom =
    resolvedRole === 'admin' || resolvedRole === 'sub_admin' || resolvedRole === 'super_admin'
      ? (tenantId ? `tenant:${tenantId}` : '')
      : (currentUserId ? `user:${currentUserId}` : '')

  useRealtime(notificationRoom, (payload) => {
    const eventType = String(payload?.type || '').toLowerCase()
    if (!eventType || eventType.includes('notification')) {
      loadUnreadCount()
    }
  })

  return (
    <header className="flex min-h-[72px] items-center justify-between border-b border-black/[0.08] bg-white px-4 py-3 sm:px-6 lg:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/[0.08] bg-white text-[#0f172a] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative min-w-0 shrink">
          <div className="flex h-[16px] flex-col justify-center text-[11px] font-medium leading-[0] text-[#94a3b8] sm:text-[13px]">
            {panelLabel}
          </div>
          <div className="line-clamp-1 flex h-[29px] flex-col justify-center text-[18px] font-bold leading-[0] text-[#0f172a] sm:text-[22px] lg:text-[24px]">
            {pageTitle}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => notificationPath && navigate(notificationPath)}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center gap-[8px] rounded-[6px] border border-black/[0.08] bg-white px-[10px] py-[0.25px]"
          disabled={!notificationPath}
        >
          <Bell className="h-[18px] w-[18px] text-[#0f172a]" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#ef4444] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          ) : null}
        </button>

        <button
          onClick={() => navigate(profilePath)}
          className="flex items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-2.5 py-2 transition-colors hover:bg-[#f8fafc] sm:gap-3 sm:px-[11px] sm:py-[9px]"
        >
          <Avatar src={currentUser?.profile_image_url || currentUser?.avatar_url || currentUser?.image_url || ''} alt={userName} name={currentUser?.full_name || currentUser?.email || ''} />
          <div className="hidden items-start gap-[0.01px] sm:flex sm:flex-col">
            <div className="flex flex-col font-semibold h-[17px] justify-center leading-[0] text-[#0f172a] text-[14px]">
              {userName}
            </div>
            <div className="flex flex-col font-normal h-[15px] justify-center leading-[0] text-[#94a3b8] text-[13px]">
              {userRole}
            </div>
          </div>
        </button>
      </div>
    </header>
  )
}