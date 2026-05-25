import React, { useEffect, useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Video,
  ChevronDown,
  ArrowLeft,
  X,
  CalendarDays,
  Clock3,
  Link2,
  Users,
  BookOpen,
  Trash2,
  AlertCircle,
  UserCheck,
  Star,
  StopCircle,
  Award,
  Upload,
  Pencil,
} from 'lucide-react'
import { api } from '../../lib/api'
import useRealtime from '../../hooks/useRealtime'
import { parseServerDate, formatDateInIst, formatTimeInIst } from '../../lib/dates'

// Removed 'Cancelled' filter, updated filter labels
const FILTERS = ['All Classes', 'Live/Upcoming', 'Completed']

const STATUS_CONFIG = {
  live: { label: 'Live', bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]', dot: 'bg-[#ef4444]' },
  upcoming: { label: 'Upcoming', bg: 'bg-[#fef9c3]', text: 'text-[#854d0e]', dot: 'bg-[#eab308]' },
  recent: { label: 'Completed', bg: 'bg-[#dcfce7]', text: 'text-[#14532d]', dot: 'bg-[#22c55e]' },
  ended: { label: 'Course Ended', bg: 'bg-[#f1f5f9]', text: 'text-[#475569]', dot: 'bg-[#94a3b8]' },
}

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'))
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'))

// Use shared date helpers from lib/dates for consistent IST formatting

function istDateTimePartsToIso(dateValue, timeValue) {
  const dateOk = /^\d{4}-\d{2}-\d{2}$/.test(String(dateValue || ''))
  const timeOk = /^\d{2}:\d{2}$/.test(String(timeValue || ''))
  if (!dateOk || !timeOk) return ''
  return `${dateValue}T${timeValue}:00+05:30`
}

function getCurrentIstDateTimeParts() {
  const now = new Date()
  // date in YYYY-MM-DD using sv locale which yields ISO-like date
  const date = new Intl.DateTimeFormat('sv', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
  // time in HH:MM 24-hour format
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit' }).format(now)
  return { start_date: date, start_time: time }
}

/**
 * Determines the daily session status for a recurring live class.
 * - 'ended'   : admin has manually ended the course
 * - 'live'    : current time falls within today's scheduled window
 * - 'upcoming': today's class hasn't started yet (or scheduled for a future date)
 * - 'recent'  : never used here since courses are ongoing until explicitly ended
 */
function getSessionStatus(rawStatus, startAtValue, durationMinutes) {
  const status = String(rawStatus || '').toLowerCase()
  if (status === 'ended' || status === 'course_ended') return 'ended'

  const startAt = parseServerDate(startAtValue)
  if (!startAt) return 'upcoming'

  const durationMs = Math.max(1, Number(durationMinutes || 60)) * 60 * 1000
  const now = Date.now()

  // If the original startAt is in the future, course hasn't started yet.
  if (now < startAt.getTime()) return 'upcoming'

  // Determine the scheduled local time (HH:MM:SS) from the original startAt in IST
  const timeParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(startAt)
  const hh = timeParts.find((p) => p.type === 'hour')?.value || '00'
  const mm = timeParts.find((p) => p.type === 'minute')?.value || '00'
  const ss = timeParts.find((p) => p.type === 'second')?.value || '00'

  // Get today's date in IST
  const todayParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const y = todayParts.find((p) => p.type === 'year')?.value
  const M = todayParts.find((p) => p.type === 'month')?.value
  const d = todayParts.find((p) => p.type === 'day')?.value

  // Build an ISO string with India offset (+05:30) for today's scheduled instance
  const todayIsoWithOffset = `${y}-${M}-${d}T${hh}:${mm}:${ss}+05:30`
  const todayStart = new Date(todayIsoWithOffset)
  const todayEnd = new Date(todayStart.getTime() + durationMs)

  if (now >= todayStart.getTime() && now <= todayEnd.getTime()) return 'live'
  return 'upcoming'
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${status === 'live' ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </span>
  )
}

function EndCourseConfirmModal({ session, onClose, onConfirm, isEnding }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-[420px] rounded-[14px] border border-black/[0.08] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1f2]">
            <StopCircle className="h-6 w-6 text-[#e11d48]" />
          </div>
          <h3 className="mt-3 text-[18px] font-bold text-[#0f172a]">End Course?</h3>
          <p className="mt-1.5 text-[13px] text-[#64748b]">
            Are you sure you want to end <strong>{session?.title}</strong>? This will mark the entire course as completed and students will no longer have access to future sessions.
          </p>
        </div>
        <div className="flex justify-end gap-3 border-t border-black/[0.08] px-5 py-4">
          <button
            onClick={onClose}
            className="h-10 rounded-[8px] border border-black/[0.08] bg-white px-4 text-[13px] font-semibold text-[#4b5563]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isEnding}
            className="h-10 rounded-[8px] bg-[#e11d48] px-4 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            {isEnding ? 'Ending...' : 'Yes, End Course'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ session, onClose, onConfirm, isDeleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-[400px] rounded-[14px] border border-black/[0.08] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fee2e2]">
            <Trash2 className="h-6 w-6 text-[#ef4444]" />
          </div>
          <h3 className="mt-3 text-[18px] font-bold text-[#0f172a]">Delete Class?</h3>
          <p className="mt-1.5 text-[13px] text-[#64748b]">
            Are you sure you want to delete <strong>{session?.title}</strong>? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3 border-t border-black/[0.08] px-5 py-4">
          <button
            onClick={onClose}
            className="h-10 rounded-[8px] border border-black/[0.08] bg-white px-4 text-[13px] font-semibold text-[#4b5563]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-10 rounded-[8px] bg-[#ef4444] px-4 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ClassDetailModal({ session, attendeeUsers, onClose, onEndCourse, endingId }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5" onClick={onClose}>
      <div
        className="w-full max-w-[780px] max-h-[90vh] overflow-y-auto rounded-[16px] border border-black/[0.08] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative rounded-t-[16px] p-5 sm:p-6 ${session.status === 'live' ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-white/10">
            <X className={`h-5 w-5 ${session.status === 'live' ? 'text-white/70' : 'text-[#94a3b8]'}`} />
          </button>
          <div className="flex items-start gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] ${session.status === 'live' ? 'bg-[#ef4444]' : 'bg-[#5b3df6]'}`}>
              <Video className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={session.status} />
                <span className={`text-[12px] ${session.status === 'live' ? 'text-white/60' : 'text-[#94a3b8]'}`}>
                  {session.platform}
                </span>
              </div>
              <h2 className={`mt-1 text-[22px] font-bold ${session.status === 'live' ? 'text-white' : 'text-[#0f172a]'}`}>
                {session.title}
              </h2>
              <p className={`text-[13px] ${session.status === 'live' ? 'text-white/60' : 'text-[#64748b]'}`}>
                {session.topic}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { label: 'Course', value: session.course, icon: BookOpen },
              { label: 'Class', value: session.class_name || '-', icon: BookOpen },
              { label: 'Instructor', value: session.instructor, icon: UserCheck },
              { label: 'Daily Time (IST)', value: `${session.time}`, icon: CalendarDays },
              { label: 'Duration', value: session.duration, icon: Clock3 },
              { label: 'Students Enrolled', value: String(session.studentsEnrolled), icon: Users },
            ].map(({ label, value, icon }) => {
              const IconComponent = icon
              return (
                <div key={label} className="flex items-center gap-3 rounded-[10px] border border-black/[0.06] p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#f7f4ff]">
                    <IconComponent className="h-4 w-4 text-[#5b3df6]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#94a3b8]">{label}</p>
                    <p className="text-[13px] font-semibold text-[#0f172a]">{value || '-'}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {session.image ? (
            <img src={session.image} alt={session.title} className="h-44 w-full rounded-[10px] border border-black/[0.08] object-cover" />
          ) : null}

          <div>
            <p className="mb-2 text-[13px] font-semibold text-[#0f172a]">Assigned students ({attendeeUsers.length})</p>
            {attendeeUsers.length > 0 ? (
              <div className="space-y-2">
                {attendeeUsers.map((student) => (
                  <div key={student._id} className="flex items-center gap-3 rounded-[10px] border border-black/[0.06] p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f5f9] text-[11px] font-semibold text-[#475569]">
                      {(student.full_name || student.email || 'S').slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#0f172a]">{student.full_name || 'Student'}</p>
                      <p className="text-[11px] text-[#94a3b8]">{student.email || '-'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[10px] border border-dashed border-black/[0.12] bg-[#fafcff] p-3 text-[12px] text-[#64748b]">
                No students assigned to this class.
              </div>
            )}
          </div>

          {session.zoomError && (
            <div className="flex items-start gap-3 rounded-[10px] border border-red-100 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-red-700">Zoom Link Issue</p>
                <p className="text-[12px] text-red-600">{session.zoomError}</p>
                <p className="mt-2 text-[11px] text-red-500 font-medium">Join link is unavailable for this class.</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <a
              className={`inline-flex h-10 items-center gap-2 rounded-[8px] px-4 text-[13px] font-semibold ${
                session.joinLink
                  ? 'bg-[#5b3df6] text-white'
                  : 'cursor-not-allowed border border-[#cbd5e1] bg-[#f8fafc] text-[#94a3b8]'
              }`}
              href={session.joinLink || '#'}
              target={session.joinLink ? '_blank' : undefined}
              rel={session.joinLink ? 'noreferrer' : undefined}
              onClick={(e) => {
                if (!session.joinLink) e.preventDefault()
              }}
            >
              <Link2 className="h-4 w-4" /> Open Join Link
            </a>
            {session.status !== 'ended' && (
              <button
                onClick={() => onEndCourse(session)}
                disabled={endingId === session.id}
                className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-[#fecaca] bg-[#fff1f2] px-4 text-[13px] font-semibold text-[#e11d48] hover:bg-[#ffe4e6] disabled:opacity-60"
              >
                <StopCircle className="h-4 w-4" /> End Course
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReassignInstructorModal({
  session,
  instructors,
  selectedInstructorId,
  onSelectInstructor,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4" onClick={onClose}>
      <div className="w-full max-w-[500px] rounded-[12px] border border-black/[0.08] bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-black/[0.08] px-4 py-4 sm:px-5">
          <div>
            <h3 className="text-[20px] font-bold text-[#0f172a]">Reassign Instructor</h3>
            <p className="mt-1 text-[12px] text-[#64748b]">{session?.title || 'Live Class'}</p>
          </div>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#64748b]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3 px-4 py-4 sm:px-5">
          <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Select instructor</label>
          <div className="relative">
            <select
              value={selectedInstructorId}
              onChange={(e) => onSelectInstructor(e.target.value)}
              className="h-10 w-full appearance-none rounded-[8px] border border-black/[0.08] px-4 text-[13px]"
            >
              <option value="">Choose instructor</option>
              {instructors.map((i) => (
                <option key={i._id} value={i._id}>{i.full_name || i.name || i.username || i.email || i._id}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
          </div>
          {instructors.length === 0 ? (
            <p className="text-[12px] text-[#b91c1c]">No instructors found. Please refresh or add instructors first.</p>
          ) : null}
        </div>
        <div className="flex justify-end gap-3 border-t border-black/[0.08] px-4 py-4 sm:px-5">
          <button onClick={onClose} className="h-10 rounded-[8px] border border-black/[0.08] bg-white px-4 text-[13px] font-semibold text-[#4b5563]">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="h-10 rounded-[8px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Updating...' : 'Update Instructor'}
          </button>
        </div>
      </div>
    </div>
  )
}

// function CertificateIssueModal({
//   session,
//   certificateTitle,
//   setCertificateTitle,
//   onClose,
//   onSubmit,
//   isSubmitting,
// }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4" onClick={onClose}>
//       <div className="w-[calc(100%-1.5rem)] max-h-[90vh] overflow-y-auto rounded-[8px] bg-white shadow-xl sm:w-[520px]" onClick={(e) => e.stopPropagation()}>
//         <div className="sticky top-0 flex items-center justify-between border-b border-black/[0.08] bg-white p-5">
//           <h2 className="text-[20px] font-bold text-[#0f172a]">Upload Certificate</h2>
//           <button onClick={onClose} className="text-[#94a3b8] hover:text-[#0f172a] transition-colors">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="space-y-4 p-5">
//           <div className="rounded-[6px] border border-black/[0.08] bg-[#f8fafc] px-3 py-2 text-[12px] text-[#334155]">
//             Class: <span className="font-semibold text-[#0f172a]">{session?.title || '-'}</span>
//           </div>

//           <div>
//             <label className="mb-1 block text-[12px] font-semibold text-[#334155]">Certificate title</label>
//             <input
//               value={certificateTitle}
//               onChange={(e) => setCertificateTitle(e.target.value)}
//               placeholder="e.g. Completion Certificate"
//               className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30"
//             />
//           </div>
//         </div>

//         <div className="sticky bottom-0 flex justify-end gap-3 border-t border-black/[0.08] bg-white p-5">
//           <button onClick={onClose} className="h-10 rounded-[6px] border border-black/[0.08] px-4 text-[13px] font-medium text-[#64748b] hover:bg-gray-50">
//             Cancel
//           </button>
//           <button
//             onClick={onSubmit}
//             disabled={isSubmitting}
//             className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-[#5b3df6] px-4 text-[13px] font-medium text-white hover:bg-[#4a2ed8] disabled:opacity-60"
//           >
//             <Upload className="h-4 w-4" />
//             {isSubmitting ? 'Uploading...' : 'Upload Certificate'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }



function CertificateIssueModal({
  session,
  certificateTitle,
  setCertificateTitle,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const [recipientName, setRecipientName] = React.useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4" onClick={onClose}>
      <div className="w-[calc(100%-1.5rem)] max-h-[90vh] overflow-y-auto rounded-[8px] bg-white shadow-xl sm:w-[560px]" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-black/[0.08] bg-white p-5">
          <h2 className="text-[20px] font-bold text-[#0f172a]">Issue Certificate</h2>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#0f172a]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {/* Certificate Preview */}
          <div className="relative overflow-hidden rounded-[10px] border border-[#c7d9f5]" style={{background:'#f0f6ff', aspectRatio:'1.6/1'}}>
            {/* Top-right shapes */}
            <div className="absolute top-0 right-0 w-32 h-20 rounded-bl-full opacity-25" style={{background:'#1565c0'}}/>
            <div className="absolute top-0 right-0 w-20 h-12 rounded-bl-full opacity-30" style={{background:'#1a5fb4'}}/>
            {/* Bottom-left shapes */}
            <div className="absolute bottom-0 left-0 w-28 h-18 rounded-tr-full opacity-25" style={{background:'#1565c0'}}/>

            {/* White card */}
            <div className="absolute inset-2 rounded-[6px] bg-white opacity-90"/>
            <div className="absolute inset-2 rounded-[6px] flex flex-col items-center justify-center px-6">
              {/* Blue top bar */}
              <div className="absolute top-2 left-2 right-2 h-[3px] rounded-full" style={{background:'#1565c0'}}/>
              <p className="text-[9px] tracking-[3px] text-[#64748b] mt-3">CERTIFICATE OF ACHIEVEMENT</p>
              <p className="text-[8px] text-[#94a3b8] mt-1">THIS CERTIFICATE IS PRESENTED TO</p>
              <p className="text-[18px] font-bold mt-1" style={{color:'#1565c0'}}>
                {recipientName || 'Name Surname'}
              </p>
              <p className="text-[8px] text-[#475569] mt-1 text-center px-4">
                {certificateTitle || 'For successfully completing the course'}
              </p>
              <div className="flex w-full justify-between px-4 mt-3 border-t border-[#e2eaf6] pt-2">
                <div>
                  <p className="text-[7px] font-bold text-[#1a1a2e]">JANUARY 2ND 2025</p>
                  <p className="text-[6px] text-[#94a3b8] tracking-widest">DATE</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] italic text-[#334155]">✦ Signature</p>
                  <p className="text-[6px] text-[#94a3b8] tracking-widest">SIGNATURE</p>
                </div>
              </div>
            </div>
            {/* Award badge */}
            <div className="absolute top-4 right-6 w-10 h-10 rounded-full border-2 flex flex-col items-center justify-center bg-white" style={{borderColor:'#1565c0'}}>
              <p className="text-[5px]" style={{color:'#1565c0'}}>★★★</p>
              <p className="text-[7px] font-bold" style={{color:'#1565c0'}}>BEST</p>
              <p className="text-[5px] text-[#475569]">AWARD</p>
            </div>
          </div>

          <div className="rounded-[6px] border border-black/[0.08] bg-[#f8fafc] px-3 py-2 text-[12px] text-[#334155]">
            Class: <span className="font-semibold text-[#0f172a]">{session?.title || '-'}</span>
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#334155]">Certificate title</label>
            <input
              value={certificateTitle}
              onChange={(e) => setCertificateTitle(e.target.value)}
              placeholder="e.g. Completion Certificate"
              className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30"
            />
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-black/[0.08] bg-white p-5">
          <button onClick={onClose} className="h-10 rounded-[6px] border border-black/[0.08] px-4 text-[13px] font-medium text-[#64748b] hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-[#1565c0] px-4 text-[13px] font-medium text-white hover:bg-[#1248a0] disabled:opacity-60"
          >
            <Award className="h-4 w-4" />
            {isSubmitting ? 'Issuing...' : 'Issue Certificate'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SessionCard({ session, onClick, onEndCourse, onReassign, onAddCertificate, onEdit, onDelete, endingId, certificateIssuingId }) {
  const isLive = session.status === 'live'
  const isEnded = session.status === 'ended'
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-[14px] border transition-all duration-200 hover:shadow-md ${
        isLive
          ? 'border-[#ef4444]/30 bg-[#fff5f5]'
          : isEnded
          ? 'border-black/[0.06] bg-[#f8fafc]'
          : 'border-black/[0.08] bg-white hover:border-[#5b3df6]/30'
      }`}
    >
      {isLive ? <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#ef4444] to-[#f97316]" /> : null}

      <div className="p-4">
        {session.image ? (
          <img src={session.image} alt={session.title} className="mb-3 h-36 w-full rounded-[10px] border border-black/[0.08] object-cover" />
        ) : (
          <div className="mb-3 flex h-36 w-full items-center justify-center rounded-[10px] border border-dashed border-black/[0.12] bg-[#f8fafc] text-[11px] font-medium text-[#94a3b8]">
            No class image
          </div>
        )}

        <div className="flex items-start justify-between gap-2">
          <StatusBadge status={session.status} />
          {/* End Course button — only shown on active courses */}
          {!isEnded && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEndCourse(session)
              }}
              disabled={endingId === session.id}
              className="inline-flex items-center gap-1 rounded-[6px] border border-[#fecaca] bg-[#fff1f2] px-2 py-1 text-[10px] font-semibold text-[#e11d48] hover:bg-[#ffe4e6] disabled:opacity-60 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <StopCircle className="h-3 w-3" />
              {endingId === session.id ? 'Ending...' : 'End Course'}
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(session)
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#5b3df6] transition-all"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(session)
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#64748b] hover:bg-[#fee2e2] hover:text-[#ef4444] transition-all"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] ${isLive ? 'bg-[#ef4444]' : isEnded ? 'bg-[#e2e8f0]' : 'bg-[#f7f4ff]'}`}>
            <Video className={`h-4 w-4 ${isLive ? 'text-white' : isEnded ? 'text-[#94a3b8]' : 'text-[#5b3df6]'}`} />
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#0f172a] leading-tight">{session.title}</p>
            {session.class_name && (
              <p className="text-[11px] text-[#5b3df6]">{session.class_name}</p>
            )}
            <p className="text-[11px] text-[#64748b]">{session.course}</p>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <UserCheck className="h-3.5 w-3.5 text-[#94a3b8]" />
            <span>{session.instructor}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <CalendarDays className="h-3.5 w-3.5 text-[#94a3b8]" />
            {/* Show daily time since this is a recurring class */}
            <span>Daily • {session.time} • {session.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <Users className="h-3.5 w-3.5 text-[#94a3b8]" />
            <span>{session.studentsEnrolled} students assigned</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
            <Star className={`h-3.5 w-3.5 ${Number(session.avgRating || 0) > 0 ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#cbd5e1]'}`} />
            <span>
              {Number(session.avgRating || 0) > 0 ? `${session.avgRating.toFixed(1)} (${session.ratingCount})` : 'Not rated'}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <a
              onClick={(e) => {
                if (!session.joinLink) e.preventDefault()
                e.stopPropagation()
              }}
              href={session.joinLink || '#'}
              target={session.joinLink ? '_blank' : undefined}
              rel={session.joinLink ? 'noreferrer' : undefined}
              className={`inline-flex items-center gap-1 rounded-[8px] px-2.5 py-1 text-[11px] font-semibold ${
                session.joinLink
                  ? 'border border-[#c7d2fe] bg-[#eef2ff] text-[#4338ca]'
                  : 'cursor-not-allowed border border-[#cbd5e1] bg-[#f8fafc] text-[#94a3b8]'
              }`}
            >
              <Link2 className="h-3 w-3" /> Join Link
            </a>
            {isEnded && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onAddCertificate(session)
                }}
                disabled={certificateIssuingId === session.id}
                className="inline-flex items-center gap-1 rounded-[8px] border border-[#c7d2fe] bg-[#eef2ff] px-2.5 py-1 text-[11px] font-semibold text-[#4338ca] disabled:opacity-60"
              >
                <Upload className="h-3 w-3" />
                {certificateIssuingId === session.id ? 'Uploading...' : 'Upload Certificate'}
              </button>
            )}
          </div>
          <span className="text-[11px] font-medium text-[#5b3df6] group-hover:underline">View details</span>
        </div>
      </div>
    </div>
  )
}

export default function AdminLiveClasses() {
  const [activeView, setActiveView] = useState('list')
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false)
  const [classes, setClasses] = useState([])
  const [courses, setCourses] = useState([])
  const [instructors, setInstructors] = useState([])
  const [students, setStudents] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All Classes')
  const [selectedSession, setSelectedSession] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCourseFilter, setActiveCourseFilter] = useState('All Courses')
  const [loading, setLoading] = useState(false)
  const [createError, setCreateError] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [actionError, setActionError] = useState('')
  const [reassignTarget, setReassignTarget] = useState(null)
  const [reassignInstructorId, setReassignInstructorId] = useState('')
  const [reassigningId, setReassigningId] = useState('')
  const [hostMode, setHostMode] = useState('self')
  const [manualCourseName, setManualCourseName] = useState('')
  const [courseInputMode, setCourseInputMode] = useState('select')
  // End Course confirm modal state
  const [endCourseTarget, setEndCourseTarget] = useState(null)
  const [endingId, setEndingId] = useState('')
  const [certificateTarget, setCertificateTarget] = useState(null)
  const [certificateIssuingId, setCertificateIssuingId] = useState('')
  const [certificateTitle, setCertificateTitle] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeletingId, setIsDeletingId] = useState('')
  const [editId, setEditId] = useState(null)

  const tenantId = localStorage.getItem('lms_tenant_id')

  const [form, setForm] = useState({
    title: '',
    class_name: '',
    course_id: '',
    instructor_id: '',
    start_date: '',
    start_time: '',
    duration_minutes: 60,
    amount: '',
    image_url: '',
    attendee_ids: [],
  })

  const handleFormChange = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const loadData = async () => {
    setLoading(true)
    try {
      const [classesRes, coursesRes, instructorsRes, studentsRes, allUsersRes, me] = await Promise.all([
        api('/lms/live-classes?limit=300').catch(() => ({ items: [] })),
        api('/lms/courses?limit=500').catch(() => ({ items: [] })),
        api('/lms/instructors?limit=1000').catch(() => ({ items: [] })),
        api('/lms/users?role=student&limit=500').catch(() => ({ items: [] })),
        api('/lms/users?limit=1000').catch(() => ({ items: [] })),
        api('/auth/me').catch(() => null),
      ])

      const roleValue = (value) => String(value || '').trim().toLowerCase()
      const roleMatchedInstructors = instructorsRes.items || []
      const inferredInstructors = (allUsersRes.items || []).filter((u) => {
        const r = roleValue(u?.role)
        return r.includes('instructor') || r.includes('teacher') || r.includes('faculty')
      })
      const mergedInstructors = [...roleMatchedInstructors, ...inferredInstructors]
      const seen = new Set()
      const finalInstructors = mergedInstructors.filter((u) => {
        const id = String(u?._id || '')
        if (!id || seen.has(id)) return false
        seen.add(id)
        return true
      })

      console.log('[DEBUG-LOAD] Raw classes from API:', classesRes.items || [])
      setClasses(classesRes.items || [])
      setCourses(coursesRes.items || [])
      setInstructors(finalInstructors)
      setStudents(studentsRes.items || [])
      setCurrentUser(me)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime(tenantId ? `tenant:${tenantId}` : '', (payload) => {
    if (payload?.type?.startsWith('live_class.')) {
      loadData()
    }
  })

  const courseMap = useMemo(() => new Map(courses.map((c) => [c._id, c])), [courses])
  const userMap = useMemo(() => {
    const map = new Map()
    instructors.forEach((u) => map.set(u._id, u))
    students.forEach((u) => map.set(u._id, u))
    return map
  }, [instructors, students])

  const sessions = useMemo(() => {
    return classes.map((c) => {
      const start = parseServerDate(c.start_at)
      const hasValidStart = !!start
      console.log(`[DEBUG-PARSE] Class: "${c.title}", raw start_at: "${c.start_at}", parsed: ${start?.toISOString()}, formatted time: ${hasValidStart ? formatTimeInIst(c.start_at) : 'N/A'}`)
      const course = courseMap.get(c.course_id)
      const instructor = userMap.get(c.instructor_id)
      const status = getSessionStatus(c.status, c.start_at, c.duration_minutes)

      return {
        id: c._id,
        courseId: c.course_id || '',
        title: c.title || 'Live Class',
        class_name: c.class_name || '',
        course: course?.title || c.course_id || 'Course',
        instructorId: c.instructor_id || '',
        instructor: instructor?.full_name || instructor?.email || c.instructor_id || 'Instructor',
        date: hasValidStart ? formatDateInIst(c.start_at) : 'Not scheduled',
        time: hasValidStart ? formatTimeInIst(c.start_at) : '-',
        duration: `${c.duration_minutes || 60} mins`,
        platform: (c.meeting_provider || 'Zoom').toString().toUpperCase(),
        status,
        joinLink: c.join_url || c.start_url || '',
        topic: c.title || 'Session',
        studentsEnrolled: (c.attendee_ids || []).length,
        attendeeIds: c.attendee_ids || [],
        amountText: Number(c.amount || 0).toFixed(2),
        image: c.image_url || '',
        avgRating: Number(c.avg_rating || c.rating || 0),
        ratingCount: Number(c.rating_count || 0),
        zoomError: c.zoom_error || '',
      }
    })
  }, [classes, courseMap, userMap])

  const filtered = useMemo(() => {
    const selectedCourse = activeCourseFilter.trim().toLowerCase()
    return sessions.filter((s) => {
      let matchFilter = false

      if (activeFilter === 'All Classes') {
        // Show all courses that have NOT been ended (i.e., ongoing/active)
        matchFilter = s.status !== 'ended'
      } else if (activeFilter === 'Live/Upcoming') {
        // Show classes that are live right now or upcoming today
        matchFilter = s.status === 'live' || s.status === 'upcoming'
      } else if (activeFilter === 'Completed') {
        // Show courses that admin has ended
        matchFilter = s.status === 'ended'
      }

      const matchCourse = selectedCourse === 'all courses' || s.course.toLowerCase() === selectedCourse

      const q = search.trim().toLowerCase()
      const matchSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.instructor.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q)

      return matchFilter && matchCourse && matchSearch
    })
  }, [sessions, activeFilter, activeCourseFilter, search])

  const courseFilters = useMemo(() => {
    const names = [...new Set(sessions.map((s) => String(s.course || '').trim()).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b),
    )
    return ['All Courses', ...names]
  }, [sessions])

  const stats = useMemo(() => {
    const total = sessions.filter((s) => s.status !== 'ended').length
    const live = sessions.filter((s) => s.status === 'live').length
    const upcoming = sessions.filter((s) => s.status === 'upcoming').length
    const ended = sessions.filter((s) => s.status === 'ended').length
    return { total, live, upcoming, ended }
  }, [sessions])

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((f) => ({ ...f, image_url: reader.result }))
      }
    }
    reader.readAsDataURL(file)
  }

  const createClass = async () => {
    if (isCreating) return
    setCreateError('')
    setIsCreating(true)
    const title = form.title.trim()
    const courseId = manualCourseName.trim()
    const instructorId = hostMode === 'self' ? currentUser?._id || '' : form.instructor_id.trim()

    if (!title || !courseId || !form.start_date || !form.start_time) {
      setCreateError('Please fill class title, course, and IST date/time.')
      setIsCreating(false)
      return
    }
    if (!instructorId) {
      setCreateError('Please select class host.')
      setIsCreating(false)
      return
    }
    try {
      const startAtIso = istDateTimePartsToIso(form.start_date, form.start_time)
      if (!startAtIso) {
        setCreateError('Please choose a valid date and time in IST.')
        setIsCreating(false)
        return
      }
      console.log('[DEBUG-CREATE] Sending start_at:', startAtIso, 'from date:', form.start_date, 'time:', form.start_time)
      const res = await api('/lms/live-classes', {
        method: 'POST',
        body: JSON.stringify({
          title,
          class_name: form.class_name,
          course_id: courseId,
          instructor_id: instructorId,
          attendee_ids: form.attendee_ids,
          start_at: startAtIso,
          duration_minutes: Number(form.duration_minutes || 60),
          amount: Number(form.amount || 0),
          image_url: form.image_url.trim(),
          repeat_daily: true, // recurring daily class
        }),
      })

      // Silently log issues if any, but don't block the UI with alerts
      if (res?.zoom_error) {
        console.error('Zoom generation failed:', res.zoom_error)
        setActionError(`Zoom generation failed: ${res.zoom_error}`)
      }

      setForm({
        title: '',
        class_name: '',
        course_id: '',
        instructor_id: '',
        start_date: '',
        start_time: '',
        duration_minutes: 60,
        amount: '',
        image_url: '',
        attendee_ids: [],
      })
      setManualCourseName('')
      setIsAddSessionOpen(false)
      setActiveView('list')
      loadData()
    } catch (error) {
      setCreateError(error?.message || 'Unable to create class.')
    } finally {
      setIsCreating(false)
    }
  }

  const updateClass = async () => {
    if (isCreating) return
    setCreateError('')
    setIsCreating(true)
    const title = form.title.trim()
    const courseId = manualCourseName.trim()
    const instructorId = hostMode === 'self' ? currentUser?._id || '' : form.instructor_id.trim()

    if (!title || !courseId || !form.start_date || !form.start_time) {
      setCreateError('Please fill class title, course, and IST date/time.')
      setIsCreating(false)
      return
    }
    try {
      const startAtIso = istDateTimePartsToIso(form.start_date, form.start_time)
      const res = await api(`/lms/live-classes/${editId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title,
          class_name: form.class_name,
          course_id: courseId,
          instructor_id: instructorId,
          attendee_ids: form.attendee_ids,
          start_at: startAtIso,
          duration_minutes: Number(form.duration_minutes || 60),
          amount: Number(form.amount || 0),
          image_url: form.image_url.trim(),
        }),
      })
      if (res?.zoom_error) {
        console.error('Zoom generation failed (update):', res.zoom_error)
        setActionError(`Zoom generation failed: ${res.zoom_error}`)
      }
      setEditId(null)
      setActiveView('list')
      loadData()
    } catch (error) {
      setCreateError(error?.message || 'Unable to update class.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleEditClass = (session) => {
    setEditId(session.id)
    const rawClass = classes.find(c => c._id === session.id)
    if (!rawClass) return
    const startAt = parseServerDate(rawClass.start_at)
    let start_date = ''
    let start_time = ''
    if (startAt) {
      // YYYY-MM-DD for date input
      start_date = new Intl.DateTimeFormat('sv', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(startAt)
      // HH:MM (24h) for time input
      start_time = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit' }).format(startAt)
    }

    setForm({
      title: rawClass.title || '',
      class_name: rawClass.class_name || '',
      course_id: rawClass.course_id || '',
      instructor_id: rawClass.instructor_id || '',
      start_date: start_date,
      start_time: start_time,
      duration_minutes: rawClass.duration_minutes || 60,
      amount: rawClass.amount || '',
      image_url: rawClass.image_url || '',
      attendee_ids: rawClass.attendee_ids || [],
    })
    setCourseInputMode('select')
    setHostMode(rawClass.instructor_id === currentUser?._id ? 'self' : 'assign')
    setActiveView('create')
  }

  const handleDeleteClass = async () => {
    if (!deleteTarget?.id) return
    try {
      setActionError('')
      setIsDeletingId(deleteTarget.id)
      await api(`/lms/live-classes/${deleteTarget.id}`, { method: 'DELETE' })
      setClasses((prev) => prev.filter((c) => String(c?._id || '') !== String(deleteTarget.id)))
      setDeleteTarget(null)
      if (selectedSession?.id === deleteTarget.id) setSelectedSession(null)
      await loadData()
    } catch (error) {
      setActionError(error?.message || 'Unable to delete class.')
    } finally {
      setIsDeletingId('')
    }
  }

  // End Course: marks status as 'ended' via PATCH
  const handleEndCourse = async () => {
    if (!endCourseTarget?.id) return
    try {
      setActionError('')
      setEndingId(endCourseTarget.id)
      await api(`/lms/live-classes/${endCourseTarget.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'ended' }),
      })
      // Optimistically update local state
      setClasses((prev) =>
        prev.map((item) =>
          String(item?._id || '') === String(endCourseTarget.id) ? { ...item, status: 'ended' } : item,
        ),
      )
      setEndCourseTarget(null)
      if (selectedSession?.id === endCourseTarget.id) setSelectedSession(null)
      await loadData()
    } catch (error) {
      setActionError(error?.message || 'Unable to end course.')
    } finally {
      setEndingId('')
    }
  }

  const openReassignModal = (session) => {
    setReassignTarget(session)
    setReassignInstructorId(session?.instructorId || '')
  }

  const closeReassignModal = () => {
    setReassignTarget(null)
    setReassignInstructorId('')
    setReassigningId('')
  }

  const reassignInstructor = async () => {
    if (!reassignTarget?.id) return
    if (!reassignInstructorId) {
      setActionError('Please select instructor to reassign.')
      return
    }
    try {
      setActionError('')
      setReassigningId(reassignTarget.id)
      await api(`/lms/live-classes/${reassignTarget.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ instructor_id: reassignInstructorId }),
      })
      await loadData()
      if (selectedSession?.id === reassignTarget.id) setSelectedSession(null)
      closeReassignModal()
    } catch (error) {
      setActionError(error?.message || 'Unable to reassign instructor.')
    } finally {
      setReassigningId('')
    }
  }

  const selectedAttendees = useMemo(() => {
    if (!selectedSession) return []
    return selectedSession.attendeeIds.map((id) => userMap.get(id)).filter(Boolean)
  }, [selectedSession, userMap])

  const openCertificateModal = (session) => {
    setActionError('')
    setCertificateTarget(session || null)
    setCertificateTitle('')
  }

  const closeCertificateModal = () => {
    setCertificateTarget(null)
    setCertificateTitle('')
    setCertificateIssuingId('')
  }

  const issueCertificatesForClass = async () => {
    if (!certificateTarget?.id) return
    if (!certificateTarget.courseId) {
      setActionError('Course mapping missing for this class. Cannot upload certificate.')
      return
    }
    if (!certificateTitle.trim()) {
      setActionError('Please enter certificate title.')
      return
    }

    try {
      setActionError('')
      setCertificateIssuingId(certificateTarget.id)

      const attendeeIds = (certificateTarget.attendeeIds || []).map((id) => String(id || '').trim()).filter(Boolean)
      let recipientIds = [...attendeeIds]

      // Fallback: if class attendee_ids are empty, pick students from course enrollments.
      if (recipientIds.length === 0) {
        const enrollmentsRes = await api('/lms/enrollments?limit=2000').catch(() => ({ items: [] }))
        const enrollmentRows = Array.isArray(enrollmentsRes?.items) ? enrollmentsRes.items : []
        recipientIds = enrollmentRows
          .filter((row) => String(row?.course_id || '').trim() === String(certificateTarget.courseId || '').trim())
          .map((row) => String(row?.student_id || '').trim())
          .filter(Boolean)
      }

      recipientIds = [...new Set(recipientIds)]

      if (recipientIds.length > 0) {
        await Promise.all(
          recipientIds.map((studentId) =>
            api('/admin/certificates', {
              method: 'POST',
              body: JSON.stringify({
                student_id: studentId,
                course_id: certificateTarget.courseId,
                title: certificateTitle.trim(),
              }),
            }),
          ),
        )
      }

      closeCertificateModal()
      alert(`Certificate uploaded successfully! Issued to ${recipientIds.length} enrolled student(s).`)
      await loadData()
    } catch (error) {
      setActionError(error?.message || 'Failed to upload certificate')
    } finally {
      setCertificateIssuingId('')
    }
  }

  // ─── Create view ────────────────────────────────────────────────────────────
  if (activeView === 'create') {
    return (
      <div className="min-h-full bg-gradient-to-b from-[#f6f8fa] to-[#eef3f9] p-4 sm:p-6">
        <div className="mx-auto max-w-[1240px] rounded-[14px] border border-black/[0.08] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-black/[0.06] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <button onClick={() => { setActiveView('list'); setEditId(null); }} className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#5b3df6] hover:text-[#4a2ed8]">
              <ArrowLeft className="h-4 w-4" /> Back to Live Classes
            </button>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button onClick={() => { setActiveView('list'); setEditId(null); }} className="h-10 rounded-[8px] border border-black/[0.08] bg-white px-4 text-[12px] font-semibold text-[#334155] hover:bg-[#f8fafc]">
                Cancel
              </button>
              <button
                onClick={editId ? updateClass : createClass}
                disabled={isCreating}
                className="h-10 rounded-[8px] bg-[#5b3df6] px-4 text-[12px] font-semibold text-white hover:bg-[#4f34df] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCreating ? (editId ? 'Updating...' : 'Creating...') : (editId ? 'Update Class' : 'Create Zoom Meeting')}
              </button>
            </div>
          </div>

          <p className="text-[12px] font-medium text-[#94a3b8]">Live Classes / {editId ? 'Edit Class' : 'Create Zoom Meeting'}</p>
          <h2 className="mt-1 text-[30px] font-bold leading-tight text-[#0f172a] sm:text-[36px]">{editId ? 'Edit Class' : 'Create Zoom Meeting'}</h2>

          {createError ? (
            <div className="mt-3 rounded-[8px] border border-[#fecaca] bg-[#fff1f2] p-3 text-[12px] text-[#991b1b]">
              {createError}
            </div>
          ) : null}

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
            <section className="rounded-[12px] border border-black/[0.08] bg-[#fcfdff] p-5">
              <h3 className="text-[20px] font-bold text-[#111827]">Batch Configuration</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#334155]">Session title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    className="h-11 w-full rounded-[8px] border border-black/[0.08] bg-white px-3 text-[13px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30"
                    placeholder="e.g. Math Mastery Live - Chapter 5"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#334155]">Class</label>
                  <input
                    value={form.class_name || ''}
                    onChange={(e) => handleFormChange('class_name', e.target.value)}
                    className="h-11 w-full rounded-[8px] border border-black/[0.08] bg-white px-3 text-[13px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30"
                    placeholder="Enter class (e.g. 10th, 12th, etc.)"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#334155]">Course program *</label>
                  <input
                    value={manualCourseName}
                    onChange={(e) => setManualCourseName(e.target.value)}
                    className="h-11 w-full rounded-[8px] border border-black/[0.08] bg-white px-3 text-[13px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30"
                    placeholder="Type course program"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#334155]">Who will host?</label>
                  <div className="grid grid-cols-2 gap-2 rounded-[8px] border border-black/[0.06] bg-[#f1f5f9] p-1">
                    <button type="button" onClick={() => setHostMode('self')} className={`h-9 rounded-[7px] text-[12px] font-semibold transition-colors ${hostMode === 'self' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#64748b] hover:text-[#334155]'}`}>I will host</button>
                    <button type="button" onClick={() => setHostMode('assign')} className={`h-9 rounded-[7px] text-[12px] font-semibold transition-colors ${hostMode === 'assign' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#64748b] hover:text-[#334155]'}`}>Assign</button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#334155]">Instructor</label>
                  {hostMode === 'self' ? (
                    <div className="flex h-11 items-center rounded-[8px] border border-black/[0.08] bg-[#f8fafc] px-3 text-[12px] text-[#334155]">
                      {currentUser?.full_name || currentUser?.email || 'Current admin'}
                    </div>
                  ) : (
                    <div className="relative">
                      <select value={form.instructor_id} onChange={(e) => handleFormChange('instructor_id', e.target.value)} className="h-11 w-full appearance-none rounded-[8px] border border-black/[0.08] bg-white px-3 text-[13px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30">
                        <option value="">Select instructor</option>
                        {instructors.map((i) => (<option key={i._id} value={i._id}>{i.full_name || i.name || i.username || i.email || i._id}</option>))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#334155]">Date (IST) *</label>
                  <input type="date" value={form.start_date} onChange={(e) => handleFormChange('start_date', e.target.value)} className="h-11 w-full rounded-[8px] border border-black/[0.08] bg-white px-3 text-[13px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30" />
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#334155]">Time (IST) *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <select value={form.start_time.split(':')[0] || ''} onChange={(e) => { const hour = e.target.value; const minute = form.start_time.split(':')[1] || '00'; handleFormChange('start_time', `${hour}:${minute}`) }} className="h-11 w-full appearance-none rounded-[8px] border border-black/[0.08] bg-white px-3 pr-8 text-[13px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30">
                        <option value="">Hour</option>
                        {HOUR_OPTIONS.map((hour) => (<option key={hour} value={hour}>{hour}</option>))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    </div>
                    <div className="relative">
                      <select value={form.start_time.split(':')[1] || ''} onChange={(e) => { const minute = e.target.value; const hour = form.start_time.split(':')[0] || '00'; handleFormChange('start_time', `${hour}:${minute}`) }} className="h-11 w-full appearance-none rounded-[8px] border border-black/[0.08] bg-white px-3 pr-8 text-[13px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30">
                        <option value="">Min</option>
                        {MINUTE_OPTIONS.map((minute) => (<option key={minute} value={minute}>{minute}</option>))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#334155]">Duration (minutes)</label>
                  <input type="number" min="15" value={form.duration_minutes} onChange={(e) => handleFormChange('duration_minutes', Number(e.target.value || 60))} className="h-11 w-full rounded-[8px] border border-black/[0.08] bg-white px-3 text-[13px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30" />
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-semibold text-[#334155]">Image URL</label>
                  <input value={form.image_url} onChange={(e) => handleFormChange('image_url', e.target.value)} className="h-11 w-full rounded-[8px] border border-black/[0.08] bg-white px-3 text-[13px] text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30" placeholder="https://example.com/class.jpg" />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-[12px] font-semibold text-[#334155]">Or upload class image</label>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="w-full rounded-[8px] border border-black/[0.08] bg-white px-3 py-2 text-[12px] file:mr-3 file:rounded-[6px] file:border-0 file:bg-[#5b3df6] file:px-3 file:py-1.5 file:font-medium file:text-white" />
              </div>

            </section>

            <aside className="space-y-3 xl:sticky xl:top-4 xl:self-start">
              <section className="rounded-[12px] border border-black/[0.08] bg-[#fcfdff] p-5">
                <h3 className="text-[16px] font-bold text-[#111827]">Session Summary</h3>
                <div className="mt-2 space-y-2 text-[12px] text-[#64748b]">
                  <p>Title: {form.title || '-'}</p>
                  <p>Course: {manualCourseName || '-'}</p>
                  <p>Host: {hostMode === 'self' ? (currentUser?.full_name || currentUser?.email || '-') : (userMap.get(form.instructor_id)?.full_name || userMap.get(form.instructor_id)?.email || '-')}</p>
                  <p>Duration: {form.duration_minutes || 60} mins</p>
                </div>
              </section>
              {form.image_url ? (
                <section className="rounded-[12px] border border-black/[0.08] bg-[#fcfdff] p-5">
                  <h3 className="text-[16px] font-bold text-[#111827] mb-2">Image Preview</h3>
                  <img src={form.image_url} alt="Preview" className="h-40 w-full rounded-[10px] border border-black/[0.08] object-cover" />
                </section>
              ) : null}
            </aside>
          </div>
        </div>
      </div>
    )
  }

  // ─── List view ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full bg-[#f6f8fa]">
      <div className="space-y-4 p-4 sm:p-5">
        <section className="w-full shrink-0 rounded-[8px] border border-black/[0.08] border-solid bg-gradient-to-br from-white to-[#e8f5ff] px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <div className="flex flex-col gap-[11px] items-start">
            <div className="bg-[#ffd966] flex items-center px-[10px] py-[6.5px] rounded-[12px] shrink-0">
              <div className="text-[12px] font-medium text-[#4b2e00]">Live teaching operations</div>
            </div>
            <div className="max-w-[850px] text-[24px] font-bold leading-[1.2] text-[#0f172a] sm:text-[30px] lg:text-[35px]">
              Schedule, track, and manage every live session from one class operations workspace.
            </div>
            <div className="max-w-[750px] text-[13.9px] text-[#94a3b8]">
              All class cards below are loaded from real backend data.
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setForm((prev) => ({ ...prev, ...getCurrentIstDateTimeParts() }))
                setEditId(null)
                setActiveView('create')
              }}
              className="inline-flex h-9 items-center gap-1 rounded-[7px] bg-[#5b3df6] px-3 text-[12px] font-semibold text-white"
            >
              <Plus className="h-4 w-4" /> Create Zoom meeting
            </button>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Active courses', value: stats.total },
            { label: 'Live now', value: stats.live },
            { label: 'Upcoming today', value: stats.upcoming },
            { label: 'Courses ended', value: stats.ended },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-[8px] border border-black/[0.08] bg-white p-4">
              <p className="text-[11px] text-[#94a3b8]">{label}</p>
              <p className="mt-2 text-[32px] font-bold text-[#0f172a]">{value}</p>
            </div>
          ))}
        </div>

        <section className="rounded-[8px] border border-black/[0.08] bg-white p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-[20px] font-bold text-[#0f172a]">All Live Classes</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search classes..."
                  className="h-9 w-[200px] rounded-[7px] border border-black/[0.08] pl-9 pr-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30"
                />
              </div>
              <div className="relative">
                <select
                  value={activeCourseFilter}
                  onChange={(e) => setActiveCourseFilter(e.target.value)}
                  className="h-9 w-[190px] appearance-none rounded-[7px] border border-black/[0.08] bg-white px-3 pr-8 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30"
                >
                  {courseFilters.map((courseName) => (
                    <option key={courseName} value={courseName}>{courseName}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
              </div>
            </div>
          </div>

          {actionError ? (
            <div className="mb-3 rounded-[8px] border border-[#fecaca] bg-[#fff1f2] p-3 text-[12px] text-[#991b1b] inline-flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> {actionError}
            </div>
          ) : null}

          {/* Updated filters: All Classes | Live/Upcoming | Completed — no Cancelled */}
          <div className="mb-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`h-8 rounded-[8px] px-3 text-[12px] font-medium transition-colors ${activeFilter === f ? 'bg-[#5b3df6] text-white' : 'border border-black/[0.08] bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9]'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="rounded-[12px] border border-dashed border-black/[0.12] bg-[#fafcff] py-12 text-center text-[13px] text-[#94a3b8]">
              Loading classes...
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-[12px] border border-dashed border-black/[0.12] bg-[#fafcff] py-12 text-center">
              <Video className="mx-auto h-8 w-8 text-[#cbd5e1]" />
              <p className="mt-3 text-[14px] font-medium text-[#94a3b8]">No classes found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onClick={() => setSelectedSession(session)}
                  onEndCourse={(s) => setEndCourseTarget(s)}
                  onReassign={openReassignModal}
                  onAddCertificate={openCertificateModal}
                  onEdit={handleEditClass}
                  onDelete={(s) => setDeleteTarget(s)}
                  endingId={endingId}
                  certificateIssuingId={certificateIssuingId}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Detail modal */}
      {selectedSession ? (
        <ClassDetailModal
          session={selectedSession}
          attendeeUsers={selectedAttendees}
          onClose={() => setSelectedSession(null)}
          onEndCourse={(s) => { setEndCourseTarget(s); setSelectedSession(null) }}
          endingId={endingId}
        />
      ) : null}

      {/* End Course confirm modal */}
      {endCourseTarget ? (
        <EndCourseConfirmModal
          session={endCourseTarget}
          onClose={() => setEndCourseTarget(null)}
          onConfirm={handleEndCourse}
          isEnding={endingId === endCourseTarget.id}
        />
      ) : null}

      {/* Reassign modal */}
      {reassignTarget ? (
        <ReassignInstructorModal
          session={reassignTarget}
          instructors={instructors}
          selectedInstructorId={reassignInstructorId}
          onSelectInstructor={setReassignInstructorId}
          onClose={closeReassignModal}
          onSubmit={reassignInstructor}
          isSubmitting={reassigningId === reassignTarget.id}
        />
      ) : null}

      {certificateTarget ? (
        <CertificateIssueModal
          session={certificateTarget}
          certificateTitle={certificateTitle}
          setCertificateTitle={setCertificateTitle}
          onClose={closeCertificateModal}
          onSubmit={issueCertificatesForClass}
          isSubmitting={certificateIssuingId === certificateTarget.id}
        />
      ) : null}

      {/* Add session modal */}
      {isAddSessionOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-[740px] rounded-[10px] border border-[#0ea5e9] bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-[#7dd3fc] px-4 py-4 sm:px-6 sm:py-5">
              <div>
                <h3 className="text-[26px] font-bold leading-none text-[#111827]">Add session</h3>
                <p className="mt-1 text-[14px] text-[#6b7280]">Schedule a new live class for an existing batch</p>
              </div>
              <button onClick={() => setIsAddSessionOpen(false)} className="text-[#94a3b8] hover:text-[#64748b]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
              {createError ? (
                <div className="rounded-[8px] border border-[#fecaca] bg-[#fff1f2] p-3 text-[12px] text-[#991b1b]">{createError}</div>
              ) : null}

              <div>
                <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Session title *</label>
                <input value={form.title} onChange={(e) => handleFormChange('title', e.target.value)} className="h-10 w-full rounded-[8px] border border-black/[0.08] px-4 text-[13px]" placeholder="e.g. Math Mastery Live - Chapter 4" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Course / Batch *</label>
                  <input
                    value={manualCourseName}
                    onChange={(e) => setManualCourseName(e.target.value)}
                    className="h-10 w-full rounded-[8px] border border-black/[0.08] px-4 text-[13px]"
                    placeholder="Type course program"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Host *</label>
                  <div className="relative">
                    <select
                      value={hostMode === 'self' ? '__self__' : form.instructor_id}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '__self__') { setHostMode('self'); setForm((prev) => ({ ...prev, instructor_id: '' })) }
                        else { setHostMode('assign'); setForm((prev) => ({ ...prev, instructor_id: value })) }
                      }}
                      className="h-10 w-full appearance-none rounded-[8px] border border-black/[0.08] px-4 text-[13px]"
                    >
                      <option value="__self__">I will host ({currentUser?.full_name || currentUser?.email || 'Admin'})</option>
                      {instructors.map((i) => (<option key={i._id} value={i._id}>{i.full_name || i.name || i.username || i.email || i._id}</option>))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Start Date (IST) *</label>
                  <input type="date" value={form.start_date} onChange={(e) => handleFormChange('start_date', e.target.value)} className="h-10 w-full rounded-[8px] border border-black/[0.08] px-4 text-[13px]" />
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Start Time (IST) *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <select value={form.start_time.split(':')[0] || ''} onChange={(e) => { const hour = e.target.value; const minute = form.start_time.split(':')[1] || '00'; handleFormChange('start_time', `${hour}:${minute}`) }} className="h-10 w-full appearance-none rounded-[8px] border border-black/[0.08] px-3 pr-8 text-[13px]">
                        <option value="">Hour</option>
                        {HOUR_OPTIONS.map((hour) => (<option key={hour} value={hour}>{hour}</option>))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    </div>
                    <div className="relative">
                      <select value={form.start_time.split(':')[1] || ''} onChange={(e) => { const minute = e.target.value; const hour = form.start_time.split(':')[0] || '00'; handleFormChange('start_time', `${hour}:${minute}`) }} className="h-10 w-full appearance-none rounded-[8px] border border-black/[0.08] px-3 pr-8 text-[13px]">
                        <option value="">Min</option>
                        {MINUTE_OPTIONS.map((minute) => (<option key={minute} value={minute}>{minute}</option>))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Duration *</label>
                  <input type="number" min="15" value={form.duration_minutes} onChange={(e) => handleFormChange('duration_minutes', Number(e.target.value || 60))} className="h-10 w-full rounded-[8px] border border-black/[0.08] px-4 text-[13px]" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Image URL</label>
                <input value={form.image_url} onChange={(e) => handleFormChange('image_url', e.target.value)} className="h-10 w-full rounded-[8px] border border-black/[0.08] px-4 text-[13px]" placeholder="https://example.com/class.jpg" />
              </div>

              <div>
                <label className="mb-1 block text-[13px] font-semibold text-[#374151]">Upload image</label>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="w-full rounded-[8px] border border-black/[0.08] px-4 py-2 text-[12px] file:mr-3 file:rounded file:border-0 file:bg-[#5b3df6] file:px-3 file:py-1 file:text-white" />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#7dd3fc] px-6 py-4">
              <button onClick={() => setIsAddSessionOpen(false)} className="h-10 rounded-[8px] border border-black/[0.08] bg-white px-5 text-[13px] font-semibold text-[#4b5563]">Cancel</button>
              <button onClick={createClass} disabled={isCreating} className="h-10 rounded-[8px] bg-[#5b3df6] px-5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
                {isCreating ? 'Scheduling...' : 'Schedule session'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete confirm modal */}
      {deleteTarget ? (
        <DeleteConfirmModal
          session={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteClass}
          isDeleting={isDeletingId === deleteTarget.id}
        />
      ) : null}
    </div>
  )
}