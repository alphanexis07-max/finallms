import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  Plus,
  Star,
  Wallet,
  X,
  Check,
  BookOpen,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { api, getToken, loadRazorpayScript } from '../../lib/api'

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

function formatCurrency(value) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return 'Rs. 0'
  return `Rs. ${numeric.toLocaleString()}`
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

function parseUserIdFromToken() {
  const token = getToken()
  if (!token) return ''

  try {
    const payload = token.split('.')[1]
    if (!payload) return ''
    const decoded = JSON.parse(window.atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded?.sub || ''
  } catch {
    return ''
  }
}

function parseUserMetaFromToken() {
  const token = getToken()
  if (!token) return { email: '', name: '' }

  try {
    const payload = token.split('.')[1]
    if (!payload) return { email: '', name: '' }
    const decoded = JSON.parse(window.atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return {
      email: decoded?.email || '',
      name: decoded?.full_name || decoded?.name || '',
    }
  } catch {
    return { email: '', name: '' }
  }
}

function toDisplayCourse(course) {
  const isPaid = course?.course_type === 'paid' && Number(course?.price || 0) > 0
  return {
    ...course,
    image: getCourseImage(course),
    tags: [course?.course_type || 'course', isPaid ? 'Paid' : 'Free'].filter(Boolean),
    mentor: course?.instructor_name || 'Instructor',
    role: course?.created_by ? `ID: ${course.created_by}` : 'Course owner',
    rating: Number(course?.rating || 0) > 0 ? Number(course.rating).toFixed(1) : null,
    priceLabel: formatCurrency(course?.price || 0),
    note: course?.youtube_url ? 'Video content available' : 'No video preview',
    createdAtLabel: formatDate(course?.created_at),
  }
}

function CourseDetailModal({ course, onClose, onEnroll, enrolled }) {
  if (!course) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-3 sm:p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="relative flex w-full max-w-[1100px] max-h-[calc(100vh-32px)] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/[0.08] bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-[10px] bg-[#f0f4f8] px-3 py-1 text-[11px] font-medium text-[#64748b]">
              Course details
            </span>
            <h2 className="mt-2 text-[22px] font-bold text-[#0f172a] sm:text-[26px]">{course.title}</h2>
            <p className="mt-1 text-[13px] text-[#94a3b8]">Published: {course.createdAtLabel}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5 text-[#94a3b8]" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[1.2fr_0.8fr]">
          <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
            <section className="overflow-hidden rounded-[18px] border border-black/[0.08] bg-white">
              <img src={course.image} alt={course.title} className="h-[280px] w-full object-cover sm:h-[320px]" />
              <div className="space-y-4 p-5">
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <span key={tag} className="inline-flex h-[26px] items-center rounded-[10px] bg-[#f1f5f9] px-[10px] text-[11px] font-medium text-[#0f172a]">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[14px] leading-relaxed text-[#64748b]">{course.description || 'No description provided by the instructor.'}</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-[12px] bg-[#f8fafc] px-3 py-3 text-center">
                    <p className="text-[11px] text-[#94a3b8]">Type</p>
                    <p className="mt-1 text-[12px] font-semibold text-[#0f172a]">{course.course_type || 'course'}</p>
                  </div>
                  <div className="rounded-[12px] bg-[#f8fafc] px-3 py-3 text-center">
                    <p className="text-[11px] text-[#94a3b8]">Price</p>
                    <p className="mt-1 text-[12px] font-semibold text-[#0f172a]">{course.priceLabel}</p>
                  </div>
                  <div className="rounded-[12px] bg-[#f8fafc] px-3 py-3 text-center">
                    <p className="text-[11px] text-[#94a3b8]">Video</p>
                    <p className="mt-1 text-[12px] font-semibold text-[#0f172a]">{course.youtube_url ? 'Available' : 'Not added'}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-5 rounded-[18px] border border-black/[0.08] bg-white p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-[16px] font-bold text-[#0f172a]">What you get</h3>
                  <p className="mt-1 text-[12px] text-[#94a3b8]">Based on course settings available in LMS.</p>
                </div>
                <BookOpen className="h-5 w-5 text-[#5b3df6]" />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  'Access to uploaded lessons',
                  'Progress tracking in dashboard',
                  course.youtube_url ? 'Direct video learning link' : 'Instructor has not added video link yet',
                  'Course appears in My Courses after enrollment',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-[12px] border border-black/[0.08] px-3 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ede7ff] text-[#5b3df6]">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="text-[13px] font-medium text-[#0f172a]">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="min-h-0 overflow-y-auto border-t border-black/[0.08] bg-[#fafcff] p-4 sm:p-6 lg:border-l lg:border-t-0">
            <div className="space-y-4">
              <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] text-[#94a3b8]">Instructor</p>
                    <p className="text-[16px] font-semibold text-[#0f172a]">{course.mentor}</p>
                    <p className="mt-1 text-[12px] text-[#94a3b8]">{course.role}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0f172a]">
                    <Star className="h-4 w-4 fill-[#ffd966] text-[#ffd966]" />
                    {course.rating || 'N/A'}
                  </div>
                </div>
                <div className="mt-4 rounded-[12px] bg-[#f8fafc] p-3">
                  <p className="text-[11px] text-[#94a3b8]">Price</p>
                  <p className="mt-1 text-[18px] font-bold text-[#0f172a]">{course.priceLabel}</p>
                </div>
              </section>

              <section className="rounded-[18px] border border-[#ffd966] bg-[#fff8e7] p-5">
                <p className="text-[13px] font-semibold text-[#4b2e00]">Ready to enroll?</p>
                <p className="mt-1 text-[12px] leading-5 text-[#6b4b00]">
                  This action creates an enrollment linked to your account and tenant.
                </p>
                <button
                  type="button"
                  disabled={enrolled}
                  onClick={() => onEnroll?.(course)}
                  className="mt-4 inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4a2ed8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  {enrolled ? 'Already enrolled' : 'Enroll now'}
                </button>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function CheckoutModal({ course, onClose, onPay, submitting }) {
  if (!course) return null

  const payableAmount = course.priceLabel

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="relative flex w-full max-w-[760px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.32)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/[0.08] bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-[10px] bg-[#f0f4f8] px-3 py-1 text-[11px] font-medium text-[#64748b]">
              Checkout
            </span>
            <h2 className="mt-2 text-[22px] font-bold text-[#0f172a] sm:text-[26px]">Complete your enrollment</h2>
            <p className="mt-1 text-[13px] text-[#94a3b8]">Enrollment will be saved to backend database.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5 text-[#94a3b8]" />
          </button>
        </div>

        <div className="space-y-4 bg-[#fafcff] p-5 sm:p-6">
          <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
            <h3 className="text-[16px] font-bold text-[#0f172a]">Order summary</h3>
            <div className="mt-4 space-y-3 text-[12px] text-[#64748b]">
              <div className="flex items-center justify-between gap-4">
                <span>{course.title}</span>
                <span className="font-semibold text-[#0f172a]">{payableAmount}</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-black/[0.08] pt-3">
                <span className="text-[13px] font-semibold text-[#0f172a]">Total due</span>
                <span className="text-[20px] font-bold text-[#0f172a]">{payableAmount}</span>
              </div>
            </div>
          </section>

          <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
            <h3 className="text-[16px] font-bold text-[#0f172a]">Payment method</h3>
            <div className="mt-3 inline-flex items-center gap-2 rounded-[10px] bg-[#f8fafc] px-3 py-2 text-[12px] text-[#0f172a]">
              <Wallet className="h-4 w-4" />
              LMS checkout flow
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-[10px] border border-black/[0.08] bg-white px-4 text-[13px] font-medium text-[#64748b] hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => onPay?.(course)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4a2ed8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Processing...' : `Pay ${payableAmount}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutSuccessModal({ course, onGoToCourse, onClose }) {
  if (!course) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="relative flex w-full max-w-[760px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.32)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/[0.08] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-[10px] bg-[#e8f5ff] px-3 py-1 text-[11px] font-medium text-[#2563eb]">
              Enrollment successful
            </span>
            <h2 className="mt-2 text-[22px] font-bold text-[#0f172a] sm:text-[26px]">You are enrolled</h2>
            <p className="mt-1 text-[13px] text-[#94a3b8]">Course access is now available in your My Courses section.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5 text-[#94a3b8]" />
          </button>
        </div>

        <div className="space-y-4 bg-[#fafcff] p-5 sm:p-6">
          <section className="rounded-[18px] border border-[#d8cffc] bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ede7ff] text-[#5b3df6]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <p className="text-[12px] text-[#94a3b8]">Course</p>
                <h3 className="text-[18px] font-bold text-[#0f172a]">{course.title}</h3>
                <p className="mt-1 text-[13px] text-[#64748b]">Amount: {course.priceLabel}</p>
              </div>
            </div>
          </section>

          <button
            type="button"
            onClick={onGoToCourse}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4a2ed8]"
          >
            Go to course
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StudentBrowseCourse() {
  const navigate = useNavigate()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [checkoutCourse, setCheckoutCourse] = useState(null)
  const [successCourse, setSuccessCourse] = useState(null)
  const [courses, setCourses] = useState([])
  const [enrolledIds, setEnrolledIds] = useState(new Set())
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')

    Promise.all([
      api('/lms/courses?limit=500'),
      api('/lms/enrollments?limit=500').catch(() => ({ items: [] })),
    ])
      .then(([courseData, enrollmentData]) => {
        const fetchedCourses = (courseData?.items || []).map(toDisplayCourse)
        const enrolledSet = new Set((enrollmentData?.items || []).map((item) => item.course_id))
        setCourses(fetchedCourses)
        setEnrolledIds(enrolledSet)
      })
      .catch((err) => {
        setCourses([])
        setError(err?.message || 'Unable to load courses right now.')
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const byType = typeFilter === 'all' || (course.course_type || '').toLowerCase() === typeFilter
      const text = `${course.title || ''} ${course.description || ''} ${course.mentor || ''}`.toLowerCase()
      const bySearch = !query || text.includes(query.toLowerCase())
      return byType && bySearch
    })
  }, [courses, query, typeFilter])

  const thisMonthCount = useMemo(() => {
    const now = new Date()
    return courses.filter((course) => {
      const created = new Date(course.created_at)
      return !Number.isNaN(created.getTime()) && created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length
  }, [courses])

  const openEnrollFlow = (course) => {
    if (!course || enrolledIds.has(course._id)) return

    setCheckoutCourse(course)
    setSelectedCourse(null)
  }

  const createEnrollment = async (course) => {
    if (!course || enrolledIds.has(course._id)) return

    const studentId = parseUserIdFromToken()
    if (!studentId) {
      setError('Unable to identify logged-in student. Please login again.')
      return
    }

    const isPaidCourse = course.course_type === 'paid' && Number(course.price || 0) > 0

    try {
      setSubmitting(true)
      setError('')

      if (isPaidCourse) {
        const chargeAmount = Number(course.price || 0)
        const order = await api('/lms/payments/order', {
          method: 'POST',
          body: JSON.stringify({
            amount: Number(chargeAmount || 0),
            enrollment_type: 'course',
            target_id: course._id,
          }),
        })

        const loaded = await loadRazorpayScript()
        if (!loaded) {
          throw new Error('Unable to load Razorpay checkout script.')
        }

        const razorpayKeyId = order?.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || ''

        if (!razorpayKeyId || !order?.order_id) {
          throw new Error('Payment gateway is not configured correctly.')
        }

        if (typeof window.Razorpay !== 'function') {
          throw new Error('Razorpay checkout is not available in this browser.')
        }

        const prefill = parseUserMetaFromToken()

        await new Promise((resolve, reject) => {
          const razorpay = new window.Razorpay({
            key: razorpayKeyId,
            amount: order.amount,
            currency: order.currency || 'INR',
            name: 'LMS',
            description: course.title,
            order_id: order.order_id,
            prefill,
            theme: { color: '#5b3df6' },
            modal: {
              ondismiss: () => reject(new Error('Payment cancelled by user.')),
            },
            handler: async (response) => {
              try {
                await api('/lms/payments/verify', {
                  method: 'POST',
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                })
                resolve(response)
              } catch (verifyError) {
                reject(verifyError)
              }
            },
          })

          try {
            razorpay.open()
          } catch (openError) {
            reject(openError)
          }
        })
      }

      await api('/lms/enrollments', {
        method: 'POST',
        body: JSON.stringify({
          course_id: course._id,
          student_id: studentId,
        }),
      })

      setEnrolledIds((prev) => new Set([...prev, course._id]))
      setSuccessCourse(course)
      setCheckoutCourse(null)
      setSelectedCourse(null)
    } catch (err) {
      setError(err?.message || 'Unable to complete enrollment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="bg-gradient-to-b flex h-full flex-col gap-[24px] from-[#f6f8fa] p-4 to-[#f7fcff] sm:p-6 lg:p-7">
        <section className="w-full shrink-0 rounded-[8px] border border-black/[0.08] border-solid bg-gradient-to-br from-white to-[#e8f5ff] px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <div className="flex flex-col gap-[11px] items-start">
            <div className="bg-[#ffd966] flex items-center px-[10px] py-[6.5px] rounded-[12px] shrink-0">
              <div className="text-[12px] font-medium text-[#4b2e00]">Live catalog from LMS</div>
            </div>
            <div className="text-[22px] font-bold leading-tight text-[#0f172a] sm:text-[26px] lg:text-[28px]">
              Browse courses from your tenant data.
            </div>
            <div className="text-[14px] text-[#94a3b8] leading-relaxed">
              Course cards, price, type, and enrollment state are loaded from backend APIs.
            </div>
          </div>
          <div className="mt-4 flex items-center gap-[12px] flex-wrap">
            <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                {courses.length} courses available
              </div>
            </div>
            <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                {thisMonthCount} new this month
              </div>
            </div>
            <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                {enrolledIds.size} enrolled by you
              </div>
            </div>
          </div>
        </section>

        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
          <div>
            <h2 className="font-bold text-[18px] text-[#0f172a]">Explore the catalog</h2>
            <p className="text-[13px] text-[#94a3b8] mt-[4px]">Search and filter only through backend course records.</p>
          </div>
          <div className="flex flex-wrap items-center gap-[12px] w-full">
            <div className="flex-1 min-w-0 sm:min-w-[280px] bg-white border border-black/[0.08] flex items-center gap-[10px] h-[40px] px-[15px] py-[0.25px] relative rounded-[6px]">
              <Search className="h-[18px] w-[18px] text-[#94a3b8]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none"
                placeholder="Search by course name, instructor, or description"
              />
            </div>
            <button className="border border-black/[0.08] flex items-center gap-[8px] h-[40px] justify-center px-[17px] py-[0.25px] rounded-[6px] shrink-0 bg-white">
              <SlidersHorizontal className="h-[18px] w-[18px] text-[#0f172a]" />
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[14px]">Filters</div>
            </button>
            {[
              { label: 'All courses', value: 'all' },
              { label: 'Free', value: 'free' },
              { label: 'Paid', value: 'paid' },
              { label: 'Demo', value: 'demo' },
            ].map((chip) => (
              <button
                key={chip.value}
                type="button"
                onClick={() => setTypeFilter(chip.value)}
                className={`inline-flex h-[36px] items-center px-[16px] rounded-[12px] text-[12px] font-medium transition-colors ${
                  typeFilter === chip.value ? 'bg-[#5b3df6] text-white' : 'bg-[#f1f5f9] text-[#0f172a] hover:bg-[#e8f5ff]'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h3 className="font-bold text-[24px] text-[#0f172a]">Available courses</h3>
              <p className="text-[13px] text-[#94a3b8] mt-[4px]">Showing live results from your LMS course table.</p>
            </div>
            <p className="text-[13px] font-medium text-[#94a3b8]">Showing {filteredCourses.length} matches</p>
          </div>

          {error ? <p className="text-[13px] text-red-600">{error}</p> : null}

          {loading ? (
            <div className="rounded-[16px] border border-black/[0.08] bg-white p-8 text-center text-[13px] text-[#64748b]">
              Loading courses...
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="rounded-[16px] border border-dashed border-black/[0.12] bg-white p-8 text-center text-[13px] text-[#64748b]">
              No courses found for current filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => {
                const enrolled = enrolledIds.has(course._id)

                return (
                  <article
                    key={course._id || course.title}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedCourse(course)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelectedCourse(course)
                      }
                    }}
                    className="bg-white border border-black/[0.08] border-solid rounded-[8px] overflow-hidden flex flex-col cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
                  >
                    <img src={course.image} alt={course.title} className="h-[200px] w-full object-cover" />
                    <div className="flex flex-col gap-[16px] p-[20px]">
                      <div className="flex gap-[8px] flex-wrap">
                        {course.tags.map((tag) => (
                          <span key={tag} className="inline-flex h-[26px] items-center px-[10px] rounded-[10px] text-[11px] font-medium bg-[#f1f5f9] text-[#0f172a]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h4 className="font-bold text-[18px] text-[#0f172a] leading-tight">{course.title}</h4>
                      <p className="text-[13px] text-[#94a3b8] line-clamp-2">{course.description || 'No description provided.'}</p>
                      <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-3">
                        <div className="bg-[#f8fafc] rounded-[6px] p-[8px] text-[11px] font-medium text-[#475569] text-center">
                          {course.course_type || 'course'}
                        </div>
                        <div className="bg-[#f8fafc] rounded-[6px] p-[8px] text-[11px] font-medium text-[#475569] text-center">
                          {course.youtube_url ? 'Video available' : 'No video'}
                        </div>
                        <div className="bg-[#f8fafc] rounded-[6px] p-[8px] text-[11px] font-medium text-[#475569] text-center">
                          {course.createdAtLabel}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-[13px] text-[#0f172a]">{course.mentor}</p>
                          <p className="text-[11px] text-[#94a3b8]">{course.role}</p>
                        </div>
                        <div className="inline-flex items-center gap-[4px] text-[13px] font-semibold text-[#0f172a]">
                          <Star className="h-[14px] w-[14px] text-[#ffd966] fill-[#ffd966]" />
                          {course.rating || 'N/A'}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 border-t border-black/[0.08] pt-2 sm:flex-row sm:items-center sm:justify-between sm:pt-0">
                        <div>
                          <p className="text-[28px] pt-2 font-bold text-[#0f172a] leading-none">{course.priceLabel}</p>
                          <p className="text-[11px] text-[#94a3b8] mt-[4px]">{course.note}</p>
                        </div>
                        <button
                          type="button"
                          disabled={enrolled}
                          onClick={(e) => {
                            e.stopPropagation()
                            openEnrollFlow(course)
                          }}
                          className="bg-[#5b3df6] flex items-center gap-[8px] h-[40px] justify-center px-[16px] rounded-[6px] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Plus className="h-[16px] w-[16px] text-white" />
                          <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-white text-[14px]">
                            {enrolled ? 'Enrolled' : 'Enroll now'}
                          </div>
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {selectedCourse && (
        <CourseDetailModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEnroll={openEnrollFlow}
          enrolled={enrolledIds.has(selectedCourse._id)}
        />
      )}
      {checkoutCourse && (
        <CheckoutModal
          course={checkoutCourse}
          onClose={() => setCheckoutCourse(null)}
          onPay={createEnrollment}
          submitting={submitting}
        />
      )}
      {successCourse && (
        <CheckoutSuccessModal
          course={successCourse}
          onClose={() => setSuccessCourse(null)}
          onGoToCourse={() => {
            setSuccessCourse(null)
            setCheckoutCourse(null)
            setSelectedCourse(null)
            navigate('/student-panel/my-courses')
          }}
        />
      )}
    </div>
  )
}
