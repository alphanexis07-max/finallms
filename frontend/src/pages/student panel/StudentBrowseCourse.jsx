import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, SlidersHorizontal, Plus, Star, Users, GraduationCap, Wallet, BarChart3, Upload, Clock, X, Check, BookOpen, CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react'

const AVATAR = 'https://www.figma.com/api/mcp/asset/5b24609b-97ad-4bea-af20-b4f4df404b75'
const HERO = 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=80'
const HERO_SIDE = 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?auto=format&fit=crop&w=900&q=80'
const ENROLLED_COURSES_KEY = 'student-enrolled-courses'

const CARDS = [
  {
    image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=1200&q=80',
    tags: ['Accessibility', 'Intermediate'],
    title: 'Advanced Accessibility for Designers',
    desc: 'Learn audit workflows, inclusive interaction patterns, and accessible design systems for modern product teams.',
    meta: ['Lessons 28', 'Duration 6h 40m', 'Level Intermediate'],
    mentor: 'Marcus Chen',
    role: 'Design Mentor',
    rating: '4.9',
    price: '$39',
    note: 'Certificate included',
  },
  {
    image: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?auto=format&fit=crop&w=1200&q=80',
    tags: ['Design Systems', 'Popular'],
    title: 'Design Systems from Scratch',
    desc: 'Build scalable foundations, token libraries, component standards, and documentation workflows your team can ship with.',
    meta: ['Lessons 34', 'Duration 8h 10m', 'Level All levels'],
    mentor: 'Elena Brooks',
    role: 'Product Designer',
    rating: '4.8',
    price: '$49',
    note: 'Best seller',
  },
  {
    image: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Frontend', 'Hands-on'],
    title: 'Frontend for Product Designers',
    desc: 'Translate layouts into production-ready HTML and CSS, collaborate better with engineers, and prototype with confidence.',
    meta: ['Lessons 22', 'Duration 5h 20m', 'Level Beginner'],
    mentor: 'Noah Bennett',
    role: 'Frontend Lead',
    rating: '4.7',
    price: '$29',
    note: 'Project-based',
  },
  {
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Career', 'Cohort'],
    title: 'Portfolio Review Bootcamp',
    desc: 'Refine case studies, storytelling, and hiring presentation skills with structured mentor feedback over four weeks.',
    meta: ['Lessons 16', 'Duration 4 weeks', 'Level Advanced'],
    mentor: 'Rina Kapoor',
    role: 'Career Coach',
    rating: '4.9',
    price: '$79',
    note: 'Mentor reviews',
  },
  {
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Product', 'Data'],
    title: 'Product Metrics for Designers',
    desc: 'Understand funnels, activation metrics, and experimentation basics so your design decisions map to measurable outcomes.',
    meta: ['Lessons 19', 'Duration 4h 55m', 'Level Intermediate'],
    mentor: 'Mateo Ruiz',
    role: 'Growth PM',
    rating: '4.6',
    price: '$35',
    note: 'Includes workbook',
  },
  {
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Prototype', 'Workshop'],
    title: 'Mobile App Prototyping Lab',
    desc: 'Create polished app flows, structure rapid usability tests, and present interactive prototypes clearly to teams and clients.',
    meta: ['Lessons 24', 'Duration 5h 45m', 'Level Beginner'],
    mentor: 'Yuna Park',
    role: 'Interaction Designer',
    rating: '4.8',
    price: '$32',
    note: 'Updated this week',
  },
]

function Pill({ children, variant }) {
  const style =
    variant === 'success'
      ? 'bg-[#2dd4bf] text-[#023b33]'
      : variant === 'warning'
        ? 'bg-[#ffd966] text-[#4b2e00]'
        : variant === 'primary'
          ? 'bg-[#5b3df6] text-white'
          : 'bg-[#e8f5ff] text-[#0f172a]'

  return <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${style}`}>{children}</span>
}

function readEnrolledCourses() {
  if (typeof window === 'undefined') return []

  try {
    const storedCourses = window.localStorage.getItem(ENROLLED_COURSES_KEY)
    const parsedCourses = storedCourses ? JSON.parse(storedCourses) : []
    return Array.isArray(parsedCourses) ? parsedCourses : []
  } catch {
    return []
  }
}

function saveEnrolledCourse(course) {
  if (typeof window === 'undefined' || !course) return

  const existingCourses = readEnrolledCourses()
  const courseKey = `${course.title}-${course.mentor}`
  const filteredCourses = existingCourses.filter((item) => `${item.title}-${item.mentor}` !== courseKey)

  window.localStorage.setItem(ENROLLED_COURSES_KEY, JSON.stringify([{ ...course, enrolledAt: new Date().toISOString() }, ...filteredCourses]))
}

function CourseDetailModal({ course, onClose, onEnroll }) {
  if (!course) return null

  const highlights = ['Project-based learning', 'Certificate included', 'Mentor feedback', 'Lifetime access']
  const curriculum = [
    'Course orientation and outcome planning',
    'Core concepts with guided exercises',
    'Practical lab work and review sessions',
    'Final project walkthrough and certificate',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-3 sm:p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="relative flex w-full max-w-[1160px] max-h-[calc(100vh-32px)] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/[0.08] bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-[10px] bg-[#f0f4f8] px-3 py-1 text-[11px] font-medium text-[#64748b]">
              Course preview
            </span>
            <h2 className="mt-2 text-[22px] font-bold text-[#0f172a] sm:text-[26px]">{course.title}</h2>
            <p className="mt-1 text-[13px] text-[#94a3b8]">Detailed view opens like the Figma course focus frame.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5 text-[#94a3b8]" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[1.2fr_0.8fr]">
          <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-5">
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
                  <p className="text-[14px] leading-relaxed text-[#64748b]">{course.desc}</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {course.meta.map((item) => (
                      <div key={item} className="rounded-[12px] bg-[#f8fafc] px-3 py-3 text-center">
                        <p className="text-[11px] text-[#94a3b8]">Course detail</p>
                        <p className="mt-1 text-[12px] font-semibold text-[#0f172a]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0f172a]">What you will get</h3>
                    <p className="mt-1 text-[12px] text-[#94a3b8]">A clear, outcome-driven learning experience.</p>
                  </div>
                  <span className="rounded-full bg-[#e8f5ff] px-3 py-1 text-[11px] font-medium text-[#2563eb]">Live mentorship</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {highlights.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-[12px] border border-black/[0.08] px-3 py-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ede7ff] text-[#5b3df6]">
                        <Check className="h-4 w-4" />
                      </div>
                      <p className="text-[13px] font-medium text-[#0f172a]">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0f172a]">Curriculum</h3>
                    <p className="mt-1 text-[12px] text-[#94a3b8]">A short roadmap of the course journey.</p>
                  </div>
                  <BookOpen className="h-5 w-5 text-[#5b3df6]" />
                </div>
                <div className="space-y-3">
                  {curriculum.map((step, idx) => (
                    <div key={step} className="flex items-start gap-3 rounded-[12px] bg-[#fafcff] p-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5b3df6] text-[11px] font-semibold text-white">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#0f172a]">{step}</p>
                        <p className="mt-0.5 text-[11px] text-[#94a3b8]">Structured to keep learners progressing with confidence.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          <aside className="min-h-0 overflow-y-auto border-t border-black/[0.08] bg-[#fafcff] p-4 sm:p-6 lg:border-l lg:border-t-0">
            <div className="space-y-4">
              <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] text-[#94a3b8]">Mentor</p>
                    <p className="text-[16px] font-semibold text-[#0f172a]">{course.mentor}</p>
                    <p className="mt-1 text-[12px] text-[#94a3b8]">{course.role}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0f172a]">
                    <Star className="h-4 w-4 fill-[#ffd966] text-[#ffd966]" />
                    {course.rating}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[12px] bg-[#f8fafc] p-3">
                    <p className="text-[11px] text-[#94a3b8]">Price</p>
                    <p className="mt-1 text-[18px] font-bold text-[#0f172a]">{course.price}</p>
                  </div>
                  <div className="rounded-[12px] bg-[#f8fafc] p-3">
                    <p className="text-[11px] text-[#94a3b8]">Access</p>
                    <p className="mt-1 text-[18px] font-bold text-[#0f172a]">Lifetime</p>
                  </div>
                </div>
              </section>

              <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
                <h3 className="text-[16px] font-bold text-[#0f172a]">Why this course</h3>
                <div className="mt-3 space-y-3 text-[12px] text-[#64748b]">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-[#5b3df6]" />
                    <p>{course.note}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <BarChart3 className="mt-0.5 h-4 w-4 text-[#5b3df6]" />
                    <p>Designed for fast outcomes and visible progress in a short learning cycle.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wallet className="mt-0.5 h-4 w-4 text-[#5b3df6]" />
                    <p>Flexible enrollment with mentor feedback and certificate support.</p>
                  </div>
                </div>
              </section>

              <section className="rounded-[18px] border border-[#ffd966] bg-[#fff8e7] p-5">
                <p className="text-[13px] font-semibold text-[#4b2e00]">Ready to start?</p>
                <p className="mt-1 text-[12px] leading-5 text-[#6b4b00]">Enroll now to open the full learning workspace and add this course to your dashboard.</p>
                <button
                  type="button"
                  onClick={() => onEnroll?.(course)}
                  className="mt-4 inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4a2ed8]"
                >
                  <Plus className="h-4 w-4" />
                  Enroll now
                </button>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function SubscriptionModal({ course, onClose, onContinue }) {
  if (!course) return null

  const plans = [
    { key: 'monthly', title: 'Monthly plan', price: '$12', desc: 'Flexible access for one month', active: true },
    { key: 'annual', title: 'Annual plan', price: '$79', desc: 'Best value with certificate support', active: false },
  ]

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="relative flex w-full max-w-[1060px] max-h-[calc(100vh-32px)] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.32)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/[0.08] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-[10px] bg-[#f0f4f8] px-3 py-1 text-[11px] font-medium text-[#64748b]">
              Subscription
            </span>
            <h2 className="mt-2 text-[22px] font-bold text-[#0f172a] sm:text-[26px]">Choose your subscription</h2>
            <p className="mt-1 text-[13px] text-[#94a3b8]">Subscription step appears before checkout for paid courses.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5 text-[#94a3b8]" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
          <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
            <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
              <div className="flex items-start gap-4">
                <img src={course.image} alt={course.title} className="h-[110px] w-[150px] rounded-[14px] object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <span key={tag} className="inline-flex h-[24px] items-center rounded-[10px] bg-[#f1f5f9] px-[10px] text-[11px] font-medium text-[#0f172a]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-3 text-[20px] font-bold text-[#0f172a]">{course.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#94a3b8]">{course.desc}</p>
                </div>
              </div>
            </section>

            <div className="mt-5 grid grid-cols-1 gap-3">
              {plans.map((plan) => (
                <button
                  key={plan.key}
                  type="button"
                  className={`rounded-[16px] border p-4 text-left transition-colors ${
                    plan.active ? 'border-[#5b3df6] bg-[#faf9ff] shadow-sm' : 'border-black/[0.08] bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[14px] font-semibold text-[#0f172a]">{plan.title}</p>
                      <p className="mt-1 text-[12px] text-[#94a3b8]">{plan.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[20px] font-bold text-[#0f172a]">{plan.price}</p>
                      <p className="text-[11px] text-[#94a3b8]">per month</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <section className="mt-5 rounded-[18px] border border-black/[0.08] bg-white p-5">
              <h3 className="text-[16px] font-bold text-[#0f172a]">Why subscription first?</h3>
              <p className="mt-2 text-[12px] leading-5 text-[#64748b]">
                This screen lets you confirm the access plan before moving to secure checkout.
              </p>
            </section>
          </div>

          <aside className="border-t border-black/[0.08] bg-[#fafcff] p-4 sm:p-6 lg:border-l lg:border-t-0">
            <div className="space-y-4">
              <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
                <h3 className="text-[16px] font-bold text-[#0f172a]">Plan summary</h3>
                <div className="mt-4 space-y-3 text-[12px] text-[#64748b]">
                  <div className="flex items-center justify-between gap-4">
                    <span>Monthly access</span>
                    <span className="font-semibold text-[#0f172a]">$12</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Annual access</span>
                    <span className="font-semibold text-[#0f172a]">$79</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-black/[0.08] pt-3">
                    <span className="text-[13px] font-semibold text-[#0f172a]">Next step</span>
                    <span className="rounded-full bg-[#e8f5ff] px-2.5 py-1 text-[11px] font-medium text-[#2563eb]">Checkout</span>
                  </div>
                </div>
              </section>

              <section className="rounded-[18px] border border-[#ffd966] bg-[#fff8e7] p-5">
                <p className="text-[13px] font-semibold text-[#4b2e00]">Proceed to payment</p>
                <p className="mt-1 text-[12px] leading-5 text-[#6b4b00]">After choosing a plan, continue to the checkout page.</p>
                <button
                  type="button"
                  onClick={() => onContinue?.(course)}
                  className="mt-4 inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4a2ed8]"
                >
                  Continue to checkout
                  <ArrowRight className="h-4 w-4" />
                </button>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function CheckoutModal({ course, onClose, onPay }) {
  if (!course) return null

  const pricing = {
    coursePrice: course.price,
    tax: '$4',
    total: course.price,
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className="relative flex w-full max-w-[1180px] max-h-[calc(100vh-32px)] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.32)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/[0.08] bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-[10px] bg-[#f0f4f8] px-3 py-1 text-[11px] font-medium text-[#64748b]">
              Checkout
            </span>
            <h2 className="mt-2 text-[22px] font-bold text-[#0f172a] sm:text-[26px]">Complete your enrollment</h2>
            <p className="mt-1 text-[13px] text-[#94a3b8]">Secure checkout flow opened from the course detail view.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5 text-[#94a3b8]" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[1.15fr_0.85fr]">
          <div className="min-h-0 overflow-y-auto p-4 sm:p-6">
            <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
              <div className="flex items-start gap-4">
                <img src={course.image} alt={course.title} className="h-[110px] w-[150px] rounded-[14px] object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag) => (
                      <span key={tag} className="inline-flex h-[24px] items-center rounded-[10px] bg-[#f1f5f9] px-[10px] text-[11px] font-medium text-[#0f172a]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-3 text-[20px] font-bold text-[#0f172a]">{course.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#94a3b8]">{course.desc}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] text-[#64748b]">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f8fafc] px-3 py-1">
                      <Clock className="h-3.5 w-3.5" />
                      {course.meta[1]}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f8fafc] px-3 py-1">
                      <Star className="h-3.5 w-3.5 fill-[#ffd966] text-[#ffd966]" />
                      {course.rating} rating
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-5 rounded-[18px] border border-black/[0.08] bg-white p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-[16px] font-bold text-[#0f172a]">Payment method</h3>
                  <p className="mt-1 text-[12px] text-[#94a3b8]">Choose how you want to pay for this course.</p>
                </div>
                <ShieldCheck className="h-5 w-5 text-[#5b3df6]" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { title: 'Card', desc: 'Visa, Mastercard', icon: CreditCard, active: true },
                  { title: 'UPI', desc: 'Instant payment', icon: Wallet, active: false },
                  { title: 'Wallet', desc: 'Use saved balance', icon: Wallet, active: false },
                ].map((method) => (
                  <button
                    key={method.title}
                    type="button"
                    className={`rounded-[14px] border p-4 text-left transition-colors ${
                      method.active ? 'border-[#5b3df6] bg-[#faf9ff]' : 'border-black/[0.08] bg-white hover:bg-gray-50'
                    }`}
                  >
                    <method.icon className={`h-5 w-5 ${method.active ? 'text-[#5b3df6]' : 'text-[#64748b]'}`} />
                    <p className="mt-3 text-[13px] font-semibold text-[#0f172a]">{method.title}</p>
                    <p className="mt-1 text-[11px] text-[#94a3b8]">{method.desc}</p>
                  </button>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-[#0f172a]">Card number</label>
                  <input className="h-11 w-full rounded-[10px] border border-black/[0.08] px-3 text-[13px] outline-none focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15" placeholder="1234 5678 9012 3456" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-[#0f172a]">Name on card</label>
                  <input className="h-11 w-full rounded-[10px] border border-black/[0.08] px-3 text-[13px] outline-none focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15" placeholder="Student name" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-[#0f172a]">Expiry date</label>
                  <input className="h-11 w-full rounded-[10px] border border-black/[0.08] px-3 text-[13px] outline-none focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15" placeholder="MM / YY" />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium text-[#0f172a]">CVV</label>
                  <input className="h-11 w-full rounded-[10px] border border-black/[0.08] px-3 text-[13px] outline-none focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15" placeholder="123" />
                </div>
              </div>

              <div className="mt-5 rounded-[14px] border border-[#d8cffc] bg-[#faf9ff] p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#5b3df6]" />
                  <div>
                    <p className="text-[13px] font-semibold text-[#0f172a]">Secure enrollment</p>
                    <p className="mt-1 text-[12px] leading-5 text-[#64748b]">
                      Your payment is protected and your course access will unlock immediately after confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="min-h-0 overflow-y-auto border-t border-black/[0.08] bg-[#fafcff] p-4 sm:p-6 lg:border-l lg:border-t-0">
            <div className="space-y-4">
              <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
                <h3 className="text-[16px] font-bold text-[#0f172a]">Order summary</h3>
                <div className="mt-4 space-y-3 text-[12px] text-[#64748b]">
                  <div className="flex items-center justify-between gap-4">
                    <span>{course.title}</span>
                    <span className="font-semibold text-[#0f172a]">{pricing.coursePrice}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Taxes & fees</span>
                    <span className="font-semibold text-[#0f172a]">{pricing.tax}</span>
                  </div>
                  <div className="border-t border-black/[0.08] pt-3 flex items-center justify-between gap-4">
                    <span className="text-[13px] font-semibold text-[#0f172a]">Total due</span>
                    <span className="text-[20px] font-bold text-[#0f172a]">{pricing.total}</span>
                  </div>
                </div>
              </section>

              <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
                <h3 className="text-[16px] font-bold text-[#0f172a]">Included in checkout</h3>
                <div className="mt-3 space-y-3">
                  {['Access to all lessons', 'Certificate on completion', 'Mentor feedback', 'Downloadable workbook'].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-[12px] text-[#334155]">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2dd4bf]">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[18px] border border-[#ffd966] bg-[#fff8e7] p-5">
                <p className="text-[13px] font-semibold text-[#4b2e00]">Need help?</p>
                <p className="mt-1 text-[12px] leading-5 text-[#6b4b00]">If you face any issue during checkout, the support team can help you complete enrollment.</p>
              </section>
            </div>
          </aside>
        </div>

        <div className="flex flex-col gap-3 border-t border-black/[0.08] bg-[#fafcff] px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button type="button" onClick={onClose} className="h-11 rounded-[10px] border border-black/[0.08] bg-white px-4 text-[13px] font-medium text-[#64748b] hover:bg-gray-50">
            Back
          </button>
          <button
            type="button"
            onClick={() => onPay?.(course)}
            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4a2ed8]"
          >
            Pay {pricing.total}
          </button>
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
              Payment successful
            </span>
            <h2 className="mt-2 text-[22px] font-bold text-[#0f172a] sm:text-[26px]">Enrollment completed</h2>
            <p className="mt-1 text-[13px] text-[#94a3b8]">Your seat is confirmed and course access is now active.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5 text-[#94a3b8]" />
          </button>
        </div>

        <div className="grid gap-0 bg-[#fafcff] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-5 sm:p-6">
            <section className="rounded-[18px] border border-[#d8cffc] bg-white p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ede7ff] text-[#5b3df6]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-[12px] text-[#94a3b8]">Confirmed course</p>
                  <h3 className="text-[18px] font-bold text-[#0f172a]">{course.title}</h3>
                  <p className="mt-1 text-[13px] text-[#64748b]">You can start learning immediately from your dashboard.</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: 'Payment', value: 'Completed' },
                  { label: 'Access', value: 'Unlocked' },
                  { label: 'Certificate', value: 'Included' },
                ].map((item) => (
                  <div key={item.label} className="rounded-[14px] bg-[#fafcff] p-3">
                    <p className="text-[11px] text-[#94a3b8]">{item.label}</p>
                    <p className="mt-1 text-[14px] font-semibold text-[#0f172a]">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-5 rounded-[18px] border border-black/[0.08] bg-white p-5">
              <h3 className="text-[16px] font-bold text-[#0f172a]">What happens next</h3>
              <div className="mt-4 space-y-3">
                {[
                  'Course content opens in your learning workspace.',
                  'Mentor support and resources are available from day one.',
                  'Completion certificate will be unlocked after final submission.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-[12px] text-[#334155]">
                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#2dd4bf]">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="border-t border-black/[0.08] bg-[#fafcff] p-5 sm:p-6 lg:border-l lg:border-t-0">
            <div className="space-y-4">
              <section className="rounded-[18px] border border-black/[0.08] bg-white p-5">
                <h3 className="text-[16px] font-bold text-[#0f172a]">Receipt summary</h3>
                <div className="mt-4 space-y-3 text-[12px] text-[#64748b]">
                  <div className="flex items-center justify-between gap-4">
                    <span>{course.title}</span>
                    <span className="font-semibold text-[#0f172a]">{course.price}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Transaction ID</span>
                    <span className="font-semibold text-[#0f172a]">TXN-24-508</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-black/[0.08] pt-3">
                    <span className="text-[13px] font-semibold text-[#0f172a]">Status</span>
                    <span className="rounded-full bg-[#2dd4bf] px-2.5 py-1 text-[11px] font-medium text-[#023b33]">Successful</span>
                  </div>
                </div>
              </section>

              <section className="rounded-[18px] border border-[#ffd966] bg-[#fff8e7] p-5">
                <p className="text-[13px] font-semibold text-[#4b2e00]">Ready to continue?</p>
                <p className="mt-1 text-[12px] leading-5 text-[#6b4b00]">Go to the course view to begin learning and review the course detail again.</p>
                <button
                  type="button"
                  onClick={onGoToCourse}
                  className="mt-4 inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4a2ed8]"
                >
                  Go to course
                  <ArrowRight className="h-4 w-4" />
                </button>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default function StudentBrowseCourse() {
  const navigate = useNavigate()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [subscriptionCourse, setSubscriptionCourse] = useState(null)
  const [checkoutCourse, setCheckoutCourse] = useState(null)
  const [successCourse, setSuccessCourse] = useState(null)

  const isFreeCourse = (course) => course?.isFree || course?.price === '$0'

  const openEnrollFlow = (course) => {
    if (isFreeCourse(course)) {
      setCheckoutCourse(course)
      setSubscriptionCourse(null)
      setSelectedCourse(null)
      return
    }

    setSubscriptionCourse(course)
    setCheckoutCourse(null)
    setSelectedCourse(null)
  }

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="bg-gradient-to-b flex h-full flex-col gap-[24px] from-[#f6f8fa] p-4 to-[#f7fcff] sm:p-6 lg:p-7">
        {/* Hero Section */}
        <section className="w-full shrink-0 rounded-[8px] border border-black/[0.08] border-solid bg-gradient-to-br from-white to-[#e8f5ff] px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <div className="flex flex-col gap-[11px] items-start">
            <div className="bg-[#ffd966] flex items-center px-[10px] py-[6.5px] rounded-[12px] shrink-0">
              <div className="text-[12px] font-medium text-[#4b2e00]">
                Create-ready course discovery
              </div>
            </div>
            <div className="text-[22px] font-bold leading-tight text-[#0f172a] sm:text-[26px] lg:text-[28px]">
              Browse courses built to help you level up faster.
            </div>
            <div className="text-[14px] text-[#94a3b8] leading-relaxed">
              Explore guided paths across UI/UX, product design, frontend development, and career growth.
              Personalized picks, top-rated cohorts, and new releases are surfaced in one clean catalog.
            </div>
          </div>
          <div className="mt-4 flex items-center gap-[12px] flex-wrap">
            <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                128 courses available
              </div>
            </div>
            <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                34 new this month
              </div>
            </div>
            <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                Top categories: UI/UX, Frontend, Product
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
          <div>
            <h2 className="font-bold text-[18px] text-[#0f172a]">Explore the catalog</h2>
            <p className="text-[13px] text-[#94a3b8] mt-[4px]">Use filters to narrow by topic, level, duration, or certificate track.</p>
          </div>
          <div className="flex flex-wrap items-center gap-[12px] w-full">
            <div className="flex-1 min-w-0 sm:min-w-[280px] bg-white border border-black/[0.08] flex items-center gap-[10px] h-[40px] px-[15px] py-[0.25px] relative rounded-[6px]">
              <Search className="h-[18px] w-[18px] text-[#94a3b8]" />
              <input
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none"
                placeholder="Search by course name, instructor, or skill"
              />
            </div>
            <button className="border border-black/[0.08] flex items-center gap-[8px] h-[40px] justify-center px-[17px] py-[0.25px] rounded-[6px] shrink-0 bg-white">
              <SlidersHorizontal className="h-[18px] w-[18px] text-[#0f172a]" />
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[14px]">
                Advanced filters
              </div>
            </button>
            {['All courses', 'Beginner', 'Intermediate', 'Design', 'Development', 'Certificate'].map((chip, idx) => (
              <button
                key={chip}
                className={`inline-flex h-[36px] items-center px-[16px] rounded-[12px] text-[12px] font-medium transition-colors ${
                  idx === 0 ? 'bg-[#5b3df6] text-white' : 'bg-[#f1f5f9] text-[#0f172a] hover:bg-[#e8f5ff]'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Section */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h3 className="font-bold text-[24px] text-[#0f172a]">Recommended for you</h3>
              <p className="text-[13px] text-[#94a3b8] mt-[4px]">Based on your recent progress in UI/UX Masterclass and accessibility topics.</p>
            </div>
            <p className="text-[13px] font-medium text-[#94a3b8]">Showing 6 curated matches</p>
          </div>

          <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 xl:grid-cols-3">
            {CARDS.map((course) => (
              <article
                key={course.title}
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
                <img src={course.image} alt="" className="h-[200px] w-full object-cover" />
                <div className="flex flex-col gap-[16px] p-[20px]">
                  <div className="flex gap-[8px] flex-wrap">
                    {course.tags.map((tag) => (
                      <span key={tag} className="inline-flex h-[26px] items-center px-[10px] rounded-[10px] text-[11px] font-medium bg-[#f1f5f9] text-[#0f172a]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="font-bold text-[18px] text-[#0f172a] leading-tight">{course.title}</h4>
                  <p className="text-[13px] text-[#94a3b8] line-clamp-2">{course.desc}</p>
                  <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-3">
                    {course.meta.map((m) => (
                      <div key={m} className="bg-[#f8fafc] rounded-[6px] p-[8px] text-[11px] font-medium text-[#475569] text-center">
                        {m}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[12px]">
                      <img src={AVATAR} alt="" className="h-[32px] w-[32px] rounded-[6px] object-cover" />
                      <div>
                        <p className="font-semibold text-[13px] text-[#0f172a]">{course.mentor}</p>
                        <p className="text-[11px] text-[#94a3b8]">{course.role}</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-[4px] text-[13px] font-semibold text-[#0f172a]">
                      <Star className="h-[14px] w-[14px] text-[#ffd966] fill-[#ffd966]" />
                      {course.rating}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 border-t border-black/[0.08] pt-2 sm:flex-row sm:items-center sm:justify-between sm:pt-0">
                    <div>
                      <p className="text-[28px] pt-2 font-bold text-[#0f172a] leading-none">{course.price}</p>
                      <p className="text-[11px] text-[#94a3b8] mt-[4px]">{course.note}</p>
                    </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEnrollFlow(course)
                        }}
                        className="bg-[#5b3df6] flex items-center gap-[8px] h-[40px] justify-center px-[16px] rounded-[6px]"
                      >
                      <Plus className="h-[16px] w-[16px] text-white" />
                      <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-white text-[14px]">
                        Enroll now
                      </div>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {selectedCourse && <CourseDetailModal course={selectedCourse} onClose={() => setSelectedCourse(null)} onEnroll={openEnrollFlow} />}
      {subscriptionCourse && (
        <SubscriptionModal
          course={subscriptionCourse}
          onClose={() => setSubscriptionCourse(null)}
          onContinue={(course) => {
            setCheckoutCourse(course)
            setSubscriptionCourse(null)
          }}
        />
      )}
      {checkoutCourse && (
        <CheckoutModal
          course={checkoutCourse}
          onClose={() => setCheckoutCourse(null)}
          onPay={(course) => {
            saveEnrolledCourse(course)
            setSuccessCourse(course)
            setCheckoutCourse(null)
          }}
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
