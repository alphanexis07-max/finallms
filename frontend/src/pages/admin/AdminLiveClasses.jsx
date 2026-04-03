import React, { useState } from 'react'
import { Search, Plus, Video, ChevronDown, ArrowLeft, X, CalendarDays, Clock3, Link2 } from 'lucide-react'

const AVATAR_RAHUL = 'https://www.figma.com/api/mcp/asset/5b24609b-97ad-4bea-af20-b4f4df404b75'
const A1 = 'https://www.figma.com/api/mcp/asset/3e187a9c-3e48-41dc-8f03-5affd73e7e5f'
const A2 = 'https://www.figma.com/api/mcp/asset/ccc04c84-4ac7-4c6c-b67f-2ff1887c4b83'
const A3 = 'https://www.figma.com/api/mcp/asset/9834fb2c-3d16-47cd-9e85-eaf390f7183a'

export default function AdminLiveClasses() {
  const [activeView, setActiveView] = useState('list')
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false)
  const sessions = [
    ['Math Mastery Live', 'Today • 4:00 PM • Zoom link ready • Aisha Verma', 'Ready', 'bg-[#2dd4bf] text-[#023b33]', 'Open'],
    ['Science Lab Workshop', 'Tomorrow • 11:00 AM • Google Meet pending • Liam Carter', 'Pending link', 'bg-[#ffd966] text-[#4b2e00]', 'Assign link'],
    ['English Speaking Club', 'Fri • 5:30 PM • Meet ready • Nadia Brown', 'Scheduled', 'bg-[#2dd4bf] text-[#023b33]', 'Modify'],
    ['Coding for Kids Bootcamp', 'Sat • 10:00 AM • Zoom ready • Arjun Singh batch', 'Link expired', 'bg-[#f0f4f8] text-[#64748b]', 'Resolve'],
  ]

  const faculty = [
    ['Aisha Verma', 'Math Mastery Live • Slides uploaded • Waiting room enabled', A1, 'Ready', 'bg-[#2dd4bf] text-[#023b33]'],
    ['Liam Carter', 'Science Lab Workshop • Meet link missing • Needs setup', A2, 'Action needed', 'bg-[#ffd966] text-[#4b2e00]'],
    ['Nadia Brown', 'English Speaking Club • Notes shared • Attendance template ready', A3, 'Prepared', 'bg-[#2dd4bf] text-[#023b33]'],
  ]

  if (activeView === 'create') {
    return (
      <div className="min-h-full bg-[#f6f8fa] p-5">
        <div className="mx-auto max-w-[1180px] rounded-[10px] border border-black/[0.08] bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setActiveView('list')}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-[#5b3df6]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Live Classes
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('list')}
                className="h-9 rounded-[7px] border border-black/[0.08] bg-white px-3 text-[12px] font-semibold text-[#334155]"
              >
                Cancel
              </button>
              <button className="h-9 rounded-[7px] bg-[#5b3df6] px-3 text-[12px] font-semibold text-white">Create Zoom Meeting</button>
            </div>
          </div>

          <p className="text-[12px] text-[#94a3b8]">Live Classes / Create Zoom Meeting</p>
          <h2 className="mt-1 text-[32px] font-bold text-[#0f172a]">Create Zoom Meeting</h2>

          <div className="mt-4 grid grid-cols-[1.5fr_1fr] gap-4">
            <section className="rounded-[8px] border border-black/[0.08] bg-white p-4">
              <h3 className="text-[18px] font-bold text-[#111827]">Batch Configuration</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Batch name</label>
                  <input className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" placeholder="e.g. Batch A - Morning" />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Course program</label>
                  <div className="relative">
                    <select className="h-10 w-full appearance-none rounded-[7px] border border-black/[0.08] px-3 text-[13px]">
                      <option>Creative English Level 1</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Instructor</label>
                  <div className="relative">
                    <select className="h-10 w-full appearance-none rounded-[7px] border border-black/[0.08] px-3 text-[13px]">
                      <option>Nadia Brown</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Class mode</label>
                  <div className="relative">
                    <select className="h-10 w-full appearance-none rounded-[7px] border border-black/[0.08] px-3 text-[13px]">
                      <option>Zoom</option>
                      <option>Google Meet</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Start time</label>
                  <input type="time" className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">End time</label>
                  <input type="time" className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" />
                </div>
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-[12px] font-medium text-[#334155]">Weekly schedule</label>
                <input className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" placeholder="Mon, Wed, Fri" />
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-[12px] font-medium text-[#334155]">Meeting link</label>
                <input className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" placeholder="Paste Zoom/Meet URL" />
              </div>
            </section>

            <aside className="space-y-3">
              <section className="rounded-[8px] border border-black/[0.08] bg-white p-4">
                <h3 className="text-[16px] font-bold text-[#111827]">Batch Summary</h3>
                <div className="mt-2 space-y-2 text-[12px] text-[#64748b]">
                  <p>Course: Creative English Level 1</p>
                  <p>Instructor: Nadia Brown</p>
                  <p>Timing: 10:00 AM - 11:30 AM</p>
                  <p>Days: Mon, Wed, Fri</p>
                </div>
              </section>
              <section className="rounded-[8px] border border-black/[0.08] bg-white p-4">
                <h3 className="text-[16px] font-bold text-[#111827]">Checklist</h3>
                <ul className="mt-2 space-y-1 text-[12px] text-[#64748b]">
                  <li>- Instructor assigned</li>
                  <li>- Time slot validated</li>
                  <li>- Link configured</li>
                  <li>- Student capacity set</li>
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#f6f8fa]">
      <div className="space-y-4 p-5">
        <section className="rounded-[8px] border border-black/[0.08] bg-[#eaf2fb] p-4">
          <div>
            <span className="inline-flex rounded-[12px] bg-[#ffd966] px-[10px] py-[5px] text-[11px] font-medium text-[#4b2e00]">Today’s live teaching operations</span>
            <h2 className="mt-3 max-w-[700px] text-[28px] font-bold leading-tight text-[#0f172a]">Schedule, track, and manage every live session from one class operations workspace.</h2>
            <p className="mt-2 max-w-[700px] text-[14px] text-[#94a3b8]">Monitor upcoming Zoom and Meet sessions, manage teachers, review attendance, and quickly resolve link or timing issues before class starts.</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setActiveView('create')}
                className="inline-flex h-9 items-center gap-1 rounded-[7px] bg-[#5b3df6] px-3 text-[12px] font-semibold text-white"
              ><Plus className="h-4 w-4" />Create Zoom meeting</button>
              <button className="h-9 rounded-[7px] border border-black/[0.08] bg-white px-3 text-[12px] font-semibold text-[#111827]">This week</button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-[8px] border border-black/[0.08] bg-white p-[16px]"><p className="text-[11px] text-[#94a3b8]">Classes today</p><p className="mt-2 text-[34px] font-bold">12</p><span className="mt-2 inline-flex rounded-[12px] bg-[#2dd4bf] px-2 py-1 text-[10px] font-medium text-[#023b33]">+3 starting in 1 hour</span></div>
          <div className="rounded-[8px] border border-black/[0.08] bg-white p-[16px]"><p className="text-[11px] text-[#94a3b8]">Attendance rate</p><p className="mt-2 text-[34px] font-bold">89%</p><span className="mt-2 inline-flex rounded-[12px] bg-[#f0f4f8] px-2 py-1 text-[10px] font-medium text-[#64748b]">Up +5% from last week</span></div>
          <div className="rounded-[8px] border border-black/[0.08] bg-white p-[16px]"><p className="text-[11px] text-[#94a3b8]">Links pending</p><p className="mt-2 text-[34px] font-bold">2</p><span className="mt-2 inline-flex rounded-[12px] bg-[#ffd966] px-2 py-1 text-[10px] font-medium text-[#4b2e00]">Needs follow-up</span></div>
          <div className="rounded-[8px] border border-black/[0.08] bg-white p-[16px]"><p className="text-[11px] text-[#94a3b8]">Faculty live now</p><p className="mt-2 text-[34px] font-bold">5</p><span className="mt-2 inline-flex rounded-[12px] bg-[#2dd4bf] px-2 py-1 text-[10px] font-medium text-[#023b33]">All sessions stable</span></div>
        </div>

        <div className="grid grid-cols-[1.7fr_1fr] gap-3">
          <section className="rounded-[8px] border border-black/[0.08] bg-white p-4">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-[22px] font-bold text-[#111827]">Upcoming sessions</h3>
                <p className="text-[12px] text-[#94a3b8]">Track links, status, instructor assignment, and upcoming timings.</p>
              </div>
              <div className="flex gap-2">
                <button className="h-8 rounded-[7px] border border-black/[0.08] bg-[#f1f5f9] px-3 text-[11px] font-medium">Bulk reminders</button>
                <button
                  onClick={() => setIsAddSessionOpen(true)}
                  className="h-8 rounded-[7px] bg-[#5b3df6] px-3 text-[11px] font-medium text-white"
                >
                  Add session
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {sessions.map(([title, meta, status, cls, action]) => (
                <div key={title} className="flex items-center justify-between rounded-[8px] border border-black/[0.06] p-3">
                  <div className="flex items-start gap-2">
                    <Video className="mt-0.5 h-4 w-4 text-[#5b3df6]" />
                    <div>
                      <p className="text-[12px] font-semibold text-[#111827]">{title}</p>
                      <p className="text-[10px] text-[#9aa9c0]">{meta}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-[12px] px-2 py-1 text-[10px] font-medium ${cls}`}>{status}</span>
                    <button className="rounded-[7px] border border-black/[0.08] bg-white px-2 py-1 text-[10px] font-semibold">{action}</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[8px] border border-black/[0.08] bg-white p-4">
            <h3 className="text-[22px] font-bold text-[#111827]">This week</h3>
            <p className="text-[12px] text-[#94a3b8]">Quick view of the next teaching schedule.</p>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {[
                ['12', 'Mon', 'Math 5PM'],
                ['13', 'Tue', 'STEM 4PM'],
                ['14', 'Wed', 'Eng 6PM'],
                ['15', 'Thu', 'Robotics'],
                ['16', 'Fri', 'Workshop'],
              ].map(([d, wd, s]) => (
                <div key={d} className="rounded-[8px] border border-black/[0.08] bg-[#f8fafc] p-2 text-center">
                  <p className="text-[18px] font-bold text-[#111827]">{d}</p>
                  <p className="text-[10px] text-[#94a3b8]">{wd}</p>
                  <p className="mt-1 text-[9px] text-[#7a84a1]">{s}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        
      </div>

      {isAddSessionOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-[740px] rounded-[10px] border border-[#0ea5e9] bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#7dd3fc] px-6 py-5">
              <div>
                <h3 className="text-[36px] font-bold leading-none text-[#111827]">Add session</h3>
                <p className="mt-1 text-[24px] text-[#6b7280]">Schedule a new live class for an existing batch</p>
              </div>
              <button onClick={() => setIsAddSessionOpen(false)} className="text-[#94a3b8] hover:text-[#64748b]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1 block text-[14px] font-semibold text-[#374151]">Session title *</label>
                <input className="h-10 w-full rounded-[8px] border border-black/[0.08] px-4 text-[14px]" defaultValue="Math Mastery Live - Chapter 4" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[14px] font-semibold text-[#374151]">Course / Batch *</label>
                  <div className="relative">
                    <select className="h-10 w-full appearance-none rounded-[8px] border border-black/[0.08] px-4 text-[14px]">
                      <option>Math Mastery Live</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[14px] font-semibold text-[#374151]">Instructor *</label>
                  <div className="relative">
                    <select className="h-10 w-full appearance-none rounded-[8px] border border-black/[0.08] px-4 text-[14px]">
                      <option>Aisha Verma</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-[14px] font-semibold text-[#374151]">Date *</label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    <input className="h-10 w-full rounded-[8px] border border-black/[0.08] py-2 pl-10 pr-3 text-[14px]" defaultValue="Oct 24, 2023" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[14px] font-semibold text-[#374151]">Start time *</label>
                  <div className="relative">
                    <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    <input className="h-10 w-full rounded-[8px] border border-black/[0.08] py-2 pl-10 pr-3 text-[14px]" defaultValue="4:00 PM" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[14px] font-semibold text-[#374151]">Duration *</label>
                  <div className="relative">
                    <select className="h-10 w-full appearance-none rounded-[8px] border border-black/[0.08] px-4 text-[14px]">
                      <option>60 mins</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[14px] font-semibold text-[#374151]">Platform *</label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    <select className="h-10 w-full appearance-none rounded-[8px] border border-black/[0.08] py-2 pl-10 pr-8 text-[14px]">
                      <option>Zoom Meeting</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[14px] font-semibold text-[#374151]">Meeting Link</label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    <input className="h-10 w-full rounded-[8px] border border-black/[0.08] py-2 pl-10 pr-3 text-[14px] text-[#9ca3af]" defaultValue="Auto-generated via integration" />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[14px] font-semibold text-[#374151]">Agenda / Description</label>
                <textarea className="h-20 w-full resize-none rounded-[8px] border border-black/[0.08] px-4 py-2 text-[14px]" placeholder="Brief outline of topics to be covered in this session..." />
              </div>

              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="relative mt-0.5 inline-flex h-6 w-11 items-center rounded-full bg-[#6b46ff] px-1"
                >
                  <span className="h-4 w-4 rounded-full bg-white" />
                </button>
                <div>
                  <p className="text-[14px] font-semibold text-[#374151]">Notify students & instructor</p>
                  <p className="text-[13px] text-[#6b7280]">Send an automated email and SMS reminder 30 minutes before the session begins.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#7dd3fc] px-6 py-4">
              <button
                onClick={() => setIsAddSessionOpen(false)}
                className="h-10 rounded-[8px] border border-black/[0.08] bg-white px-6 text-[16px] font-semibold text-[#4b5563]"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsAddSessionOpen(false)}
                className="h-10 rounded-[8px] bg-[#6b46ff] px-6 text-[16px] font-semibold text-white"
              >
                Schedule session
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
