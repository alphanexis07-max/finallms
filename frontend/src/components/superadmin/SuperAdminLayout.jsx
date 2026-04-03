import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Shield,
  LayoutDashboard,
  Building2,
  DollarSign,
  Users,
  FileText,
  CreditCard,
  Settings,
  User,
} from 'lucide-react'
import HeaderPanel from '../../components/HeaderPanel'

const links = [
  { to: '/superadmin', label: 'Overview', end: true, icon: LayoutDashboard },
  { to: '/superadmin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/superadmin/tenant-management', label: 'Tenant Management', icon: Building2 },
  { to: '/superadmin/revenue', label: 'Revenue', icon: DollarSign },
  { to: '/superadmin/user-management', label: 'User Management', icon: Users },
  { to: '/superadmin/reports', label: 'Reports', icon: FileText },
  { to: '/superadmin/plans-billing', label: 'Plans & Billing', icon: CreditCard },
  { to: '/superadmin/platform-settings', label: 'Platform Settings', icon: Settings },
]

export default function SuperAdminLayout() {
  const location = useLocation()
  const showProfileNav = location.pathname === '/superadmin/profile'

  return (
    <div className="flex h-screen min-w-[1280px] bg-[#f6f8fa] text-[#0f172a]">
      <aside className="flex w-[240px] shrink-0 flex-col border-r border-black/[0.08] bg-white">
        <div className="flex items-center gap-3 px-[18px] pt-4 pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#ede7ff]">
            <Shield className="h-5 w-5 text-[#5b3df6]" strokeWidth={2} />
          </div>
          <div>
            <div className="text-xl font-bold leading-[22px]">LMS</div>
            <div className="text-[13px] text-[#94a3b8]">Super Admin</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-[18px]">
          <div className="px-2.5 pb-1 text-xs font-semibold text-[#94a3b8]">Overview</div>
          {links.slice(0, 1).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-[2px] rounded-md px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#ede7ff] text-[#5b3df6]'
                    : 'text-[#0f172a] hover:bg-slate-100'
                }`
              }
            >
              <link.icon className="h-5 w-5 shrink-0 pr-1" strokeWidth={2} />
              {link.label}
            </NavLink>
          ))}

          <div className="px-2.5 pb-1 pt-2 text-xs font-semibold text-[#94a3b8]">Management</div>
          {links.slice(1, 6).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-[2px] rounded-md px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#ede7ff] text-[#5b3df6]'
                    : 'text-[#0f172a] hover:bg-slate-100'
                }`
              }
            >
              <link.icon className="h-5 w-5 shrink-0 pr-1" strokeWidth={2} />
              {link.label}
            </NavLink>
          ))}

          <div className="px-2.5 pb-1 pt-2 text-xs font-semibold text-[#94a3b8]">System</div>
          {links.slice(6).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-[1.5px] rounded-md px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#ede7ff] text-[#5b3df6]'
                    : 'text-[#0f172a] hover:bg-slate-100'
                }`
              }
            >
              <link.icon className="h-5 w-5 shrink-0 pr-1" strokeWidth={2} />
              {link.label}
            </NavLink>
          ))}
          {showProfileNav ? (
            <NavLink
              to="/superadmin/profile"
              className={({ isActive }) =>
                `flex items-center gap-[1.5px] rounded-md px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
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
            <div className="text-[12px] font-semibold text-[#0f172a]">Platform Overview</div>
            <p className="mt-1 text-[12px] leading-snug text-[#94a3b8]">
              Total active tenants and revenue
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-xl bg-[#f0f4f8]">
              <div className="h-full w-[82%] rounded-xl bg-[#5b3df6]" />
            </div>
            <p className="mt-2 text-[12px] text-[#94a3b8]">82% of quarterly target achieved</p>
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