import React, { useState } from 'react'
import {
  Search,
  Upload,
  Plus,
  BookOpen,
  Users,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  X,
  ChevronDown,
  ImageIcon,
  FileStack,
  Clock,
  Star,
  AlertCircle,
  Play,
  FileText,
  Video,
  File,
  ClipboardList,
  Calendar,
  Folder,
  Mail,
  MessageSquare,
  Rocket,
  Check,
  MoreVertical,
} from 'lucide-react'

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const STEPS = [
  { id: 'basics', label: '1. Basics' },
  { id: 'content', label: '2. Content' },
  { id: 'pricing', label: '3. Pricing' },
  { id: 'publish', label: '4. Publish' },
]

const sampleCourses = [
  {
    id: 1,
    title: 'Integrated Science Foundation',
    description: 'A blended course with online theory classes, practical lab sessions, weekly MCQ tests, and teacher-led revision support.',
    category: 'Science',
    level: 'Intermediate',
    duration: '8 weeks',
    lessons: 24,
    students: 124,
    rating: 4.8,
    status: 'published',
    createdAt: '2024-01-15',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    title: 'Coding for Kids Bootcamp',
    description: 'Learn programming basics through fun projects and interactive coding exercises.',
    category: 'Programming',
    level: 'Beginner',
    duration: '6 weeks',
    lessons: 18,
    students: 89,
    rating: 4.9,
    status: 'draft',
    createdAt: '2024-02-01',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    title: 'Creative English Club',
    description: 'Improve English speaking and writing skills through creative exercises and group discussions.',
    category: 'Language',
    level: 'Intermediate',
    duration: '10 weeks',
    lessons: 30,
    students: 56,
    rating: 4.7,
    status: 'review',
    createdAt: '2024-01-20',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80',
  },
]

const initialModules = [
  {
    id: 1,
    title: 'Foundations of scientific thinking',
    moduleNumber: '01',
    status: 'drafted',
    meta: '3 lessons • 1 activity sheet • 1 live workshop',
    lessons: [
      { id: 101, title: 'What makes a strong experiment?', duration: '12 min', type: 'video', typeLabel: 'Video', description: 'Intro overview, learning goals, and experiment design basics.' },
      { id: 102, title: 'Observation worksheet', duration: '', type: 'pdf', typeLabel: 'PDF', description: 'Downloadable practice sheet with guided prompts and reflection questions.' },
      { id: 103, title: 'Live mentor workshop', duration: '', type: 'live', typeLabel: 'Live', description: 'Thursday, 4:00 PM • Small-group session for hands-on Q&A and experiments.' },
    ],
  },
  {
    id: 2,
    title: 'Robotics basics and sensors',
    moduleNumber: '02',
    status: 'review',
    meta: '4 lessons • 2 worksheets • Coding starter lab',
    lessons: [
      { id: 201, title: 'Sensor essentials', duration: '14 min', type: 'recorded', typeLabel: 'Recorded', description: 'Covers signal basics, measurement, and hardware examples.' },
      { id: 202, title: 'First coding lab', duration: '', type: 'lab', typeLabel: 'Lab', description: 'Interactive coding exercise for reading and testing simple inputs.' },
      { id: 203, title: 'Module checkpoint quiz', duration: '', type: 'quiz', typeLabel: 'Quiz', description: '8 questions • Checks sensor vocabulary and logic comprehension.' },
    ],
  },
  {
    id: 3,
    title: 'Build, test, and present',
    moduleNumber: '03',
    status: 'draft',
    meta: '5 lessons • Final project • Peer showcase session',
    lessons: [],
  },
]

const sharedResources = [
  { id: 1, name: 'Starter files bundle', type: 'ZIP package', size: '7 files', icon: 'folder' },
  { id: 2, name: 'Parent guidance pack', type: 'PDF', note: 'Sent at enrollment', icon: 'pdf' },
  { id: 3, name: 'Community guidelines', type: 'PDF', note: 'Visible inside student space', icon: 'pdf' },
]

// ─────────────────────────────────────────────
// SMALL SHARED COMPONENTS
// ─────────────────────────────────────────────
function Pill({ children, variant }) {
  const styles = {
    published: 'bg-emerald-100 text-emerald-700',
    draft: 'bg-gray-100 text-gray-600',
    review: 'bg-amber-100 text-amber-700',
    archived: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium ${styles[variant] || styles.draft}`}>
      {children}
    </span>
  )
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white border border-black/[0.08] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] text-[#94a3b8]">{label}</span>
        <div className="p-2 rounded-lg bg-[#ede9ff]">
          <Icon className="h-4 w-4 text-[#5b3df6]" />
        </div>
      </div>
      <p className="text-[28px] font-bold text-[#0f172a]">{value}</p>
    </div>
  )
}

function FieldLabel({ children }) {
  return <label className="text-[13px] font-medium text-[#0f172a]">{children}</label>
}

function InputShell({ children, className = '' }) {
  return (
    <div className={`flex min-h-11 items-center rounded-md border border-black/[0.08] bg-white px-[15px] py-2 ${className}`}>
      {children}
    </div>
  )
}

function Toggle({ enabled, onToggle }) {
  return (
    <button onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-[#5b3df6]' : 'bg-[#e2e8f0]'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

function TypeBadge({ label, type }) {
  const colors = {
    video: 'bg-blue-50 text-blue-600',
    pdf: 'bg-orange-50 text-orange-600',
    live: 'bg-green-50 text-green-600',
    recorded: 'bg-purple-50 text-purple-600',
    lab: 'bg-cyan-50 text-cyan-600',
    quiz: 'bg-yellow-50 text-yellow-700',
  }
  return <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${colors[type] || 'bg-gray-100 text-gray-600'}`}>{label}</span>
}

function LessonIcon({ type }) {
  const cls = 'h-4 w-4 text-[#5b3df6]'
  const wrap = (child) => <div className="w-8 h-8 rounded-md bg-[#ede9ff] flex items-center justify-center flex-shrink-0">{child}</div>
  switch (type) {
    case 'video': return wrap(<Video className={cls} />)
    case 'pdf': return wrap(<FileText className={cls} />)
    case 'live': return wrap(<Calendar className={cls} />)
    case 'recorded': return wrap(<Play className={cls} />)
    case 'lab': return wrap(<File className={cls} />)
    case 'quiz': return wrap(<ClipboardList className={cls} />)
    default: return wrap(<File className={cls} />)
  }
}

function getStatusBadge(status) {
  switch (status) {
    case 'completed': return <span className="text-[11px] bg-[#d1fae5] text-[#065f46] px-2.5 py-1 rounded-full font-medium">Completed ✓</span>
    case 'review': return <span className="text-[11px] bg-[#fef3c7] text-[#92400e] px-2.5 py-1 rounded-full font-medium">Needs review</span>
    case 'drafted': return <span className="text-[11px] bg-[#f1f5f9] text-[#64748b] px-2.5 py-1 rounded-full font-medium">Drafted</span>
    case 'draft': return <span className="text-[11px] bg-[#f1f5f9] text-[#64748b] px-2.5 py-1 rounded-full font-medium">Draft</span>
    default: return null
  }
}

function getLessonAction(lesson) {
  switch (lesson.type) {
    case 'pdf': return <button className="text-[12px] text-[#0f172a] font-medium px-3 py-1.5 rounded-md border border-black/[0.08] hover:bg-gray-50">Replace</button>
    case 'live': return <button className="text-[12px] text-[#0f172a] font-medium px-3 py-1.5 rounded-md border border-black/[0.08] hover:bg-gray-50">Reschedule</button>
    case 'lab': return <button className="text-[12px] text-[#5b3df6] font-medium px-3 py-1.5 rounded-md border border-[#d8cffc] bg-[#f3efff] hover:bg-[#ece5ff]">Open Lab</button>
    case 'quiz': return <button className="text-[12px] text-[#5b3df6] font-medium px-3 py-1.5 rounded-md border border-[#d8cffc] bg-[#f3efff] hover:bg-[#ece5ff]">Edit Quiz</button>
    default: return <button className="text-[12px] text-[#0f172a] font-medium px-3 py-1.5 rounded-md border border-black/[0.08] hover:bg-gray-50">Preview</button>
  }
}

// ─────────────────────────────────────────────
// STEP 1 — BASICS
// ─────────────────────────────────────────────
function BasicsStep({ form, onChange }) {
  return (
    <div className="flex gap-6">
      {/* Main */}
      <div className="flex-1 space-y-5">
        {/* Course basics */}
        <section className="rounded-lg border border-black/[0.08] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-bold text-[#0f172a]">Course basics</h3>
              <p className="text-[12px] text-[#6b7280] mt-0.5">Start with the core details learners and instructors will see across the platform.</p>
            </div>
            <span className="inline-flex items-center rounded-xl bg-emerald-500 px-2.5 py-1 text-[11px] font-medium text-white">Auto-saved</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Course title</FieldLabel>
              <input name="title" value={form.title} onChange={onChange} placeholder="e.g., STEM Explorers Advanced" className="min-h-11 rounded-md border border-black/[0.08] px-4 py-2 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Category</FieldLabel>
              <div className="relative">
                <select name="category" value={form.category} onChange={onChange} className="w-full min-h-11 appearance-none rounded-md border border-black/[0.08] px-4 py-2 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]">
                  <option>Science</option><option>Programming</option><option>Language</option><option>Mathematics</option><option>Arts</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Level</FieldLabel>
              <div className="relative">
                <select name="level" value={form.level} onChange={onChange} className="w-full min-h-11 appearance-none rounded-md border border-black/[0.08] px-4 py-2 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]">
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Course format</FieldLabel>
              <div className="relative">
                <select name="format" value={form.format} onChange={onChange} className="w-full min-h-11 appearance-none rounded-md border border-black/[0.08] px-4 py-2 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]">
                  <option>Hybrid · Live + Recorded</option><option>Live only</option><option>Self-paced</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
              </div>
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <FieldLabel>Short description</FieldLabel>
              <textarea name="description" value={form.description} onChange={onChange} rows={3} placeholder="A brief description shown on listing cards..." className="rounded-md border border-black/[0.08] px-4 py-2 text-sm text-[#0f172a] resize-none focus:outline-none focus:ring-2 focus:ring-[#5b3df6]" />
              <p className="text-[11px] text-[#6b7280]">Keep this under 220 characters for listing cards and landing pages.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Duration</FieldLabel>
              <input name="duration" value={form.duration} onChange={onChange} placeholder="e.g., 8 weeks · 24 lessons" className="min-h-11 rounded-md border border-black/[0.08] px-4 py-2 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Primary instructor</FieldLabel>
              <div className="relative">
                <select name="instructor" value={form.instructor} onChange={onChange} className="w-full min-h-11 appearance-none rounded-md border border-black/[0.08] px-4 py-2 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]">
                  <option>Marcus Chen</option><option>Aisha Verma</option><option>Rahul Mehta</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
              </div>
            </div>
          </div>
        </section>

        {/* Cover & Assets */}
        <section className="rounded-lg border border-black/[0.08] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-bold text-[#0f172a]">Cover and learning assets</h3>
              <p className="text-[12px] text-[#6b7280] mt-0.5">Add the hero visual and starter resources before building the full course outline.</p>
            </div>
            <button type="button" className="inline-flex items-center rounded-md bg-[#e9f2ff] px-3.5 h-9 text-sm font-medium text-[#0f172a]">Asset Library</button>
          </div>
          <div className="space-y-3">
            {[
              { icon: <ImageIcon className="h-5 w-5 text-[#5b3df6]" />, title: 'Course cover image', desc: 'Upload a wide visual for course cards and public listings. Recommended ratio: 16:9.', btn: 'Choose File' },
              { icon: <FileStack className="h-5 w-5 text-[#5b3df6]" />, title: 'Starter files and PDFs', desc: 'Upload lesson notes, worksheets, and welcome materials learners receive at enrollment.', btn: 'Upload Files' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-[#f1f5f9] p-4 gap-4">
                <div className="flex gap-3 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#edebff]">{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">{item.title}</p>
                    <p className="text-[12px] text-[#6b7280] mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <button type="button" className="shrink-0 inline-flex h-9 items-center justify-center rounded-md border border-black/[0.08] bg-white px-4 text-sm font-medium text-[#0f172a]">{item.btn}</button>
              </div>
            ))}
          </div>
        </section>

        {/* Module outline */}
        <section className="rounded-lg border border-black/[0.08] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-bold text-[#0f172a]">Initial module outline</h3>
              <p className="text-[12px] text-[#6b7280] mt-0.5">Create the first structure now. You can add videos, quizzes, and assignments in the next step.</p>
            </div>
            <button type="button" className="inline-flex items-center gap-1.5 rounded-md bg-[#5b3df6] px-3.5 h-9 text-sm font-medium text-white hover:bg-[#4a2ed8]">
              <Plus className="h-4 w-4" /> Add Module
            </button>
          </div>
          <ul className="space-y-2.5">
            {[
              { n: '01', title: 'Foundations of scientific thinking', meta: '3 lessons • 1 live workshop • Intro experiments kit' },
              { n: '02', title: 'Robotics basics and sensors', meta: '4 lessons • 2 downloadable worksheets • Coding starter lab' },
              { n: '03', title: 'Build, test, and present', meta: '5 lessons • Final project • Peer showcase session' },
            ].map((m) => (
              <li key={m.n} className="flex items-center justify-between rounded-md bg-[#f1f5f9] p-3.5 gap-3">
                <div className="flex gap-3 items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-black/[0.08] bg-white text-[13px] font-semibold text-[#0f172a]">{m.n}</div>
                  <div>
                    <p className="text-sm font-medium text-[#0f172a]">{m.title}</p>
                    <p className="text-[11px] text-[#6b7280]">{m.meta}</p>
                  </div>
                </div>
                <button type="button" className="shrink-0 inline-flex h-8 items-center justify-center rounded-md border border-black/[0.08] bg-white px-3.5 text-sm font-medium text-[#0f172a]">Edit</button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Sidebar */}
      <aside className="w-[300px] shrink-0 space-y-4">
        <div className="rounded-lg border border-black/[0.08] bg-white p-4">
          <h3 className="text-sm font-bold text-[#0f172a] mb-1">Setup summary</h3>
          <p className="text-[12px] text-[#6b7280] mb-3">A quick view of what is ready before the course goes to review.</p>
          <div className="space-y-2">
            {[['Basics completed', 'Ready', true], ['3 starter modules added', 'In progress', false], ['Pricing not set yet', 'Pending', false], ['Publishing checklist', '2/5 done', false]].map(([label, val, badge]) => (
              <div key={label} className="flex items-center justify-between rounded-md bg-[#f1f5f9] px-3 py-2.5">
                <span className="text-[12px] text-[#0f172a]">{label}</span>
                {badge ? <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-medium text-white">{val}</span> : <span className="text-[12px] text-[#6b7280]">{val}</span>}
              </div>
            ))}
          </div>
          <div className="my-3 h-px bg-black/[0.06]" />
          <div className="space-y-2 text-[12px]">
            {[['Estimated launch', 'Next Tuesday'], ['Assigned owner', 'Marcus Chen'], ['Visibility', 'Private draft']].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span className="text-[#6b7280]">{k}</span><span className="text-[#0f172a]">{v}</span></div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-black/[0.08] bg-white p-4">
          <h3 className="text-sm font-bold text-[#0f172a] mb-1">Pricing preview</h3>
          <p className="text-[12px] text-[#6b7280] mb-3">Quick commercial decisions from the side panel.</p>
          <div className="space-y-3">
            <div><FieldLabel>Base price</FieldLabel><InputShell className="mt-1"><span className="text-sm text-[#0f172a]">₹4,999</span></InputShell></div>
            <div><FieldLabel>Enrollment cap</FieldLabel><InputShell className="mt-1"><span className="text-sm text-[#0f172a]">120 students</span></InputShell></div>
            <div><FieldLabel>Discount eligibility</FieldLabel><InputShell className="mt-1 justify-between"><span className="text-sm text-[#0f172a]">Coupons allowed</span><ChevronDown className="h-4 w-4 text-[#94a3b8]" /></InputShell></div>
          </div>
        </div>

        <div className="rounded-lg border border-black/[0.08] bg-white p-4">
          <h3 className="text-sm font-bold text-[#0f172a] mb-1">Publishing workflow</h3>
          <p className="text-[12px] text-[#6b7280] mb-3">Follow the same approval path used in the main dashboard.</p>
          <ul className="space-y-3">
            {[
              { icon: <Check className="h-4 w-4 text-[#5b3df6]" strokeWidth={2.5} />, title: 'Draft', desc: 'Course basics and first modules are being created.' },
              { icon: <ClipboardList className="h-4 w-4 text-[#5b3df6]" />, title: 'Review', desc: 'Academic team checks curriculum coverage and downloadable files.' },
              { icon: <Rocket className="h-4 w-4 text-[#5b3df6]" />, title: 'Publish', desc: 'Make the course visible to learners after pricing and banner assets are approved.' },
            ].map((item) => (
              <li key={item.title} className="flex gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#edebff]">{item.icon}</div>
                <div><p className="text-[12px] font-semibold text-[#0f172a]">{item.title}</p><p className="text-[11px] text-[#6b7280] mt-0.5">{item.desc}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP 2 — CONTENT
// ─────────────────────────────────────────────
function ContentStep() {
  return (
    <div className="grid grid-cols-[1.55fr_1fr] gap-5">
      {/* Left */}
      <div className="space-y-4">
        <div className="bg-white border border-black/[0.08] rounded-lg p-4 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-[#0f172a]">Content structure</h2>
            <p className="text-[12px] text-[#94a3b8] mt-0.5">Arrange the main modules and keep the lesson plan ready for review.</p>
          </div>
          <span className="inline-flex items-center rounded-xl bg-emerald-500 px-2.5 py-1 text-[11px] font-medium text-white">Auto-saved</span>
        </div>

        {initialModules.map((module) => (
          <div key={module.id} className="bg-white border border-black/[0.08] rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-[#f1f5f9] text-[#0f172a] font-bold text-sm border border-black/[0.08]">{module.moduleNumber}</div>
                <div>
                  <h3 className="font-semibold text-[13px] text-[#0f172a]">{module.title}</h3>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">{module.meta}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(module.status)}
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#0f172a] border border-black/[0.08] rounded-md hover:bg-gray-50">
                  <Edit className="h-3.5 w-3.5" /> Edit Module
                </button>
              </div>
            </div>
            {module.lessons.length > 0 && (
              <div className="border-t border-black/[0.08] bg-[#fafcff] px-4 py-3.5 space-y-2.5">
                {module.lessons.map((lesson, i) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 bg-white border border-black/[0.08] rounded-lg">
                    <div className="flex items-start gap-3 flex-1">
                      <LessonIcon type={lesson.type} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[12px] font-medium text-[#0f172a]">Lesson {i + 1} · {lesson.title}</span>
                          <TypeBadge label={lesson.typeLabel} type={lesson.type} />
                        </div>
                        <p className="text-[11px] text-[#94a3b8] mt-0.5">{lesson.duration ? `${lesson.duration} • ` : ''}{lesson.description}</p>
                      </div>
                    </div>
                    <div className="ml-3 flex-shrink-0">{getLessonAction(lesson)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Shared Resources */}
        <div className="bg-white border border-black/[0.08] rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[15px] font-bold text-[#0f172a]">Shared resources</h3>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#0f172a] border border-black/[0.08] rounded-md bg-white hover:bg-gray-50">Add Resource</button>
          </div>
          <p className="text-[11px] text-[#94a3b8] mb-3">Materials available across modules to support the full course journey.</p>
          <div className="grid grid-cols-3 gap-2.5">
            {sharedResources.map((r) => (
              <div key={r.id} className="flex flex-col gap-2 p-3 bg-[#f8fafc] border border-black/[0.08] rounded-lg">
                <div className="w-8 h-8 rounded-md bg-[#ede9ff] flex items-center justify-center">
                  {r.icon === 'folder' ? <Folder className="h-4 w-4 text-[#5b3df6]" /> : <FileText className="h-4 w-4 text-[#5b3df6]" />}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-[#0f172a]">{r.name}</p>
                  <p className="text-[10px] text-[#94a3b8] mt-0.5">{r.type}{r.size ? ` • ${r.size}` : ''}{r.note ? ` • ${r.note}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="space-y-4">
        <div className="bg-white border border-black/[0.08] rounded-lg p-4">
          <h3 className="text-[15px] font-bold text-[#0f172a] mb-1">Content summary</h3>
          <p className="text-[11px] text-[#94a3b8] mb-3">A quick view of what is ready before moving to pricing.</p>
          <div className="space-y-1.5">
            {[
              { label: '2 modules structured', badge: <span className="text-[10px] font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full">Ready</span> },
              { label: '6 lessons added', badge: <span className="text-[11px] text-[#94a3b8]">In progress</span> },
              { label: '3 shared resources', badge: <span className="text-[11px] text-[#94a3b8]">Uploaded</span> },
              { label: 'Pricing not set yet', badge: <span className="text-[11px] text-[#94a3b8]">Pending</span> },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-md bg-[#f8fafc]">
                <span className="text-[12px] text-[#0f172a]">{row.label}</span>{row.badge}
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-black/[0.06] space-y-1.5">
            {[['Total runtime', '26 min'], ['Live sessions', '2 scheduled'], ['Downloads', '5 resources']].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-[11px] text-[#94a3b8]">{k}</span>
                <span className="text-[11px] font-semibold text-[#0f172a]">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-black/[0.08] rounded-lg p-4">
          <h3 className="text-[15px] font-bold text-[#0f172a] mb-1">Reviewer checklist</h3>
          <p className="text-[11px] text-[#94a3b8] mb-3">Keep content quality consistent before the course goes live.</p>
          <div className="space-y-3">
            {[
              { done: true, title: 'Learning outcomes added', desc: 'Each module explains what learners should understand or build.' },
              { done: true, title: 'Downloadables attached', desc: 'Worksheets and orientation docs are available from the start.' },
              { done: false, title: 'Final assessment pending', desc: 'Add the capstone grading rubric before sending to final review.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                {item.done ? <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> : <div className="h-4 w-4 rounded-full border-2 border-[#94a3b8] mt-0.5 flex-shrink-0" />}
                <div>
                  <p className="text-[12px] font-semibold text-[#0f172a]">{item.title}</p>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-black/[0.08] rounded-lg p-4">
          <h3 className="text-[15px] font-bold text-[#0f172a] mb-1">Publishing workflow</h3>
          <p className="text-[11px] text-[#94a3b8] mb-3">The flow continues naturally from Basics into Content.</p>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">✓</div>
              <div><p className="text-[12px] font-semibold text-[#0f172a]">Basics completed</p><p className="text-[11px] text-[#94a3b8] mt-0.5">Course details, category, level, and primary instructor are already configured.</p></div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full border-2 border-[#5b3df6] flex items-center justify-center flex-shrink-0 mt-0.5"><div className="w-2 h-2 rounded-full bg-[#5b3df6]" /></div>
              <div><p className="text-[12px] font-semibold text-[#0f172a]">Content in progress</p><p className="text-[11px] text-[#94a3b8] mt-0.5">Modules, lesson types, and shared assets are being reviewed for completeness.</p></div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full border-2 border-black/[0.1] flex-shrink-0 mt-0.5" />
              <div><p className="text-[12px] font-semibold text-[#0f172a]">Pricing next</p><p className="text-[11px] text-[#94a3b8] mt-0.5">Set payment model, discounts, and tax handling after content is approved.</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP 3 — PRICING
// ─────────────────────────────────────────────
function PricingStep({ form, onChange }) {
  return (
    <div className="grid grid-cols-[1.55fr_1fr] gap-5">
      <div className="space-y-4">
        {/* Pricing model */}
        <section className="rounded-lg border border-black/[0.08] bg-white p-5">
          <div className="flex items-start justify-between mb-4">
            <div><h3 className="text-[16px] font-bold text-[#0f172a]">Pricing model</h3><p className="text-[12px] text-[#6b7280]">Select the payment structure learners will see on the enrollment page.</p></div>
            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-medium text-white">Auto-saved</span>
          </div>
          <div className="space-y-2">
            {[
              { id: 'one-time', title: 'One-time payment', desc: 'Collect the full course fee during enrollment with optional coupon support.', recommended: true },
              { id: 'installment', title: 'Monthly installment plan', desc: 'Split the total into scheduled monthly payments with automated reminders.' },
              { id: 'subscription', title: 'Subscription access', desc: 'Charge recurring access while the learner stays enrolled.' },
            ].map((opt) => (
              <div key={opt.id} onClick={() => onChange({ target: { name: 'pricingModel', value: opt.id } })}
                className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-colors ${form.pricingModel === opt.id ? 'border-[#5b3df6] bg-[#faf8ff]' : 'border-black/[0.08] bg-white hover:bg-gray-50'}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-1 h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${form.pricingModel === opt.id ? 'border-[#5b3df6]' : 'border-[#d1d5db]'}`}>
                    {form.pricingModel === opt.id && <div className="h-1.5 w-1.5 rounded-full bg-[#5b3df6]" />}
                  </div>
                  <div><p className="text-[13px] font-semibold text-[#0f172a]">{opt.title}</p><p className="text-[11px] text-[#6b7280]">{opt.desc}</p></div>
                </div>
                {opt.recommended && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 shrink-0">Recommended</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Course price */}
        <section className="rounded-lg border border-black/[0.08] bg-white p-5">
          <h3 className="text-[16px] font-bold text-[#0f172a] mb-0.5">Course price</h3>
          <p className="text-[12px] text-[#6b7280] mb-4">Configure the core fee, billing currency, and tax behavior.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Base price</FieldLabel>
              <input name="basePrice" value={form.basePrice} onChange={onChange} placeholder="₹ 0" className="mt-1.5 w-full min-h-11 rounded-md border border-black/[0.08] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b3df6]" />
            </div>
            <div>
              <FieldLabel>Currency</FieldLabel>
              <div className="relative mt-1.5">
                <select name="currency" value={form.currency} onChange={onChange} className="w-full min-h-11 appearance-none rounded-md border border-black/[0.08] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b3df6]">
                  <option>INR - Indian Rupee</option><option>USD - US Dollar</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
              </div>
            </div>
            <div>
              <FieldLabel>Enrollment fee</FieldLabel>
              <input name="enrollmentFee" value={form.enrollmentFee} onChange={onChange} placeholder="₹ 0 (optional)" className="mt-1.5 w-full min-h-11 rounded-md border border-black/[0.08] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b3df6]" />
            </div>
            <div>
              <FieldLabel>Tax handling</FieldLabel>
              <div className="relative mt-1.5">
                <select name="tax" value={form.tax} onChange={onChange} className="w-full min-h-11 appearance-none rounded-md border border-black/[0.08] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b3df6]">
                  <option>Inclusive of GST</option><option>Exclusive of GST</option><option>No tax</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
              </div>
            </div>
          </div>
          {form.basePrice && (
            <div className="mt-4 rounded-md bg-[#f1f5f9] p-4">
              <p className="text-[11px] text-[#6b7280]">Displayed selling price</p>
              <p className="text-[30px] font-bold leading-none text-[#0f172a]">{form.basePrice}</p>
              <p className="mt-1 text-[11px] text-[#6b7280]">Learners will see one clear price at checkout. Taxes are already included.</p>
            </div>
          )}
        </section>

        {/* Discounts */}
        <section className="rounded-lg border border-black/[0.08] bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <div><h3 className="text-[16px] font-bold text-[#0f172a]">Discounts and offers</h3><p className="text-[12px] text-[#6b7280]">Use time-bound promotions to support admissions campaigns.</p></div>
            <button className="rounded-md bg-[#e9f2ff] px-3 py-1.5 text-[12px] font-medium text-[#1f4f9c]">Create Coupon</button>
          </div>
          <div className="space-y-2">
            <div className="flex items-start justify-between rounded-md border border-black/[0.08] bg-[#f8fafc] p-3"><div><p className="text-[12px] font-semibold text-[#0f172a]">EARLY20 · Early admissions</p><p className="text-[11px] text-[#6b7280]">20% off until 30 Sep 2026 · Limited to first 50 enrollments</p></div><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Active</span></div>
            <div className="flex items-start justify-between rounded-md border border-black/[0.08] bg-[#f8fafc] p-3"><div><p className="text-[12px] font-semibold text-[#0f172a]">Sibling scholarship</p><p className="text-[11px] text-[#6b7280]">Flat ₹ 1,000 reduction for second learner registrations from the same family.</p></div><span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[10px] font-semibold text-[#4f46e5]">Rule saved</span></div>
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="rounded-lg border border-black/[0.08] bg-white p-4">
          <h4 className="text-[15px] font-bold text-[#0f172a] mb-1">Pricing summary</h4>
          <p className="text-[11px] text-[#6b7280] mb-3">A quick view of learner-facing billing setup.</p>
          <div className="space-y-1.5">
            {[['One-time payment', 'Selected', true], ['Base price', 'Inclusive tax', false], ['2 offers configured', '1 active', false], ['Publish step pending', 'Next', false]].map(([k, v, highlight]) => (
              <div key={k} className="flex items-center justify-between rounded-md bg-[#f1f5f9] px-3 py-2 text-[12px]">
                <span>{k}</span>
                {highlight ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">{v}</span> : <span className="text-[#6b7280]">{v}</span>}
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-black/[0.06] space-y-1.5 text-[12px]">
            {[['Expected net revenue', '₹ 10,170'], ['Tax included', '18% GST'], ['Coupons available', '2 rules']].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span className="text-[#6b7280]">{k}</span><span className="font-medium">{v}</span></div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-black/[0.08] bg-white p-4">
          <h4 className="text-[15px] font-bold text-[#0f172a] mb-1">Checkout preview</h4>
          <p className="text-[11px] text-[#6b7280] mb-3">Billing breakdown learners will see at checkout.</p>
          <div className="rounded-md bg-[#f8fafc] p-3 text-[12px]">
            <p className="font-semibold text-[#0f172a]">{form.title || 'Your Course'}</p>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between"><span className="text-[#6b7280]">Course fee</span><span>{form.basePrice || '—'}</span></div>
              <div className="flex justify-between"><span className="text-[#6b7280]">Enrollment fee</span><span>{form.enrollmentFee || '—'}</span></div>
              <div className="flex justify-between"><span className="text-[#6b7280]">Tax included</span><span>GST included</span></div>
            </div>
            <div className="mt-2 border-t border-black/[0.08] pt-2 flex justify-between font-semibold"><span>Total payable</span><span>{form.basePrice || '—'}</span></div>
          </div>
        </div>

        <div className="rounded-lg border border-black/[0.08] bg-white p-4">
          <h4 className="text-[15px] font-bold text-[#0f172a] mb-1">Publishing workflow</h4>
          <ul className="mt-2 space-y-2.5 text-[12px]">
            <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" /><span><strong>Basics completed</strong><br /><span className="text-[#6b7280]">Course details, category, and instructor are already locked.</span></span></li>
            <li className="flex gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" /><span><strong>Content completed</strong><br /><span className="text-[#6b7280]">Modules, resources, and lesson sequence are approved for enrollment.</span></span></li>
            <li className="flex gap-2"><AlertCircle className="h-4 w-4 text-[#5b3df6] mt-0.5" /><span><strong>Pricing in progress</strong><br /><span className="text-[#6b7280]">Final learner price, coupons, and tax settings are being reviewed.</span></span></li>
            <li className="flex gap-2"><span className="inline-block h-4 w-4 rounded-full border border-black/[0.15] mt-0.5 flex-shrink-0" /><span><strong>Publish next</strong><br /><span className="text-[#6b7280]">Review enrollment details and launch readiness after this step.</span></span></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP 4 — PUBLISH
// ─────────────────────────────────────────────
function PublishStep() {
  const [visibility, setVisibility] = useState('public')
  const [welcomeEmail, setWelcomeEmail] = useState(true)
  const [whatsapp, setWhatsapp] = useState(false)

  return (
    <div className="grid grid-cols-[1.55fr_1fr] gap-5">
      <div className="space-y-4">
        {/* Visibility */}
        <section className="rounded-lg border border-black/[0.08] bg-white p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div><h3 className="text-[16px] font-bold text-[#0f172a]">Course Visibility</h3><p className="text-[12px] text-[#6b7280]">Control who can discover and enroll in this course.</p></div>
            <span className="inline-flex shrink-0 items-center rounded-xl bg-emerald-500 px-2.5 py-1 text-[11px] font-medium text-white">Auto-saved</span>
          </div>
          <div className="space-y-2">
            {[
              { id: 'public', title: 'Public (Marketplace)', desc: 'Course will be visible in the student portal and open for enrollment to anyone.', recommended: true },
              { id: 'unlisted', title: 'Unlisted', desc: 'Not visible in the portal. Students can only enroll if they have the direct link.' },
              { id: 'private', title: 'Private', desc: 'Closed for self-enrollment. You must manually add or invite students.' },
            ].map((opt) => (
              <div key={opt.id} onClick={() => setVisibility(opt.id)}
                className={`flex items-start justify-between p-3.5 rounded-lg border cursor-pointer transition-colors ${visibility === opt.id ? 'border-[#5b3df6] bg-[#faf8ff]' : 'border-black/[0.08] bg-white hover:bg-gray-50'}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${visibility === opt.id ? 'border-[#5b3df6]' : 'border-[#d1d5db]'}`}>
                    {visibility === opt.id && <div className="h-2 w-2 rounded-full bg-[#5b3df6]" />}
                  </div>
                  <div><p className="text-[13px] font-semibold text-[#0f172a]">{opt.title}</p><p className="text-[12px] text-[#6b7280] mt-0.5">{opt.desc}</p></div>
                </div>
                {opt.recommended && <span className="shrink-0 ml-3 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Recommended</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Enrollment & Capacity */}
        <section className="rounded-lg border border-black/[0.08] bg-white p-5">
          <h3 className="text-[16px] font-bold text-[#0f172a] mb-0.5">Enrollment & Capacity</h3>
          <p className="text-[12px] text-[#6b7280] mb-4">Set limits on when students can join and how many seats are available.</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5"><FieldLabel>Enrollment Start</FieldLabel><InputShell className="justify-between"><span className="text-sm text-[#0f172a]">Immediate</span><Calendar className="h-4 w-4 text-[#94a3b8]" /></InputShell></div>
            <div className="flex flex-col gap-1.5"><FieldLabel>Enrollment End</FieldLabel><InputShell className="justify-between"><span className="text-sm text-[#94a3b8]">No end date</span><Calendar className="h-4 w-4 text-[#94a3b8]" /></InputShell></div>
            <div className="flex flex-col gap-1.5"><FieldLabel>Maximum Capacity</FieldLabel><InputShell><span className="text-sm text-[#0f172a]">Unlimited</span></InputShell></div>
            <div className="flex flex-col gap-1.5"><FieldLabel>Access Duration</FieldLabel><InputShell className="justify-between"><span className="text-sm text-[#0f172a]">Lifetime</span><ChevronDown className="h-4 w-4 text-[#94a3b8]" /></InputShell></div>
          </div>
        </section>

        {/* Automated Communication */}
        <section className="rounded-lg border border-black/[0.08] bg-white p-5">
          <h3 className="text-[16px] font-bold text-[#0f172a] mb-0.5">Automated Communication</h3>
          <p className="text-[12px] text-[#6b7280] mb-4">Set up immediate touches for new enrollments.</p>
          <div className="space-y-3">
            {[
              { icon: <Mail className="h-5 w-5 text-[#5b3df6]" />, bg: 'bg-[#ede9ff]', title: 'Welcome Email', desc: 'Sent automatically when a student enrolls.', enabled: welcomeEmail, toggle: () => setWelcomeEmail(!welcomeEmail) },
              { icon: <MessageSquare className="h-5 w-5 text-emerald-600" />, bg: 'bg-[#f0fdf4]', title: 'WhatsApp Notification', desc: 'Send a quick welcome message via WhatsApp.', enabled: whatsapp, toggle: () => setWhatsapp(!whatsapp) },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between p-4 rounded-lg border border-black/[0.08] bg-[#f8fafc]">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}>{item.icon}</div>
                  <div><p className="text-[13px] font-semibold text-[#0f172a]">{item.title}</p><p className="text-[12px] text-[#6b7280]">{item.desc}</p></div>
                </div>
                <Toggle enabled={item.enabled} onToggle={item.toggle} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="rounded-lg border border-black/[0.08] bg-white p-4">
          <h4 className="text-[15px] font-bold text-[#0f172a] mb-1">Pre-flight Checklist</h4>
          <p className="text-[11px] text-[#6b7280] mb-3">All mandatory steps are completed.</p>
          <div className="space-y-3">
            {[
              { label: '1. Basics completed', sub: 'Course title, category, and instructor set.', done: true },
              { label: '2. Content uploaded', sub: 'Modules, lessons, and resources added.', done: true },
              { label: '3. Pricing locked', sub: 'Payment model and price configured.', done: true },
              { label: '4. Ready to publish', sub: 'Review settings on this page to launch.', done: false, current: true },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.done ? 'bg-emerald-500' : item.current ? 'border-2 border-[#5b3df6]' : 'border-2 border-[#e2e8f0]'}`}>
                  {item.done ? <Check className="h-3 w-3 text-white" strokeWidth={3} /> : item.current ? <div className="w-2 h-2 rounded-full border-2 border-[#5b3df6]" /> : null}
                </div>
                <div><p className="text-[12px] font-semibold text-[#0f172a]">{item.label}</p><p className="text-[11px] text-[#6b7280]">{item.sub}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-3 h-1.5 w-full bg-[#e9f2ff] rounded-full overflow-hidden">
            <div className="h-full bg-[#5b3df6] rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        <div className="rounded-lg border border-black/[0.08] bg-white p-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#f1f5f9] flex items-center justify-center mx-auto mb-3">
            <Rocket className="h-6 w-6 text-[#5b3df6]" />
          </div>
          <h4 className="text-[16px] font-bold text-[#0f172a] mb-1">Launch Course</h4>
          <p className="text-[11px] text-[#6b7280] mb-4">Everything is ready. Make your course available to learners.</p>
          <button className="w-full py-2.5 bg-[#5b3df6] text-white text-[13px] font-semibold rounded-lg hover:bg-[#4a2ed8] transition-colors mb-2">Publish Course Now</button>
          <button className="w-full py-2.5 border border-black/[0.08] text-[13px] font-medium text-[#0f172a] rounded-lg hover:bg-gray-50 transition-colors">Schedule for Later</button>
          <p className="text-[10px] text-[#94a3b8] mt-3 text-left leading-relaxed">Once published, the course page becomes live immediately. Registered students will be notified if you enable announcements.</p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// CREATE COURSE PAGE (full-page multi-step)
// ─────────────────────────────────────────────
function CreateCoursePage({ onBack, onCreate }) {
  const [activeStep, setActiveStep] = useState('basics')
  const stepOrder = ['basics', 'content', 'pricing', 'publish']
  const nextLabel = { basics: 'Continue to Content', content: 'Continue to Pricing', pricing: 'Continue to Publish', publish: 'Publish Now' }

  const [form, setForm] = useState({
    title: '', description: '', category: 'Science', level: 'Beginner',
    format: 'Hybrid · Live + Recorded', duration: '', instructor: 'Marcus Chen',
    pricingModel: 'one-time', basePrice: '', currency: 'INR - Indian Rupee',
    enrollmentFee: '', tax: 'Inclusive of GST',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleNext = () => {
    const idx = stepOrder.indexOf(activeStep)
    if (activeStep === 'publish') {
      onCreate(form)
      onBack()
      return
    }
    if (idx < stepOrder.length - 1) setActiveStep(stepOrder[idx + 1])
  }

  const handleSaveDraft = () => {
    onCreate({ ...form, status: 'draft' })
    onBack()
  }

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="p-8 pb-16">
        {/* Header — same style as AdminCourseManagement */}
        <section
          className="relative overflow-hidden rounded-lg border border-black/[0.08] p-6"
          style={{ background: 'linear-gradient(127.823deg, rgb(255,255,255) 0%, rgb(232,245,255) 100%)' }}
        >
          <div className="flex flex-col gap-4 pr-4 md:pr-80">
            {/* Back breadcrumb */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-[12px] text-[#94a3b8] hover:text-[#5b3df6] transition-colors w-fit"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
              Back to My Courses
            </button>

            <span className="inline-flex w-fit rounded-xl bg-[#ffd966] px-2.5 py-1.5 text-[11.915px] font-medium text-[#4b2e00]">Create</span>
            <h2 className="max-w-[650px] text-[27.801px] font-bold leading-[1.2] text-[#0f172a]">
              {activeStep === 'pricing' ? 'Set pricing, billing, and discount rules before publishing.'
               : activeStep === 'publish' ? 'Review settings and launch your course to learners.'
               : activeStep === 'content' ? 'Build your course modules, lessons, and shared resources.'
               : 'Create a new course with modules, pricing, and publishing settings.'}
            </h2>
            <p className="max-w-[650px] text-[13.9px] text-[#94a3b8]">
              {activeStep === 'pricing' ? 'Choose how learners pay for the course, define offers for admissions campaigns, and review the final revenue setup before the course goes live.'
               : activeStep === 'publish' ? 'Control course visibility, enrollment windows, and automated student communications before publishing.'
               : 'Set up the essentials first, then move through content, review, and publishing. The layout stays balanced and spacious so instructors can complete setup without losing context.'}
            </p>
            <div className="inline-flex flex-wrap gap-2 rounded-xl bg-[#f1f5f9] p-1">
              {STEPS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveStep(s.id)}
                  className={`rounded-xl px-3.5 py-2 text-[13px] font-medium transition-colors ${activeStep === s.id ? 'border border-black/[0.08] bg-white text-[#0f172a]' : 'text-[#6b7280] hover:text-[#0f172a]'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Top-right action buttons */}
          <div className="mt-6 flex flex-wrap gap-3 md:absolute md:right-6 md:top-6 md:mt-0">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-black/[0.08] bg-white px-[15px] text-sm font-medium text-[#0f172a] hover:bg-gray-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('pricing')}
              className="inline-flex h-10 items-center justify-center rounded-[6px] border border-[#d8cffc] bg-[#f3efff] px-4 text-[13px] font-semibold tracking-[0.01em] text-[#5b3df6] shadow-[0_1px_0_rgba(91,61,246,0.08)] hover:bg-[#ece5ff]"
            >
              Open Pricing
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#6c5ce7] px-3.5 text-sm font-medium text-white hover:bg-[#4a2ed8]"
            >
              {nextLabel[activeStep]}
            </button>
          </div>
        </section>

        {/* Step content */}
        <div className="mt-8">
          {activeStep === 'basics'  && <BasicsStep form={form} onChange={handleChange} />}
          {activeStep === 'content' && <ContentStep />}
          {activeStep === 'pricing' && <PricingStep form={form} onChange={handleChange} />}
          {activeStep === 'publish' && <PublishStep />}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// EDIT MODAL (simple)
// ─────────────────────────────────────────────
function EditCourseModal({ course, onClose, onSave }) {
  const [form, setForm] = useState({ title: course.title, description: course.description, category: course.category, level: course.level, duration: course.duration, lessons: course.lessons.toString() })
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[560px] max-h-[90vh] overflow-y-auto bg-white rounded-[16px] shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-black/[0.08]">
          <h2 className="text-[18px] font-bold text-[#0f172a]">Edit Course</h2>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-[#0f172a]"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          {[['title', 'Course Title', 'text'], ['description', 'Description', 'textarea'], ['duration', 'Duration', 'text'], ['lessons', 'Total Lessons', 'number']].map(([name, label, type]) => (
            <div key={name}>
              <label className="block text-[13px] font-semibold text-[#0f172a] mb-1">{label}</label>
              {type === 'textarea'
                ? <textarea name={name} value={form[name]} onChange={handleChange} rows={3} className="w-full rounded-[8px] border border-black/[0.08] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] resize-none" />
                : <input type={type} name={name} value={form[name]} onChange={handleChange} className="w-full rounded-[8px] border border-black/[0.08] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]" />}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            {[['category', 'Category', ['Science', 'Programming', 'Language', 'Mathematics', 'Arts']], ['level', 'Level', ['Beginner', 'Intermediate', 'Advanced']]].map(([name, label, opts]) => (
              <div key={name}>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1">{label}</label>
                <select name={name} value={form[name]} onChange={handleChange} className="w-full rounded-[8px] border border-black/[0.08] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]">
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-black/[0.08]">
          <button onClick={onClose} className="flex-1 h-10 border border-black/[0.08] rounded-[8px] text-[13px] font-medium text-[#64748b] hover:bg-gray-50">Cancel</button>
          <button onClick={() => { onSave(form); onClose(); }} className="flex-1 h-10 bg-[#5b3df6] rounded-[8px] text-[13px] font-medium text-white hover:bg-[#4a2ed8]">Save Changes</button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function InstructorCourseManagement() {
  const [courses, setCourses] = useState(sampleCourses)
  const [showCreatePage, setShowCreatePage] = useState(false) // ← full-page toggle
  const [editCourse, setEditCourse] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const handleCreate = (form) => {
    const newCourse = {
      id: Date.now(),
      title: form.title || 'Untitled Course',
      description: form.description || '',
      category: form.category || 'Science',
      level: form.level || 'Beginner',
      duration: form.duration || '—',
      lessons: parseInt(form.lessons) || 0,
      students: 0,
      rating: 0,
      status: form.status || 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80',
    }
    setCourses(prev => [newCourse, ...prev])
  }

  const handleSaveEdit = (form) => {
    setCourses(courses.map(c => c.id === editCourse.id ? { ...c, ...form, lessons: parseInt(form.lessons) || c.lessons } : c))
    setEditCourse(null)
  }

  const handleDelete = (id) => { setCourses(courses.filter(c => c.id !== id)); setDeleteId(null) }

  // ── If create-page is open, render full-page flow ──
  if (showCreatePage) {
    return (
      <CreateCoursePage
        onBack={() => setShowCreatePage(false)}
        onCreate={handleCreate}
      />
    )
  }

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchFilter = filterStatus === 'all' || c.status === filterStatus
    return matchSearch && matchFilter
  })

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    totalStudents: courses.reduce((s, c) => s + c.students, 0),
  }

  return (
    <div className="min-h-full bg-[#f6f8fa]">
      <div className="space-y-4 p-5">
        {/* Hero */}
        <section className="rounded-[12px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-[12px] bg-[#ffd966] px-3 py-1.5 mb-4">
                <BookOpen className="h-4 w-4 text-[#4b2e00]" />
                <span className="text-[12px] font-medium text-[#4b2e00]">Instructor Workspace</span>
              </div>
              <h1 className="text-[32px] font-bold leading-tight text-[#0f172a]">My Courses</h1>
              <p className="mt-2 max-w-[560px] text-[13px] text-[#94a3b8]">
                Create, manage, and publish your courses. Track student enrollment, performance, and course engagement all in one place.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowCreatePage(true)}
                  className="inline-flex items-center gap-2 bg-[#5b3df6] px-4 py-2 rounded-[8px] text-[13px] font-semibold text-white hover:bg-[#4a2ed8] transition-colors"
                >
                  <Plus className="h-4 w-4" /> Create New Course
                </button>
                <button className="inline-flex items-center gap-2 border border-black/[0.08] bg-white px-4 py-2 rounded-[8px] text-[13px] font-semibold text-[#0f172a] hover:bg-gray-50">
                  <Upload className="h-4 w-4" /> Bulk Upload
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white border border-black/[0.08] flex items-center gap-2 px-3 py-2 rounded-[8px]">
                <div className="h-8 w-8 rounded-full bg-[#e8f5ff] flex items-center justify-center text-[12px] font-bold text-[#5b3df6]">MC</div>
                <div><p className="text-[12px] font-semibold text-[#0f172a]">Marcus Chen</p><p className="text-[10px] text-[#94a3b8]">Instructor</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Total Courses" value={stats.total} icon={BookOpen} />
          <StatCard label="Published" value={stats.published} icon={CheckCircle} />
          <StatCard label="In Draft" value={stats.draft} icon={Edit} />
          <StatCard label="Total Students" value={stats.totalStudents} icon={Users} />
        </div>

        {/* Search */}
        <div className="bg-white border border-black/[0.08] rounded-lg p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
              <input type="text" placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-black/[0.08] rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]" />
            </div>
            <div className="flex gap-2">
              {['all', 'published', 'draft', 'review'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors ${filterStatus === s ? 'bg-[#5b3df6] text-white' : 'bg-gray-100 text-[#64748b] hover:bg-gray-200'}`}>
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course) => (
            <div key={course.id} className="bg-white border border-black/[0.08] rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-40">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3"><Pill variant={course.status}>{course.status}</Pill></div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="text-[15px] font-bold text-[#0f172a] line-clamp-1 flex-1">{course.title}</h3>
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-medium text-[#64748b]">{course.rating || '—'}</span>
                  </div>
                </div>
                <p className="text-[12px] text-[#94a3b8] line-clamp-2 mb-3">{course.description}</p>
                <div className="flex flex-wrap gap-3 mb-3 text-[11px] text-[#94a3b8]">
                  <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" />{course.lessons} lessons</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{course.duration}</span>
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{course.students} students</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-black/[0.08]">
                  <span className="text-[10px] text-[#94a3b8]">Created: {course.createdAt}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => setEditCourse(course)} className="p-1.5 text-[#64748b] hover:text-[#5b3df6] hover:bg-[#ede7ff] rounded-md transition-colors" title="Edit"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteId(course.id)} className="p-1.5 text-[#64748b] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    <button className="p-1.5 text-[#64748b] hover:text-[#5b3df6] hover:bg-[#ede7ff] rounded-md transition-colors" title="View"><Eye className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-[#94a3b8] mx-auto mb-3" />
            <p className="text-[14px] text-[#94a3b8]">No courses found</p>
            <button onClick={() => setShowCreatePage(true)} className="mt-3 text-[13px] text-[#5b3df6] hover:text-[#4a2ed8] font-medium">Create your first course</button>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editCourse && <EditCourseModal course={editCourse} onClose={() => setEditCourse(null)} onSave={handleSaveEdit} />}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[380px] bg-white rounded-[16px] shadow-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3"><AlertCircle className="h-6 w-6 text-red-500" /></div>
            <h3 className="text-[17px] font-bold text-[#0f172a] mb-2">Delete Course?</h3>
            <p className="text-[13px] text-[#64748b] mb-5">This action cannot be undone. All course data will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 h-10 border border-black/[0.08] rounded-[8px] text-[13px] font-medium text-[#64748b] hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 h-10 bg-red-500 rounded-[8px] text-[13px] font-medium text-white hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
