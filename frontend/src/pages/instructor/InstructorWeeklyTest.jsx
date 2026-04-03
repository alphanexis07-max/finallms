import React, { useState } from 'react'
import { PlusCircle, FileCheck, X, ChevronDown, Plus, HelpCircle, Trash2, Edit2, MoveUp, MoveDown, FileText, Users } from 'lucide-react'

export default function InstructorWeeklyTest() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [testTitle, setTestTitle] = useState('')
  const [testClass, setTestClass] = useState('Class 9')
  const [testSubject, setTestSubject] = useState('Science')
  const [description, setDescription] = useState('')
  const [publishImmediately, setPublishImmediately] = useState(true)
  const [deadlineDate, setDeadlineDate] = useState('')
  const [deadlineTime, setDeadlineTime] = useState('')
  const [duration, setDuration] = useState(45)
  const [attempts, setAttempts] = useState(1)
  const [shuffleQuestions, setShuffleQuestions] = useState(false)
  const [showResultsInstantly, setShowResultsInstantly] = useState(true)
  const [questions, setQuestions] = useState([])
  
  // Question form state
  const [questionType, setQuestionType] = useState('multiple-choice')
  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [points, setPoints] = useState(1)
  const [editingQuestionId, setEditingQuestionId] = useState(null)

  const tests = [
    ['Weekly MCQ test • Chemical reactions and equations', 'Saturday • 9:00 AM to 9:30 AM', 'A timed 25-question assessment covering balancing equations, reaction types, and concept-based application problems for this week chapter.', ['25 questions', '30 mins', 'Auto evaluation'], 'Scheduled', 'Open test setup'],
    ['Concept check • Separation techniques recap', 'Published yesterday • 10-minute quiz', 'Short recap quiz used after practical lab to confirm understanding of filtration, evaporation, sedimentation, and magnetic separation.', ['18 questions', 'Instant score', 'Retry enabled'], '92% attempted', 'View analytics'],
    ['Revision quiz • Matter and its states', 'Result published today • Retry window open till 5:00 PM', 'Revision assessment designed for absent learners and slow scorers, with randomized questions from first two chapters and answer review after submission.', ['32 attempts', 'Avg score 78%', 'Question bank'], 'Retake active', 'Review results'],
    ['Chapter assessment • Acids, bases, and salts', 'Scheduled on Monday • Performance summary ready', 'Comprehensive chapter test with MCQs, match-the-following, and short-answer responses used to identify students needing extra support in the next revision class.', ['41 questions', '84% class avg', '18 flagged learners'], 'Results shared', 'Open report'],
  ]

  const handleCreateTest = () => {
    console.log('Creating test:', {
      testTitle,
      testClass,
      testSubject,
      description,
      publishImmediately,
      deadlineDate,
      deadlineTime,
      duration,
      attempts,
      shuffleQuestions,
      showResultsInstantly,
      questions
    })
    setShowCreateModal(false)
    setTestTitle('')
    setTestClass('Class 9')
    setTestSubject('Science')
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
      options: questionType === 'multiple-choice' ? options : null,
      correctAnswer: correctAnswer,
      points: points
    }

    if (editingQuestionId) {
      setQuestions(questions.map(q => q.id === editingQuestionId ? newQuestion : q))
    } else {
      setQuestions([...questions, newQuestion])
    }
    setShowQuestionModal(false)
  }

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const handleMoveQuestion = (id, direction) => {
    const index = questions.findIndex(q => q.id === id)
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

  const addOption = () => {
    setOptions([...options, ''])
  }

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
  }

  const statusStyles = {
    'Scheduled': 'bg-[#ffd966] text-[#4b2e00]',
    '92% attempted': 'bg-[#2dd4bf] text-[#023b33]',
    'Retake active': 'bg-[#e8f5ff] text-[#0f172a]',
    'Results shared': 'bg-[#f1f5f9] text-[#64748b]'
  }

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="flex h-full flex-col gap-6 bg-gradient-to-b from-[#f6f8fa] to-[#f7fcff] p-4 sm:p-6 lg:p-7">
        {/* Hero Section */}
        <section className="relative w-full shrink-0 rounded-[8px] border border-black/[0.08] border-solid bg-gradient-to-br from-white to-[#e8f5ff] px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <div className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row">
            <div className="relative flex min-w-0 flex-1 flex-col items-start gap-[11px]">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#e8f5ff] text-[#0f172a]">Class 9 • Science</span>
                <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#ffd966] text-[#4b2e00]">Next test on Saturday</span>
              </div>
              <div className="text-[24px] font-bold leading-tight text-[#0f172a] sm:text-[28px]">
                Integrated Science Foundation • Weekly tests
              </div>
              <div className="text-[14px] leading-relaxed text-[#94a3b8]">
                Plan chapter-wise assessments, track student attempts, and review performance trends across MCQ tests, revision quizzes, and concept checks for the current science batch.
              </div>
              <div className="flex flex-wrap gap-4 text-[13px] text-[#94a3b8]">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4 text-[#5b3df6]" />
                  124 students assigned
                </span>
                <span>12 tests published</span>
                <span>84% average score</span>
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
              <button className="inline-flex h-[40px] items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-[17px] text-[14px] font-medium text-[#0f172a] transition-colors hover:bg-[#f1f5f9]">
                <FileText className="h-[18px] w-[18px]" />
                Export results
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="bg-white border border-black/[0.08] rounded-[8px] p-[21px]">
            <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Test overview</h3>
            <p className="text-[13px] text-[#94a3b8] mt-[4px] mb-[16px]">Monitor participation, average scores, and review turnaround for weekly assessments.</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-[16px]">
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Attempt rate</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">93%</div>
              </div>
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Class average</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">84%</div>
              </div>
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Pending review</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">18</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] rounded-[8px] p-[21px]">
            <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Assessment progress</h3>
            <p className="text-[13px] text-[#94a3b8] mt-[4px] mb-[16px]">Weekly tests cycle completed for this month.</p>
            <div className="text-[30px] font-bold text-[#0f172a] mb-[8px]">76%</div>
            <div className="h-2 rounded-full bg-[#edf2ff] mb-[16px]">
              <div className="h-2 w-[76%] rounded-full bg-[#5b3df6]" />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#f1f5f9] text-[#0f172a]">9 published</span>
              <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#2dd4bf] text-[#023b33]">3 pending</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)] xl:gap-x-6 xl:gap-y-6">
          {/* Upcoming and recent tests */}
          <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
            <div className="flex flex-col items-start justify-between gap-4 px-[21px] pb-[16px] pt-[21px] sm:flex-row">
              <div>
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Upcoming and recent tests</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Scheduled assessments, auto-graded quizzes, and recently published results.</p>
              </div>
              <button className="inline-flex h-[36px] items-center gap-1.5 rounded-[6px] border border-black/[0.08] bg-white px-[12px] text-[13px] font-medium text-[#0f172a] transition-colors hover:bg-[#f1f5f9]">
                All tests
              </button>
            </div>
            <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
              {tests.map(([title, time, desc, tags, status, cta], i) => (
                <div key={i} className="p-[16px] border border-black/[0.08] rounded-[6px]">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <FileCheck className="h-5 w-5 text-[#5b3df6] mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-semibold text-[#0f172a] leading-snug">{title}</div>
                          <div className="text-[12px] text-[#94a3b8] mt-[4px]">{time}</div>
                          <div className="text-[12px] text-[#94a3b8] mt-[4px] line-clamp-2">{desc}</div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {tags.map((tag, idx) => (
                              <span key={idx} className="inline-flex h-[24px] items-center px-[8px] rounded-[10px] text-[10px] font-medium bg-[#f1f5f9] text-[#64748b]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 lg:ml-4 lg:flex-shrink-0">
                      <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${statusStyles[status] || 'bg-[#f1f5f9] text-[#64748b]'}`}>
                        {status}
                      </span>
                      <button className="inline-flex h-[36px] items-center whitespace-nowrap rounded-[6px] border border-black/[0.08] bg-white px-[12px] text-[13px] font-medium text-[#0f172a] transition-colors hover:bg-[#f1f5f9]">
                        {cta}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-[24px]">
            {/* This week's checklist */}
            <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
              <div className="px-[21px] pt-[21px] pb-[16px]">
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">This week's checklist</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Tasks lined up for the weekly test cycle.</p>
              </div>
              <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
                {['Finalize question set', 'Verify answer key', 'Send test reminder'].map((task, i) => (
                  <div key={i} className="p-[16px] border border-black/[0.08] rounded-[6px]">
                    <div className="text-[14px] font-semibold text-[#0f172a]">{task}</div>
                    <div className="text-[12px] text-[#94a3b8] mt-[4px]">Pending action</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent result highlights */}
            <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
              <div className="px-[21px] pt-[21px] pb-[16px]">
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Recent result highlights</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Top trends from published tests this week.</p>
              </div>
              <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
                {['Separation techniques recap', 'Matter and its states revision', 'Acids, bases, and salts'].map((highlight, i) => (
                  <div key={i} className="p-[16px] border border-black/[0.08] rounded-[6px]">
                    <div className="text-[14px] font-semibold text-[#0f172a]">{highlight}</div>
                    <div className="text-[12px] text-[#94a3b8] mt-[4px]">Insights available</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Test Modal - Keep existing modal but update styling to match */}
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
              {/* Modal content remains the same as original */}
              {/* Basic Details Section */}
              <div>
                <h3 className="text-[16px] font-bold text-[#0f172a] mb-3">Basic details</h3>
                <p className="text-[12px] text-[#64748b] mb-4">Provide general information about this assessment.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">
                      Test title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={testTitle}
                      onChange={(e) => setTestTitle(e.target.value)}
                      placeholder="e.g., Chapter 4: Carbon and its compounds - Recap"
                      className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] placeholder:text-[#94a3b8]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Class</label>
                      <div className="relative">
                        <select
                          value={testClass}
                          onChange={(e) => setTestClass(e.target.value)}
                          className="w-full appearance-none rounded-[6px] border border-black/[0.08] bg-white px-3 py-2.5 text-[13px] text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] cursor-pointer"
                        >
                          <option>Class 9</option>
                          <option>Class 10</option>
                          <option>Class 11</option>
                          <option>Class 12</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Subject</label>
                      <div className="relative">
                        <select
                          value={testSubject}
                          onChange={(e) => setTestSubject(e.target.value)}
                          className="w-full appearance-none rounded-[6px] border border-black/[0.08] bg-white px-3 py-2.5 text-[13px] text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] cursor-pointer"
                        >
                          <option>Science</option>
                          <option>Math</option>
                          <option>English</option>
                          <option>History</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Description (Optional)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add instructions, topics covered, or any specific details for the students..."
                      rows="3"
                      className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] resize-none placeholder:text-[#94a3b8]"
                    />
                  </div>
                </div>
              </div>

              {/* Availability & Scheduling Section */}
              <div>
                <h3 className="text-[16px] font-bold text-[#0f172a] mb-3">Availability & Scheduling</h3>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input
                        type="checkbox"
                        checked={publishImmediately}
                        onChange={(e) => setPublishImmediately(e.target.checked)}
                        className="w-4 h-4 rounded border-black/[0.2] text-[#5b3df6] focus:ring-[#5b3df6]"
                      />
                      <span className="text-[13px] font-semibold text-[#0f172a]">Publish date</span>
                      <span className="text-[12px] text-[#94a3b8]">Immediately upon publish</span>
                    </label>
                  </div>

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

              {/* Questions Section */}
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
                <p className="text-[12px] text-[#64748b] mb-4">
                  Build your assessment by adding new questions or importing existing ones.
                </p>

                {questions.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-black/[0.08] rounded-[8px]">
                    <HelpCircle className="h-12 w-12 text-[#94a3b8] mx-auto mb-2" />
                    <p className="text-[13px] text-[#94a3b8]">No questions yet</p>
                    <p className="text-[11px] text-[#94a3b8] mt-1">
                      Start building your test by adding multiple choice, short answer, or essay questions.
                    </p>
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
                            {q.type === 'multiple-choice' && q.options && (
                              <div className="mt-2 space-y-1">
                                {q.options.map((opt, i) => (
                                  <div key={i} className="flex items-center gap-2 text-[11px] text-[#64748b]">
                                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                                      opt === q.correctAnswer ? 'bg-[#5b3df6] text-white' : 'border border-black/[0.2]'
                                    }`}>
                                      {opt === q.correctAnswer && '✓'}
                                    </span>
                                    <span>{opt || `Option ${String.fromCharCode(65 + i)}`}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleMoveQuestion(q.id, 'up')} className="p-1 text-[#94a3b8] hover:text-[#5b3df6]">
                              <MoveUp className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleMoveQuestion(q.id, 'down')} className="p-1 text-[#94a3b8] hover:text-[#5b3df6]">
                              <MoveDown className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleEditQuestion(q)} className="p-1 text-[#94a3b8] hover:text-[#5b3df6]">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteQuestion(q.id)} className="p-1 text-[#94a3b8] hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Settings */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={(e) => setShuffleQuestions(e.target.checked)}
                    className="w-4 h-4 rounded border-black/[0.2] text-[#5b3df6] focus:ring-[#5b3df6]"
                  />
                  <span className="text-[13px] font-semibold text-[#0f172a]">Shuffle questions</span>
                  <span className="text-[12px] text-[#94a3b8]">Randomize the question order for each student.</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showResultsInstantly}
                    onChange={(e) => setShowResultsInstantly(e.target.checked)}
                    className="w-4 h-4 rounded border-black/[0.2] text-[#5b3df6] focus:ring-[#5b3df6]"
                  />
                  <span className="text-[13px] font-semibold text-[#0f172a]">Show results instantly</span>
                  <span className="text-[12px] text-[#94a3b8]">Students can see their score right after submitting.</span>
                </label>
              </div>

              <div className="bg-[#f8fafc] rounded-[6px] p-3 border border-black/[0.08]">
                <div className="flex items-start gap-2">
                  <FileCheck className="h-4 w-4 text-[#5b3df6] mt-0.5" />
                  <div>
                    <p className="text-[12px] font-semibold text-[#0f172a]">Auto-evaluation</p>
                    <p className="text-[11px] text-[#64748b]">Automatically grade multiple-choice and true/false questions.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-black/[0.08] sticky bottom-0 bg-white">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 h-10 border border-black/[0.08] rounded-[6px] text-[13px] font-medium text-[#64748b] hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleCreateTest} className="flex-1 h-10 bg-[#5b3df6] rounded-[6px] text-[13px] font-medium text-white hover:bg-[#4a2ed8]">
                Create Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Modal - Keep existing but update styling */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-[8px] shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-black/[0.08] sticky top-0 bg-white">
              <h2 className="text-[20px] font-bold text-[#0f172a]">
                {editingQuestionId ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button onClick={() => setShowQuestionModal(false)} className="text-[#94a3b8] hover:text-[#0f172a]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Question Type */}
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

              {/* Question Text */}
              <div>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Question</label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter your question here..."
                  rows="3"
                  className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] resize-none"
                />
              </div>

              {/* Options for Multiple Choice */}
              {(questionType === 'multiple-choice') && (
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
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          className="flex-1 rounded-[6px] border border-black/[0.08] px-3 py-2 text-[12px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                        />
                        {idx > 1 && (
                          <button onClick={() => removeOption(idx)} className="text-[#94a3b8] hover:text-red-500">
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={addOption} className="text-[12px] text-[#5b3df6] hover:text-[#4a2ed8] flex items-center gap-1 mt-1">
                      <Plus className="h-3 w-3" /> Add option
                    </button>
                  </div>
                </div>
              )}

              {/* Correct Answer */}
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
                      {options.map((opt, idx) => opt && (
                        <option key={idx} value={opt}>{String.fromCharCode(65 + idx)}. {opt}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    placeholder="Enter the correct answer"
                    className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                  />
                )}
              </div>

              {/* Points */}
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
