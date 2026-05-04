import React, { useState, useEffect } from 'react'
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
  Video,
  FileText,
  Settings,
  MoreHorizontal,
  ThumbsUp,
  Eye,
  Trash2,
  Ban,
  CheckCircle2
} from 'lucide-react'
import { api } from '../../lib/api'

// Figma avatar assets
const AVATAR_RAHUL = 'https://www.figma.com/api/mcp/asset/5b24609b-97ad-4bea-af20-b4f4df404b75'
const AVATAR_AISHA = 'https://www.figma.com/api/mcp/asset/3e187a9c-3e48-41dc-8f03-5affd73e7e5f'
const AVATAR_LIAM = 'https://www.figma.com/api/mcp/asset/ccc04c84-4ac7-4c6c-b67f-2ff1887c4b83'
const AVATAR_NADIA = 'https://www.figma.com/api/mcp/asset/9834fb2c-3d16-47cd-9e85-eaf390f7183a'
const AVATAR_OMAR = 'https://www.figma.com/api/mcp/asset/36623965-019b-4b68-bd68-2bf7a2e38748'

function Avatar({ src, alt = '', className = '' }) {
  const [imgError, setImgError] = useState(false)
  
  if (imgError || !src || src.includes('figma.com/api/mcp/asset')) {
    return (
      <div className={`flex items-center justify-center bg-[#ede7ff] text-[#5b3df6] font-semibold ${className}`}>
        {alt?.charAt(0) || 'A'}
      </div>
    )
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={`h-[36px] w-[36px] rounded-[6px] object-cover ${className}`}
      onError={() => setImgError(true)}
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
function ViewInstructorModal({ instructor, courses = [], onClose }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [liveCourses, setLiveCourses] = useState(Array.isArray(courses) ? courses : [])
  const [liveClasses, setLiveClasses] = useState([])

  useEffect(() => {
    let isMounted = true

    Promise.allSettled([
      api('/lms/courses?limit=300'),
      api('/lms/public/courses?limit=300'),
      api('/lms/live-classes?limit=300'),
    ])
      .then((results) => {
        const mergedCourses = []
        const seenIds = new Set()
        const liveClassesResponse = results[2]

        results.forEach((result) => {
          if (result === liveClassesResponse) {
            return
          }

          const items = result.status === 'fulfilled'
            ? (Array.isArray(result.value?.items)
              ? result.value.items
              : Array.isArray(result.value)
                ? result.value
                : [])
            : []

          items.forEach((course) => {
            const courseId = String(course?._id || course?.id || '').trim()
            if (courseId && !seenIds.has(courseId)) {
              seenIds.add(courseId)
              mergedCourses.push(course)
            }
          })
        })

        if (isMounted) {
          setLiveCourses(mergedCourses.length > 0 ? mergedCourses : (Array.isArray(courses) ? courses : []))
          const liveItems = liveClassesResponse.status === 'fulfilled'
            ? (Array.isArray(liveClassesResponse.value?.items)
              ? liveClassesResponse.value.items
              : Array.isArray(liveClassesResponse.value)
                ? liveClassesResponse.value
                : [])
            : []
          setLiveClasses(liveItems)
        }
      })
      .catch(() => {
        if (isMounted) {
          setLiveCourses(Array.isArray(courses) ? courses : [])
          setLiveClasses([])
        }
      })

    return () => {
      isMounted = false
    }
  }, [courses])

  if (!instructor) return null

  const tabs = ['overview', 'courses', 'live-classes', 'reviews', 'bank-details']
  const instructorId = String(instructor._id || instructor.id || '').trim()
  const instructorEmail = String(instructor.email || '').trim().toLowerCase()

  const uploadedCourses = React.useMemo(() => {
    return [...liveCourses]
      .filter((course) => {
        const createdBy = String(course?.created_by || course?.instructor_id || course?.owner_id || '').trim()
        const createdByEmail = String(course?.created_by_email || course?.email || '').trim().toLowerCase()
        return (instructorId && createdBy === instructorId) || (instructorEmail && createdByEmail === instructorEmail)
      })
      .sort((left, right) => new Date(right.created_at || right.updated_at || 0) - new Date(left.created_at || left.updated_at || 0))
  }, [liveCourses, instructorId, instructorEmail])

  const instructorLiveClasses = React.useMemo(() => {
    return [...liveClasses]
      .filter((session) => {
        const createdBy = String(session?.created_by || session?.instructor_id || session?.owner_id || '').trim()
        return (instructorId && createdBy === instructorId)
      })
      .sort((left, right) => new Date(left.start_at || 0) - new Date(right.start_at || 0))
  }, [liveClasses, instructorId])

  const totalStudents = React.useMemo(() => uploadedCourses.reduce((sum, c) => sum + Number(c.students_count || 0), 0), [uploadedCourses])
  const activeBatches = React.useMemo(() => instructorLiveClasses.length, [instructorLiveClasses])
  const avgRating = React.useMemo(() => uploadedCourses.length ? (uploadedCourses.reduce((sum, c) => sum + Number(c.avg_rating || c.rating || 0), 0) / uploadedCourses.length).toFixed(1) : '-', [uploadedCourses])

  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)

  useEffect(() => {
    let isMounted = true
    if (uploadedCourses.length > 0) {
      setLoadingReviews(true)
      Promise.all(uploadedCourses.map(c => api(`/lms/ratings?target_type=course&target_id=${c._id || c.id}`)))
        .then(results => {
          if (!isMounted) return
          const allReviews = results.flatMap(r => r.items || r || [])
          setReviews(allReviews.sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0)))
        })
        .catch(err => console.error(err))
        .finally(() => {
          if (isMounted) setLoadingReviews(false)
        })
    }
    return () => { isMounted = false }
  }, [uploadedCourses])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 sm:p-5">
          <div className="flex items-center gap-4">
            <Avatar src={instructor.avatar} alt={instructor.full_name || instructor.email} className="w-12 h-12 rounded-lg" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{instructor.full_name || instructor.email}</h2>
              <p className="text-sm text-gray-500">{instructor.email} • {instructor.role || 'Instructor'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-100 px-4 sm:px-5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-[#5b3df6] text-[#5b3df6]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 max-h-[calc(90vh-140px)] sm:p-5">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{instructor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{instructor.phone || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{instructor.expertise || '-'}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Teaching Profile</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">Status: <span className="font-medium text-gray-900">{instructor.status}</span></p>
                    <p className="text-gray-600">Teaching Load: <span className="font-medium text-gray-900">{instructor.load}</span></p>
                    <p className="text-gray-600">Course: <span className="font-medium text-gray-900">{instructor.course || '-'}</span></p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Teaching Stats</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total Students Taught</p>
                    <p className="text-sm font-medium mt-1">{totalStudents}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Active Batches</p>
                    <p className="text-sm font-medium mt-1">{activeBatches}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Average Rating</p>
                    <p className="text-sm font-medium mt-1">{avgRating}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Status</p>
                    <div className="mt-1"><Pill variant={instructor.statusVariant}>{instructor.status}</Pill></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-900">Uploaded Courses</h3>
                <span className="rounded-full bg-[#f0f4f8] px-3 py-1 text-[11px] font-medium text-[#64748b]">
                  {uploadedCourses.length} total
                </span>
              </div>
              {uploadedCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">No uploaded courses found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadedCourses.map((course) => (
                    <div key={course._id || course.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">{course.title || 'Untitled course'}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {course.description || 'No description available'}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-gray-600">
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1">
                              {course.course_type || 'course'}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-[#e8f5ff] px-2.5 py-1 text-[#2563eb]">
                              {course.students_count || 0} students enrolled
                            </span>
                            <span className="inline-flex items-center rounded-full bg-[#ede7ff] px-2.5 py-1 text-[#5b3df6]">
                              {course.price ? `₹${Number(course.price).toLocaleString()}` : 'Free'}
                            </span>
                          </div>
                        </div>
                        {course.youtube_url && (
                          <a
                            href={course.youtube_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
                          >
                            View source
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'live-classes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-900">Active Live Classes</h3>
                <span className="rounded-full bg-[#f0f4f8] px-3 py-1 text-[11px] font-medium text-[#64748b]">
                  {instructorLiveClasses.length} total
                </span>
              </div>
              {instructorLiveClasses.length === 0 ? (
                <div className="text-center py-8">
                  <Video className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">No live classes found for this instructor</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {instructorLiveClasses.map((session) => {
                    const startLabel = session.start_at ? new Date(session.start_at).toLocaleString() : 'No schedule'
                    const status = String(session.status || 'upcoming').toLowerCase()
                    const attendees = Array.isArray(session.attendee_ids) ? session.attendee_ids.length : 0

                    return (
                      <div key={session._id || session.id} className="rounded-lg border border-gray-200 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900">{session.title || 'Untitled live class'}</p>
                            <p className="mt-1 text-sm text-gray-500">{session.description || 'No description available'}</p>
                            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-gray-600">
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1">
                                {startLabel}
                              </span>
                              <span className="inline-flex items-center rounded-full bg-[#e8f5ff] px-2.5 py-1 text-[#2563eb]">
                                {session.duration_minutes || 60} mins
                              </span>
                              <span className="inline-flex items-center rounded-full bg-[#ede7ff] px-2.5 py-1 text-[#5b3df6]">
                                {attendees} attendees
                              </span>
                              <span className="inline-flex items-center rounded-full bg-[#f0f4f8] px-2.5 py-1 text-[#64748b]">
                                {status}
                              </span>
                            </div>
                          </div>
                          {session.join_url && (
                            <a
                              href={session.join_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50"
                            >
                              Join
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Student Reviews</h3>
              {loadingReviews ? (
                <p className="text-sm text-gray-500">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No review data is available yet for this instructor.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((r, idx) => (
                    <div key={idx} className="rounded-lg border border-gray-200 p-4">
                       <div className="flex items-center justify-between mb-2">
                         <div className="flex gap-1 text-[#facc15]">
                           {Array.from({ length: 5 }).map((_, i) => (
                             <Star key={i} className={`h-4 w-4 ${i < (r.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
                           ))}
                         </div>
                         <span className="text-xs text-gray-500">{r.updated_at || r.created_at ? new Date(r.updated_at || r.created_at).toLocaleDateString() : ''}</span>
                       </div>
                       <p className="text-sm text-gray-700">{r.comment || 'No comment provided.'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'bank-details' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Bank Details</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-3">
                  <p className="text-xs text-gray-500">Account holder name</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{instructor.bank_account_holder || '-'}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3">
                  <p className="text-xs text-gray-500">Bank name</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{instructor.bank_name || '-'}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3">
                  <p className="text-xs text-gray-500">Account number</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{instructor.bank_account_number || '-'}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3">
                  <p className="text-xs text-gray-500">IFSC</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{instructor.bank_ifsc || '-'}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 sm:col-span-2">
                  <p className="text-xs text-gray-500">UPI ID</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{instructor.bank_upi_id || '-'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 flex flex-col gap-3 sm:px-5 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
            Close
          </button>
          <button className="px-4 py-2 bg-[#5b3df6] text-white text-sm font-medium rounded-lg hover:bg-[#4a2ed8]">
            Send Message
          </button>
        </div>
      </div>
    </div>
  )
}

// Assign Course Modal Component
function AssignCourseModal({ instructor, onClose, onAssign, availableCourses }) {
  const [selectedCourse, setSelectedCourse] = useState('')
  const [teachingRole, setTeachingRole] = useState('primary')
  const [note, setNote] = useState('')
  const [loading] = useState(false)

  const courses = availableCourses?.length > 0 ? availableCourses : []

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
                <Avatar src={instructor.avatar} alt={instructor.full_name || instructor.email} className="h-12 w-12 rounded-full" />
                <div>
                  <p className="text-[18px] font-semibold text-[#111827]">{instructor.full_name || instructor.email}</p>
                  <p className="text-[12px] text-[#94a3b8]">Current load: {instructor.load || '0 hrs'} / week</p>
                </div>
              </div>
              <Pill variant={instructor.is_active ? 'success' : 'secondary'}>{instructor.is_active ? 'Active' : 'Inactive'}</Pill>
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
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full appearance-none rounded-[8px] border border-black/[0.08] bg-white px-3 py-2.5 text-[14px] text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] cursor-pointer"
                >
                  <option value="">Select a course...</option>
                  {courses.map(course => (
                    <option key={course._id || course.id} value={course.title}>{course.title}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
              </div>
            </div>

            {/* Teaching Role */}
            <div className="mb-6 rounded-[14px] border border-black/[0.08] bg-white p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5b3df6] text-[11px] font-semibold text-white">2</div>
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

          </div>

          <aside className="min-h-0 overflow-y-auto border-t border-black/[0.08] bg-[#fafcff] p-4 sm:p-6 xl:border-l xl:border-t-0">
            <div className="space-y-4">
              <div className="rounded-[14px] border border-black/[0.08] bg-white p-4">
                <h3 className="text-[15px] font-semibold text-[#0f172a]">Assignment summary</h3>
                <div className="mt-3 space-y-2 text-[12px] text-[#64748b]">
                  <p><span className="text-[#94a3b8]">Course:</span> <span className="font-medium text-[#334155]">{selectedCourse || 'Not selected'}</span></p>
                  <p><span className="text-[#94a3b8]">Role:</span> <span className="font-medium text-[#334155]">{teachingRole === 'primary' ? 'Primary Instructor' : 'Co-Instructor'}</span></p>
                </div>
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
                    Course roster gets notified after confirmation.
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
              if (selectedCourse) {
                onAssign?.({ course: selectedCourse, role: teachingRole, note })
                onClose()
              }
            }}
            disabled={!selectedCourse || loading}
            className={`inline-flex h-10 items-center gap-2 rounded-[8px] px-4 text-[13px] font-semibold transition-colors ${
              selectedCourse && !loading
                ? 'bg-[#5b3df6] text-white hover:bg-[#4a2ed8]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Assigning...' : 'Assign Course'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function CreateInstructorModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    expertise: 'STEM',
    experience: '3-5 years',
    bio: '',
  })
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Wed'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const expertiseOptions = ['STEM', 'Coding', 'English', 'Math']
  const scheduleOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const formCompletion = [form.fullName, form.email, form.password, form.phone].filter(Boolean).length

  const toggleDay = (day) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]))
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!form.fullName.trim()) {
      setError('Full name is required')
      return
    }
    if (!form.email.trim()) {
      setError('Email is required')
      return
    }
    if (!form.password.trim()) {
      setError('Password is required')
      return
    }
    
    setLoading(true)
    setError('')
    await onCreate(form)
    setLoading(false)
    onClose()
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
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-[13px] text-red-600">{error}</p>
              </div>
            )}
            
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
                    <label className="mb-1.5 block text-[12px] font-medium text-[#0f172a]">Password</label>
                    <div className="flex h-11 items-center gap-2 rounded-[10px] border border-black/[0.08] bg-white px-3 focus-within:border-[#5b3df6] focus-within:ring-2 focus-within:ring-[#5b3df6]/15">
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        className="min-w-0 flex-1 bg-transparent text-[13px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
                        placeholder="••••••••"
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
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4a2ed8] disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create & send invite'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminInstructorManagement() {
  const [instructors, setInstructors] = useState([])
  const [courses, setCourses] = useState([])
  const [activeFilter, setActiveFilter] = useState('All instructors')
  const [directorySearch, setDirectorySearch] = useState('')
  const [selectedAssignInstructor, setSelectedAssignInstructor] = useState(null)
  const [selectedViewInstructor, setSelectedViewInstructor] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const filters = ['All instructors', 'Active', 'Inactive']

  // Load instructors from API
  const loadInstructors = async () => {
    try {
      setLoading(true)
      setError('')
      const [userResponse, courseResponse] = await Promise.all([
        api('/lms/users?role=instructor&limit=200'),
        api('/lms/courses?limit=300'),
      ])
      const users = userResponse.items || []
      const allCourses = courseResponse.items || []
      
      // Transform API data to match UI format
      const formattedInstructors = users.map(user => ({
        id: user._id,
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        is_active: user.is_active,
        role: 'Instructor',
        course: user.assigned_course || '',
        courseSub: user.expertise || '',
        load: user.weekly_load ? `${user.weekly_load} hrs / week` : '0 hrs / week',
        capacity: user.capacity || 'Capacity open',
        status: user.is_active ? 'Active' : 'Inactive',
        statusVariant: user.is_active ? 'success' : 'secondary',
        avatar: user.avatar_url,
        expertise: user.expertise,
        bank_account_holder: user.bank_account_holder || '',
        bank_name: user.bank_name || '',
        bank_account_number: user.bank_account_number || '',
        bank_ifsc: user.bank_ifsc || '',
        bank_upi_id: user.bank_upi_id || '',
        students_count: user.students_count || 0,
        active_batches: user.active_batches || 0,
        rating: user.rating ?? null,
      }))
      
      setInstructors(formattedInstructors)
      setCourses(allCourses)
    } catch (err) {
      setError(err?.message || 'Unable to load instructors.')
      setInstructors([])
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInstructors()
  }, [])

  // Create instructor via API
  const handleCreateInstructor = async (formData) => {
    setLoading(true)
    try {
      setError('')
      await api('/lms/users', {
        method: 'POST',
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone,
          expertise: formData.expertise,
          experience: formData.experience,
          bio: formData.bio,
          role: 'instructor',
        }),
      })
      await loadInstructors()
    } catch (err) {
      setError(err?.message || 'Unable to create instructor.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete instructor via API
  const handleDeleteInstructor = async (id) => {
    setLoading(true)
    try {
      setError('')
      await api(`/lms/users/${id}`, { method: 'DELETE' })
      await loadInstructors()
    } catch (err) {
      setError(err?.message || 'Unable to delete instructor.')
    } finally {
      setLoading(false)
    }
  }

  const handleActionClick = (action, instructor) => {
    if (action === 'View') {
      setSelectedViewInstructor(instructor)
      setShowViewModal(true)
    } else if (action === 'Assign' || action === 'Map Course') {
      setSelectedAssignInstructor(instructor)
      setShowAssignModal(true)
    }
  }

  const handleToggleStatus = async (instructor) => {
    setLoading(true)
    try {
      setError('')
      await api(`/lms/users/${instructor._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: !instructor.is_active })
      })
      await loadInstructors()
    } catch (err) {
      setError(err?.message || 'Unable to update status.')
    } finally {
      setLoading(false)
    }
  }

  const filteredInstructors = instructors.filter((inst) => {
    const matchesFilter =
      activeFilter === 'All instructors' ||
      (activeFilter === 'Active' && inst.is_active === true) ||
      (activeFilter === 'Inactive' && inst.is_active === false)

    if (!matchesFilter) return false
    if (!directorySearch.trim()) return true
    const q = directorySearch.toLowerCase()
    return (
      (inst.full_name || '').toLowerCase().includes(q) ||
      (inst.email || '').toLowerCase().includes(q) ||
      (inst.course || '').toLowerCase().includes(q)
    )
  })

  const stats = {
    total: instructors.length,
    active: instructors.filter(i => i.is_active).length,
    inactive: instructors.filter(i => !i.is_active).length,
  }

  return (
    <>
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-7">
        {/* Hero section */}
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
                disabled={loading}
                className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4b2fd5] disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Create Instructor
              </button>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:min-w-[200px] lg:w-auto">
            <div className="rounded-[8px] border border-black/[0.08] bg-white px-5 py-4">
              <p className="mb-1 text-[12px] text-[#94a3b8]">Total Instructors</p>
              <p className="text-[28px] font-bold text-[#0f172a]">{stats.total}</p>
            </div>
            <div className="rounded-[8px] border border-black/[0.08] bg-white px-5 py-4">
              <p className="mb-1 text-[12px] text-[#94a3b8]">Active Instructors</p>
              <p className="text-[28px] font-bold text-[#0f172a]">{stats.active}</p>
            </div>
          </div>
        </section>

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-[13px] text-red-600">{error}</p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total instructors"
            value={stats.total}
            sub="All instructors"
            subVariant="neutral"
            icon={<Users className="h-[18px] w-[18px] text-[#5b3df6]" />}
          />
          <StatCard
            label="Active instructors"
            value={stats.active}
            sub="Currently teaching"
            subVariant="success"
            icon={<Calendar className="h-[18px] w-[18px] text-[#5b3df6]" />}
          />
          <StatCard
            label="Inactive"
            value={stats.inactive}
            sub="Needs action"
            subVariant="warning"
            icon={<UserPlus className="h-[18px] w-[18px] text-[#5b3df6]" />}
          />
          <StatCard
            label="Applications"
            value="0"
            sub="Pending onboarding"
            subVariant="neutral"
            icon={<UserPlus className="h-[18px] w-[18px] text-[#5b3df6]" />}
          />
        </div>

        {/* Instructor directory */}
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
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5b3df6] mx-auto"></div>
              <p className="mt-3 text-[13px] text-[#94a3b8]">Loading instructors...</p>
            </div>
          ) : (
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
                          <Avatar src={inst.avatar} alt={inst.full_name || inst.email} className="h-11 w-11 shrink-0 rounded-full" />
                          <div className="min-w-0">
                            <p className="text-[14px] font-semibold text-[#0f172a]">{inst.full_name || inst.email}</p>
                            <p className="truncate text-[12px] text-[#94a3b8]">{inst.email}</p>
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
                          <button
                            type="button"
                            onClick={() => handleActionClick('View', inst)}
                            className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-3 text-[12px] font-medium text-[#0f172a] hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleActionClick('Assign', inst)}
                            className="inline-flex h-9 items-center gap-2 rounded-[6px] bg-[#5b3df6] px-3 text-[12px] font-medium text-white hover:bg-[#4b2fd5]"
                          >
                            Assign
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(inst)}
                            title={inst.is_active ? "Suspend" : "Activate"}
                            className={`inline-flex h-9 items-center gap-2 rounded-[6px] border px-3 text-[12px] font-medium transition-colors ${
                              inst.is_active 
                                ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100" 
                                : "border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                            }`}
                          >
                            {inst.is_active ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteInstructor(inst._id)}
                            className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-red-200 bg-red-50 px-3 text-[12px] font-medium text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {filteredInstructors.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-[#94a3b8] mx-auto mb-3" />
              <p className="text-[14px] text-[#94a3b8]">No instructors found</p>
              <button onClick={() => setShowCreateModal(true)} className="mt-3 text-[13px] text-[#5b3df6] hover:text-[#4a2ed8] font-medium">
                Create your first instructor
              </button>
            </div>
          )}
        </section>
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
        availableCourses={courses}
      />
    )}
    {showViewModal && selectedViewInstructor && (
      <ViewInstructorModal
        instructor={selectedViewInstructor}
        courses={courses}
        onClose={() => {
          setShowViewModal(false)
          setSelectedViewInstructor(null)
        }}
      />
    )}
    {showCreateModal && <CreateInstructorModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateInstructor} />}
    </>
  )
}
