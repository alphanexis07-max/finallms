import React, { useEffect, useMemo, useState } from 'react'
import {
  Search,
  Upload,
  X,
  SlidersHorizontal,
  Users,
} from 'lucide-react'
import { api } from '../../lib/api'

function normalizeFlag(flag) {
  if (flag === 'top_performer') return 'top_performer'
  if (flag === 'needs_support') return 'needs_support'
  return 'average'
}

function flagMeta(flag) {
  if (flag === 'top_performer') {
    return { label: 'Top performer', className: 'bg-[#2dd4bf] text-[#023b33]' }
  }
  if (flag === 'needs_support') {
    return { label: 'Needs support', className: 'bg-[#ffd966] text-[#4b2e00]' }
  }
  return { label: 'Average', className: 'bg-[#e8f5ff] text-[#0f172a]' }
}

function maskStudentName(studentId) {
  const id = String(studentId || '').trim()
  if (!id) return 'Unknown student'
  return `Student ${id.slice(-6).toUpperCase()}`
}

export default function InstructorStudentInsights() {
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [performanceMin, setPerformanceMin] = useState(0)
  const [performanceMax, setPerformanceMax] = useState(100)
  const [selectedStatuses, setSelectedStatuses] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [uploadSaving, setUploadSaving] = useState(false)

  const [dashboard, setDashboard] = useState(null)
  const [insightsSummary, setInsightsSummary] = useState({ total_students: 0, top_performers: 0, needs_support: 0 })
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [certificateCourseId, setCertificateCourseId] = useState('')
  const [certificateTitle, setCertificateTitle] = useState('')

  const certificateCourses = useMemo(() => {
    const list = Array.isArray(courses) ? courses : []
    return [...list]
      .filter((course) => Boolean(course?._id) && Boolean(course?.title))
      .sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')))
  }, [courses])

  const statusOptions = useMemo(() => {
    return ['top_performer', 'average', 'needs_support']
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const [insightsRes, dashboardRes, courseRes] = await Promise.all([
        api('/instructor/students/insights'),
        api('/instructor/dashboard'),
        api('/instructor/courses'),
      ])

      const studentsFromApi = Array.isArray(insightsRes?.students) ? insightsRes.students : []
      const normalizedStudents = studentsFromApi.map((item) => {
        const performance = Number(item?.performance || 0)
        const flag = normalizeFlag(item?.flag)
        return {
          student_id: item?.student_id || '',
          name: maskStudentName(item?.student_id),
          performance,
          flag,
        }
      })

      setInsightsSummary(insightsRes?.summary || { total_students: 0, top_performers: 0, needs_support: 0 })
      setStudents(normalizedStudents)
      setDashboard(dashboardRes || {})
      setCourses(Array.isArray(courseRes) ? courseRes : [])
    } catch (err) {
      setError(err?.message || 'Failed to load student insights')
      setInsightsSummary({ total_students: 0, top_performers: 0, needs_support: 0 })
      setStudents([])
      setDashboard(null)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchTerm.trim().toLowerCase()
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || String(s.student_id).toLowerCase().includes(q)
      const matchesPerf = s.performance >= performanceMin && s.performance <= performanceMax
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(s.flag)
      return matchesSearch && matchesPerf && matchesStatus
    })
  }, [students, searchTerm, performanceMin, performanceMax, selectedStatuses])

  const avgPerformance = useMemo(() => {
    if (students.length === 0) return 0
    const total = students.reduce((sum, s) => sum + Number(s.performance || 0), 0)
    return Math.round((total / students.length) * 100) / 100
  }, [students])

  const improvingCount = useMemo(() => {
    return students.filter((s) => s.performance >= 40 && s.performance < 80).length
  }, [students])

  const handleStatusToggle = (status) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
    } else {
      setSelectedStatuses([...selectedStatuses, status])
    }
  }

  const handleClearAll = () => {
    setPerformanceMin(0)
    setPerformanceMax(100)
    setSelectedStatuses([])
  }

  const handleApplyFilters = () => {
    setShowFilterModal(false)
  }

  const openCertificateModal = (student) => {
    setSelectedStudent(student)
    setUploadError('')
    // Auto-select the first course (or you can adjust logic to pick based on student)
    setCertificateCourseId(certificateCourses[0]?._id || '')
    setCertificateTitle('')
    setShowCertificateModal(true)
  }

  const closeCertificateModal = () => {
    setShowCertificateModal(false)
    setSelectedStudent(null)
    setUploadError('')
    setUploadSaving(false)
  }

  const handleUploadCertificate = async () => {
    if (!selectedStudent?.student_id || !certificateCourseId || !certificateTitle.trim()) {
      setUploadError('Please select course and certificate title.')
      return
    }

    setUploadSaving(true)
    setUploadError('')
    try {
      await api('/instructor/certificates', {
        method: 'POST',
        body: JSON.stringify({
          student_id: selectedStudent.student_id,
          course_id: certificateCourseId,
          title: certificateTitle.trim(),
        }),
      })
      closeCertificateModal()
    } catch (err) {
      setUploadError(err?.message || 'Failed to upload certificate')
      setUploadSaving(false)
    }
  }

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="bg-gradient-to-b flex h-full flex-col gap-[24px] from-[#f6f8fa] p-4 to-[#f7fcff] sm:p-6 lg:p-7">
        <section className="w-full shrink-0 rounded-[8px] border border-black/[0.08] border-solid bg-gradient-to-br from-white to-[#e8f5ff] px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-start">
            <div className="flex min-w-0 flex-1 flex-col gap-[11px] items-start">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#e8f5ff] text-[#0f172a]">
                  Instructor insights
                </span>
                <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#2dd4bf] text-[#023b33]">
                  {insightsSummary?.total_students || 0} tracked students
                </span>
              </div>
              <div className="text-[22px] font-bold leading-tight text-[#0f172a] sm:text-[26px] lg:text-[28px]">
                Student performance and engagement overview
              </div>
              <div className="text-[13px] leading-relaxed text-[#94a3b8] sm:text-[14px]">
                Live data from instructor insights API. Filters apply to real student performance records.
              </div>
              <div className="flex flex-col gap-2 text-[12px] text-[#94a3b8] sm:text-[13px] xl:flex-row xl:flex-wrap xl:gap-4">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4 text-[#5b3df6]" />
                  {insightsSummary?.total_students || 0} students in insights scope
                </span>
                <span>{insightsSummary?.top_performers || 0} top performers</span>
                <span>{insightsSummary?.needs_support || 0} need support</span>
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-[8px] border border-red-200 bg-red-50 p-4">
            <p className="text-[13px] text-red-700">{error}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-x-[16px] gap-y-[16px] xl:grid-cols-[repeat(2,minmax(0,1fr))]">
          <div className="bg-white border border-black/[0.08] rounded-[8px] p-[21px]">
            <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Student overview</h3>
            <p className="text-[13px] text-[#94a3b8] mt-[4px] mb-[16px]">Real metrics from students insights payload.</p>
            <div className="grid grid-cols-2 gap-[16px] lg:grid-cols-4">
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Students tracked</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">{insightsSummary?.total_students || 0}</div>
              </div>
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Needs support</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">{insightsSummary?.needs_support || 0}</div>
              </div>
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Top performers</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">{insightsSummary?.top_performers || 0}</div>
              </div>
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Average band</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">{improvingCount}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] rounded-[8px] p-[21px]">
            <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Class health</h3>
            <p className="text-[13px] text-[#94a3b8] mt-[4px] mb-[16px]">Derived from real student performance percentages.</p>
            <div className="text-[30px] font-bold text-[#0f172a] mb-[8px]">{avgPerformance}%</div>
            <div className="text-[12px] text-[#94a3b8] mb-[12px]">Overall performance across tracked students.</div>
            <div className="h-2 rounded-full bg-[#edf2ff] mb-[16px]">
              <div className="h-2 rounded-full bg-[#5b3df6]" style={{ width: `${Math.max(0, Math.min(100, avgPerformance))}%` }} />
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#f1f5f9] text-[#0f172a]">{dashboard?.tests || 0} tests</span>
              <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#2dd4bf] text-[#023b33]">{dashboard?.courses || 0} courses</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-[24px] gap-y-[24px]">
          <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
            <div className="px-[21px] pt-[21px] pb-[16px] flex justify-between items-start gap-4">
              <div>
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Student highlights</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Real-time student performance analytics.</p>
              </div>
              <div className="relative min-w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search student id..."
                  className="h-[36px] w-full rounded-[6px] border border-black/[0.08] pl-9 pr-3 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
              {loading ? (
                <div className="p-[16px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">
                  Loading students...
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-[16px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">
                  No students found for current filters.
                </div>
              ) : (
                filteredStudents.map((student) => {
                  const meta = flagMeta(student.flag)
                  return (
                    <div key={student.student_id} className="p-[16px] border border-black/[0.08] rounded-[6px]">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-10 w-10 rounded-full bg-[#ede7ff] flex items-center justify-center text-[13px] font-bold text-[#5b3df6]">
                            {student.name.slice(-2)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[14px] font-semibold text-[#0f172a] leading-snug">{student.name}</div>
                            <div className="text-[11px] text-[#94a3b8] mt-[2px]">ID: {student.student_id}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 text-[11px] text-[#64748b] sm:grid-cols-2 lg:mx-4 lg:grid-cols-3">
                          <div>Performance: {student.performance}%</div>
                          <div>Flag: {meta.label}</div>
                          <div>Source: test attempts</div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${meta.className}`}>
                              {meta.label}
                            </span>
                            <button
                              onClick={() => openCertificateModal(student)}
                              className="inline-flex h-[30px] items-center gap-1 rounded-[8px] border border-[#c7d2fe] bg-[#eef2ff] px-2.5 text-[11px] font-semibold text-[#4338ca]"
                            >
                              <Upload className="h-3.5 w-3.5" /> Upload Certificate
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[calc(100%-1.5rem)] max-h-[90vh] overflow-y-auto bg-white rounded-[8px] shadow-xl sm:w-[480px]">
            <div className="flex items-center justify-between p-5 border-b border-black/[0.08] sticky top-0 bg-white">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-[#5b3df6]" />
                <h2 className="text-[20px] font-bold text-[#0f172a]">Filter insights</h2>
              </div>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-[#94a3b8] hover:text-[#0f172a] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-[14px] font-semibold text-[#0f172a] mb-3">Performance range</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-[11px] text-[#94a3b8] block mb-1">Min</label>
                    <input
                      type="number"
                      value={performanceMin}
                      onChange={(e) => setPerformanceMin(Math.max(0, Math.min(100, Number(e.target.value || 0))))}
                      className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                      min="0"
                      max="100"
                    />
                  </div>
                  <span className="text-[13px] text-[#94a3b8]">-</span>
                  <div className="flex-1">
                    <label className="text-[11px] text-[#94a3b8] block mb-1">Max</label>
                    <input
                      type="number"
                      value={performanceMax}
                      onChange={(e) => setPerformanceMax(Math.max(0, Math.min(100, Number(e.target.value || 0))))}
                      className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[14px] font-semibold text-[#0f172a] mb-3">Student status</h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => {
                    const meta = flagMeta(status)
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusToggle(status)}
                        className={`px-3 py-1.5 rounded-[20px] text-[12px] font-medium transition-all ${
                          selectedStatuses.includes(status)
                            ? 'bg-[#5b3df6] text-white'
                            : `${meta.className} hover:opacity-80`
                        }`}
                      >
                        {meta.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex flex-col gap-3 p-5 border-t border-black/[0.08] bg-white sm:flex-row">
              <button
                onClick={handleClearAll}
                className="flex-1 h-10 border border-black/[0.08] rounded-[6px] text-[13px] font-medium text-[#64748b] hover:bg-gray-50 transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 h-10 bg-[#5b3df6] rounded-[6px] text-[13px] font-medium text-white hover:bg-[#4a2ed8] transition-colors"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}

      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[calc(100%-1.5rem)] max-h-[90vh] overflow-y-auto rounded-[8px] bg-white shadow-xl sm:w-[520px]">
            <div className="sticky top-0 flex items-center justify-between border-b border-black/[0.08] bg-white p-5">
              <h2 className="text-[20px] font-bold text-[#0f172a]">Upload Certificate</h2>
              <button onClick={closeCertificateModal} className="text-[#94a3b8] hover:text-[#0f172a] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-[6px] border border-black/[0.08] bg-[#f8fafc] px-3 py-2 text-[12px] text-[#334155]">
                Student: <span className="font-semibold text-[#0f172a]">{selectedStudent?.name || '-'}</span>
              </div>

              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#334155]">Course</label>
                <div className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 flex items-center bg-gray-50 text-[13px]">
                  {certificateCourses.find((c) => c._id === certificateCourseId)?.title || 'No course found'}
                </div>
                <p className="mt-1 text-[11px] text-[#94a3b8]">Only courses uploaded by you are shown here.</p>
              </div>

              <div>
                <label className="mb-1 block text-[12px] font-semibold text-[#334155]">Certificate title</label>
                <input
                  value={certificateTitle}
                  onChange={(e) => setCertificateTitle(e.target.value)}
                  className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]/30"
                  placeholder="e.g. Completion Certificate"
                />
              </div>

              {uploadError ? (
                <div className="rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">{uploadError}</div>
              ) : null}
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-black/[0.08] bg-white p-5">
              <button
                onClick={closeCertificateModal}
                className="h-10 rounded-[6px] border border-black/[0.08] px-4 text-[13px] font-medium text-[#64748b] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadCertificate}
                disabled={uploadSaving}
                className="h-10 rounded-[6px] bg-[#5b3df6] px-4 text-[13px] font-medium text-white hover:bg-[#4a2ed8] disabled:opacity-60"
              >
                {uploadSaving ? 'Uploading...' : 'Upload Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}