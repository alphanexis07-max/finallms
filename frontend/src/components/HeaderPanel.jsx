import React from 'react'
import { Search, Bell } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const AVATAR = 'https://www.figma.com/api/mcp/asset/cac9530e-475b-4f0c-b716-69a17ab9bc2f'

function Avatar({ src, alt = '', className = '' }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`h-[36px] w-[36px] rounded-[6px] object-cover ${className}`}
    />
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
  if (pathname === '/superadmin/profile') return 'Super Admin Profile'

  // Admin routes
  if (pathname === '/admin') return 'Dashboard Overview'
  if (pathname === '/admin/course-management') return 'Course Management'
  if (pathname === '/admin/instructor-management') return 'Instructor Management'
  if (pathname === '/admin/student-management') return 'Student Management'
  if (pathname === '/admin/payments-coupons') return 'Payments & Coupons'
  if (pathname === '/admin/live-classes') return 'Live Classes'
  if (pathname === '/admin/e-library') return 'E-Library'
  if (pathname === '/admin/subscription') return 'Subscriptions'
  if (pathname === '/admin/analytics') return 'Analytics'
  if (pathname === '/admin/notification') return 'Notifications'
  if (pathname === '/admin/profile') return 'Admin Profile'

  // Instructor routes
  if (pathname === '/instructor') return 'Dashboard Overview'
  if (pathname === '/instructor/my-courses') return 'My Courses'
  if (pathname === '/instructor/online-classes') return 'Online Classes'
  if (pathname === '/instructor/weekly-tests') return 'Weekly Tests'
  if (pathname === '/instructor/school-events') return 'School Events'
  if (pathname === '/instructor/student-insights') return 'Student Insights'
  if (pathname === '/instructor/analytics') return 'Analytics'
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
  if (pathname === '/student-panel/certificates') return 'Certificates'

  // Default fallback
  return 'Dashboard'
}

export default function HeaderPanel() {
  const location = useLocation()
  const navigate = useNavigate()

  // Determine which panel we're in based on the route
  const isSuperAdmin = location.pathname.includes('/superadmin')
  const isAdmin = location.pathname.includes('/admin')
  const isInstructor = location.pathname.includes('/instructor')
  const isStudent = location.pathname.includes('/student-panel') || location.pathname.includes('/student')

  // Set dynamic content based on panel type
  let panelLabel = "LMS"
  let userName = "Rahul Mehta"
  let userRole = "Institute Owner"
  let placeholderText = "Search students, courses, or classes"

  if (isSuperAdmin) {
    panelLabel = "Super Admin Panel"
    userName = "Platform Admin"
    userRole = "Super Admin"
    placeholderText = "Search tenants, reports, or plans"
  } else if (isAdmin) {
    panelLabel = "Admin Panel"
    userName = "Rahul Mehta"
    userRole = "Institute Owner"
    placeholderText = "Search students, courses, or classes"
  } else if (isInstructor) {
    panelLabel = "Instructor Panel"
    userName = "Aisha Verma"
    userRole = "Lead Instructor"
    placeholderText = "Search courses, students, or materials"
  } else if (isStudent) {
    panelLabel = "Student Panel"
    userName = "Aarohi Shah"
    userRole = "Learner"
    placeholderText = "Search modules, tests..."
  }

  // Get the current page title
  const pageTitle = getPageTitle(location.pathname)

  let profilePath = '/profile'
  if (isSuperAdmin) profilePath = '/superadmin/profile'
  else if (isAdmin) profilePath = '/admin/profile'
  else if (isInstructor) profilePath = '/instructor/profile'
  else if (isStudent) profilePath = '/student-panel/profile'

  return (
    <header className="flex h-[76px] items-center justify-between border-b border-black/[0.08] bg-white px-[28px]">
      <div className="relative shrink-0">
        <div className="flex flex-col font-medium h-[16px] justify-center leading-[0] text-[#94a3b8] text-[13px]">
          {panelLabel}
        </div>
        <div className="flex flex-col font-bold h-[29px] justify-center leading-[0] text-[#0f172a] text-[24px]">
          {pageTitle}
        </div>
      </div>

      <div className="flex items-center gap-[12px]">
        <div className="bg-white border border-black/[0.08] flex items-center gap-[10px] h-[40px] min-w-[280px] px-[15px] py-[0.25px] relative rounded-[6px]">
          <Search className="h-[18px] w-[18px] text-[#94a3b8]" />
          <input
            className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none"
            placeholder={placeholderText}
          />
        </div>

        <button
          onClick={() => navigate(isAdmin ? '/admin/notification' : '/notification')}
          className="bg-white border border-black/[0.08] flex items-center gap-[8px] h-[40px] justify-center px-[10px] py-[0.25px] rounded-[6px] shrink-0"
        >
          <Bell className="h-[18px] w-[18px] text-[#0f172a]" />
        </button>

        <button
          onClick={() => navigate(profilePath)}
          className="bg-white border border-black/[0.08] flex items-center gap-[12px] px-[11px] py-[9px] rounded-[6px] hover:bg-[#f8fafc] transition-colors"
        >
          <Avatar src={AVATAR} alt={userName} />
          <div className="flex flex-col gap-[0.01px] items-start">
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
