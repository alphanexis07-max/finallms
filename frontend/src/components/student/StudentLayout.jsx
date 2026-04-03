import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Video,
  BarChart3,
  Layers,
  Trophy,
  User,
} from 'lucide-react'
import HeaderPanel from '../HeaderPanel'

const nav = [
  { to: '/student-panel', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/student-panel/continue-learning', label: 'Continue Learning', icon: Video },
  { to: '/student-panel/my-courses', label: 'My Courses', icon: BookOpen },
  { to: '/student-panel/browse-courses', label: 'Browse Courses', icon: BarChart3 },
  { to: '/student-panel/e-library', label: 'E-Library', icon: GraduationCap },
  { to: '/student-panel/live-classes', label: 'Live Classes', icon: Users },
  { to: '/student-panel/certificates', label: 'Certificates', icon: Trophy },
]

export default function StudentLayout() {
  const location = useLocation()
  const showProfileNav = location.pathname === '/student-panel/profile'

  return (
    <div className="flex h-screen w-full min-w-0 overflow-x-hidden bg-[#f6f8fa] text-[#0f172a]">
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-black/[0.08] bg-white">
        <div className="flex items-center gap-3 px-[18px] pt-4 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#ede7ff]">
            <Layers className="h-5 w-5 text-[#5b3df6]" strokeWidth={2} />
          </div>
          <div>
            <div className="text-xl font-bold leading-[22px]">LMS</div>
            <div className="text-[13px] text-[#94a3b8]">Student Panel</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-[18px]">
          <div className="px-2.5 pb-1.5 text-xs font-semibold text-[#94a3b8]">Overview</div>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
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
              to="/student-panel/profile"
              className={({ isActive }) =>
                `flex items-center gap-[2px] rounded-md px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                  isActive ? 'bg-[#ede7ff] text-[#5b3df6]' : 'text-[#0f172a] hover:bg-slate-100'
                }`
              }
            >
              <User className="h-5 w-5 shrink-0 pr-1" strokeWidth={2} />
              Profile
            </NavLink>
          ) : null}
        </nav>

        <div className="px-[18px] pb-3 pt-3">
          <div className="rounded-lg border border-black/[0.08] bg-[#e8f5ff] p-[12px]">
            <div className="text-[12px] font-semibold text-[#0f172a]">Learning streak</div>
            <p className="mt-1 text-[12px] leading-snug text-[#94a3b8]">
              Keep consistency and finish your weekly goals
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-xl bg-[#f0f4f8]">
              <div className="h-full w-[76%] rounded-xl bg-[#5b3df6]" />
            </div>
            <p className="mt-2 text-[12px] text-[#94a3b8]">12 days active in a row</p>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <HeaderPanel />
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}