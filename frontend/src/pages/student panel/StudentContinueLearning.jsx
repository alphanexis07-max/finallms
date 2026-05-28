import React, { useEffect, useMemo, useState } from 'react'
import { BookOpen, ExternalLink, PlayCircle } from 'lucide-react'
import { api } from '../../lib/api'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80'

function getYoutubeVideoId(url) {
  if (!url) return ''

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0] || ''
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const fromQuery = parsed.searchParams.get('v')
      if (fromQuery) return fromQuery

      const parts = parsed.pathname.split('/').filter(Boolean)
      if (parts[0] === 'embed' || parts[0] === 'shorts') {
        return parts[1] || ''
      }
    }
  } catch {
    return ''
  }

  return ''
}

function getCourseImage(course) {
  if (course?.image) return course.image
  if (course?.thumbnail) return course.thumbnail
  if (course?.banner) return course.banner

  const videoId = getYoutubeVideoId(course?.youtube_url)
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }

  return FALLBACK_IMAGE
}

function formatDate(value) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatPrice(value) {
  const price = Number(value || 0)
  if (!Number.isFinite(price)) return 'Rs. 0'
  return `Rs. ${price.toLocaleString()}`
}

function mapCourse(course, enrollment) {
  return {
    _id: course?._id,
    title: course?.title || 'Untitled course',
    description: course?.description || 'No description available.',
    youtube_url: course?.youtube_url || '',
    course_type: course?.course_type || 'course',
    price: Number(course?.price || 0),
    image: getCourseImage(course),
    enrolledAt: enrollment?.created_at || null,
    updatedAt: course?.updated_at || course?.created_at || null,
  }
}

export default function StudentContinueLearning() {
  const [courses, setCourses] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    Promise.all([
      api('/lms/enrollments?limit=500').catch(() => ({ items: [] })),
      api('/lms/courses?limit=800').catch(() => ({ items: [] })),
    ])
      .then(([enrollmentRes, courseRes]) => {
        const enrollments = enrollmentRes?.items || []
        const coursesById = new Map((courseRes?.items || []).map((course) => [course._id, course]))

        const mappedCourses = enrollments
          .map((enrollment) => {
            const course = coursesById.get(enrollment.course_id)
            if (!course) return null
            return mapCourse(course, enrollment)
          })
          .filter(Boolean)

        setCourses(mappedCourses)
        setSelectedCourseId(mappedCourses[0]?._id || '')
      })
      .catch((err) => {
        setCourses([])
        setError(err?.message || 'Unable to load learning courses.')
      })
      .finally(() => setLoading(false))
  }, [])

  const selectedCourse = useMemo(() => {
    return courses.find((course) => course._id === selectedCourseId) || courses[0] || null
  }, [courses, selectedCourseId])

  return (
    <div className="min-h-full bg-[#F7FAFD] p-4 sm:p-6 lg:p-7">
      <section className="rounded-[8px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] px-5 py-5 sm:px-6 sm:py-6">
        <span className="inline-flex h-[28px] items-center rounded-[12px] bg-[#e8f5ff] px-[10px] text-[12px] font-medium text-[#2563eb]">
          Continue Learning
        </span>
        <h1 className="mt-3 text-[24px] font-bold text-[#0f172a] sm:text-[30px]">Your real enrolled courses</h1>
        <p className="mt-2 max-w-[740px] text-[14px] text-[#64748b]">
          This page is dynamically driven by live enrollment and course data pulled from your LMS.
        </p>
      </section> 

      <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[340px_1fr]">
        <div className="rounded-[8px] border border-black/[0.08] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#0f172a]">My Learning List</h2>
            <span className="rounded-[10px] bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-medium text-[#0f172a]">{courses.length} courses</span>
          </div>

          {loading ? <p className="text-[12px] text-[#94a3b8]">Loading courses...</p> : null}
          {error ? <p className="text-[12px] text-red-600">{error}</p> : null}

          <div className="space-y-2">
            {courses.map((course) => {
              const isActive = selectedCourse?._id === course._id
              return (
                <button
                  key={course._id}
                  type="button"
                  onClick={() => setSelectedCourseId(course._id)}
                  className={`w-full rounded-[8px] border px-3 py-3 text-left transition-colors ${
                    isActive ? 'border-[#5b3df6] bg-[#faf9ff]' : 'border-black/[0.08] bg-white hover:bg-[#f8fafc]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <BookOpen className={`mt-0.5 h-4 w-4 shrink-0 ${isActive ? 'text-[#5b3df6]' : 'text-[#94a3b8]'}`} />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-[#0f172a]">{course.title}</p>
                      <p className="mt-0.5 text-[11px] text-[#94a3b8]">Enrolled: {formatDate(course.enrolledAt)}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {!loading && courses.length === 0 ? <p className="mt-2 text-[12px] text-[#94a3b8]">No enrolled courses yet.</p> : null}
        </div>

        <div className="rounded-[8px] border border-black/[0.08] bg-white p-5 sm:p-6">
          {selectedCourse ? (
            <>
              <img src={selectedCourse.image} alt={selectedCourse.title} className="h-[220px] w-full rounded-[10px] object-cover sm:h-[300px]" />

              <div className="mt-5">
                <h3 className="text-[24px] font-bold leading-tight text-[#0f172a]">{selectedCourse.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#64748b]">{selectedCourse.description}</p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[10px] bg-[#f8fafc] p-3">
                  <p className="text-[11px] text-[#94a3b8]">Course type</p>
                  <p className="mt-1 text-[13px] font-semibold text-[#0f172a] capitalize">{selectedCourse.course_type}</p>
                </div>
                <div className="rounded-[10px] bg-[#f8fafc] p-3">
                  <p className="text-[11px] text-[#94a3b8]">Price</p>
                  <p className="mt-1 text-[13px] font-semibold text-[#0f172a]">{formatPrice(selectedCourse.price)}</p>
                </div>
                <div className="rounded-[10px] bg-[#f8fafc] p-3">
                  <p className="text-[11px] text-[#94a3b8]">Enrolled on</p>
                  <p className="mt-1 text-[13px] font-semibold text-[#0f172a]">{formatDate(selectedCourse.enrolledAt)}</p>
                </div>
                <div className="rounded-[10px] bg-[#f8fafc] p-3">
                  <p className="text-[11px] text-[#94a3b8]">Last update</p>
                  <p className="mt-1 text-[13px] font-semibold text-[#0f172a]">{formatDate(selectedCourse.updatedAt)}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedCourse.youtube_url) window.open(selectedCourse.youtube_url, '_blank', 'noopener,noreferrer')
                  }}
                  disabled={!selectedCourse.youtube_url}
                  className="inline-flex h-10 items-center gap-2 rounded-[8px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4a2ed8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <PlayCircle className="h-4 w-4" />
                  {selectedCourse.youtube_url ? 'Continue Learning' : 'Content Not Available'}
                </button>

                {selectedCourse.youtube_url ? (
                  <a
                    href={selectedCourse.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-black/[0.08] bg-white px-4 text-[13px] font-medium text-[#0f172a] hover:bg-gray-50"
                  >
                    Open Link
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </>
          ) : (
            <div className="rounded-[10px] border border-dashed border-black/[0.12] bg-[#fafcff] p-8 text-center text-[13px] text-[#64748b]">
              No course selected.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
