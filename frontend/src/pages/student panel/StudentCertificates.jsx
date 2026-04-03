import React, { useState } from 'react'
import { Download, Award, Share2, Search, CheckCircle, Calendar } from 'lucide-react'

const certs = [
  {
    title: 'UI/UX Masterclass',
    program: 'Design Track',
    awardedTo: 'Aarohi Shah',
    id: 'UX-2024-1189',
    issued: 'Feb 12, 2024',
  },
  {
    title: 'Designing for Accessibility',
    program: 'Design Track',
    awardedTo: 'Aarohi Shah',
    id: 'AX-2024-0741',
    issued: 'Jan 08, 2024',
  },
  {
    title: 'Frontend Foundations',
    program: 'Engineering Track',
    awardedTo: 'Aarohi Shah',
    id: 'FE-2023-4217',
    issued: 'Nov 18, 2023',
  },
  {
    title: 'Product Management Basics',
    program: 'Product Track',
    awardedTo: 'Aarohi Shah',
    id: 'PM-2023-3302',
    issued: 'Sep 05, 2023',
  },
  {
    title: 'Data Analysis with Python',
    program: 'Data Track',
    awardedTo: 'Aarohi Shah',
    id: 'DA-2023-2891',
    issued: 'Jul 22, 2023',
  },
  {
    title: 'Agile & Scrum Fundamentals',
    program: 'Management Track',
    awardedTo: 'Aarohi Shah',
    id: 'AG-2023-1134',
    issued: 'Apr 14, 2023',
  },
]

const PROGRAM_COLORS = {
  'Design Track': { bg: 'bg-violet-50', text: 'text-violet-600', dot: 'bg-violet-400' },
  'Engineering Track': { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-400' },
  'Product Track': { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400' },
  'Data Track': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-400' },
  'Management Track': { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-400' },
}

export default function StudentCertificates() {
  const [search, setSearch] = useState('')

  const filtered = certs.filter(
    c =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.program.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight">My Certificates</h1>
            <p className="mt-1 text-sm text-[#64748b]">
              {certs.length} certificates earned • All verified
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
              <input
                type="text"
                placeholder="Search certificates..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-9 w-56 rounded-lg border border-[#e2e8f0] bg-white pl-9 pr-3 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30 focus:border-[#5b3df6]"
              />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: 'Total Earned', value: certs.length },
            { label: 'This Year', value: certs.filter(c => c.issued.includes('2024')).length },
            { label: 'Ready to Share', value: certs.length },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-white border border-[#e2e8f0] px-5 py-4">
              <p className="text-xs text-[#94a3b8]">{label}</p>
              <p className="mt-1 text-2xl font-bold text-[#0f172a]">{value}</p>
            </div>
          ))}
        </div>

        {/* Certificates grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Award className="h-10 w-10 text-[#cbd5e1] mb-3" />
            <p className="text-[#64748b] font-medium">No certificates found</p>
            <p className="text-sm text-[#94a3b8] mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cert) => {
              const colors = PROGRAM_COLORS[cert.program] || PROGRAM_COLORS['Design Track']
              return (
                <div
                  key={cert.id}
                  className="group relative bg-white rounded-xl border border-[#e2e8f0] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Top accent bar */}
                  <div className={`h-1 w-full ${colors.dot}`} />

                  <div className="p-5">
                    {/* Program tag */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${colors.bg} ${colors.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                        {cert.program}
                      </span>
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f1f5f9]">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-[15px] text-[#0f172a] leading-snug mb-1">{cert.title}</h3>
                    <p className="text-xs text-[#94a3b8] mb-4">Awarded to {cert.awardedTo}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-[11px] text-[#94a3b8] mb-5">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {cert.issued}
                      </span>
                      <span className="text-[#e2e8f0]">•</span>
                      <span className="font-mono">{cert.id}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg bg-[#5b3df6] text-white text-xs font-medium hover:bg-[#4c31d4] transition-colors">
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f8fafc] transition-colors">
                        <Share2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
