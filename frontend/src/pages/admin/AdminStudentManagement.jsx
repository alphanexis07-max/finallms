import React, { useState } from 'react'
import {
  Search,
  Upload,
  Plus,
  Users,
  GraduationCap,
  Calendar,
  AlertTriangle,
  ChevronDown,
  FileText,
  Receipt,
  XCircle,
  Download,
  Filter,
  Eye,
  Award,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  MessageCircle,
  ArrowRight,
  MoreVertical,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle as XCircleIcon,
} from 'lucide-react'

// ── Helper Components ──────────────────────────────────────────
function StatusBadge({ status, type }) {
  const getStyles = () => {
    if (type === 'enrollment') {
      switch (status) {
        case 'active': return 'bg-[#2dd4bf] text-[#023b33]'
        case 'inactive': return 'bg-gray-100 text-gray-600'
        case 'suspended': return 'bg-red-100 text-red-700'
        case 'graduated': return 'bg-blue-100 text-blue-700'
        default: return 'bg-gray-100 text-gray-600'
      }
    }
    if (type === 'payment') {
      switch (status) {
        case 'paid': return 'bg-[#2dd4bf] text-[#023b33]'
        case 'pending': return 'bg-[#ffd966] text-[#4b2e00]'
        case 'overdue': return 'bg-red-100 text-red-700'
        case 'partial': return 'bg-orange-100 text-orange-700'
        default: return 'bg-gray-100 text-gray-600'
      }
    }
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <span className={`inline-flex h-[28px] items-center rounded-[12px] px-[10px] text-[12px] font-medium ${getStyles()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function ProgressRing({ percentage, size = 32, strokeWidth = 3 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference
  
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={percentage >= 80 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  )
}

function StatCard({ label, value, sub, subVariant, icon }) {
  const subColors = {
    success: 'bg-[#2dd4bf] text-[#023b33]',
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

// ── Sample Data ────────────────────────────────────────────────
const sampleStudents = [
  {
    id: 'STU001',
    name: 'Arjun Singh',
    email: 'arjun.singh@example.com',
    phone: '+91 98765 43210',
    address: '123, Green Park, New Delhi - 110016',
    avatar: '#c7d2fe',
    enrollment: {
      class: 'class-8',
      className: 'Class 8 - Einstein',
      grade: '8th Grade',
      section: 'A',
      rollNumber: '24001',
      enrollmentDate: '2024-04-15',
      status: 'active',
      paymentStatus: 'paid',
    },
    subscription: {
      plan: 'Annual Academic Plus',
      amount: 29999,
      billingCycle: 'yearly',
      startDate: '2024-04-15',
      endDate: '2025-04-14',
      autoRenew: true,
      status: 'active',
    },
    certificates: [
      {
        id: 'CERT001',
        name: 'Python Programming Certificate',
        issueDate: '2024-12-20',
        grade: 'A',
        url: '#',
      },
    ],
    bills: [
      {
        id: 'BILL001',
        invoiceNumber: 'INV-2024-001',
        amount: 29999,
        date: '2024-04-15',
        dueDate: '2024-05-15',
        status: 'paid',
        items: [{ description: 'Annual Academic Plus Subscription', amount: 29999 }],
      },
    ],
    progress: {
      overall: 82,
      subjects: [
        { name: 'Mathematics', percentage: 85 },
        { name: 'Science', percentage: 78 },
        { name: 'English', percentage: 92 },
        { name: 'Computer Science', percentage: 88 },
      ],
      attendance: 93,
      assignmentsCompleted: 24,
      totalAssignments: 28,
      averageQuizScore: 79,
      teacherRemarks: ['Excellent progress in Mathematics'],
      performanceHistory: [
        { month: 'Sep', score: 75 },
        { month: 'Oct', score: 78 },
        { month: 'Nov', score: 80 },
        { month: 'Dec', score: 82 },
        { month: 'Jan', score: 85 },
      ],
    },
    parent: {
      name: 'Kavita Singh',
      relation: 'Mother',
      phone: '+91 99887 66554',
      email: 'kavita.singh@example.com',
    },
    notes: [],
  },
  {
    id: 'STU002',
    name: 'Mia Chen',
    email: 'mia.chen@example.com',
    phone: '+91 87654 32109',
    address: '456, Lake View, Bangalore - 560001',
    avatar: '#fce7f3',
    enrollment: {
      class: 'class-7',
      className: 'Class 7 - Newton',
      grade: '7th Grade',
      section: 'B',
      rollNumber: '24056',
      enrollmentDate: '2024-06-10',
      status: 'active',
      paymentStatus: 'pending',
    },
    subscription: {
      plan: 'Quarterly STEM Pro',
      amount: 8999,
      billingCycle: 'quarterly',
      startDate: '2024-12-01',
      endDate: '2025-02-28',
      autoRenew: true,
      status: 'active',
    },
    certificates: [],
    bills: [
      {
        id: 'BILL003',
        invoiceNumber: 'INV-2024-089',
        amount: 8999,
        date: '2024-12-01',
        dueDate: '2024-12-15',
        status: 'pending',
        items: [{ description: 'Quarterly STEM Pro Subscription', amount: 8999 }],
      },
    ],
    progress: {
      overall: 64,
      subjects: [
        { name: 'Mathematics', percentage: 68 },
        { name: 'Science', percentage: 72 },
        { name: 'English', percentage: 85 },
        { name: 'Robotics', percentage: 45 },
      ],
      attendance: 71,
      assignmentsCompleted: 18,
      totalAssignments: 26,
      averageQuizScore: 65,
      teacherRemarks: ['Struggling with Robotics concepts'],
      performanceHistory: [
        { month: 'Sep', score: 70 },
        { month: 'Oct', score: 68 },
        { month: 'Nov', score: 65 },
        { month: 'Dec', score: 64 },
        { month: 'Jan', score: 64 },
      ],
    },
    parent: {
      name: 'Daniel Chen',
      relation: 'Father',
      phone: '+91 88776 55443',
      email: 'daniel.chen@example.com',
    },
    notes: [],
  },
  {
    id: 'STU003',
    name: 'Sofia Ramirez',
    email: 'sofia.ramirez@example.com',
    phone: '+91 76543 21098',
    address: '789, Coastal Road, Mumbai - 400001',
    avatar: '#d1fae5',
    enrollment: {
      class: 'class-9',
      className: 'Class 9 - Curie',
      grade: '9th Grade',
      section: 'A',
      rollNumber: '24123',
      enrollmentDate: '2024-03-20',
      status: 'active',
      paymentStatus: 'paid',
    },
    subscription: {
      plan: 'Annual All Access',
      amount: 49999,
      billingCycle: 'yearly',
      startDate: '2024-03-20',
      endDate: '2025-03-19',
      autoRenew: true,
      status: 'active',
    },
    certificates: [
      {
        id: 'CERT004',
        name: 'English Proficiency - Advanced',
        issueDate: '2024-12-01',
        grade: 'A+',
        url: '#',
      },
    ],
    bills: [
      {
        id: 'BILL004',
        invoiceNumber: 'INV-2024-012',
        amount: 49999,
        date: '2024-03-20',
        dueDate: '2024-04-20',
        status: 'paid',
        items: [{ description: 'Annual All Access Subscription', amount: 49999 }],
      },
    ],
    progress: {
      overall: 91,
      subjects: [
        { name: 'Mathematics', percentage: 95 },
        { name: 'Science', percentage: 88 },
        { name: 'English', percentage: 98 },
        { name: 'Literature', percentage: 92 },
      ],
      attendance: 96,
      assignmentsCompleted: 32,
      totalAssignments: 34,
      averageQuizScore: 92,
      teacherRemarks: ['Outstanding performance'],
      performanceHistory: [
        { month: 'Sep', score: 85 },
        { month: 'Oct', score: 88 },
        { month: 'Nov', score: 90 },
        { month: 'Dec', score: 91 },
        { month: 'Jan', score: 92 },
      ],
    },
    parent: {
      name: 'Elena Ramirez',
      relation: 'Mother',
      phone: '+91 99876 54321',
      email: 'elena.ramirez@example.com',
    },
    notes: [],
  },
  {
    id: 'STU004',
    name: 'Yusuf Ali',
    email: 'yusuf.ali@example.com',
    phone: '+91 65432 10987',
    address: '321, Heritage City, Hyderabad - 500001',
    avatar: '#fef3c7',
    enrollment: {
      class: 'class-6',
      className: 'Class 6 - Raman',
      grade: '6th Grade',
      section: 'C',
      rollNumber: '24189',
      enrollmentDate: '2025-01-02',
      status: 'active',
      paymentStatus: 'pending',
    },
    subscription: {
      plan: 'Monthly Math Mastery',
      amount: 1999,
      billingCycle: 'monthly',
      startDate: '2025-01-02',
      endDate: '2025-02-01',
      autoRenew: true,
      status: 'active',
    },
    certificates: [],
    bills: [
      {
        id: 'BILL005',
        invoiceNumber: 'INV-2025-001',
        amount: 1999,
        date: '2025-01-02',
        dueDate: '2025-02-02',
        status: 'pending',
        items: [{ description: 'Monthly Math Mastery Subscription', amount: 1999 }],
      },
    ],
    progress: {
      overall: 28,
      subjects: [
        { name: 'Mathematics', percentage: 28 },
        { name: 'Science', percentage: 35 },
      ],
      attendance: 58,
      assignmentsCompleted: 4,
      totalAssignments: 14,
      averageQuizScore: 31,
      teacherRemarks: ['New admission - needs additional support'],
      performanceHistory: [
        { month: 'Jan', score: 28 },
      ],
    },
    parent: {
      name: 'Fatima Ali',
      relation: 'Mother',
      phone: '+91 98765 12345',
      email: 'fatima.ali@example.com',
    },
    notes: [],
  },
]

// ── Main Component ─────────────────────────────────────────────
export default function StudentManagement() {
  const [students] = useState(sampleStudents)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkNotice, setBulkNotice] = useState('')
  const [filters, setFilters] = useState({
    enrollmentStatus: 'all',
    paymentStatus: 'all',
    subscriptionStatus: 'all',
    class: 'all',
  })
  const [showFilters, setShowFilters] = useState(false)

  const filteredStudents = students.filter(student => {
    if (searchTerm && !student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !student.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    if (filters.enrollmentStatus !== 'all' && student.enrollment.status !== filters.enrollmentStatus) return false
    if (filters.paymentStatus !== 'all' && student.enrollment.paymentStatus !== filters.paymentStatus) return false
    if (filters.class !== 'all' && student.enrollment.class !== filters.class) return false
    return true
  })

  const getFilterCount = () => {
    let count = 0
    if (filters.enrollmentStatus !== 'all') count++
    if (filters.paymentStatus !== 'all') count++
    if (filters.class !== 'all') count++
    return count
  }

  const resetFilters = () => {
    setFilters({
      enrollmentStatus: 'all',
      paymentStatus: 'all',
      subscriptionStatus: 'all',
      class: 'all',
    })
    setSearchTerm('')
  }

  const uniqueClasses = ['all', ...new Set(students.map(s => s.enrollment.class))]
  const pendingPaymentsCount = filteredStudents.filter((s) => s.enrollment.paymentStatus === 'pending' || s.enrollment.paymentStatus === 'overdue').length
  const avgProgress = filteredStudents.length
    ? Math.round(filteredStudents.reduce((acc, s) => acc + s.progress.overall, 0) / filteredStudents.length)
    : 0

  const bulkActions = [
    {
      key: 'payment-reminder',
      title: 'Send payment reminder',
      desc: 'Notify selected learners and parents about pending invoices.',
      icon: Receipt,
      meta: `${pendingPaymentsCount} pending payments`,
      tone: 'bg-[#fff8e7] text-[#4b2e00] border-[#ffd966]',
    },
    {
      key: 'progress-report',
      title: 'Export progress report',
      desc: 'Download progress snapshots for all visible students.',
      icon: TrendingUp,
      meta: `Average progress ${avgProgress}%`,
      tone: 'bg-[#e8f5ff] text-[#0f172a] border-[#cfe8ff]',
    },
    {
      key: 'send-message',
      title: 'Broadcast message',
      desc: 'Send one announcement to all students in this view.',
      icon: MessageCircle,
      meta: `${filteredStudents.length} recipients`,
      tone: 'bg-[#ede7ff] text-[#3b2aa8] border-[#d8cffc]',
    },
  ]

  const handleBulkAction = (actionTitle) => {
    setBulkNotice(`${actionTitle} queued for ${filteredStudents.length} students.`)
    setShowBulkActions(false)
  }

  return (
    <div className="min-h-screen bg-[#F7FAFD]">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-7">
        {/* Hero Section - matches instructor management style */}
        <section className="flex flex-col items-start justify-between gap-6 rounded-[10px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] p-5 sm:p-7 lg:flex-row lg:gap-8">
          <div className="min-w-0 flex-1">
            <span className="mb-4 inline-flex items-center rounded-[10px] bg-[#f0f4f8] px-3 py-1.5 text-[11px] font-medium text-[#64748b]">
              Student workspace
            </span>
            <h1 className="mb-3 max-w-[850px] text-[30px] font-bold leading-[1.2] text-[#0f172a]">
              Track enrollment, progress, attendance, and follow-ups from one dedicated learner screen.
            </h1>
            <p className="mb-5 max-w-[800px] text-[13.5px] leading-relaxed text-[#94a3b8]">
              Review course performance, student health, parent contact status, and operational actions without leaving the student management workspace. The layout stays consistent with the institute dashboard while giving more room to learner operations.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex h-10 items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-4 text-[13px] font-medium text-[#0f172a] hover:bg-gray-50">
                <FileText className="h-4 w-4" />
                Import CSV
              </button>
              <button className="inline-flex h-10 items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-4 text-[13px] font-medium text-[#0f172a] hover:bg-gray-50">
                <Calendar className="h-4 w-4" />
                This week
              </button>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:min-w-[200px] lg:w-auto">
            <div className="rounded-[8px] border border-black/[0.08] bg-white px-5 py-4">
              <p className="mb-1 text-[12px] text-[#94a3b8]">Active Students</p>
              <p className="text-[28px] font-bold text-[#0f172a]">{students.filter(s => s.enrollment.status === 'active').length}</p>
            </div>
            <div className="rounded-[8px] border border-black/[0.08] bg-white px-5 py-4">
              <p className="mb-1 text-[12px] text-[#94a3b8]">Pending Payments</p>
              <p className="text-[28px] font-bold text-[#0f172a]">{students.filter(s => s.enrollment.paymentStatus === 'pending' || s.enrollment.paymentStatus === 'overdue').length}</p>
              <p className="mt-1 text-[11px] text-orange-600">Needs attention</p>
            </div>
          </div>
        </section>

        {/* Stats Cards - matching instructor management style */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Students"
            value={students.length}
            sub="+12 this month"
            subVariant="success"
            icon={<Users className="h-[18px] w-[18px] text-[#5b3df6]" />}
          />
          <StatCard
            label="Active Enrollments"
            value={students.filter(s => s.enrollment.status === 'active').length}
            sub="0 inactive"
            subVariant="neutral"
            icon={<GraduationCap className="h-[18px] w-[18px] text-[#5b3df6]" />}
          />
          <StatCard
            label="Avg. Progress"
            value={`${Math.round(students.reduce((acc, s) => acc + s.progress.overall, 0) / students.length)}%`}
            sub="across all students"
            subVariant="neutral"
            icon={<TrendingUp className="h-[18px] w-[18px] text-[#5b3df6]" />}
          />
          <StatCard
            label="Certificates Issued"
            value={students.reduce((acc, s) => acc + s.certificates.length, 0)}
            sub="total achievements"
            subVariant="neutral"
            icon={<Award className="h-[18px] w-[18px] text-[#5b3df6]" />}
          />
        </div>

        {/* Student Directory - matching instructor directory style */}
        <section className="rounded-[10px] border border-black/[0.08] bg-white p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-bold text-[#0f172a]">Student directory</h2>
              <p className="mt-0.5 text-[13px] text-[#94a3b8]">
                Monitor enrollment, progress, payment status, and next actions from a single operational list.
              </p>
            </div>
            <div className="relative flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowBulkActions((prev) => !prev)}
                className={`inline-flex h-9 items-center gap-2 rounded-[6px] border px-4 text-[13px] font-medium transition-colors ${
                  showBulkActions
                    ? 'border-[#5b3df6]/30 bg-[#ede7ff] text-[#5b3df6]'
                    : 'border-black/[0.08] bg-white text-[#0f172a] hover:bg-gray-50'
                }`}
              >
                <MoreVertical className="h-4 w-4" />
                Bulk Actions
                <ChevronDown className={`h-4 w-4 transition-transform ${showBulkActions ? 'rotate-180' : ''}`} />
              </button>

              {showBulkActions && (
                <div className="absolute right-0 top-11 z-20 w-[380px] rounded-[14px] border border-black/[0.08] bg-white p-3 shadow-[0_20px_40px_rgba(15,23,42,0.16)]">
                  <div className="mb-3 rounded-[10px] border border-black/[0.08] bg-gradient-to-br from-white to-[#f8fbff] p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-semibold text-[#0f172a]">Bulk action center</p>
                      <span className="rounded-full bg-[#f0f4f8] px-2.5 py-1 text-[11px] font-medium text-[#64748b]">
                        {filteredStudents.length} visible
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="rounded-[8px] bg-white px-2.5 py-2">
                        <p className="text-[10px] text-[#94a3b8]">Pending payment</p>
                        <p className="mt-0.5 text-[14px] font-semibold text-[#0f172a]">{pendingPaymentsCount}</p>
                      </div>
                      <div className="rounded-[8px] bg-white px-2.5 py-2">
                        <p className="text-[10px] text-[#94a3b8]">Avg progress</p>
                        <p className="mt-0.5 text-[14px] font-semibold text-[#0f172a]">{avgProgress}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {bulkActions.map((action) => (
                      <button
                        key={action.key}
                        onClick={() => handleBulkAction(action.title)}
                        className={`w-full rounded-[10px] border p-3 text-left transition-colors hover:opacity-90 ${action.tone}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <action.icon className="mt-0.5 h-4 w-4" />
                            <div>
                              <p className="text-[12.5px] font-semibold">{action.title}</p>
                              <p className="mt-0.5 text-[11px] opacity-80">{action.desc}</p>
                              <p className="mt-1 text-[10.5px] font-medium opacity-90">{action.meta}</p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {bulkNotice && (
            <div className="mb-4 flex items-start justify-between gap-3 rounded-[10px] border border-[#d8cffc] bg-[#faf9ff] px-4 py-3">
              <p className="text-[12px] text-[#5f4bb8]">{bulkNotice}</p>
              <button onClick={() => setBulkNotice('')} className="text-[11px] font-medium text-[#5b3df6] hover:underline">
                Dismiss
              </button>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setFilters({ ...filters, enrollmentStatus: 'all' })}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  filters.enrollmentStatus === 'all'
                    ? 'bg-[#ede7ff] text-[#5b3df6]'
                    : 'text-[#64748b] hover:bg-gray-50'
                }`}
              >
                All Students
              </button>
              <button
                onClick={() => setFilters({ ...filters, enrollmentStatus: 'active' })}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  filters.enrollmentStatus === 'active'
                    ? 'bg-[#ede7ff] text-[#5b3df6]'
                    : 'text-[#64748b] hover:bg-gray-50'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilters({ ...filters, paymentStatus: 'pending' })}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  filters.paymentStatus === 'pending'
                    ? 'bg-[#ede7ff] text-[#5b3df6]'
                    : 'text-[#64748b] hover:bg-gray-50'
                }`}
              >
                Pending Payment
              </button>
              <button
                onClick={() => setFilters({ ...filters, enrollmentStatus: 'graduated' })}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  filters.enrollmentStatus === 'graduated'
                    ? 'bg-[#ede7ff] text-[#5b3df6]'
                    : 'text-[#64748b] hover:bg-gray-50'
                }`}
              >
                Graduated
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-9 w-full items-center gap-2 rounded-[6px] border border-black/[0.08] bg-[#f8fafc] px-3 sm:min-w-[220px]">
                <Search className="h-4 w-4 shrink-0 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Search students, classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`h-8 rounded-[6px] border border-black/[0.08] px-3 text-[12px] font-medium transition-colors ${
                  showFilters || getFilterCount() > 0
                    ? 'bg-[#ede7ff] text-[#5b3df6] border-[#5b3df6]/30'
                    : 'bg-white text-[#0f172a] hover:bg-gray-50'
                }`}
              >
                <Filter className="h-3 w-3 inline mr-1" />
                Filters
                {getFilterCount() > 0 && (
                  <span className="ml-1 rounded-full bg-[#5b3df6] px-1.5 py-0.5 text-[10px] text-white">
                    {getFilterCount()}
                  </span>
                )}
              </button>
              {(searchTerm || getFilterCount() > 0) && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] text-[#94a3b8] hover:text-[#64748b]"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mb-4 grid grid-cols-1 gap-4 rounded-[10px] border border-black/[0.08] bg-[#fafcff] p-4 md:grid-cols-3">
              <div>
                <label className="block text-[12px] font-medium text-[#334155] mb-1.5">Enrollment Status</label>
                <select
                  value={filters.enrollmentStatus}
                  onChange={(e) => setFilters({ ...filters, enrollmentStatus: e.target.value })}
                  className="w-full rounded-[6px] border border-black/[0.08] bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#334155] mb-1.5">Payment Status</label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
                  className="w-full rounded-[6px] border border-black/[0.08] bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                >
                  <option value="all">All</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#334155] mb-1.5">Class</label>
                <select
                  value={filters.class}
                  onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                  className="w-full rounded-[6px] border border-black/[0.08] bg-white px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                >
                  {uniqueClasses.map(cls => (
                    <option key={cls} value={cls}>
                      {cls === 'all' ? 'All Classes' : cls.replace('class-', 'Class ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Student Table Header */}
          <div className="overflow-x-auto">
            <div className="min-w-[720px] lg:min-w-[860px]">
              <div className="grid grid-cols-[1.8fr_1.6fr_1.4fr_0.8fr_0.8fr_0.6fr] gap-4 border-b border-black/[0.06] px-3 pb-2">
                {['Student', 'Class & Roll', 'Plan', 'Progress', 'Status', ''].map((h) => (
                  <p key={h} className="text-[12px] font-medium text-[#94a3b8]">
                    {h}
                  </p>
                ))}
              </div>

              <div className="divide-y divide-black/[0.05]">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="grid grid-cols-[1.8fr_1.6fr_1.4fr_0.8fr_0.8fr_0.6fr] items-center gap-4 px-3 py-4 transition-colors hover:bg-gray-50/60 cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="h-11 w-11 shrink-0 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: student.avatar, color: '#475569' }}
                      >
                        {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-[#0f172a]">{student.name}</p>
                        <p className="truncate text-[12px] text-[#94a3b8]">ID: {student.id}</p>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#0f172a]">{student.enrollment.className}</p>
                      <p className="text-[12px] text-[#94a3b8]">Roll: {student.enrollment.rollNumber}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#0f172a]">{student.subscription.plan}</p>
                      <p className="text-[12px] text-[#94a3b8]">₹{student.subscription.amount.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ProgressRing percentage={student.progress.overall} />
                      <span className="text-[13px] font-medium">{student.progress.overall}%</span>
                    </div>
                    <div>
                      <StatusBadge status={student.enrollment.status} type="enrollment" />
                    </div>
                    <div className="flex justify-end">
                      <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Eye className="h-4 w-4 text-[#94a3b8]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredStudents.length === 0 && (
                <div className="py-12 text-center">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-[13px] text-[#94a3b8]">No students found matching your filters</p>
                  <button onClick={resetFilters} className="mt-2 text-[12px] text-[#5b3df6] hover:underline">Clear filters</button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Student Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4" onClick={() => setSelectedStudent(null)}>
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-gray-100 sm:p-5">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: selectedStudent.avatar, color: '#475569' }}
                  >
                    {selectedStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h2>
                    <p className="text-sm text-gray-500">{selectedStudent.id} • {selectedStudent.enrollment.className}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="p-2 rounded-lg hover:bg-gray-100">
                  <XCircle className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <div className="flex overflow-x-auto border-b border-gray-100 px-4 sm:px-5">
                {['overview', 'progress', 'certificates', 'bills', 'notes'].map((tab) => (
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

              <div className="overflow-y-auto p-4 max-h-[calc(90vh-140px)] sm:p-5">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{selectedStudent.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{selectedStudent.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{selectedStudent.address}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Parent/Guardian</h3>
                        <div className="space-y-2 text-sm">
                          <p className="font-medium text-gray-900">{selectedStudent.parent.name}</p>
                          <p className="text-gray-500">{selectedStudent.parent.relation}</p>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{selectedStudent.parent.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{selectedStudent.parent.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Enrollment Details</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Enrollment Date</p>
                          <p className="text-sm font-medium mt-1">{new Date(selectedStudent.enrollment.enrollmentDate).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Section</p>
                          <p className="text-sm font-medium mt-1">{selectedStudent.enrollment.section}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Roll Number</p>
                          <p className="text-sm font-medium mt-1">{selectedStudent.enrollment.rollNumber}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Status</p>
                          <div className="mt-1"><StatusBadge status={selectedStudent.enrollment.status} type="enrollment" /></div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Subscription Plan</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Plan</p>
                          <p className="text-sm font-medium mt-1">{selectedStudent.subscription.plan}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="text-sm font-medium mt-1">₹{selectedStudent.subscription.amount.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Valid Till</p>
                          <p className="text-sm font-medium mt-1">{new Date(selectedStudent.subscription.endDate).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500">Status</p>
                          <div className="mt-1"><StatusBadge status={selectedStudent.subscription.status} type="subscription" /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'progress' && (
                  <div className="space-y-6">
                    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
                      <div className="text-center">
                        <div className="relative inline-flex">
                          <ProgressRing percentage={selectedStudent.progress.overall} size={80} strokeWidth={6} />
                          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
                            {selectedStudent.progress.overall}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Overall Progress</p>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 flex-1 w-full">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{selectedStudent.progress.attendance}%</p>
                          <p className="text-xs text-gray-500">Attendance</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{selectedStudent.progress.assignmentsCompleted}/{selectedStudent.progress.totalAssignments}</p>
                          <p className="text-xs text-gray-500">Assignments</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{selectedStudent.progress.averageQuizScore}%</p>
                          <p className="text-xs text-gray-500">Avg. Quiz Score</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Subject-wise Performance</h3>
                      <div className="space-y-3">
                        {selectedStudent.progress.subjects.map((subject, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700">{subject.name}</span>
                              <span className="font-medium text-gray-900">{subject.percentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#5b3df6]"
                                style={{ width: `${subject.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Performance Trend</h3>
                      <div className="h-48 flex items-end gap-3">
                        {selectedStudent.progress.performanceHistory.map((point, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <div
                              className="w-full bg-[#5b3df6] rounded-t-lg transition-all"
                              style={{ height: `${point.score * 0.6}px` }}
                            />
                            <span className="text-xs text-gray-500">{point.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedStudent.progress.teacherRemarks.length > 0 && (
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <h3 className="font-semibold text-amber-800 mb-2">Teacher's Remarks</h3>
                        <ul className="space-y-1">
                          {selectedStudent.progress.teacherRemarks.map((remark, idx) => (
                            <li key={idx} className="text-sm text-amber-700">• {remark}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'certificates' && (
                  <div>
                    {selectedStudent.certificates.length === 0 ? (
                      <div className="text-center py-12">
                        <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400">No certificates issued yet</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {selectedStudent.certificates.map((cert) => (
                          <div key={cert.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-4">
                              <Award className="h-8 w-8 text-[#5b3df6]" />
                              <div>
                                <p className="font-semibold text-gray-900">{cert.name}</p>
                                <p className="text-xs text-gray-500">Issued: {new Date(cert.issueDate).toLocaleDateString()} • Grade: {cert.grade}</p>
                              </div>
                            </div>
                            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">
                              <Download className="h-4 w-4" />
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'bills' && (
                  <div>
                    {selectedStudent.bills.length === 0 ? (
                      <div className="text-center py-12">
                        <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400">No bills available</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedStudent.bills.map((bill) => (
                          <div key={bill.id} className="rounded-lg border border-gray-200 overflow-hidden">
                            <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                              <div>
                                <p className="font-semibold text-gray-900">{bill.invoiceNumber}</p>
                                <p className="text-xs text-gray-500">{new Date(bill.date).toLocaleDateString()}</p>
                              </div>
                              <StatusBadge status={bill.status} type="payment" />
                            </div>
                            <div className="p-4">
                              {bill.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm py-1">
                                  <span className="text-gray-600">{item.description}</span>
                                  <span className="text-gray-900">₹{item.amount.toLocaleString()}</span>
                                </div>
                              ))}
                              <div className="flex justify-between pt-2 mt-2 border-t border-gray-100 font-semibold">
                                <span className="text-gray-900">Total</span>
                                <span className="text-gray-900">₹{bill.amount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-end gap-2 mt-3">
                                <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">
                                  <Download className="h-3 w-3 inline mr-1" />
                                  Invoice
                                </button>
                                {bill.status === 'pending' && (
                                  <button className="rounded-lg bg-[#5b3df6] px-3 py-1.5 text-sm text-white hover:bg-[#4a2ed8]">
                                    Pay Now
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <button className="inline-flex items-center gap-2 rounded-lg bg-[#5b3df6] px-3 py-1.5 text-sm text-white">
                        <Plus className="h-4 w-4" />
                        Add Note
                      </button>
                    </div>
                    {selectedStudent.notes.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400">No notes added yet</p>
                      </div>
                    ) : (
                      selectedStudent.notes.map((note) => (
                        <div key={note.id} className="rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500">{new Date(note.date).toLocaleDateString()}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              note.type === 'warning' ? 'bg-red-100 text-red-700' :
                              note.type === 'achievement' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {note.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
