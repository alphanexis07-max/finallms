import {
  Search,
  Bell,
  Mail,
  Phone,
  Shield,
  Flame,
  Award,
  Target,
  PlayCircle,
  Video,
  CheckCircle,
  KeyRound,
  History,
} from 'lucide-react'

const AVATAR =
  'https://www.figma.com/api/mcp/asset/cac9530e-475b-4f0c-b716-69a17ab9bc2f'

function InfoBox({ label, value }) {
  return (
    <div className="rounded-[10px] bg-[#f3f4f6] px-3 py-2.5">
      <p className="text-[11px] font-medium text-[#94a3b8]">{label}</p>
      <p className="mt-0.5 text-[13px] font-semibold text-[#0f172a]">{value}</p>
    </div>
  )
}

function DetailField({ label, value }) {
  return (
    <div className="rounded-[10px] bg-[#f3f4f6] px-3 py-2.5">
      <p className="text-[11px] font-medium text-[#94a3b8]">{label}</p>
      <p className="mt-0.5 text-[13px] font-semibold text-[#0f172a]">{value}</p>
    </div>
  )
}

export default function StudentProfile() {
  return (
    <div className="min-h-full bg-[#f3f4f6]">
      <div className="p-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left: profile summary */}
          <aside className="w-full shrink-0 rounded-[12px] bg-white p-6 shadow-sm lg:w-[300px]">
            <div className="flex flex-col items-center text-center">
              <img
                src={AVATAR}
                alt="Aarohi Shah"
                className="h-[100px] w-[100px] rounded-full object-cover ring-4 ring-[#f3f4f6]"
              />
              <h2 className="mt-4 text-[22px] font-bold text-[#0f172a]">Aarohi Shah</h2>
              <p className="mt-1 text-[13px] text-[#64748b]">Product Design Learner</p>
              <span className="mt-3 inline-flex rounded-full bg-[#2dd4bf]/25 px-3 py-1 text-[11px] font-semibold text-[#047857]">
                Prime learner
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                { label: 'Courses', value: '12' },
                { label: 'Hours', value: '148' },
                { label: 'Badges', value: '9' },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-[8px] bg-[#f3f4f6] px-2 py-2.5 text-center">
                  <p className="text-[10px] font-medium text-[#94a3b8]">{label}</p>
                  <p className="mt-0.5 text-[18px] font-bold text-[#0f172a]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              <InfoBox label="Email" value="aarohi.shah@example.com" />
              <InfoBox label="Phone" value="+91 98765 43210" />
              <InfoBox label="Joined" value="12 January 2024" />
            </div>

            <div className="mt-6 space-y-2">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-black/[0.1] bg-white py-2.5 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc]"
              >
                <Shield className="h-4 w-4 text-[#64748b]" />
                Account security
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-black/[0.1] bg-white py-2.5 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc]"
              >
                <KeyRound className="h-4 w-4 text-[#64748b]" />
                Change password
              </button>
            </div>
          </aside>

          {/* Right: main content */}
          <div className="min-w-0 flex-1 space-y-6">
            <section className="rounded-[12px] bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a]">Personal details</h3>
                  <p className="mt-1 text-[13px] text-[#94a3b8]">
                    Information shown on your profile and certificates.
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc]"
                >
                  Update details
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailField label="Full name" value="Aarohi Shah" />
                <DetailField label="Display name" value="Aarohi" />
                <DetailField label="Email address" value="aarohi.shah@example.com" />
                <DetailField label="Phone number" value="+91 98765 43210" />
                <DetailField label="Location" value="Mumbai, India" />
                <DetailField label="Preferred language" value="English" />
              </div>
            </section>

            <section className="rounded-[12px] bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a]">Learning achievements</h3>
                  <p className="mt-1 text-[13px] text-[#94a3b8]">
                    Highlights from your learning journey on the platform.
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc]"
                >
                  View certificates
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                  {
                    icon: Flame,
                    title: '18 day streak',
                    desc: 'Keep steady habits with daily lessons and short revision blocks.',
                    iconBg: 'bg-orange-100 text-orange-600',
                  },
                  {
                    icon: Award,
                    title: '5 certificates earned',
                    desc: 'Download verified certificates from your completed programs anytime.',
                    iconBg: 'bg-violet-100 text-violet-600',
                  },
                  {
                    icon: Target,
                    title: '92% average quiz score',
                    desc: 'Strong accuracy across modules—great for tracking mastery over time.',
                    iconBg: 'bg-emerald-100 text-emerald-600',
                  },
                ].map(({ icon: Icon, title, desc, iconBg }) => (
                  <div key={title} className="rounded-[10px] bg-[#f3f4f6] p-4">
                    <div className={`mb-3 inline-flex rounded-lg p-2 ${iconBg}`}>
                      <Icon className="h-5 w-5" />
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
                  <p className="mt-1 text-[13px] text-[#94a3b8]">
                    Latest learner events tied to your course progress, classes, and account status.
                  </p>
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
                {[
                  {
                    icon: PlayCircle,
                    title: 'Resumed Product Thinking Fundamentals',
                    sub: 'Continued from lesson 8 at 24:16 with auto resume enabled',
                    tag: '2h ago',
                    tagClass: 'bg-[#f1f5f9] text-[#64748b]',
                  },
                  {
                    icon: Video,
                    title: 'Joined live class on UX research interviews',
                    sub: 'Attendance marked successfully and notes were added to your library',
                    tag: 'Yesterday',
                    tagClass: 'bg-[#f1f5f9] text-[#64748b]',
                  },
                  {
                    icon: CheckCircle,
                    title: 'Certificate unlocked for Design Systems Basics',
                    sub: 'Completion verified and certificate is ready to download',
                    tag: 'Completed',
                    tagClass: 'bg-[#2dd4bf]/25 text-[#047857]',
                  },
                ].map(({ icon: Icon, title, sub, tag, tagClass }) => (
                  <div key={title} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#e8f5ff] text-[#5b3df6]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-[#0f172a]">{title}</p>
                      <p className="mt-1 text-[12px] text-[#94a3b8]">{sub}</p>
                    </div>
                    <span className={`shrink-0 self-start rounded-full px-2.5 py-0.5 text-[11px] font-medium ${tagClass}`}>
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[12px] bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a]">Membership & account</h3>
                  <p className="mt-1 text-[13px] text-[#94a3b8]">
                    Subscription details and learner access settings connected to your profile.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-[8px] border border-black/[0.1] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f172a] shadow-sm hover:bg-[#f8fafc]"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <KeyRound className="h-4 w-4" />
                      Change password
                    </span>
                  </button>
                  <button
                    type="button"
                    className="rounded-[8px] bg-[#5b3df6] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#4a2ed8]"
                  >
                    Manage plan
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailField label="Current plan" value="Prime learner monthly" />
                <DetailField label="Billing cycle" value="Renews on 12 August 2025" />
                <DetailField label="Library benefits" value="Read-only access + 2 downloads" />
                <DetailField label="Security" value="Two-step verification enabled" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
