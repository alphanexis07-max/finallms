import React from 'react'

export default function SuperAdminProfile() {
  return (
    <div className="min-h-full bg-[#F7FAFD] p-4 sm:p-6 lg:p-7">
      <section className="rounded-[8px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] p-5 sm:p-6">
        <h2 className="text-[26px] font-bold text-[#0f172a] sm:text-[30px]">Super Admin Profile</h2>
        <p className="mt-2 text-[14px] text-[#64748b]">
          Manage super admin identity, account preferences, and platform-level access settings.
        </p>
      </section>

      <section className="mt-6 rounded-[8px] border border-black/[0.08] bg-white p-5 sm:p-6">
        <h3 className="text-[18px] font-bold text-[#0f172a]">Account details</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[13px] font-semibold text-[#0f172a]">Full name</label>
            <input
              defaultValue="Platform Admin"
              className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-semibold text-[#0f172a]">Email</label>
            <input
              defaultValue="superadmin@lms.com"
              className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px]"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
