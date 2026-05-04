import React, { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Wallet,
  Video,
  BarChart3,
  Layers,
  Calendar,
  Library,
  BadgePercent,
  FileText,
  Newspaper,
  LogOut,
} from 'lucide-react'
import HeaderPanel from '../../components/HeaderPanel'

const nav = [
  { to: '/admin', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/admin/course-management', label: 'Course Management', icon: BookOpen },
  { to: '/admin/instructor-management', label: 'Instructor Management', icon: Users },
  { to: '/admin/student-management', label: 'Student Management', icon: GraduationCap },

  { to: '/admin/school-events', label: 'School Events', icon: Calendar },
  { to: '/admin/payments-coupons', label: 'Payments & Coupons', icon: Wallet },
  { to: '/admin/live-classes', label: 'Live Classes', icon: Video },
  { to: '/admin/e-library', label: 'E-Library', icon: Library },
  { to: '/admin/subscription', label: 'Subscriptions', icon: BadgePercent },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/weekly-tests', label: 'Weekly Tests', icon: FileText },
  { to: '/admin/blogs', label: 'Blogs', icon: Newspaper },
  { to: '/admin/inquire', label: 'Inquire', icon: Users },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const showProfileNav = location.pathname === '/admin/profile'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('lms_token')
    localStorage.removeItem('lms_user')
    navigate('/login')
  }

  return (
    <div className="flex h-screen w-full min-w-0 overflow-hidden bg-[#f6f8fa] text-[#0f172a]">
      {isSidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] shrink-0 flex-col border-r border-black/[0.08] bg-white transition-transform duration-200 lg:static lg:z-auto lg:w-[240px] lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-[18px] pt-4 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <div className="text-xl font-bold leading-[22px]">LMS</div>
            <div className="text-[13px] text-[#94a3b8]">Institute Admin</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-[18px]">
          <div className="px-2.5 pb-1.5 text-xs font-semibold text-[#94a3b8]">Overview</div>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-[2px] rounded-md px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#ede7ff] text-[#5b3df6]'
                    : 'text-[#0f172a] hover:bg-slate-100'
                }`
              }
            >
              <item.icon className="h-5 w-5 shrink-0 pr-1" strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
          {showProfileNav ? (
            <NavLink
              to="/admin/profile"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-[2px] rounded-md px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                  isActive ? 'bg-[#ede7ff] text-[#5b3df6]' : 'text-[#0f172a] hover:bg-slate-100'
                }`
              }
            >
              <Users className="h-5 w-5 shrink-0 pr-1" strokeWidth={2} />
              Profile
            </NavLink>
          ) : null}
        </nav>

        <div className="px-[18px] pb-3 pt-3">
          <div className="rounded-lg border border-black/[0.08] bg-[#e8f5ff] p-[12px]">
            <div className="text-[12px] font-semibold text-[#0f172a]">Institute growth</div>
            <p className="mt-1 text-[12px] leading-snug text-[#94a3b8]">
              Enrollment target progress for this month
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-xl bg-[#f0f4f8]">
              <div className="h-full w-[76%] rounded-xl bg-[#5b3df6]" />
            </div>
            <p className="mt-2 text-[12px] text-[#94a3b8]">76% of monthly goal achieved</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full h-10 flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 text-[13px] font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <HeaderPanel onMenuToggle={() => setIsSidebarOpen(true)} />
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
