import React, { useEffect, useMemo, useState } from 'react'
import {
  PlusCircle,
  FileCheck,
  X,
  ChevronDown,
  Plus,
  HelpCircle,
  Trash2,
  Edit2,
  MoveUp,
  MoveDown,
  Users,
  RefreshCcw,
  AlertTriangle,
} from 'lucide-react'
import { api } from '../../lib/api'

function formatDateTime(value) {
  if (!value) return 'Not scheduled'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'Not scheduled'
  return d.toLocaleString()
}

function statusClass(status) {
  const map = {
    draft: 'bg-[#f1f5f9] text-[#64748b]',
    scheduled: 'bg-[#ffd966] text-[#4b2e00]',
    active: 'bg-[#2dd4bf] text-[#023b33]',
    closed: 'bg-[#e8f5ff] text-[#0f172a]',
  }
  return map[status] || 'bg-[#f1f5f9] text-[#64748b]'
}

export default function InstructorWeeklyTest() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showQuestionModal, setShowQuestionModal] = useState(false)

  const [testTitle, setTestTitle] = useState('')
  const [courseId, setCourseId] = useState('')
  const [testClass, setTestClass] = useState('')
  const [testSubject, setTestSubject] = useState('')
  const [description, setDescription] = useState('')
  const [publishImmediately, setPublishImmediately] = useState(true)
  const [deadlineDate, setDeadlineDate] = useState('')
  const [deadlineTime, setDeadlineTime] = useState('')
  const [duration, setDuration] = useState(45)
  const [attempts, setAttempts] = useState(1)
  const [shuffleQuestions, setShuffleQuestions] = useState(false)
  const [showResultsInstantly, setShowResultsInstantly] = useState(true)
  const [questions, setQuestions] = useState([])

  const [questionType, setQuestionType] = useState('multiple-choice')
  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [points, setPoints] = useState(1)
  const [editingQuestionId, setEditingQuestionId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [overview, setOverview] = useState({
    total_tests: 0,
    published_tests: 0,
    draft_or_scheduled_tests: 0,
    total_attempts: 0,
    average_score: 0,
  })
  const [tests, setTests] = useState([])
  const [courses, setCourses] = useState([])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const [overviewRes, testsRes, coursesRes] = await Promise.all([
        api('/instructor/weekly-tests/overview'),
        api('/instructor/tests'),
        api('/instructor/courses'),
      ])

      setOverview(overviewRes || {
        total_tests: 0,
        published_tests: 0,
        draft_or_scheduled_tests: 0,
        total_attempts: 0,
        average_score: 0,
      })
      setTests(Array.isArray(testsRes) ? testsRes : [])

      const loadedCourses = Array.isArray(coursesRes) ? coursesRes : []
      setCourses(loadedCourses)
      if (!courseId && loadedCourses.length > 0) {
        setCourseId(loadedCourses[0]._id)
      }
    } catch (err) {
      setError(err?.message || 'Failed to load weekly test data')
      setOverview({
        total_tests: 0,
        published_tests: 0,
        draft_or_scheduled_tests: 0,
        total_attempts: 0,
        average_score: 0,
      })
      setTests([])
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const progressPercent = useMemo(() => {
    if (!overview.total_tests) return 0
    return Math.round((overview.published_tests / overview.total_tests) * 100)
  }, [overview])

  const checklist = useMemo(() => {
    return [
      `${tests.filter((t) => t.status === 'draft').length} draft tests pending publish`,
      `${tests.filter((t) => t.status === 'scheduled').length} scheduled tests`,
      `${tests.filter((t) => t.status === 'active').length} active tests running`,
    ]
  }, [tests])

  const topHighlights = useMemo(() => {
    return [...tests]
      .sort((a, b) => Number(b.average_score || 0) - Number(a.average_score || 0))
      .slice(0, 3)
  }, [tests])

  const resetForm = () => {
    setTestTitle('')
    setTestClass('')
    setTestSubject('')
    setDescription('')
    setPublishImmediately(true)
    setDeadlineDate('')
    setDeadlineTime('')
    setDuration(45)
    setAttempts(1)
    setShuffleQuestions(false)
    setShowResultsInstantly(true)
    setQuestions([])
  }

  const handleCreateTest = async () => {
    if (!testTitle.trim()) {
      setError('Test title is required')
      return
    }
    const effectiveCourseId = courseId || courses[0]?._id || ''
    if (!effectiveCourseId) {
      setError('No course found. Please create a course first.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const deadlineAt = deadlineDate
        ? new Date(`${deadlineDate}T${deadlineTime || '23:59'}:00`).toISOString()
        : null

      const created = await api('/instructor/tests', {
        method: 'POST',
        body: JSON.stringify({
          title: testTitle.trim(),
          course_id: effectiveCourseId,
          duration: Number(duration) || 45,
          total_questions: questions.length,
          scheduled_at: new Date().toISOString(),
          description: description.trim() || null,
          class_name: testClass.trim() || null,
          subject: testSubject.trim() || null,
          deadline_at: deadlineAt,
          attempts_allowed: Number(attempts) || 1,
          shuffle_questions: !!shuffleQuestions,
          show_results_instantly: !!showResultsInstantly,
          is_published: !!publishImmediately,
        }),
      })

      const testId = created?._id || created?.id
      if (testId && questions.length > 0) {
        for (let index = 0; index < questions.length; index += 1) {
          const q = questions[index]
          await api('/instructor/questions', {
            method: 'POST',
            body: JSON.stringify({
              test_id: testId,
              question: q.text,
              options: q.type === 'multiple-choice' ? (q.options || []).filter(Boolean) : [],
              correct_answer: q.correctAnswer || '',
              points: Number(q.points) || 1,
              question_type: q.type,
              order: index,
            }),
          })
        }
      }

      setShowCreateModal(false)
      resetForm()
      await loadData()
    } catch (err) {
      setError(err?.message || 'Failed to create test')
    } finally {
      setSaving(false)
    }
  }

  const handleAddQuestion = () => {
    setEditingQuestionId(null)
    setQuestionType('multiple-choice')
    setQuestionText('')
    setOptions(['', '', '', ''])
    setCorrectAnswer('')
    setPoints(1)
    setShowQuestionModal(true)
  }

  const handleEditQuestion = (question) => {
    setEditingQuestionId(question.id)
    setQuestionType(question.type)
    setQuestionText(question.text)
    setOptions(question.options || ['', '', '', ''])
    setCorrectAnswer(question.correctAnswer || '')
    setPoints(question.points)
    setShowQuestionModal(true)
  }

  const handleSaveQuestion = () => {
    const newQuestion = {
      id: editingQuestionId || Date.now(),
      type: questionType,
      text: questionText,
      options: questionType === 'multiple-choice' ? options : [],
      correctAnswer,
      points,
    }

    if (editingQuestionId) {
      setQuestions(questions.map((q) => (q.id === editingQuestionId ? newQuestion : q)))
    } else {
      setQuestions([...questions, newQuestion])
    }
    setShowQuestionModal(false)
  }

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleMoveQuestion = (id, direction) => {
    const index = questions.findIndex((q) => q.id === id)
    if (direction === 'up' && index > 0) {
      const newQuestions = [...questions]
      ;[newQuestions[index - 1], newQuestions[index]] = [newQuestions[index], newQuestions[index - 1]]
      setQuestions(newQuestions)
    } else if (direction === 'down' && index < questions.length - 1) {
      const newQuestions = [...questions]
      ;[newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]]
      setQuestions(newQuestions)
    }
  }

  const handleUpdateOption = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => setOptions([...options, ''])
  const removeOption = (index) => setOptions(options.filter((_, i) => i !== index))

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="flex h-full flex-col gap-6 bg-gradient-to-b from-[#f6f8fa] to-[#f7fcff] p-4 sm:p-6 lg:p-7">
        <section className="relative w-full shrink-0 rounded-[8px] border border-black/[0.08] border-solid bg-gradient-to-br from-white to-[#e8f5ff] px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <div className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row">
            <div className="relative flex min-w-0 flex-1 flex-col items-start gap-[11px]">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#e8f5ff] text-[#0f172a]">
                  Real DB data
                </span>
                <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#ffd966] text-[#4b2e00]">
                  {overview.total_tests} total tests
                </span>
              </div>
              <div className="text-[24px] font-bold leading-tight text-[#0f172a] sm:text-[28px]">Weekly tests</div>
              <div className="text-[14px] leading-relaxed text-[#94a3b8]">
                Plan assessments, track attempts, and monitor outcomes from live API records.
              </div>
              <div className="flex flex-wrap gap-4 text-[13px] text-[#94a3b8]">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4 text-[#5b3df6]" />
                  {overview.total_attempts} total attempts
                </span>
                <span>{overview.published_tests} tests published</span>
                <span>{overview.average_score}% average score</span>
              </div>
            </div>
            <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:justify-end">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex h-[40px] items-center gap-2 rounded-[6px] bg-[#5b3df6] px-[16px] text-[14px] font-medium text-white transition-colors hover:bg-[#4c2dd9]"
              >
                <PlusCircle className="h-[18px] w-[18px]" />
                Create test
              </button>
              <button
                onClick={loadData}
                className="inline-flex h-[40px] items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-[17px] text-[14px] font-medium text-[#0f172a] transition-colors hover:bg-[#f1f5f9]"
              >
                <RefreshCcw className="h-[18px] w-[18px]" />
                Refresh
              </button>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <p className="text-[13px] text-red-700">{error}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="bg-white border border-black/[0.08] rounded-[8px] p-[21px]">
            <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Test overview</h3>
            <p className="text-[13px] text-[#94a3b8] mt-[4px] mb-[16px]">Live summary from weekly tests API.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-[16px]">
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Total tests</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">{overview.total_tests}</div>
              </div>
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Average score</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">{overview.average_score}%</div>
              </div>
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Attempts</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">{overview.total_attempts}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] rounded-[8px] p-[21px]">
            <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Assessment progress</h3>
            <p className="text-[13px] text-[#94a3b8] mt-[4px] mb-[16px]">Published tests out of total.</p>
            <div className="text-[30px] font-bold text-[#0f172a] mb-[8px]">{progressPercent}%</div>
            <div className="h-2 rounded-full bg-[#edf2ff] mb-[16px]">
              <div className="h-2 rounded-full bg-[#5b3df6]" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#f1f5f9] text-[#0f172a]">
                {overview.published_tests} published
              </span>
              <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#2dd4bf] text-[#023b33]">
                {overview.draft_or_scheduled_tests} draft/scheduled
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)] xl:gap-x-6 xl:gap-y-6">
          <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
            <div className="flex flex-col items-start justify-between gap-4 px-[21px] pb-[16px] pt-[21px] sm:flex-row">
              <div>
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Upcoming and recent tests</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Live tests from database.</p>
              </div>
            </div>
            <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
              {loading ? (
                <div className="p-[16px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">Loading tests...</div>
              ) : tests.length === 0 ? (
                <div className="p-[16px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">No tests created yet.</div>
              ) : (
                tests.map((test) => (
                  <div key={test._id || test.id} className="p-[16px] border border-black/[0.08] rounded-[6px]">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <FileCheck className="h-5 w-5 text-[#5b3df6] mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-[14px] font-semibold text-[#0f172a] leading-snug">{test.title}</div>
                            <div className="text-[12px] text-[#94a3b8] mt-[4px]">{formatDateTime(test.scheduled_at)}</div>
                            <div className="text-[12px] text-[#94a3b8] mt-[4px] line-clamp-2">{test.description || 'No description'}</div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              <span className="inline-flex h-[24px] items-center px-[8px] rounded-[10px] text-[10px] font-medium bg-[#f1f5f9] text-[#64748b]">{test.total_questions || 0} questions</span>
                              <span className="inline-flex h-[24px] items-center px-[8px] rounded-[10px] text-[10px] font-medium bg-[#f1f5f9] text-[#64748b]">{test.duration || 0} mins</span>
                              <span className="inline-flex h-[24px] items-center px-[8px] rounded-[10px] text-[10px] font-medium bg-[#f1f5f9] text-[#64748b]">{test.attempts_count || 0} attempts</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 lg:ml-4 lg:flex-shrink-0">
                        <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${statusClass(test.status)}`}>
                          {test.status || 'draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[24px]">
            <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
              <div className="px-[21px] pt-[21px] pb-[16px]">
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">This week's checklist</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Derived from real test statuses.</p>
              </div>
              <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
                {checklist.map((task) => (
                  <div key={task} className="p-[16px] border border-black/[0.08] rounded-[6px]">
                    <div className="text-[14px] font-semibold text-[#0f172a]">{task}</div>
                    <div className="text-[12px] text-[#94a3b8] mt-[4px]">Auto generated</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
              <div className="px-[21px] pt-[21px] pb-[16px]">
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Recent result highlights</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Top scoring tests from real attempts.</p>
              </div>
              <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
                {topHighlights.length === 0 ? (
                  <div className="p-[16px] border border-black/[0.08] rounded-[6px] text-[13px] text-[#94a3b8]">No highlights available yet.</div>
                ) : (
                  topHighlights.map((item) => (
                    <div key={item._id || item.title} className="p-[16px] border border-black/[0.08] rounded-[6px]">
                      <div className="text-[14px] font-semibold text-[#0f172a]">{item.title}</div>
                      <div className="text-[12px] text-[#94a3b8] mt-[4px]">{item.average_score || 0}% average score</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[95vw] max-w-[680px] max-h-[90vh] overflow-y-auto bg-white rounded-[8px] shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-black/[0.08] sticky top-0 bg-white">
              <h2 className="text-[20px] font-bold text-[#0f172a]">Create new test</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-[#94a3b8] hover:text-[#0f172a] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <h3 className="text-[16px] font-bold text-[#0f172a] mb-3">Basic details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Test title</label>
                    <input
                      type="text"
                      value={testTitle}
                      onChange={(e) => setTestTitle(e.target.value)}
                      className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Class</label>
                      <input
                        type="text"
                        value={testClass}
                        onChange={(e) => setTestClass(e.target.value)}
                        className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Subject</label>
                      <input
                        type="text"
                        value={testSubject}
                        onChange={(e) => setTestSubject(e.target.value)}
                        className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Description (Optional)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] resize-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[16px] font-bold text-[#0f172a] mb-3">Availability & Scheduling</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={publishImmediately}
                      onChange={(e) => setPublishImmediately(e.target.checked)}
                      className="w-4 h-4 rounded border-black/[0.2] text-[#5b3df6] focus:ring-[#5b3df6]"
                    />
                    <span className="text-[13px] font-semibold text-[#0f172a]">Publish immediately</span>
                  </label>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Deadline</label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="date"
                        value={deadlineDate}
                        onChange={(e) => setDeadlineDate(e.target.value)}
                        className="flex-1 rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                      />
                      <input
                        type="time"
                        value={deadlineTime}
                        onChange={(e) => setDeadlineTime(e.target.value)}
                        className="flex-1 rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Duration</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(Number(e.target.value))}
                          className="flex-1 rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                          min="1"
                        />
                        <span className="text-[13px] text-[#64748b]">mins</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Attempts</label>
                      <input
                        type="number"
                        value={attempts}
                        onChange={(e) => setAttempts(Number(e.target.value))}
                        className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[16px] font-bold text-[#0f172a]">Questions</h3>
                  <button
                    onClick={handleAddQuestion}
                    className="inline-flex items-center gap-1 text-[12px] text-[#5b3df6] hover:text-[#4a2ed8]"
                  >
                    <Plus className="h-4 w-4" />
                    Add question
                  </button>
                </div>

                {questions.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-black/[0.08] rounded-[8px]">
                    <HelpCircle className="h-12 w-12 text-[#94a3b8] mx-auto mb-2" />
                    <p className="text-[13px] text-[#94a3b8]">No questions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="bg-[#fafcff] border border-black/[0.08] rounded-[6px] p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[11px] font-medium text-[#5b3df6] bg-[#ede7ff] px-2 py-0.5 rounded-full">
                                Q{idx + 1}
                              </span>
                              <span className="text-[11px] text-[#94a3b8]">{q.points} point{q.points !== 1 ? 's' : ''}</span>
                            </div>
                            <p className="text-[13px] font-medium text-[#0f172a]">{q.text}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleMoveQuestion(q.id, 'up')} className="p-1 text-[#94a3b8] hover:text-[#5b3df6]"><MoveUp className="h-4 w-4" /></button>
                            <button onClick={() => handleMoveQuestion(q.id, 'down')} className="p-1 text-[#94a3b8] hover:text-[#5b3df6]"><MoveDown className="h-4 w-4" /></button>
                            <button onClick={() => handleEditQuestion(q)} className="p-1 text-[#94a3b8] hover:text-[#5b3df6]"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => handleDeleteQuestion(q.id)} className="p-1 text-[#94a3b8] hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                    className="w-4 h-4 rounded border-black/[0.2] text-[#5b3df6] focus:ring-[#5b3df6]"
                  />
                  <span className="text-[13px] font-semibold text-[#0f172a]">Shuffle questions</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showResultsInstantly}
                    onChange={(e) => setShowResultsInstantly(e.target.checked)}
                    className="w-4 h-4 rounded border-black/[0.2] text-[#5b3df6] focus:ring-[#5b3df6]"
                  />
                  <span className="text-[13px] font-semibold text-[#0f172a]">Show results instantly</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-black/[0.08] sticky bottom-0 bg-white">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 h-10 border border-black/[0.08] rounded-[6px] text-[13px] font-medium text-[#64748b] hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleCreateTest}
                disabled={saving}
                className="flex-1 h-10 bg-[#5b3df6] rounded-[6px] text-[13px] font-medium text-white hover:bg-[#4a2ed8] disabled:opacity-60"
              >
                {saving ? 'Creating...' : 'Create Test'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-[8px] shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-black/[0.08] sticky top-0 bg-white">
              <h2 className="text-[20px] font-bold text-[#0f172a]">
                {editingQuestionId ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button onClick={() => setShowQuestionModal(false)} className="text-[#94a3b8] hover:text-[#0f172a]"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Question Type</label>
                <div className="relative">
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full appearance-none rounded-[6px] border border-black/[0.08] bg-white px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="short-answer">Short Answer</option>
                    <option value="essay">Essay</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Question</label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows="3"
                  className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] resize-none"
                />
              </div>

              {questionType === 'multiple-choice' && (
                <div>
                  <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Answer Options</label>
                  <div className="space-y-2">
                    {options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 text-[12px] font-medium text-[#94a3b8]">{String.fromCharCode(65 + idx)}.</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdateOption(idx, e.target.value)}
                          className="flex-1 rounded-[6px] border border-black/[0.08] px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                        />
                        {idx > 1 && (
                          <button onClick={() => removeOption(idx)} className="text-[#94a3b8] hover:text-red-500"><X className="h-4 w-4" /></button>
                        )}
                      </div>
                    ))}
                    <button onClick={addOption} className="text-[12px] text-[#5b3df6] hover:text-[#4a2ed8] flex items-center gap-1 mt-1">
                      <Plus className="h-3 w-3" /> Add option
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Correct Answer</label>
                {questionType === 'multiple-choice' ? (
                  <div className="relative">
                    <select
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      className="w-full appearance-none rounded-[6px] border border-black/[0.08] bg-white px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                    >
                      <option value="">Select correct answer</option>
                      {options.map((opt, idx) => (
                        <option key={idx} value={opt} disabled={!opt.trim()}>
                          {opt.trim() ? `${String.fromCharCode(65 + idx)}. ${opt}` : `${String.fromCharCode(65 + idx)}. (empty)`}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                  />
                )}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Points</label>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  min="1"
                  className="w-24 rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                />
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-black/[0.08] sticky bottom-0 bg-white">
              <button onClick={() => setShowQuestionModal(false)} className="flex-1 h-10 border border-black/[0.08] rounded-[6px] text-[13px] font-medium text-[#64748b] hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSaveQuestion} className="flex-1 h-10 bg-[#5b3df6] rounded-[6px] text-[13px] font-medium text-white hover:bg-[#4a2ed8]">
                {editingQuestionId ? 'Update Question' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
