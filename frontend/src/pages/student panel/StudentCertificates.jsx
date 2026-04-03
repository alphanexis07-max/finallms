import React, { useState } from 'react'
import { Search, Bell, Download, Award, Share2, Copy, Link, Clock, CheckCircle, Globe, Users, GraduationCap, Wallet, BarChart3, Upload, Plus } from 'lucide-react'

const AVATAR = 'https://www.figma.com/api/mcp/asset/5b24609b-97ad-4bea-af20-b4f4df404b75'

const certs = [
  {
    type: 'Certificate of Completion',
    status: 'Issued',
    statusColor: 'bg-[#2dd4bf] text-[#023b33]',
    awardedTo: 'Aarohi Shah',
    program: 'UI/UX Masterclass',
    title: 'UI/UX Masterclass',
    id: 'UX-2024-1189',
    issued: 'Issued Feb 12, 2024',
    pending: false,
  },
  {
    type: 'Certificate of Completion',
    status: 'Issued',
    statusColor: 'bg-[#2dd4bf] text-[#023b33]',
    awardedTo: 'Aarohi Shah',
    program: 'Designing for Accessibility',
    title: 'Designing for Accessibility',
    id: 'AX-2024-0741',
    issued: 'Issued Jan 08, 2024',
    pending: false,
  },
  {
    type: 'Certificate pending',
    status: 'Pending',
    statusColor: 'bg-[#ffd966] text-[#4b2e00]',
    awardedTo: null,
    program: 'Product Strategy Bootcamp',
    title: 'Product Strategy Bootcamp',
    id: null,
    issued: 'Completion approved • ETA 2 days',
    pending: true,
    pendingNote: 'Awaiting final review',
  },
  {
    type: 'Certificate of Completion',
    status: 'Issued',
    statusColor: 'bg-[#2dd4bf] text-[#023b33]',
    awardedTo: 'Aarohi Shah',
    program: 'Frontend Foundations',
    title: 'Frontend Foundations',
    id: 'FE-2023-4217',
    issued: 'Issued Nov 18, 2023',
    pending: false,
  },
]

const activity = [
  { icon: <Download className="h-3.5 w-3.5 text-[#5b3df6]" />, bg: 'bg-[#e8f5ff]', text: 'UI/UX Masterclass downloaded', sub: 'Today, 10:18 AM' },
  { icon: <Share2 className="h-3.5 w-3.5 text-[#5b3df6]" />, bg: 'bg-[#e8f5ff]', text: 'Accessibility certificate shared', sub: 'Yesterday, 7:42 PM' },
  { icon: <Clock className="h-3.5 w-3.5 text-[#94a3b8]" />, bg: 'bg-[#f1f5f9]', text: 'Product Strategy Bootcamp pending', sub: 'Expected within 48 hours' },
]

function Pill({ children, variant }) {
  const style =
    variant === 'success'
      ? 'bg-[#2dd4bf] text-[#023b33]'
      : variant === 'warning'
        ? 'bg-[#ffd966] text-[#4b2e00]'
        : variant === 'primary'
          ? 'bg-[#5b3df6] text-white'
          : 'bg-[#e8f5ff] text-[#0f172a]'

  return <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${style}`}>{children}</span>
}

export default function StudentCertificates() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? certs
    : filter === 'Downloaded' ? certs.filter(c => !c.pending)
    : certs.filter(c => c.pending)

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="bg-gradient-to-b flex flex-col from-[#f6f8fa] gap-[24px] h-full p-[28px] to-[#f7fcff]">
        {/* Top 3-column row */}
        <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-3">
          {/* Your verified achievements */}
          <div className="border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px] bg-gradient-to-br from-white to-[#e8f5ff]">
            <div className="flex items-start justify-between w-full">
              <div className="bg-[#ffd966] inline-flex items-center px-[10px] py-[6.5px] rounded-[12px]">
                <Award className="h-[14px] w-[14px] mr-[6px] text-[#4b2e00]" />
                <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[#4b2e00] text-[12px]">
                  Certificates
                </div>
              </div>
              <button className="bg-[#5b3df6] flex items-center gap-[8px] h-[36px] justify-center px-[14px] rounded-[6px]">
                <Share2 className="h-[14px] w-[14px] text-white" />
                <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-white text-[12px]">
                  Share Profile
                </div>
              </button>
            </div>
            <h2 className="font-bold text-[20px] text-[#0f172a]">Your verified achievements</h2>
            <p className="text-[13px] text-[#94a3b8]">
              Access, download, and share course completion certificates issued across your enrolled programs.
            </p>
            <div className="grid grid-cols-3 gap-[16px] w-full">
              {[['Issued certificates', '12'], ['Ready to download', '9'], ['In review', '3']].map(([label, val]) => (
                <div key={label} className="bg-white rounded-[8px] p-[14px] border border-black/[0.08]">
                  <p className="text-[11px] text-[#94a3b8] leading-tight">{label}</p>
                  <p className="mt-[4px] text-[28px] font-bold text-[#0f172a]">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verification */}
          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
            <div className="flex items-center justify-between w-full">
              <h3 className="font-bold text-[18px] text-[#0f172a]">Verification</h3>
              <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[6px] border border-black/[0.08] bg-[#f8fafc]">
                <CheckCircle className="h-[18px] w-[18px] text-[#5b3df6]" />
              </div>
            </div>
            <p className="text-[12px] font-medium text-[#94a3b8]">Public certificate URL</p>
            <div className="flex items-center gap-[8px] w-full rounded-[6px] border border-black/[0.08] bg-[#f8fafc] px-[12px] py-[10px]">
              <Globe className="h-[14px] w-[14px] text-[#94a3b8]" />
              <span className="flex-1 truncate text-[12px] text-[#0f172a]">lms.app/certificates/aarohi-shah</span>
              <Copy className="h-[14px] w-[14px] text-[#94a3b8] cursor-pointer hover:text-[#5b3df6]" />
            </div>
            <div className="flex gap-[12px] w-full">
              <button className="flex-1 bg-[#5b3df6] flex items-center justify-center h-[40px] rounded-[6px]">
                <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-white text-[14px]">Copy Link</div>
              </button>
              <button className="flex-1 border border-black/[0.08] flex items-center justify-center h-[40px] rounded-[6px] bg-white">
                <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[14px]">Manage</div>
              </button>
            </div>
          </div>

          {/* Certificate status */}
          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
            <h3 className="font-bold text-[18px] text-[#0f172a]">Certificate status</h3>
            <div className="w-full">
              <div className="flex items-center justify-between text-[13px] mb-[8px]">
                <span className="font-medium text-[#0f172a]">Profile completion</span>
                <span className="font-bold text-[#5b3df6]">86%</span>
              </div>
              <div className="h-[6px] w-full rounded-full bg-[#f1f5f9]">
                <div className="h-[6px] rounded-full bg-[#5b3df6]" style={{ width: '86%' }} />
              </div>
              <p className="mt-[12px] text-[12px] text-[#94a3b8]">Add a public bio to unlock sharing on all certificate pages.</p>
            </div>
            <div className="flex flex-col w-full gap-[12px]">
              {[
                { label: 'Ready for download', sub: '9 certificates', badge: 'Ready', badgeClass: 'bg-[#2dd4bf] text-[#023b33]' },
                { label: 'Pending review', sub: '3 certificates', badge: 'Review', badgeClass: 'bg-[#ffd966] text-[#4b2e00]' },
                { label: 'Shared publicly', sub: '4 certificates', badge: 'Live', badgeClass: 'bg-[#e8f5ff] text-[#5b3df6]' },
              ].map(({ label, sub, badge, badgeClass }) => (
                <div key={label} className="flex items-center justify-between pt-[12px] border-t border-black/[0.08]">
                  <div>
                    <p className="font-semibold text-[13px] text-[#0f172a]">{label}</p>
                    <p className="text-[11px] text-[#94a3b8] mt-[2px]">{sub}</p>
                  </div>
                  <span className={`inline-flex h-[26px] items-center px-[10px] rounded-[10px] text-[11px] font-medium ${badgeClass}`}>{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: certs + activity */}
        <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-[16px]">
            {/* Section header + filters */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[20px] text-[#0f172a]">Recent certificates</h2>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Issued this year across completed programs</p>
              </div>
              <div className="flex gap-[8px]">
                {['All', 'Downloaded', 'Pending'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`inline-flex h-[36px] items-center px-[14px] rounded-[12px] text-[12px] font-medium transition-colors ${
                      filter === f ? 'bg-[#5b3df6] text-white' : 'bg-[#f1f5f9] text-[#0f172a] hover:bg-[#e8f5ff]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Certificate cards grid */}
            <div className="grid grid-cols-2 gap-[24px]">
              {filtered.map((cert) => (
                <article key={cert.title} className="bg-white border border-black/[0.08] border-solid rounded-[8px] overflow-hidden">
                  {/* Card top */}
                  <div className="flex items-center justify-between px-[20px] pt-[16px] pb-[12px]">
                    <div>
                      <p className={`text-[11px] font-semibold ${cert.pending ? 'text-[#ffd966]' : 'text-[#5b3df6]'}`}>{cert.type}</p>
                      {cert.awardedTo && (
                        <>
                          <p className="mt-[4px] text-[10px] text-[#94a3b8]">Awarded to</p>
                          <p className="text-[14px] font-bold text-[#0f172a]">{cert.awardedTo}</p>
                        </>
                      )}
                      {cert.pending && <p className="mt-[8px] text-[11px] text-[#94a3b8]">Program</p>}
                    </div>
                    <div className={`flex h-[40px] w-[40px] items-center justify-center rounded-[8px] ${cert.pending ? 'bg-[#ffd966] bg-opacity-20' : 'bg-[#e8f5ff]'}`}>
                      {cert.pending
                        ? <Clock className="h-[18px] w-[18px] text-[#ffd966]" />
                        : <Award className="h-[18px] w-[18px] text-[#5b3df6]" />
                      }
                    </div>
                  </div>

                  <div className="px-[20px] pb-[16px]">
                    {cert.awardedTo && <p className="mb-[4px] text-[11px] text-[#94a3b8]">{cert.program}</p>}

                    {/* Title + status */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[16px] text-[#0f172a]">{cert.title}</h3>
                      <span className={`inline-flex h-[26px] items-center px-[10px] rounded-[10px] text-[11px] font-medium ${cert.statusColor}`}>{cert.status}</span>
                    </div>

                    {/* ID + date */}
                    <p className="mt-[8px] text-[11px] text-[#94a3b8]">
                      {cert.id ? `ID: ${cert.id}   ` : ''}{cert.issued}
                    </p>
                    {cert.pending && cert.pendingNote && (
                      <p className="text-[11px] text-[#94a3b8] mt-[4px]">{cert.pendingNote}</p>
                    )}

                    {/* Actions */}
                    {!cert.pending && (
                      <div className="mt-[16px] flex gap-[12px]">
                        <button className="bg-[#5b3df6] flex items-center gap-[8px] h-[36px] justify-center px-[14px] rounded-[6px]">
                          <Download className="h-[14px] w-[14px] text-white" />
                          <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-white text-[12px]">
                            Download PDF
                          </div>
                        </button>
                        <button className="border border-black/[0.08] flex items-center justify-center h-[36px] px-[14px] rounded-[6px] bg-white">
                          <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                            View
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
            <h3 className="font-bold text-[18px] text-[#0f172a]">Recent activity</h3>
            <div className="flex flex-col w-full gap-[16px]">
              {activity.map(({ icon, bg, text, sub }) => (
                <div key={text} className="flex items-start gap-[12px]">
                  <div className={`flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[6px] ${bg}`}>{icon}</div>
                  <div>
                    <p className="font-semibold text-[13px] text-[#0f172a]">{text}</p>
                    <p className="text-[11px] text-[#94a3b8] mt-[2px]">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}