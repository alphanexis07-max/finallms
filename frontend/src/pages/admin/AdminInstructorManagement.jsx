import React, { useState } from 'react'
import {
  Search,
  Upload,
  Plus,
  Users,
  Calendar,
  Star,
  UserPlus,
  ChevronDown,
  Camera,
  Mail,
  Phone,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Clock3,
  TriangleAlert,
  Check,
  X,
  Award,
  TrendingUp,
  CalendarDays,
  MessageSquare,
  Quote,
  Briefcase,
  GraduationCap,
  Video,
  FileText,
  Settings,
  MoreHorizontal,
  ThumbsUp,
  Eye
} from 'lucide-react'

// Figma avatar assets
const AVATAR_RAHUL = 'https://www.figma.com/api/mcp/asset/5b24609b-97ad-4bea-af20-b4f4df404b75'
const AVATAR_AISHA = 'https://www.figma.com/api/mcp/asset/3e187a9c-3e48-41dc-8f03-5affd73e7e5f'
const AVATAR_LIAM = 'https://www.figma.com/api/mcp/asset/ccc04c84-4ac7-4c6c-b67f-2ff1887c4b83'
const AVATAR_NADIA = 'https://www.figma.com/api/mcp/asset/9834fb2c-3d16-47cd-9e85-eaf390f7183a'
const AVATAR_OMAR = 'https://www.figma.com/api/mcp/asset/36623965-019b-4b68-bd68-2bf7a2e38748'

function Avatar({ src, alt = '', className = '' }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`h-[36px] w-[36px] rounded-[6px] object-cover ${className}`}
      onError={(e) => {
        e.target.style.display = 'none'
        e.target.nextSibling.style.display = 'flex'
      }}
    />
  )
}

function Pill({ children, variant }) {
  const style =
    variant === 'success'
      ? 'bg-[#2dd4bf] text-[#023b33]'
      : variant === 'warning'
        ? 'bg-[#ffd966] text-[#4b2e00]'
        : variant === 'secondary'
          ? 'bg-[#e8f5ff] text-[#0f172a]'
          : 'bg-[#f1f5f9] text-[#0f172a]'

  return <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${style}`}>{children}</span>
}

function StatCard({ label, value, sub, subVariant, icon }) {
  const subColors = {
    success: 'bg-emerald-100 text-emerald-700',
    neutral: 'bg-[#f0f4f8] text-[#94a3b8]',
    warning: 'bg-[#ffd966] text-[#4b2e00]',
  }
  return (
    <div className="flex flex-col gap-3 rounded-[8px] border border-black/[0.08] bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-[#94a3b8]">{label}</p>
        <div className="rounded-[6px] bg-[#e8f5ff] p-2">{icon}</div>
      </div>
      <p className="text-[30px] font-bold leading-none tracking-tight text-[#0f172a]">{value}</p>
      <span
        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-medium ${subColors[subVariant] || subColors.neutral}`}
      >
        {sub}
      </span>
    </div>
  )
}

// View Instructor Modal Component
function ViewInstructorModal({ instructor, onClose }) {
  if (!instructor) return null

  const stats = [
    { label: 'Total Students Taught', value: '142', change: '+12 this term', icon: Users },
    { label: 'Active Batches', value: '3', sub: '16 hrs / week load', icon: Calendar },
    { label: 'Average Rating', value: '4.9', sub: 'Top 5% instructor', icon: Star },
    { label: 'Attendance Rate', value: '98%', sub: 'Over last 30 days', icon: TrendingUp },
  ]

  const upcomingClasses = [
    { title: 'STEM Explorers - Group A', time: 'Today, 4:00 PM (1h 30m)', students: '18 students • Grade 4-6', schedule: 'Mon, Wed' },
    { title: 'STEM Explorers - Group B', time: 'Tomorrow, 4:00 PM (1h 30m)', students: '15 students • Grade 4-6', schedule: 'Tue, Thu' },
    { title: 'Advanced Robotics Workshop', time: 'Saturday, 10:00 AM (3h)', students: '12 students • Grade 7-9', schedule: 'Saturday' },
  ]

  const reviews = [
    { name: 'Sara K.', daysAgo: '2 days ago', comment: '"Awesome! I wish I had this when I was in school!"', detail: 'First robot and is so proud of his achievement.' },
    { name: 'Michael T.', daysAgo: '1 week ago', comment: '"Very engaging classes. Clear instructions and fun projects that keep the children interested all hour."', detail: '' },
  ]

  const qualifications = ['STEM Core', 'Scratch Programming', 'Robotics Level 1 & 2', 'Python Basics']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-3 sm:p-4">
      <div className="relative w-full max-w-[1200px] my-4 sm:my-8 mx-0 sm:mx-4 bg-white rounded-[16px] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/[0.08] bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Avatar src={instructor.avatar} alt={instructor.name} className="h-10 w-10 rounded-full" />
            <div>
              <h2 className="text-xl font-bold text-[#0f172a]">{instructor.name}</h2>
              <p className="text-[13px] text-[#94a3b8]">{instructor.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-[#94a3b8]" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-120px)] overflow-y-auto p-4 sm:p-6">
          {/* Stats Grid */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="border border-black/[0.08] rounded-[12px] p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-[#5b3df6]" />
                  <span className="text-[11px] text-[#94a3b8]">{stat.change || stat.sub}</span>
                </div>
                <div className="text-[28px] font-bold text-[#0f172a]">{stat.value}</div>
                <div className="text-[12px] text-[#94a3b8] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Left Column - Upcoming Classes & Reviews */}
            <div className="space-y-6 xl:col-span-2">
              {/* Upcoming Classes */}
              <div className="border border-black/[0.08] rounded-[12px] p-5">
                <h3 className="text-[16px] font-semibold text-[#0f172a] mb-4">Upcoming Classes</h3>
                <div className="space-y-4">
                  {upcomingClasses.map((cls, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-3 border-b border-black/[0.08] last:border-0">
                      <div className="bg-[#ede7ff] rounded-[8px] p-2">
                        <CalendarDays className="h-5 w-5 text-[#5b3df6]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[14px] text-[#0f172a]">{cls.title}</p>
                        <p className="text-[12px] text-[#94a3b8] mt-1">{cls.time}</p>
                        <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-[#64748b]">
                          <span>{cls.students}</span>
                          <span>{cls.schedule}</span>
                        </div>
                      </div>
                      <button className="text-[11px] font-medium text-[#5b3df6] hover:underline">Join</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="border border-black/[0.08] rounded-[12px] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-semibold text-[#0f172a]">Recent Reviews</h3>
                  <button className="text-[12px] text-[#5b3df6] font-medium">View all</button>
                </div>
                <div className="space-y-4">
                  {reviews.map((review, idx) => (
                    <div key={idx} className="pb-3 border-b border-black/[0.08] last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-[#e8f5ff] rounded-full h-8 w-8 flex items-center justify-center">
                          <span className="text-[12px] font-bold text-[#5b3df6]">{review.name[0]}</span>
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#0f172a]">{review.name}</p>
                          <p className="text-[10px] text-[#94a3b8]">{review.daysAgo}</p>
                        </div>
                      </div>
                      <p className="text-[13px] text-[#334155] italic">{review.comment}</p>
                      {review.detail && <p className="text-[12px] text-[#64748b] mt-1">{review.detail}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Qualifications & Institute Growth */}
            <div className="space-y-6">
              {/* Qualifications & Course Mapping */}
              <div className="border border-black/[0.08] rounded-[12px] p-5">
                <h3 className="text-[16px] font-semibold text-[#0f172a] mb-3">Qualifications & Course Mapping</h3>
                <div className="space-y-2">
                  {qualifications.map((qual, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-[#5b3df6]" />
                      <span className="text-[13px] text-[#334155]">{qual}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Institute Growth */}
              <div className="border border-black/[0.08] rounded-[12px] p-5">
                <h3 className="text-[16px] font-semibold text-[#0f172a] mb-3">Institute growth</h3>
                <p className="text-[12px] text-[#94a3b8] mb-2">Enrollment target progress for this month</p>
                <div className="mb-2">
                  <div className="flex justify-between text-[12px] text-[#334155] mb-1">
                    <span>76% of monthly goal achieved</span>
                    <span className="font-semibold text-[#5b3df6]">76%</span>
                  </div>
                  <div className="h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#5b3df6] rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
              </div>

              {/* Job Postings / Notes */}
              <div className="border border-black/[0.08] rounded-[12px] p-5 bg-[#fafcff]">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 text-[#94a3b8] mt-0.5" />
                  <p className="text-[12px] text-[#64748b] italic">
                    "Excellent subject knowledge and classroom management. Students love the hands-on projects."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-black/[0.08] bg-[#fafcff] px-4 py-4 flex flex-col gap-3 sm:px-6 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-black/[0.08] rounded-[6px] text-[13px] text-[#64748b] hover:bg-gray-50">
            Close
          </button>
          <button className="px-4 py-2 bg-[#5b3df6] text-white text-[13px] font-semibold rounded-[6px] hover:bg-[#4a2ed8]">
            Schedule Meeting
          </button>
        </div>
      </div>
    </div>
  )
}

// Assign Course Modal Component
function AssignCourseModal({ instructor, onClose, onAssign }) {
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedBatch, setSelectedBatch] = useState('')
  const [teachingRole, setTeachingRole] = useState('primary')
  const [note, setNote] = useState('')

  const courses = [
    { id: 1, name: 'Creative English Level 1', hours: 4.5, level: 'Beginner', learners: 58 },
    { id: 2, name: 'Creative English Level 2', hours: 4.5, level: 'Intermediate', learners: 46 },
    { id: 3, name: 'Advanced English Writing', hours: 3, level: 'Advanced', learners: 29 },
  ]

  const batches = {
    'Creative English Level 1': [
      { key: 'A', title: 'Batch A - Morning', sub: 'Starts next week', days: 'Mon, Wed, Fri', time: '10:00 AM - 11:30 AM', hours: '4.5 hrs/wk', seats: '24 / 30 Enrolled' },
      { key: 'B', title: 'Batch B - Evening', sub: 'Currently active', days: 'Tue, Thu', time: '5:00 PM - 6:30 PM', hours: '3 hrs/wk', seats: '28 / 30 Enrolled' },
    ],
    'Creative English Level 2': [
      { key: 'C', title: 'Batch C - Weekend', sub: 'Starts next month', days: 'Sat, Sun', time: '10:00 AM - 1:00 PM', hours: '6 hrs/wk', seats: '0 / 30 Enrolled' },
    ],
    'Advanced English Writing': [
      { key: 'D', title: 'Batch D - Evening Advanced', sub: 'Starts next week', days: 'Mon, Thu', time: '6:00 PM - 7:30 PM', hours: '3 hrs/wk', seats: '12 / 20 Enrolled' },
    ],
  }

  const selectedBatchesList = selectedCourse ? batches[selectedCourse] || [] : []
  const selectedBatchData = selectedBatchesList.find(b => b.key === selectedBatch)
  const additionalHours = selectedBatchData ? parseFloat(selectedBatchData.hours) : 0
  const currentLoad = instructor?.load ? parseInt(instructor.load) || 0 : 0
  const newTotal = currentLoad + additionalHours
  const isOverload = newTotal > 25
  const selectedCourseData = courses.find((course) => course.name === selectedCourse)
  const loadPercent = Math.min((newTotal / 25) * 100, 100)

  if (!instructor) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="relative flex w-full max-w-[1140px] max-h-[calc(100vh-30px)] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_28px_70px_rgba(15,23,42,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/[0.08] bg-white px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-[10px] bg-[#f0f4f8] px-3 py-1 text-[11px] font-medium text-[#64748b]">
              Course mapping
            </span>
            <h2 className="mt-2 text-[22px] font-bold text-[#0f172a]">Assign Course & Batch</h2>
            <p className="mt-1 text-[12px] text-[#94a3b8]">Map instructor to the right cohort with safe workload planning.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-[#94a3b8]" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-hidden xl:grid-cols-[1.35fr_0.9fr]">
          <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
            {/* Instructor Info */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-black/[0.08] bg-[#fbfdff] p-4">
              <div className="flex items-center gap-3">
                <Avatar src={instructor.avatar} alt={instructor.name} className="h-12 w-12 rounded-full" />
                <div>
                  <p className="text-[18px] font-semibold text-[#111827]">{instructor.name}</p>
                  <p className="text-[12px] text-[#94a3b8]">Current load: {instructor.load} ({instructor.capacity || '82% capacity'})</p>
                </div>
              </div>
              <Pill variant={instructor.statusVariant}>{instructor.status}</Pill>
            </div>

            {/* Select Course */}
            <div className="mb-6 rounded-[14px] border border-black/[0.08] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5b3df6] text-[11px] font-semibold text-white">1</div>
                <h4 className="text-[16px] font-semibold text-[#1f2937]">Select Course</h4>
              </div>
              <label className="mb-1.5 block text-[12px] font-medium text-[#334155]">Choose a course from directory...</label>
              <div className="relative">
                <select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value)
                    setSelectedBatch('')
                  }}
                  className="w-full appearance-none rounded-[8px] border border-black/[0.08] bg-white px-3 py-2.5 text-[14px] text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] cursor-pointer"
                >
                  <option value="">Select a course...</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
              </div>
              {selectedCourseData && (
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#64748b]">
                  <span className="rounded-full bg-[#f0f4f8] px-2.5 py-1">{selectedCourseData.level}</span>
                  <span className="rounded-full bg-[#e8f5ff] px-2.5 py-1 text-[#2563eb]">{selectedCourseData.learners} active learners</span>
                  <span className="rounded-full bg-[#ede7ff] px-2.5 py-1 text-[#5b3df6]">{selectedCourseData.hours} hrs / week</span>
                </div>
              )}
            </div>

            {/* Select Batch */}
            <div className="mb-6 rounded-[14px] border border-black/[0.08] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5b3df6] text-[11px] font-semibold text-white">2</div>
                <h4 className="text-[16px] font-semibold text-[#1f2937]">Select Batch</h4>
              </div>
              {!selectedCourse ? (
                <p className="text-[12px] text-[#94a3b8] italic">Please select a course first</p>
              ) : selectedBatchesList.length === 0 ? (
                <p className="text-[12px] text-[#f97316]">No batches available for this course</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {selectedBatchesList.map((batch) => (
                    <button
                      key={batch.key}
                      onClick={() => setSelectedBatch(batch.key)}
                      className={`rounded-[10px] border p-4 text-left transition-all ${
                        selectedBatch === batch.key
                          ? 'border-[#5b3df6] bg-[#faf9ff] shadow-sm'
                          : 'border-black/[0.08] bg-white hover:bg-[#fafcff]'
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-[14px] font-semibold text-[#1f2937]">{batch.title}</p>
                          <p className="mt-0.5 text-[11px] text-[#94a3b8]">{batch.sub}</p>
                        </div>
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-[4px] border-2 ${
                            selectedBatch === batch.key
                              ? 'border-[#5b3df6] bg-[#5b3df6]'
                              : 'border-black/[0.2] bg-white'
                          }`}
                        >
                          {selectedBatch === batch.key && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] text-[#64748b]">{batch.days}</p>
                        <p className="text-[11px] text-[#64748b]">{batch.time}</p>
                        <p className="text-[11px] text-[#64748b]">{batch.hours}</p>
                      </div>
                      <p className="mt-2 text-[11px] font-medium text-[#5b3df6]">{batch.seats}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Teaching Role */}
            <div className="mb-6 rounded-[14px] border border-black/[0.08] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5b3df6] text-[11px] font-semibold text-white">3</div>
                <h4 className="text-[16px] font-semibold text-[#1f2937]">Teaching Role</h4>
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="teachingRole"
                    value="primary"
                    checked={teachingRole === 'primary'}
                    onChange={(e) => setTeachingRole(e.target.value)}
                    className="h-4 w-4 text-[#5b3df6] focus:ring-[#5b3df6]"
                  />
                  <span className="text-[13px] text-[#334155]">Primary Instructor</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="teachingRole"
                    value="co"
                    checked={teachingRole === 'co'}
                    onChange={(e) => setTeachingRole(e.target.value)}
                    className="h-4 w-4 text-[#5b3df6] focus:ring-[#5b3df6]"
                  />
                  <span className="text-[13px] text-[#334155]">Co-Instructor</span>
                </label>
              </div>
            </div>

            <div className="rounded-[14px] border border-black/[0.08] bg-white p-5">
              <label className="mb-1.5 block text-[12px] font-medium text-[#0f172a]">Assignment note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Add handover notes, assessment expectations, or class objectives..."
                className="w-full rounded-[8px] border border-black/[0.08] px-3 py-2 text-[13px] text-[#334155] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
              />
            </div>

            {/* Warning Message */}
            <div className="rounded-[10px] border border-[#ffd966] bg-[#fff8e7] p-4 flex gap-3">
              <TriangleAlert className="h-5 w-5 text-[#f97316] flex-shrink-0" />
              <p className="text-[12px] text-[#4b2e00]">
                Assigning a new batch will increase the instructor's weekly teaching load based on the course schedule.
                Proceed with caution to avoid burnout.
                {selectedBatchData && (
                  <span className="block mt-1 font-medium">
                    Current: {currentLoad} hrs/week {'->'} New: {newTotal} hrs/week
                    {isOverload && <span className="ml-2 text-[#f97316]">Exceeds recommended 25 hrs/week limit.</span>}
                  </span>
                )}
              </p>
            </div>
          </div>

          <aside className="min-h-0 overflow-y-auto border-t border-black/[0.08] bg-[#fafcff] p-4 sm:p-6 xl:border-l xl:border-t-0">
            <div className="space-y-4">
              <div className="rounded-[14px] border border-black/[0.08] bg-white p-4">
                <h3 className="text-[15px] font-semibold text-[#0f172a]">Assignment summary</h3>
                <div className="mt-3 space-y-2 text-[12px] text-[#64748b]">
                  <p><span className="text-[#94a3b8]">Course:</span> <span className="font-medium text-[#334155]">{selectedCourse || 'Not selected'}</span></p>
                  <p><span className="text-[#94a3b8]">Batch:</span> <span className="font-medium text-[#334155]">{selectedBatchData ? selectedBatchData.title : 'Not selected'}</span></p>
                  <p><span className="text-[#94a3b8]">Role:</span> <span className="font-medium text-[#334155]">{teachingRole === 'primary' ? 'Primary Instructor' : 'Co-Instructor'}</span></p>
                </div>
              </div>

              <div className="rounded-[14px] border border-black/[0.08] bg-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold text-[#0f172a]">Workload impact</h3>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${isOverload ? 'bg-[#ffe2db] text-[#c2410c]' : 'bg-[#e8f5ff] text-[#2563eb]'}`}>
                    {isOverload ? 'High load' : 'Safe range'}
                  </span>
                </div>
                <p className="mt-2 text-[12px] text-[#64748b]">{currentLoad} hrs/week {'->'} {newTotal} hrs/week</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e2e8f0]">
                  <div
                    className={`h-full rounded-full ${isOverload ? 'bg-[#f97316]' : 'bg-[#5b3df6]'}`}
                    style={{ width: `${Math.max(12, loadPercent)}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-[#94a3b8]">Recommended max weekly load: 25 hrs</p>
              </div>

              <div className="rounded-[14px] border border-[#d8cffc] bg-[#faf9ff] p-4">
                <h3 className="text-[14px] font-semibold text-[#3b2aa8]">What happens next?</h3>
                <ul className="mt-2 space-y-2 text-[12px] text-[#5f4bb8]">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5" />
                    Instructor schedule will be updated in live calendar.
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5" />
                    Batch roster gets notified after confirmation.
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-black/[0.08] bg-[#fafcff] px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button onClick={onClose} className="h-10 rounded-[8px] border border-black/[0.08] px-4 text-[13px] text-[#64748b] hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedCourse && selectedBatch) {
                onAssign?.()
                onClose()
              }
            }}
            disabled={!selectedCourse || !selectedBatch}
            className={`inline-flex h-10 items-center gap-2 rounded-[8px] px-4 text-[13px] font-semibold transition-colors ${
              selectedCourse && selectedBatch
                ? 'bg-[#5b3df6] text-white hover:bg-[#4a2ed8]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Assign Course
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function CreateInstructorModal({ onClose }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    expertise: 'STEM',
    experience: '3-5 years',
    bio: '',
  })
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Wed'])

  const expertiseOptions = ['STEM', 'Coding', 'English', 'Math']
  const scheduleOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const formCompletion = [form.fullName, form.email, form.phone, form.bio].filter(Boolean).length

  const toggleDay = (day) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]))
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]">
      <div className="relative flex w-full max-w-[1120px] max-h-[calc(100vh-32px)] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
        <div className="flex items-center justify-between border-b border-black/[0.08] bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-[10px] bg-[#f0f4f8] px-3 py-1 text-[11px] font-medium text-[#64748b]">
              Instructor onboarding
            </span>
            <h2 className="mt-3 text-[22px] font-bold leading-tight text-[#0f172a] sm:text-[26px]">Create Instructor Profile</h2>
            <p className="mt-1 text-[13px] text-[#94a3b8]">
              Capture identity, contact details, expertise, and weekly availability in one place.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5 text-[#94a3b8]" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[1.35fr_0.85fr]">
          <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
            <div className="space-y-5">
              <section className="rounded-[18px] border border-black/[0.08] bg-[#fbfdff] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#ede7ff] text-[#5b3df6]">
                      <Camera className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-[16px] font-semibold text-[#0f172a]">Profile photo</p>
                      <p className="mt-1 text-[12px] text-[#94a3b8]">Upload a clear headshot for instructor cards and class rosters.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-black/[0.08] bg-white px-4 text-[13px] font-medium text-[#0f172a] hover:bg-gray-50"
                  >
                    <Upload className="h-4 w-4" />
                    Upload photo
                  </button>
                </div>
              </section>

              <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0f172a]">Basic details</h3>
                    <p className="mt-1 text-[12px] text-[#94a3b8]">Use the same identity format shown in the Figma instructor frame.</p>
                  </div>
                  <span className="rounded-full bg-[#e8f5ff] px-3 py-1 text-[11px] font-medium text-[#2563eb]">Required fields</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[12px] font-medium text-[#0f172a]">Full name</label>
                    <input
                      value={form.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      className="h-11 w-full rounded-[10px] border border-black/[0.08] bg-white px-3 text-[13px] text-[#0f172a] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                      placeholder="e.g. Aisha Verma"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#0f172a]">Email address</label>
                    <div className="flex h-11 items-center gap-2 rounded-[10px] border border-black/[0.08] bg-white px-3 focus-within:border-[#5b3df6] focus-within:ring-2 focus-within:ring-[#5b3df6]/15">
                      <Mail className="h-4 w-4 text-[#94a3b8]" />
                      <input
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="min-w-0 flex-1 bg-transparent text-[13px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
                        placeholder="name@institute.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#0f172a]">Phone number</label>
                    <div className="flex h-11 items-center gap-2 rounded-[10px] border border-black/[0.08] bg-white px-3 focus-within:border-[#5b3df6] focus-within:ring-2 focus-within:ring-[#5b3df6]/15">
                      <Phone className="h-4 w-4 text-[#94a3b8]" />
                      <input
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="min-w-0 flex-1 bg-transparent text-[13px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#0f172a]">Primary expertise</label>
                    <div className="relative">
                      <select
                        value={form.expertise}
                        onChange={(e) => handleChange('expertise', e.target.value)}
                        className="h-11 w-full appearance-none rounded-[10px] border border-black/[0.08] bg-white px-3 text-[13px] text-[#0f172a] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                      >
                        {expertiseOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium text-[#0f172a]">Experience</label>
                    <div className="relative">
                      <select
                        value={form.experience}
                        onChange={(e) => handleChange('experience', e.target.value)}
                        className="h-11 w-full appearance-none rounded-[10px] border border-black/[0.08] bg-white px-3 text-[13px] text-[#0f172a] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                      >
                        <option>1-2 years</option>
                        <option>3-5 years</option>
                        <option>5+ years</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[12px] font-medium text-[#0f172a]">Short bio</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      rows={4}
                      className="w-full rounded-[10px] border border-black/[0.08] bg-white px-3 py-2 text-[13px] text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                      placeholder="Summarize teaching style, subject strength, and classroom approach..."
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
                <div className="mb-4">
                  <h3 className="text-[16px] font-bold text-[#0f172a]">Availability</h3>
                  <p className="mt-1 text-[12px] text-[#94a3b8]">Mark the instructor's default teaching days for onboarding and scheduling.</p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                  {scheduleOptions.map((day) => {
                    const active = selectedDays.includes(day)
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`rounded-[10px] border px-3 py-2 text-[12px] font-medium transition-colors ${
                          active
                            ? 'border-[#d8cffc] bg-[#ede7ff] text-[#5b3df6]'
                            : 'border-black/[0.08] bg-white text-[#64748b] hover:bg-gray-50'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </section>
            </div>
          </div>

          <aside className="min-h-0 overflow-y-auto border-t border-black/[0.08] bg-[#fafcff] p-5 lg:border-l lg:border-t-0 lg:p-6">
            <div className="space-y-5">
              <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ede7ff] text-[24px] font-bold text-[#5b3df6]">
                    {form.fullName ? form.fullName.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-semibold text-[#0f172a]">{form.fullName || 'Aisha Verma'}</p>
                    <p className="mt-0.5 text-[12px] text-[#94a3b8]">{form.email || 'name@institute.com'}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-[#e8f5ff] px-3 py-1 text-[11px] font-medium text-[#2563eb]">
                        {form.expertise} expert
                      </span>
                      <span className="inline-flex items-center rounded-full bg-[#f0f4f8] px-3 py-1 text-[11px] font-medium text-[#64748b]">
                        {selectedDays.length} active days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-[14px] bg-[#fbfdff] p-3">
                    <p className="text-[11px] text-[#94a3b8]">Profile completion</p>
                    <p className="mt-1 text-[22px] font-bold text-[#0f172a]">{Math.min(100, formCompletion * 25)}%</p>
                  </div>
                  <div className="rounded-[14px] bg-[#fbfdff] p-3">
                    <p className="text-[11px] text-[#94a3b8]">Suggested load</p>
                    <p className="mt-1 text-[22px] font-bold text-[#0f172a]">18 hrs</p>
                  </div>
                </div>
              </section>

              <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
                <h3 className="text-[16px] font-bold text-[#0f172a]">Invite checklist</h3>
                <div className="mt-4 space-y-3">
                  {[
                    'Instructor profile created',
                    'Email invite will be sent',
                    'Default schedule and expertise saved',
                    'Ready for course assignment',
                  ].map((item, index) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${index < 2 ? 'bg-[#2dd4bf]' : 'bg-[#e2e8f0]'}`}>
                        <Check className={`h-3 w-3 ${index < 2 ? 'text-white' : 'text-[#94a3b8]'}`} />
                      </div>
                      <p className="text-[12px] leading-5 text-[#334155]">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[18px] border border-[#ffd966] bg-[#fff8e7] p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-[#ffd966] p-2 text-[#4b2e00]">
                    <Clock3 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#4b2e00]">Next step after creation</h3>
                    <p className="mt-1 text-[12px] leading-5 text-[#6b4b00]">
                      Add a course mapping and batch assignment so the instructor appears in the live schedule immediately.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </aside>
        </div>

        <div className="flex flex-col gap-3 border-t border-black/[0.08] bg-[#fafcff] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-[10px] border border-black/[0.08] bg-white px-4 text-[13px] font-medium text-[#64748b] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4a2ed8]"
          >
            Create & send invite
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminInstructorManagement() {
  const [activeFilter, setActiveFilter] = useState('All instructors')
  const [availability, setAvailability] = useState({})
  const [directorySearch, setDirectorySearch] = useState('')
  const [selectedAssignInstructor, setSelectedAssignInstructor] = useState(null)
  const [selectedViewInstructor, setSelectedViewInstructor] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filters = ['All instructors', 'Pending onboarding', 'High workload', 'Unassigned']

  const instructors = [
    {
      id: 1,
      name: 'Aisha Verma',
      role: 'STEM Explorers • 3 active batches',
      course: 'STEM Explorers',
      courseSub: 'Robotics, Science Lab',
      load: '16 hrs / week',
      capacity: 'Capacity 82%',
      status: 'Active',
      statusVariant: 'success',
      avatar: AVATAR_AISHA,
      actions: ['View', 'Assign'],
    },
    {
      id: 2,
      name: 'Liam Carter',
      role: 'Coding for Kids • 2 active batches',
      course: 'Coding for Kids',
      courseSub: 'Scratch, Python Basics',
      load: '19 hrs / week',
      capacity: 'Capacity 94%',
      status: 'High workload',
      statusVariant: 'warning',
      avatar: AVATAR_LIAM,
      actions: ['View', 'Assign'],
    },
    {
      id: 3,
      name: 'Nadia Brown',
      role: 'Creative English • Pending course mapping',
      course: 'Not assigned',
      courseSub: 'Ready for spoken English',
      load: '0 hrs / week',
      capacity: 'Capacity open',
      status: 'Onboarding',
      statusVariant: 'secondary',
      avatar: AVATAR_NADIA,
      actions: ['View', 'Map Course'],
    },
    {
      id: 4,
      name: 'Omar Saleh',
      role: 'Math Mastery • Evening batches',
      course: 'Math Mastery Live',
      courseSub: 'Algebra, Olympiad prep',
      load: '12 hrs / week',
      capacity: 'Capacity 61%',
      status: 'Available',
      statusVariant: 'success',
      avatar: AVATAR_OMAR,
      actions: ['View', 'Assign'],
    },
  ]

  const onboardingSteps = [
    {
      num: 1,
      title: 'Create profile',
      desc: 'Add basic details, subject expertise, and contact information for shortlisted instructors.',
    },
    {
      num: 2,
      title: 'Verify credentials',
      desc: 'Review demo class notes, teaching experience, and curriculum familiarity before approval.',
    },
    {
      num: 3,
      title: 'Assign courses and batches',
      desc: 'Map the instructor to appropriate courses, set capacity, and publish their upcoming schedule.',
    },
    {
      num: 4,
      title: 'Enable live class tools',
      desc: 'Grant access to Zoom or Meet setup, shared resources, and classroom communication templates.',
    },
  ]

  const availabilityDays = ['Mon PM', 'Wed PM', 'Fri AM', 'Sat AM', 'Sat PM', 'Sun PM']

  const handleActionClick = (action, instructor) => {
    if (action === 'View') {
      setSelectedViewInstructor(instructor)
      setShowViewModal(true)
    } else if (action === 'Assign' || action === 'Map Course') {
      setSelectedAssignInstructor(instructor)
      setShowAssignModal(true)
    }
  }

  const filteredInstructors = instructors.filter((inst) => {
    const matchesFilter =
      activeFilter === 'All instructors' ||
      (activeFilter === 'Pending onboarding' && inst.status === 'Onboarding') ||
      (activeFilter === 'High workload' && inst.status === 'High workload') ||
      (activeFilter === 'Unassigned' && inst.course === 'Not assigned')

    if (!matchesFilter) return false
    if (!directorySearch.trim()) return true
    const q = directorySearch.toLowerCase()
    return (
      inst.name.toLowerCase().includes(q) ||
      inst.course.toLowerCase().includes(q) ||
      inst.role.toLowerCase().includes(q)
    )
  })

  return (
    <>
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-7">
        {/* Hero — matches Student Management / Figma instructor frame pattern */}
        <section className="flex flex-col items-start justify-between gap-6 rounded-[10px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] p-5 sm:p-7 lg:flex-row lg:gap-8">
          <div className="min-w-0 flex-1">
            <span className="mb-4 inline-flex items-center rounded-[10px] bg-[#f0f4f8] px-3 py-1.5 text-[11px] font-medium text-[#64748b]">
              Instructor workspace
            </span>
            <h1 className="mb-3 max-w-[850px] text-[30px] font-bold leading-[1.2] text-[#0f172a]">
              Create, onboard, and assign instructors across all active programs.
            </h1>
            <p className="mb-5 max-w-[800px] text-[13.5px] leading-relaxed text-[#94a3b8]">
              Review availability, teaching load, learner ratings, and course mapping from one operational screen.
              Keep instructor records, batch assignments, and onboarding tasks aligned with your institute dashboard.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4b2fd5]"
              >
                <Plus className="h-4 w-4" />
                Create Instructor
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedAssignInstructor(instructors.find((i) => i.id === 3) || instructors[0])
                  setShowAssignModal(true)
                }}
                className="inline-flex h-10 items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-4 text-[13px] font-medium text-[#0f172a] hover:bg-gray-50"
              >
                <BookOpen className="h-4 w-4" />
                Assign Courses
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-4 text-[13px] font-medium text-[#0f172a] hover:bg-gray-50"
              >
                <Calendar className="h-4 w-4" />
                This week
              </button>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:min-w-[200px] lg:w-auto">
            <div className="rounded-[8px] border border-black/[0.08] bg-white px-5 py-4">
              <p className="mb-1 text-[12px] text-[#94a3b8]">Pending onboarding</p>
              <p className="text-[28px] font-bold text-[#0f172a]">5</p>
            </div>
            <div className="rounded-[8px] border border-black/[0.08] bg-white px-5 py-4">
              <p className="mb-1 text-[12px] text-[#94a3b8]">Unassigned courses</p>
              <p className="text-[28px] font-bold text-[#0f172a]">3</p>
              <p className="mt-1 text-[11px] text-orange-600">Needs action today</p>
            </div>
          </div>
        </section>

        {/* Stats row — same card system as Student Management */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total instructors"
            value="42"
            sub="+4 this month"
            subVariant="success"
            icon={<Users className="h-[18px] w-[18px] text-[#5b3df6]" />}
          />
          <StatCard
            label="Active batches"
            value="31"
            sub="7 shared across cohorts"
            subVariant="neutral"
            icon={<Calendar className="h-[18px] w-[18px] text-[#5b3df6]" />}
          />
          <StatCard
            label="Average rating"
            value="4.8"
            sub="Based on 5,284 reviews"
            subVariant="neutral"
            icon={<Star className="h-[18px] w-[18px] text-[#5b3df6]" />}
          />
          <StatCard
            label="Applications"
            value="14"
            sub="Pending onboarding"
            subVariant="warning"
            icon={<UserPlus className="h-[18px] w-[18px] text-[#5b3df6]" />}
          />
        </div>

        {/* Instructor directory — Figma-style operational card */}
        <section className="rounded-[10px] border border-black/[0.08] bg-white p-6">
          <div className="flex flex-col gap-4 border-b border-black/[0.08] pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[20px] font-bold text-[#0f172a]">Instructor directory</h2>
                <span className="inline-flex items-center rounded-full bg-[#f0f4f8] px-3 py-1 text-[11px] font-medium text-[#64748b]">
                  {filteredInstructors.length} visible
                </span>
              </div>
              <p className="mt-1.5 max-w-[760px] text-[13px] leading-relaxed text-[#94a3b8]">
                Review teaching load, course mapping, onboarding stage, and follow-up actions in a single operational card.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-4 text-[13px] font-medium text-[#0f172a] hover:bg-gray-50"
              >
                <Upload className="h-4 w-4 text-[#5b3df6]" />
                Bulk invite
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex h-9 items-center gap-2 rounded-[6px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4b2fd5]"
              >
                <Plus className="h-4 w-4" />
                Create Instructor
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                    activeFilter === f
                      ? 'bg-[#ede7ff] text-[#5b3df6]'
                      : 'border border-transparent text-[#64748b] hover:bg-gray-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-9 w-full items-center gap-2 rounded-[6px] border border-black/[0.08] bg-[#f8fafc] px-3 sm:min-w-[240px]">
                <Search className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                <input
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none"
                  placeholder="Search instructors, courses…"
                />
              </div>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-3 text-[12px] font-medium text-[#0f172a] hover:bg-gray-50"
              >
                <Calendar className="h-4 w-4 text-[#5b3df6]" />
                Availability
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-3 text-[12px] font-medium text-[#0f172a] hover:bg-gray-50"
              >
                <Star className="h-4 w-4 text-[#5b3df6]" />
                Ratings
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <div className="min-w-[840px]">
              <div className="grid grid-cols-[1.7fr_1.55fr_1fr_0.95fr_1.15fr] gap-4 border-b border-black/[0.06] px-3 pb-3">
                {['Instructor', 'Course & focus', 'Load', 'Status', 'Actions'].map((h) => (
                  <p key={h} className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#94a3b8]">
                    {h}
                  </p>
                ))}
              </div>

              <div className="divide-y divide-black/[0.05]">
                {filteredInstructors.map((inst) => {
                  const loadValue = parseInt(inst.load, 10) || 0
                  const loadBar = Math.min(loadValue, 24) / 24

                  return (
                    <div
                      key={inst.id}
                      className="grid grid-cols-[1.7fr_1.55fr_1fr_0.95fr_1.15fr] items-center gap-4 px-3 py-4 transition-colors hover:bg-gray-50/60"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar src={inst.avatar} alt={inst.name} className="h-11 w-11 shrink-0 rounded-full" />
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-[#0f172a]">{inst.name}</p>
                          <p className="truncate text-[12px] text-[#94a3b8]">{inst.role}</p>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#0f172a]">{inst.course}</p>
                        <p className="mt-0.5 text-[12px] text-[#94a3b8]">{inst.courseSub}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#64748b]">
                          <span className="inline-flex items-center rounded-full bg-[#f0f4f8] px-2.5 py-1">{inst.capacity}</span>
                          <span className="inline-flex items-center rounded-full bg-[#e8f5ff] px-2.5 py-1 text-[#2563eb]">
                            {inst.course === 'Not assigned' ? 'Needs mapping' : 'Mapped'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[13px] font-semibold text-[#0f172a]">{inst.load}</p>
                          <p className="text-[11px] text-[#94a3b8]">{loadValue >= 19 ? 'Busy' : 'Balanced'}</p>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
                          <div
                            className={`h-full rounded-full ${loadValue >= 19 ? 'bg-[#f97316]' : 'bg-[#5b3df6]'}`}
                            style={{ width: `${Math.max(18, loadBar * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <Pill variant={inst.statusVariant}>{inst.status}</Pill>
                      </div>

                      <div className="flex items-center gap-2">
                        {inst.actions.map((action) => (
                          <button
                            key={action}
                            type="button"
                            onClick={() => handleActionClick(action, inst)}
                            className={`inline-flex h-9 items-center gap-2 rounded-[6px] px-3 text-[12px] font-medium transition-colors ${
                              action === 'Assign' || action === 'Map Course'
                                ? 'bg-[#5b3df6] text-white hover:bg-[#4b2fd5]'
                                : 'border border-black/[0.08] bg-white text-[#0f172a] hover:bg-gray-50'
                            }`}
                          >
                            {action === 'View' ? <Eye className="h-4 w-4" /> : null}
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Create & Onboard Flow */}
        <div className="rounded-[10px] border border-black/[0.08] bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[20px] font-bold text-[#0f172a]">Create & onboard flow</h2>
              <p className="mt-1 text-[13px] text-[#94a3b8]">
                A simple operational checklist for bringing new instructors into the institute.
              </p>
            </div>
            <div className="rounded-[12px] bg-[#ffd966] px-[10px] py-1">
              <span className="text-[12px] font-medium text-[#4b2e00]">5 pending</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {onboardingSteps.map((step) => (
              <div key={step.num} className="flex flex-col gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ede7ff] text-sm font-bold text-[#5b3df6]">
                  {step.num}
                </div>
                <h3 className="text-[14px] font-semibold text-[#0f172a]">{step.title}</h3>
                <p className="text-[12px] leading-relaxed text-[#94a3b8]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Create */}
        <div className="rounded-[10px] border border-black/[0.08] bg-white p-6">
          <h2 className="mb-1 text-[20px] font-bold text-[#0f172a]">Quick create</h2>
          <p className="text-[13px] text-[#94a3b8] mb-6">
            Prepare a new instructor record without leaving this page.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="text-[12px] font-medium text-[#0f172a] block mb-1">Instructor name</label>
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full px-3 py-2 border border-black/[0.08] rounded-[6px] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#0f172a] block mb-1">Primary expertise</label>
              <div className="relative">
                <select className="w-full px-3 py-2 border border-black/[0.08] rounded-[6px] text-[13px] text-[#0f172a] bg-white focus:outline-none focus:ring-2 focus:ring-[#5b3df6] appearance-none">
                  <option>Coding, STEM, English, Math</option>
                  <option>Coding</option>
                  <option>STEM</option>
                  <option>English</option>
                  <option>Math</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#0f172a] block mb-1">Assigned course</label>
              <div className="relative">
                <select className="w-full px-3 py-2 border border-black/[0.08] rounded-[6px] text-[13px] text-[#0f172a] bg-white focus:outline-none focus:ring-2 focus:ring-[#5b3df6] appearance-none">
                  <option>Select course and initial batch</option>
                  <option>STEM Explorers</option>
                  <option>Coding for Kids</option>
                  <option>Math Mastery Live</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#0f172a] block mb-1">Availability</label>
              <div className="grid grid-cols-3 gap-2">
                {availabilityDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => setAvailability((prev) => ({ ...prev, [day]: !prev[day] }))}
                    className={`py-1.5 rounded text-[11px] font-medium transition-colors ${
                      availability[day]
                        ? 'bg-[#ede7ff] text-[#5b3df6] border border-[#5b3df6]/30'
                        : 'border border-black/[0.08] text-[#64748b] hover:bg-gray-50'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="rounded-[6px] bg-[#5b3df6] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#4a2ed8]"
            >
              Create Instructor
            </button>
            <button
              type="button"
              className="rounded-[6px] border border-black/[0.08] px-4 py-2 text-[13px] text-[#64748b] hover:bg-gray-50"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>

    {showAssignModal && selectedAssignInstructor && (
      <AssignCourseModal
        instructor={selectedAssignInstructor}
        onClose={() => {
          setShowAssignModal(false)
          setSelectedAssignInstructor(null)
        }}
        onAssign={() => {}}
      />
    )}
    {showViewModal && selectedViewInstructor && (
      <ViewInstructorModal
        instructor={selectedViewInstructor}
        onClose={() => {
          setShowViewModal(false)
          setSelectedViewInstructor(null)
        }}
      />
    )}
    {showCreateModal && <CreateInstructorModal onClose={() => setShowCreateModal(false)} />}
    </>
  )
}
