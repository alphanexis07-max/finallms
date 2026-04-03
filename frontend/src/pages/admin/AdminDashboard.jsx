import React from 'react'
import {
  Search,
  Upload,
  Plus,
  GraduationCap,
  BookOpen,
  Users,
  Video,
  Wallet,
  BarChart3,
  Check,
} from 'lucide-react'

// Figma avatar assets (from node-id=1-791 output)
const AVATAR_RAHUL = 'https://www.figma.com/api/mcp/asset/5b24609b-97ad-4bea-af20-b4f4df404b75'
const AVATAR_AISHA = 'https://www.figma.com/api/mcp/asset/3e187a9c-3e48-41dc-8f03-5affd73e7e5f'
const AVATAR_LIAM = 'https://www.figma.com/api/mcp/asset/ccc04c84-4ac7-4c6c-b67f-2ff1887c4b83'
const AVATAR_NADIA = 'https://www.figma.com/api/mcp/asset/9834fb2c-3d16-47cd-9e85-eaf390f7183a'
const AVATAR_ARJUN = 'https://www.figma.com/api/mcp/asset/36623965-019b-4b68-bd68-2bf7a2e38748'
const AVATAR_MIA = 'https://www.figma.com/api/mcp/asset/3d5af1bf-9fd8-4c28-aa30-a19dca037191'
const AVATAR_SOFIA = 'https://www.figma.com/api/mcp/asset/0fd37186-8019-4228-b5e5-7a28115bd2b6'

function Avatar({ src, alt = '', className = '' }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`h-[36px] w-[36px] rounded-[6px] object-cover ${className}`}
    />
  )
}

function Pill({ children, variant }) {
  const style =
    variant === 'ready'
      ? 'bg-[#2dd4bf] text-[#023b33]'
      : variant === 'active'
        ? 'bg-[#2dd4bf] text-[#023b33]'
        : variant === 'draft'
          ? 'bg-[#e8f5ff] text-[#0f172a]'
          : variant === 'pending'
            ? 'bg-[#ffd966] text-[#4b2e00]'
            : variant === 'review'
              ? 'bg-[#e8f5ff] text-[#0f172a]'
              : variant === 'publish'
                ? 'bg-[#5b3df6] text-white'
                : 'bg-[#f1f5f9] text-[#0f172a]'

  return <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${style}`}>{children}</span>
}

function StepPill({ label, variant }) {
  const style =
    variant === 'draft' || variant === 'review'
      ? 'bg-[#e8f5ff] text-[#0f172a]'
      : variant === 'publish'
        ? 'bg-[#5b3df6] text-white'
        : 'bg-[#f1f5f9] text-[#0f172a]'

  return (
    <div className={`flex h-[30px] items-center px-[12px] rounded-[12px] shrink-0 ${style}`}>
      <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[12px]">
        {label}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const adminSharePercent = 30
  const instructorSharePercent = 70
  const sampleCoursePrice = 500
  const adminShareAmount = Math.round((sampleCoursePrice * adminSharePercent) / 100)
  const instructorShareAmount = sampleCoursePrice - adminShareAmount

  const courses = [
    {
      title: 'STEM Explorers Program',
      meta: '24 lessons • 8 modules • ₹4,999',
      steps: ['draft', 'review', 'publish'],
      action: { label: 'Edit', kind: 'outline' },
    },
    {
      title: 'Coding for Kids Bootcamp',
      meta: '16 lessons • 5 modules • ₹3,499',
      steps: ['draft', 'publish', 'review'],
      action: { label: 'Set Pricing', kind: 'outline' },
    },
    {
      title: 'Creative English Club',
      meta: '12 lessons • 4 modules • ₹2,299',
      steps: ['draft', 'review', 'publish'],
      action: { label: 'Continue', kind: 'draft' },
    },
  ]

  const liveClasses = [
    {
      title: 'Math Mastery Live',
      meta: 'Today • 4:00 PM • Zoom link ready',
      status: { text: 'Ready', variant: 'ready' },
    },
    {
      title: 'Science Lab Workshop',
      meta: 'Tomorrow • 11:00 AM • Google Meet',
      status: { text: 'Pending link', variant: 'pending' },
    },
    {
      title: 'English Speaking Club',
      meta: 'Fri • 5:30 PM • Meet link active',
      status: { text: 'Active', variant: 'active' },
    },
  ]

  const instructors = [
    {
      name: 'Aisha Verma',
      meta: 'STEM Explorers • 3 active batches',
      avatar: AVATAR_AISHA,
      cta: { type: 'pill', text: 'Assigned', variant: 'ready' },
    },
    {
      name: 'Liam Carter',
      meta: 'Coding for Kids • 2 active batches',
      avatar: AVATAR_LIAM,
      cta: { type: 'pill', text: 'Assigned', variant: 'ready' },
    },
    {
      name: 'Nadia Brown',
      meta: 'Creative English • Pending course mapping',
      avatar: AVATAR_NADIA,
      cta: { type: 'button', text: 'Map Course' },
    },
  ]

  const students = [
    {
      name: 'Arjun Singh',
      meta: 'Coding for Kids Bootcamp • 82% progress',
      avatar: AVATAR_ARJUN,
      status: { text: 'On track', variant: 'ready' },
    },
    {
      name: 'Mia Chen',
      meta: 'STEM Explorers • 64% progress',
      avatar: AVATAR_MIA,
      status: { text: 'Needs follow-up', variant: 'pending' },
    },
    {
      name: 'Sofia Ramirez',
      meta: 'Creative English Club • 91% progress',
      avatar: AVATAR_SOFIA,
      status: { text: 'Excellent', variant: 'active' },
    },
  ]

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      {/* Removed Header component */}
      
      <div className="bg-gradient-to-b flex flex-col from-[#f6f8fa] gap-[24px] h-full p-[28px] to-[#f7fcff]">
        {/* Hero */}
        <section className="border border-black/[0.08] border-solid content-stretch flex flex-col items-start pb-[23px] pt-[25px] px-[25px] relative rounded-[8px] shrink-0 w-full bg-gradient-to-br from-white to-[#e8f5ff]">
          <div className="flex flex-col gap-[11px] items-start relative shrink-0">
            <div className="bg-[#ffd966] flex items-center px-[10px] py-[6.5px] rounded-[12px] shrink-0">
              <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[#4b2e00] text-[12px]">
                Daily operations snapshot
              </div>
            </div>

            <div className="flex flex-col font-bold h-[31.59px] justify-center text-[#0f172a] text-[28px]">
              Run courses, track learners, and grow revenue from one institute workspace.
            </div>

            <div className="flex flex-col font-normal h-[17px] justify-center leading-[0] text-[#94a3b8] text-[14px]">
              Manage your courses, instructors, students, live classes, and payments with a clear operational overview.
            </div>
          </div>

          <div className="mt-4 flex items-center gap-[12px]">
            <div className="bg-[#5b3df6] flex items-center gap-[8px] h-[40px] justify-center px-[16px] rounded-[6px] shrink-0">
              <Plus className="h-[18px] w-[18px] text-white" />
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-white text-[14px]">
                Create Course
              </div>
            </div>
            <div className="border border-black/[0.08] flex gap-[8px] h-[40px] items-center justify-center px-[17px] py-[0.25px] rounded-[6px] shrink-0 bg-white">
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[14px]">
                This week
              </div>
            </div>
          </div>
        </section>

        {/* Rest of your dashboard content remains the same */}
        {/* ... all the other sections (stats, courses, etc.) ... */}
        
        {/* Stats row */}
        <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(4,minmax(0,1fr))]">
          <div className="bg-white border border-black/[0.08] border-solid col-1 flex flex-col gap-[16px] items-start p-[19px] rounded-[8px]">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start w-[98.3px]">
                <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#94a3b8] text-[14px]">
                  Total Students
                </div>
                <div className="flex flex-col font-bold h-[30px] justify-center leading-[0] text-[#0f172a] text-[30px] tracking-[-0.6px]">
                  12,480
                </div>
              </div>
              <div className="bg-[#e8f5ff] flex items-center justify-center relative rounded-[6px] shrink-0 size-[40px]">
                <Users className="h-[18px] w-[18px] text-[#5b3df6]" />
              </div>
            </div>
            <div className="bg-[#2dd4bf] h-[28px] rounded-[12px] relative flex items-center px-[10px]">
              <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[#023b33] text-[12px] w-[94.16px]">
                +324 this month
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] border-solid col-2 flex flex-col gap-[16px] items-start p-[19px] rounded-[8px]">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start w-[92.42px]">
                <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#94a3b8] text-[14px]">
                  Total Courses
                </div>
                <div className="flex flex-col font-bold h-[30px] justify-center leading-[0] text-[#0f172a] text-[30px] tracking-[-0.6px]">
                  84
                </div>
              </div>
              <div className="bg-[#e8f5ff] flex items-center justify-center relative rounded-[6px] shrink-0 size-[40px]">
                <BookOpen className="h-[18px] w-[18px] text-[#5b3df6]" />
              </div>
            </div>
            <div className="bg-[#f0f4f8] h-[28px] rounded-[12px] relative flex items-center px-[10px]">
              <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[#94a3b8] text-[12px] w-[56.2px]">
                18 in draft
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] border-solid col-3 flex flex-col gap-[16px] items-start p-[19px] rounded-[8px]">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start w-[125.19px]">
                <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#94a3b8] text-[14px]">
                  Revenue Overview
                </div>
                <div className="flex flex-col font-bold h-[30px] justify-center leading-[0] text-[#0f172a] text-[30px] tracking-[-0.6px]">
                  ₹9.6L
                </div>
              </div>
              <div className="bg-[#e8f5ff] flex items-center justify-center relative rounded-[6px] shrink-0 size-[40px]">
                <Wallet className="h-[18px] w-[18px] text-[#5b3df6]" />
              </div>
            </div>
            <div className="bg-[#ffd966] h-[28px] rounded-[12px] relative flex items-center px-[10px]">
              <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[#4b2e00] text-[12px] w-[93.53px]">
                ₹1.4L this month
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] border-solid col-4 flex flex-col gap-[16px] items-start p-[19px] rounded-[8px]">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start w-[124.72px]">
                <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#94a3b8] text-[14px]">
                  Active Enrollments
                </div>
                <div className="flex flex-col font-bold h-[30px] justify-center leading-[0] text-[#0f172a] text-[30px] tracking-[-0.6px]">
                  6,238
                </div>
              </div>
              <div className="bg-[#e8f5ff] flex items-center justify-center relative rounded-[6px] shrink-0 size-[40px]">
                <GraduationCap className="h-[18px] w-[18px] text-[#5b3df6]" />
              </div>
            </div>
            <div className="bg-[#2dd4bf] h-[28px] rounded-[12px] relative flex items-center px-[10px]">
              <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[#023b33] text-[12px] w-[112.59px]">
                91% active learners
              </div>
            </div>
          </div>
        </div>

        {/* Subscription revenue split */}
        <section className="bg-white border border-black/[0.08] border-solid rounded-[8px] p-[21px]">
          <div className="flex items-center justify-between w-full">
            <div>
              <div className="font-bold text-[18px] text-[#0f172a]">Subscription revenue split</div>
              <div className="text-[13px] text-[#94a3b8] mt-[4px]">
                Course price example ₹{sampleCoursePrice} with admin and instructor percentage split.
              </div>
            </div>
            <div className="bg-[#eef2ff] h-[30px] rounded-[12px] flex items-center px-[12px]">
              <div className="text-[12px] font-medium text-[#4338ca]">Configurable in Subscriptions</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-[16px]">
            <div className="bg-[#f8fafc] rounded-[6px] p-[14px] border border-black/[0.06]">
              <div className="text-[13px] font-medium text-[#94a3b8]">Admin share</div>
              <div className="text-[24px] font-bold text-[#0f172a] mt-[6px]">{adminSharePercent}% (₹{adminShareAmount})</div>
            </div>
            <div className="bg-[#f8fafc] rounded-[6px] p-[14px] border border-black/[0.06]">
              <div className="text-[13px] font-medium text-[#94a3b8]">Instructor share</div>
              <div className="text-[24px] font-bold text-[#0f172a] mt-[6px]">{instructorSharePercent}% (₹{instructorShareAmount})</div>
            </div>
          </div>
        </section>

        {/* Keep all other sections exactly as they were */}
        {/* Top 2 cards: Course management + Live classes */}
        <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[minmax(0,1.80fr)_minmax(0,1.20fr)]">
          <div className="bg-white border border-black/[0.08] border-solid content-stretch flex flex-col gap-[18px] items-start p-[21px] rounded-[8px]">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-[4px] items-start w-[287.92px]">
                <div className="font-bold text-[18px] text-[#0f172a]">Course management</div>
                <div className="text-[13px] text-[#94a3b8]">
                  Build, review, publish, and price your programs
                </div>
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="bg-[#e8f5ff] border border-black/[0.08] flex h-[40px] items-center justify-center px-[17px] rounded-[6px]">
                  <div className="text-[14px] font-medium text-[#0f172a]">Add Modules</div>
                </div>
                <div className="bg-[#5b3df6] flex h-[40px] items-center justify-center px-[16px] rounded-[6px]">
                  <div className="text-[14px] font-medium text-white">Upload Videos / PDFs</div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col">
              {courses.map((c, idx) => (
                <div
                  key={c.title}
                  className={`flex flex-col ${
                    idx === 0 ? '' : 'border-t border-black/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between pb-[14px] pt-[15px]">
                    <div className="flex gap-[12px] items-center">
                      <div className="bg-[#e8f5ff] flex items-center justify-center rounded-[6px] shrink-0 size-[42px]">
                        <BookOpen className="h-[18px] w-[18px] text-[#5b3df6]" />
                      </div>
                      <div className="flex flex-col w-[202.78px]">
                        <div className="font-semibold text-[14px] text-[#0f172a]">{c.title}</div>
                        <div className="text-[13px] text-[#94a3b8] mt-[4px]">{c.meta}</div>
                        <div className="flex gap-[8px] items-center pt-[8px]">
                          <StepPill label="Draft" variant="draft" />
                          <StepPill label="Review" variant="review" />
                          <StepPill label="Publish" variant="publish" />
                        </div>
                      </div>
                    </div>

                    {c.action.kind === 'draft' ? (
                      <div className="bg-[#ffd966] h-[28px] rounded-[12px] flex items-center px-[10px]">
                        <div className="text-[12px] font-medium text-[#4b2e00]">{c.action.label}</div>
                      </div>
                    ) : (
                      <div className="border border-black/[0.08] flex h-[40px] items-center justify-center px-[17px] rounded-[6px]">
                        <div className="text-[14px] font-medium text-[#0f172a] text-center">
                          {c.action.label}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px]">
            <div className="flex flex-col gap-[4px] items-start w-full">
              <div className="font-bold text-[18px] text-[#0f172a]">Live classes</div>
              <div className="text-[13px] text-[#94a3b8]">
                Schedule and manage Zoom or Meet sessions
              </div>
            </div>
            <div className="bg-[#e8f5ff] border border-black/[0.08] flex h-[40px] items-center justify-center rounded-[6px] px-[17px]">
              <div className="text-[14px] font-medium text-[#0f172a] text-center">Schedule Class</div>
            </div>

            <div className="flex flex-col w-full">
              {liveClasses.map((lc, idx) => (
                <div key={lc.title} className={`${idx === 0 ? '' : 'border-t border-black/[0.08]'} pb-[14px] pt-[15px]`}>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-[4px] w-[225px]">
                      <div className="font-semibold text-[14px] text-[#0f172a]">{lc.title}</div>
                      <div className="text-[13px] text-[#94a3b8]">{lc.meta}</div>
                    </div>
                    <div className={`${lc.status.variant === 'ready' || lc.status.variant === 'active' ? 'bg-[#2dd4bf]' : 'bg-[#ffd966]'} h-[28px] flex items-center rounded-[12px] px-[10px]`}>
                      <div className={`flex flex-col font-medium h-[15px] justify-center leading-[0] text-[12px] ${lc.status.variant === 'pending' ? 'text-[#4b2e00]' : 'text-[#023b33]'}`}>
                        {lc.status.text}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle row: Instructor management + Student management */}
        <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-2">
          {/* Instructor */}
          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px]">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-[4px] w-[307.58px]">
                <div className="font-bold text-[18px] text-[#0f172a]">Instructor management</div>
                <div className="text-[13px] text-[#94a3b8]">
                  Add instructors and assign them to active courses
                </div>
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="bg-[#e8f5ff] border border-black/[0.08] flex h-[40px] items-center justify-center rounded-[6px] px-[17px]">
                  <div className="text-[14px] font-medium text-[#0f172a] text-center">Assign Courses</div>
                </div>
                <div className="bg-[#5b3df6] flex h-[40px] items-center justify-center rounded-[6px] px-[16px]">
                  <div className="text-[14px] font-medium text-white text-center">Add Instructor</div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col">
              {instructors.map((inst, idx) => (
                <div key={inst.name} className={`${idx === 0 ? '' : 'border-t border-black/[0.08]'} flex items-center justify-between pb-[14px] pt-[15px]`}>
                  <div className="flex items-center gap-[12px]">
                    <Avatar src={inst.avatar} alt={inst.name} className="h-[42px] w-[42px]" />
                    <div className="flex flex-col w-[211.09px]">
                      <div className="font-semibold text-[14px] text-[#0f172a]">{inst.name}</div>
                      <div className="text-[13px] text-[#94a3b8] mt-[4px]">{inst.meta}</div>
                    </div>
                  </div>

                  {inst.cta.type === 'pill' ? (
                    <div className="bg-[#2dd4bf] h-[28px] rounded-[12px] flex items-center px-[10px]">
                      <div className="text-[12px] font-medium text-[#023b33]">{inst.cta.text}</div>
                    </div>
                  ) : (
                    <div className="border border-black/[0.08] flex h-[40px] items-center justify-center rounded-[6px] px-[17px]">
                      <div className="text-[14px] font-medium text-[#0f172a] text-center">{inst.cta.text}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Student */}
          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px]">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-[4px] w-[287.98px]">
                <div className="font-bold text-[18px] text-[#0f172a]">Student management</div>
                <div className="text-[13px] text-[#94a3b8]">
                  Add learners, upload CSVs, and track progress
                </div>
              </div>
              <div className="bg-[#e8f5ff] border border-black/[0.08] flex h-[40px] items-center justify-center rounded-[6px] px-[17px]">
                <div className="text-[14px] font-medium text-[#0f172a] text-center">Track Progress</div>
              </div>
            </div>

            <div className="w-full flex flex-col">
              {students.map((st, idx) => (
                <div key={st.name} className={`${idx === 0 ? '' : 'border-t border-black/[0.08]'} flex items-center justify-between pb-[14px] pt-[15px]`}>
                  <div className="flex items-center gap-[12px]">
                    <Avatar src={st.avatar} alt={st.name} className="h-[42px] w-[42px]" />
                    <div className="flex flex-col w-[262.89px]">
                      <div className="font-semibold text-[14px] text-[#0f172a]">{st.name}</div>
                      <div className="text-[13px] text-[#94a3b8] mt-[4px]">{st.meta}</div>
                    </div>
                  </div>

                  <div
                    className={`h-[28px] rounded-[12px] flex items-center px-[10px] ${
                      st.status.variant === 'pending' ? 'bg-[#ffd966]' : 'bg-[#2dd4bf]'
                    }`}
                  >
                    <div className={`text-[12px] font-medium ${st.status.variant === 'pending' ? 'text-[#4b2e00]' : 'text-[#023b33]'}`}>
                      {st.status.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bulk upload row */}
            <div className="border-t border-black/[0.08] w-full pt-[15px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[12px]">
                  <div className="bg-[#e8f5ff] flex items-center justify-center overflow-clip rounded-[6px] shrink-0 size-[42px]">
                    <Upload className="h-[18px] w-[18px] text-[#5b3df6]" />
                  </div>
                  <div className="flex flex-col w-[236px]">
                    <div className="font-semibold text-[14px] text-[#0f172a]">Bulk Upload (CSV)</div>
                    <div className="text-[13px] text-[#94a3b8] mt-[4px]">
                      148 student records queued for import
                    </div>
                  </div>
                </div>
                <div className="bg-[#5b3df6] h-[40px] rounded-[6px] flex items-center justify-center px-[16px]">
                  <div className="text-[14px] font-medium text-white text-center">Review CSV</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: Payments & coupons + Analytics */}
        <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-2">
          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px]">
            <div className="flex flex-col gap-[4px] w-full">
              <div className="font-bold text-[18px] text-[#0f172a]">Payments &amp; coupons</div>
              <div className="text-[13px] text-[#94a3b8]">
                Create discounts, review transactions, and monitor revenue
              </div>
            </div>

            <div className="flex items-center gap-[12px]">
              <div className="bg-[#e8f5ff] border border-black/[0.08] flex h-[40px] items-center justify-center rounded-[6px] px-[17px] flex-1">
                <div className="text-[14px] font-medium text-[#0f172a] text-center">Create Coupon</div>
              </div>
              <div className="bg-[#e8f5ff] border border-black/[0.08] flex h-[40px] items-center justify-center rounded-[6px] px-[17px] flex-1">
                <div className="text-[14px] font-medium text-[#0f172a] text-center">Revenue Reports</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-[12px] w-full">
              <div className="bg-[#e8f5ff] rounded-[6px] p-[14px]">
                <div className="text-[14px] font-medium text-[#94a3b8]">Coupon use</div>
                <div className="text-[22px] font-bold text-[#0f172a] mt-[6px]">482</div>
              </div>
              <div className="bg-[#e8f5ff] rounded-[6px] p-[14px]">
                <div className="text-[14px] font-medium text-[#94a3b8]">Avg. order</div>
                <div className="text-[22px] font-bold text-[#0f172a] mt-[6px]">₹1,840</div>
              </div>
              <div className="bg-[#e8f5ff] rounded-[6px] p-[14px]">
                <div className="text-[14px] font-medium text-[#94a3b8]">Refunds</div>
                <div className="text-[22px] font-bold text-[#0f172a] mt-[6px]">1.2%</div>
              </div>
            </div>

            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-[14px] w-[55%]">
                <div className="bg-[#e8f5ff] rounded-[6px] p-[14px] flex items-center justify-between">
                  <div className="flex items-center gap-[12px]">
                    <div className="bg-[#e8f5ff] rounded-[6px] flex items-center justify-center h-[42px] w-[42px]">
                      <Wallet className="h-[18px] w-[18px] text-[#5b3df6]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[14px] text-[#0f172a]">SUMMER20</div>
                      <div className="text-[13px] text-[#94a3b8] mt-[4px]">20% off • 184 redemptions</div>
                    </div>
                  </div>
                  <div className="bg-[#2dd4bf] h-[28px] rounded-[12px] flex items-center px-[10px]">
                    <div className="text-[12px] font-medium text-[#023b33]">Active</div>
                  </div>
                </div>

                <div className="bg-[#e8f5ff] rounded-[6px] p-[14px] flex items-center justify-between">
                  <div className="flex items-center gap-[12px]">
                    <div className="bg-[#e8f5ff] rounded-[6px] flex items-center justify-center h-[42px] w-[42px]">
                      <Wallet className="h-[18px] w-[18px] text-[#5b3df6]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[14px] text-[#0f172a]">WELCOME500</div>
                      <div className="text-[13px] text-[#94a3b8] mt-[4px]">₹500 off • 92 redemptions</div>
                    </div>
                  </div>
                  <div className="bg-[#ffd966] h-[28px] rounded-[12px] flex items-center px-[10px]">
                    <div className="text-[12px] font-medium text-[#4b2e00]">Limited</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-black/[0.08] w-full pt-[15px]">
              <div className="flex items-center justify-between pb-[14px] pt-[15px]">
                <div className="flex items-center gap-[12px]">
                  <div className="bg-[#e8f5ff] rounded-[6px] flex items-center justify-center h-[42px] w-[42px]">
                    <BarChart3 className="h-[18px] w-[18px] text-[#5b3df6]" />
                  </div>
                  <div className="flex flex-col w-[260px]">
                    <div className="font-semibold text-[14px] text-[#0f172a]">Recent transactions</div>
                    <div className="text-[13px] text-[#94a3b8] mt-[4px]">
                      42 payments captured in the last 24 hours
                    </div>
                  </div>
                </div>
                <div className="bg-[#5b3df6] h-[40px] rounded-[6px] flex items-center justify-center px-[16px]">
                  <div className="text-[14px] font-medium text-white text-center">View Transactions</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px]">
            <div className="flex flex-col gap-[4px] w-full">
              <div className="font-bold text-[18px] text-[#0f172a]">Analytics</div>
              <div className="text-[13px] text-[#94a3b8]">
                Course performance and student engagement
              </div>
            </div>

            {/* Bars */}
            <div className="w-full h-[196px] flex flex-col gap-[12px] pt-[4px]">
              <div className="flex gap-[14px] items-end justify-center h-full pt-[20px]">
                <div className="bg-gradient-to-b from-[#ffb86b] to-[#5b3df6] w-[46px] rounded-tl-[4px] rounded-tr-[4px] h-[82px]" />
                <div className="bg-gradient-to-b from-[#ffb86b] to-[#5b3df6] w-[46px] rounded-tl-[4px] rounded-tr-[4px] h-[108px]" />
                <div className="bg-gradient-to-b from-[#ffb86b] to-[#5b3df6] w-[46px] rounded-tl-[4px] rounded-tr-[4px] h-[124px]" />
                <div className="bg-gradient-to-b from-[#ffb86b] to-[#5b3df6] w-[46px] rounded-tl-[4px] rounded-tr-[4px] h-[148px]" />
                <div className="bg-gradient-to-b from-[#ffb86b] to-[#5b3df6] w-[46px] rounded-tl-[4px] rounded-tr-[4px] h-[132px]" />
              </div>
              <div className="flex justify-center gap-[14px] text-[#94a3b8] text-[12px]">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-[4px] border-t border-black/[0.08] pt-[15px]">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[4px] w-[193px]">
                  <div className="font-semibold text-[14px] text-[#0f172a]">Course performance</div>
                  <div className="text-[13px] text-[#94a3b8]">Top performer: STEM Explorers</div>
                </div>
                <div className="bg-[#2dd4bf] h-[28px] rounded-[12px] flex items-center px-[10px]">
                  <div className="text-[12px] font-medium text-[#023b33]">94%</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-[15px] border-t border-black/[0.08]">
                <div className="flex flex-col gap-[4px] w-[192px] pt-[15px]">
                  <div className="font-semibold text-[14px] text-[#0f172a]">Student engagement</div>
                  <div className="text-[13px] text-[#94a3b8]">Average watch time per learner</div>
                </div>
                <div className="bg-[#f0f4f8] h-[28px] rounded-[12px] flex items-center px-[10px]">
                  <div className="text-[12px] font-medium text-[#94a3b8]">38 min</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}