import React from 'react'
import { Upload, PlayCircle, Users, Video } from 'lucide-react'

export default function InstructorOnlineClasses() {
  const isClassCreationManagedByAdmin = true

  const items = [
    { 
      title: 'Live class • Chemical reactions and equations', 
      time: 'Today • 10:00 AM to 10:45 AM', 
      description: 'Meeting starts with quick warmup, clarity explanation, and a short concept check at the end of class.', 
      status: 'Starting soon', 
      statusType: 'warning',
      cta: 'Open class room' 
    },
    { 
      title: 'Practical demo • Separation techniques', 
      time: 'Tomorrow • 11:30 AM to 12:15 PM', 
      description: 'Teacher-led demonstration with filtration, evaporation, and magnetic separation using daily life examples.', 
      status: 'Virtual lab', 
      statusType: 'secondary',
      cta: 'View details' 
    },
    { 
      title: 'Revision room • Weekly recap and doubt solving', 
      time: 'Friday • 4:00 PM to 4:45 PM', 
      description: 'Focused revision session covering key diagrams, short-answer patterns, and common misconceptions before the weekly assessment.', 
      status: 'Scheduled', 
      statusType: 'default',
      cta: 'Share invite' 
    },
    { 
      title: 'Recorded lecture • Matter and its states', 
      time: 'Uploaded yesterday • 38 min replay', 
      description: 'Previous theory class recording with clear chapter markers, downloadable notes, and a short assignment reminder for absent learners.', 
      status: 'Recording live', 
      statusType: 'success',
      cta: 'Open recording' 
    },
  ]

  const statusStyles = {
    warning: 'bg-[#ffd966] text-[#4b2e00]',
    secondary: 'bg-[#e8f5ff] text-[#0f172a]',
    default: 'bg-[#f1f5f9] text-[#64748b]',
    success: 'bg-[#2dd4bf] text-[#023b33]'
  }

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="flex h-full flex-col gap-6 bg-gradient-to-b from-[#f6f8fa] to-[#f7fcff] p-4 sm:p-6 lg:p-7">
        {/* Hero Section */}
        <section className="relative w-full shrink-0 rounded-[8px] border border-black/[0.08] border-solid bg-gradient-to-br from-white to-[#e8f5ff] px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <div className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row">
            <div className="relative flex min-w-0 flex-1 flex-col items-start gap-[11px]">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#e8f5ff] text-[#0f172a]">Class 9 • Science</span>
                <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#ffd966] text-[#4b2e00]">Live now in 12 mins</span>
              </div>
              <div className="text-[24px] font-bold leading-tight text-[#0f172a] sm:text-[28px]">
                Integrated Science Foundation • Online classes
              </div>
              <div className="text-[14px] leading-relaxed text-[#94a3b8]">
                Manage upcoming live sessions, revision rooms, and recorded lectures for the current science batch. Keep learners on schedule with class timings, session notes, and replay access.
              </div>
              <div className="flex flex-wrap gap-4 text-[13px] text-[#94a3b8]">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4 text-[#5b3df6]" />
                  124 students this batch
                </span>
                <span>4 classes this week</span>
                <span>28 recordings available</span>
              </div>
            </div>
            <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">
              <button className="inline-flex h-[40px] items-center gap-2 rounded-[6px] bg-[#5b3df6] px-[16px] text-[14px] font-medium text-white transition-colors hover:bg-[#4c2dd9]">
                <Video className="h-[18px] w-[18px]" />
                Join class
              </button>
              <button
                disabled={isClassCreationManagedByAdmin}
                title="Only admin can create Zoom meetings"
                className="inline-flex h-[40px] items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-[17px] text-[14px] font-medium text-[#0f172a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Upload className="h-[18px] w-[18px]" />
                Admin creates Zoom meeting
              </button>
            </div>
          </div>
          {isClassCreationManagedByAdmin ? (
            <div className="mt-4 rounded-[6px] border border-[#c7d2fe] bg-[#eef2ff] px-3 py-2 text-[12px] text-[#4338ca]">
              Online class creation is admin-managed. Instructors can join and conduct only assigned Zoom sessions.
            </div>
          ) : null}
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="bg-white border border-black/[0.08] rounded-[8px] p-[21px]">
            <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Class overview</h3>
            <p className="text-[13px] text-[#94a3b8] mt-[4px] mb-[16px]">Monitor live session quality, attendance, and recording coverage.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-[16px]">
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Live attendance</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">89%</div>
              </div>
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Replay rate</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">63%</div>
              </div>
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Classes completed</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">18</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] rounded-[8px] p-[21px]">
            <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Teaching progress</h3>
            <p className="text-[13px] text-[#94a3b8] mt-[4px] mb-[16px]">Live delivery completed this month.</p>
            <div className="text-[30px] font-bold text-[#0f172a] mb-[8px]">72%</div>
            <div className="h-2 rounded-full bg-[#edf2ff] mb-[16px]">
              <div className="h-2 w-[72%] rounded-full bg-[#5b3df6]" />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#f1f5f9] text-[#0f172a]">18 classes done</span>
              <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#2dd4bf] text-[#023b33]">7 pending</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)] xl:gap-x-6 xl:gap-y-6">
          {/* Upcoming and recent sessions */}
          <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
            <div className="flex flex-col items-start justify-between gap-4 px-[21px] pb-[16px] pt-[21px] sm:flex-row">
              <div>
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Upcoming and recent sessions</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Live lectures, revision classes, and practical demos for this week.</p>
              </div>
              <button className="inline-flex h-[36px] items-center gap-1.5 rounded-[6px] border border-black/[0.08] bg-white px-[12px] text-[13px] font-medium text-[#0f172a] transition-colors hover:bg-[#f1f5f9]">
                All sessions
              </button>
            </div>
            <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
              {items.map((item, i) => (
                <div key={i} className="flex flex-col gap-3 rounded-[6px] border border-black/[0.08] p-[16px] lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <PlayCircle className="h-5 w-5 text-[#5b3df6] mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-semibold text-[#0f172a] leading-snug">{item.title}</div>
                      <div className="text-[12px] text-[#94a3b8] mt-[4px]">{item.time}</div>
                      <div className="text-[12px] text-[#94a3b8] mt-[4px] line-clamp-1">{item.description}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 lg:ml-4 lg:flex-shrink-0">
                    <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${statusStyles[item.statusType]}`}>
                      {item.status}
                    </span>
                    <button className="inline-flex h-[36px] items-center whitespace-nowrap rounded-[6px] border border-black/[0.08] bg-white px-[12px] text-[13px] font-medium text-[#0f172a] transition-colors hover:bg-[#f1f5f9]">
                      {item.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-[24px]">
            {/* Today's queue */}
            <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
              <div className="px-[21px] pt-[21px] pb-[16px]">
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Today's queue</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Tasks lined up for today's live sessions.</p>
              </div>
              <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
                {['Share reaction worksheet', 'Check audio and camera', 'Post join reminder'].map((task, i) => (
                  <div key={i} className="p-[16px] border border-black/[0.08] rounded-[6px]">
                    <div className="text-[14px] font-semibold text-[#0f172a]">{task}</div>
                    <div className="text-[12px] text-[#94a3b8] mt-[4px]">Pending action</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent recordings */}
            <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
              <div className="px-[21px] pt-[21px] pb-[16px]">
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Recent recordings</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Most viewed class replays this week.</p>
              </div>
              <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
                {['Matter and its states', 'Acids, bases, and salts', 'Revision room highlights'].map((recording, i) => (
                  <div key={i} className="p-[16px] border border-black/[0.08] rounded-[6px]">
                    <div className="text-[14px] font-semibold text-[#0f172a]">{recording}</div>
                    <div className="text-[12px] text-[#94a3b8] mt-[4px]">Top replay content</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
