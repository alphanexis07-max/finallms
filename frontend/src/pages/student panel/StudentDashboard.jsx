import React, { useEffect, useMemo, useState } from 'react'
import { PlayCircle, Video, Trophy, BookOpen as BookIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import useRealtime from '../../hooks/useRealtime'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const tenantId = localStorage.getItem('lms_tenant_id')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statsData, setStatsData] = useState({
    courses_in_progress: 0,
    live_classes_week: 0,
    quiz_attempts: 0,
    certificates_earned: 0,
    unread_notifications: 0,
  })
  const [enrollments, setEnrollments] = useState([])
  const [courses, setCourses] = useState([])
  const [liveClasses, setLiveClasses] = useState([])
  const [libraryResources, setLibraryResources] = useState([])
  const [notifications, setNotifications] = useState([])
  const [secondaryLoading, setSecondaryLoading] = useState(false)

  const loadPrimaryData = async () => {
    try {
      setLoading(true)
      setError('')

      const [dashboardRes, enrollmentsRes, coursesRes] = await Promise.all([
        api('/lms/dashboard/student').catch(() => ({
          courses_in_progress: 0,
          live_classes_week: 0,
          quiz_attempts: 0,
          certificates_earned: 0,
          unread_notifications: 0,
        })),
        api('/lms/enrollments?limit=100').catch(() => ({ items: [] })),
        api('/lms/courses?limit=200').catch(() => ({ items: [] })),
      ])

      setStatsData(dashboardRes || {})
      setEnrollments(enrollmentsRes?.items || [])
      setCourses(coursesRes?.items || [])
    } catch (err) {
      setError(err?.message || 'Unable to load student dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  const loadSecondaryData = async () => {
    try {
      setSecondaryLoading(true)
      const [liveClassesRes, resourcesRes, notificationsRes] = await Promise.all([
        api('/lms/live-classes?status=upcoming&limit=100').catch(() => ({ items: [] })),
        api('/lms/library-resources?limit=100').catch(() => ({ items: [] })),
        api('/lms/notifications?limit=100').catch(() => ({ items: [] })),
      ])
      setLiveClasses(liveClassesRes?.items || [])
      setLibraryResources(resourcesRes?.items || [])
      setNotifications(notificationsRes?.items || [])
    } finally {
      setSecondaryLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    loadPrimaryData().then(() => {
      if (!cancelled) {
        loadSecondaryData()
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  useRealtime(tenantId ? `tenant:${tenantId}` : '', () => {
    loadPrimaryData()
    loadSecondaryData()
  })

  const stats = useMemo(
    () => [
      ['Courses in progress', String(statsData.courses_in_progress ?? 0), 'From enrollments'],
      ['Live classes this week', String(statsData.live_classes_week ?? 0), 'Upcoming'],
      ['Quiz attempts', String(statsData.quiz_attempts ?? 0), 'Synced'],
      ['Certificates earned', String(statsData.certificates_earned ?? 0), 'Achievements'],
      ['Unread alerts', String(statsData.unread_notifications ?? 0), 'Notifications'],
    ],
    [statsData],
  )

  const coursesById = useMemo(() => {
    const map = {}
    courses.forEach((course) => {
      map[String(course?._id)] = course
    })
    return map
  }, [courses])

  const enrolledCourseRows = useMemo(
    () =>
      enrollments.slice(0, 4).map((enrollment) => {
        const course = coursesById[String(enrollment.course_id)]
        return {
          id: enrollment._id,
          title: course?.title || `Course ${String(enrollment.course_id || '').slice(-6)}`,
          meta: course?.description || 'Enrolled course',
        }
      }),
    [enrollments, coursesById],
  )

  const resourceRows = useMemo(
    () =>
      libraryResources.slice(0, 4).map((resource) => ({
        id: resource._id,
        title: resource.title || 'Untitled resource',
        meta: [resource.format, resource.grade].filter(Boolean).join(' - ') || 'Library resource',
      })),
    [libraryResources],
  )

  const liveClassRows = useMemo(
    () =>
      liveClasses.slice(0, 4).map((liveClass) => {
        const startsAt = liveClass.start_at ? new Date(liveClass.start_at) : null
        const schedule = startsAt && !Number.isNaN(startsAt.getTime()) ? startsAt.toLocaleString() : 'Schedule pending'
        return {
          id: liveClass._id,
          title: liveClass.title || 'Live class',
          meta: schedule,
        }
      }),
    [liveClasses],
  )

  const enrollmentRows = useMemo(
    () =>
      enrollments.slice(0, 3).map((enrollment) => {
        const createdAt = enrollment.created_at ? new Date(enrollment.created_at) : null
        return {
          id: enrollment._id,
          title: coursesById[String(enrollment.course_id)]?.title || 'Enrollment record',
          meta:
            createdAt && !Number.isNaN(createdAt.getTime())
              ? `Enrolled on ${createdAt.toLocaleDateString()}`
              : 'Enrollment completed',
        }
      }),
    [enrollments, coursesById],
  )

  const quizNoticeRows = useMemo(() => {
    const filtered = notifications.filter((item) => {
      const text = `${item?.title || ''} ${item?.message || ''}`.toLowerCase()
      return text.includes('quiz') || text.includes('test') || text.includes('certificate')
    })
    return filtered.slice(0, 3)
  }, [notifications])

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="bg-gradient-to-b flex h-full flex-col gap-[24px] from-[#f6f8fa] p-4 to-[#f7fcff] sm:p-6 lg:p-7">
        <section className="w-full shrink-0 rounded-[8px] border border-black/[0.08] border-solid bg-gradient-to-br from-white to-[#e8f5ff] px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <div className="flex flex-col gap-[11px] items-start">
            <div className="bg-[#ffd966] flex items-center px-[10px] py-[6.5px] rounded-[12px] shrink-0">
              <div className="text-[12px] font-medium text-[#4b2e00]">Student journey - Updated</div>
            </div>
            <div className="max-w-[850px] text-[24px] font-bold leading-[1.2] text-[#0f172a] sm:text-[30px] lg:text-[35px]">
              Continue courses, access the new e-library, join live classes, and complete quizzes from one place.
            </div>
            <div className="max-w-[750px] text-[13.9px] text-[#94a3b8]">
              A learner dashboard for course discovery, class schedule, progress tracking, saved courses, e-library resources, live class reminders, and next-step digital study pathways with time-based goals.
            </div>
          </div>
          <div className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button
              onClick={() => navigate('/student-panel/continue-learning')}
              className="flex h-[40px] w-full items-center justify-center gap-[8px] rounded-[6px] bg-[#5b3df6] px-[16px] sm:w-auto"
            >
              <div className="text-[14px] font-medium text-white">Continue Learning</div>
            </button>
            <button
              onClick={() => navigate('/student-panel/e-library')}
              className="flex h-[40px] w-full items-center justify-center gap-[8px] rounded-[6px] border border-black/[0.08] bg-white px-[17px] py-[0.25px] sm:w-auto"
            >
              <div className="text-[14px] font-medium text-[#0f172a]">Open E-Library</div>
            </button>
          </div>
        </section>

        {error ? (
          <div className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">{error}</div>
        ) : null}

        <div className="grid grid-cols-1 gap-x-[16px] gap-y-[16px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map(([title, value, meta]) => (
            <div key={title} className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[12px] items-start p-[16px] rounded-[8px]">
              <div className="text-[13px] font-medium text-[#94a3b8]">{title}</div>
              <div className="text-[32px] font-bold tracking-[-0.6px] text-[#0f172a] leading-none">{value}</div>
              <div className="bg-[#2dd4bf] h-[28px] rounded-[12px] relative flex items-center px-[10px]">
                <div className="text-[11px] font-medium text-[#023b33]">{meta}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-x-[24px] gap-y-[24px] xl:grid-cols-[1.45fr_1fr]">
          <div className="flex flex-col gap-[24px]">
            <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px]">
              <div className="flex flex-col items-start justify-between gap-3 w-full sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-bold text-[18px] text-[#0f172a]">Course browsing</h3>
                  <p className="text-[13px] text-[#94a3b8] mt-[4px]">Real courses from your enrollments.</p>
                </div>
              </div>
              <div className="flex flex-col w-full gap-[12px]">
                {loading ? (
                  <div className="p-[14px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">Loading enrolled courses...</div>
                ) : enrolledCourseRows.length === 0 ? (
                  <div className="p-[14px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">No enrollments found yet.</div>
                ) : (
                  enrolledCourseRows.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-[14px] border border-black/[0.08] rounded-[6px]">
                      <div>
                        <p className="font-semibold text-[14px] text-[#0f172a]">{item.title}</p>
                        <p className="text-[11px] text-[#94a3b8] mt-[3px] line-clamp-2">{item.meta}</p>
                      </div>
                      <PlayCircle className="h-[18px] w-[18px] text-[#5b3df6]" />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[18px] items-start p-[21px] rounded-[8px]">
              <div className="flex flex-col items-start justify-between gap-3 w-full sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-bold text-[18px] text-[#0f172a]">E-Library</h3>
                  <p className="text-[13px] text-[#94a3b8] mt-[4px]">Latest uploaded resources from backend.</p>
                </div>
              </div>
              <div className="flex flex-col w-full gap-[12px]">
                {loading ? (
                  <div className="p-[14px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">Loading library resources...</div>
                ) : secondaryLoading && resourceRows.length === 0 ? (
                  <div className="p-[14px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">Loading library resources...</div>
                ) : resourceRows.length === 0 ? (
                  <div className="p-[14px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">No library resources available.</div>
                ) : (
                  resourceRows.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-[14px] border border-black/[0.08] rounded-[6px]">
                      <div>
                        <p className="font-semibold text-[14px] text-[#0f172a]">{item.title}</p>
                        <p className="text-[11px] text-[#94a3b8] mt-[3px]">{item.meta}</p>
                      </div>
                      <BookIcon className="h-[18px] w-[18px] text-[#5b3df6]" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[24px]">
            <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
              <div>
                <h3 className="font-bold text-[18px] text-[#0f172a]">Enrollment timeline</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Recent enrollment records.</p>
              </div>
              <div className="flex flex-col w-full gap-[12px]">
                {loading ? (
                  <div className="p-[14px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">Loading enrollment timeline...</div>
                ) : enrollmentRows.length === 0 ? (
                  <div className="p-[14px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">No enrollment records yet.</div>
                ) : (
                  enrollmentRows.map((item) => (
                    <div key={item.id} className="p-[14px] border border-black/[0.08] rounded-[6px]">
                      <p className="font-semibold text-[14px] text-[#0f172a] mb-[4px]">{item.title}</p>
                      <p className="text-[11px] text-[#94a3b8]">{item.meta}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
              <div>
                <h3 className="font-bold text-[18px] text-[#0f172a]">Live classes</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Upcoming classes from live class records.</p>
              </div>
              <div className="flex flex-col w-full gap-[12px]">
                {loading ? (
                  <div className="p-[14px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">Loading live classes...</div>
                ) : secondaryLoading && liveClassRows.length === 0 ? (
                  <div className="p-[14px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">Loading live classes...</div>
                ) : liveClassRows.length === 0 ? (
                  <div className="p-[14px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">No upcoming live classes.</div>
                ) : (
                  liveClassRows.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-[14px] border border-black/[0.08] rounded-[6px]">
                      <div>
                        <p className="font-semibold text-[14px] text-[#0f172a]">{item.title}</p>
                        <p className="text-[11px] text-[#94a3b8] mt-[3px]">{item.meta}</p>
                      </div>
                      <Video className="h-[18px] w-[18px] text-[#5b3df6]" />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
              <div>
                <h3 className="font-bold text-[18px] text-[#0f172a]">Quiz section</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Scores and quiz-related alerts from live records.</p>
              </div>
              <div className="flex flex-col w-full gap-[12px]">
                <div className="flex items-center justify-between p-[14px] border border-black/[0.08] rounded-[6px]">
                  <p className="font-semibold text-[14px] text-[#0f172a]">Quiz attempts recorded: {statsData.quiz_attempts ?? 0}</p>
                  <Trophy className="h-[18px] w-[18px] text-[#5b3df6]" />
                </div>
                <div className="flex items-center justify-between p-[14px] border border-black/[0.08] rounded-[6px]">
                  <p className="font-semibold text-[14px] text-[#0f172a]">Certificates earned: {statsData.certificates_earned ?? 0}</p>
                  <Trophy className="h-[18px] w-[18px] text-[#5b3df6]" />
                </div>
                {quizNoticeRows.length === 0 ? (
                  <div className="p-[14px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">No quiz or certificate alerts yet.</div>
                ) : (
                  quizNoticeRows.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-[14px] border border-black/[0.08] rounded-[6px]">
                      <div>
                        <p className="font-semibold text-[14px] text-[#0f172a]">{item.title || 'Quiz update'}</p>
                        <p className="text-[11px] text-[#94a3b8] mt-[3px]">{item.message || 'Latest notification'}</p>
                      </div>
                      <Trophy className="h-[18px] w-[18px] text-[#5b3df6]" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
