import React, { useEffect, useMemo, useState } from 'react'
import { Search, Bell, Download, PlayCircle, ChevronRight, ChevronDown, ChevronUp, Lock, FileText, Link2, MessageSquare, Calendar, Pause, Volume2, Settings, Maximize2, Users, GraduationCap, Wallet, BarChart3, Upload, Plus, ThumbsUp, Flag, Reply, MoreHorizontal, Bookmark, Edit2, Trash2 } from 'lucide-react'

const HERO = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80'
const ENROLLED_COURSES_KEY = 'student-enrolled-courses'
const COURSE_PROGRESS_KEY = 'student-course-progress'

const DEFAULT_CONTINUE_COURSE = {
  id: 'default-accessibility-course',
  title: 'Advanced Accessibility for Designers',
  mentor: 'Marcus Chen',
  image: HERO,
  progressPct: 65,
  completedLessons: 24,
  totalLessons: 36,
  currentLesson: '4.2: Screen Readers and Semantic HTML',
  lastWatched: '15:45 / 45:00',
  moduleNum: 4,
}

function getCourseId(course) {
  return `${course?.title || 'course'}-${course?.mentor || 'mentor'}`
}

function readContinueLearningCourses() {
  if (typeof window === 'undefined') return [DEFAULT_CONTINUE_COURSE]

  try {
    const enrolledRaw = window.localStorage.getItem(ENROLLED_COURSES_KEY)
    const enrolled = enrolledRaw ? JSON.parse(enrolledRaw) : []
    const progressRaw = window.localStorage.getItem(COURSE_PROGRESS_KEY)
    const progressMap = progressRaw ? JSON.parse(progressRaw) : {}

    if (!Array.isArray(enrolled) || enrolled.length === 0) return [DEFAULT_CONTINUE_COURSE]

    const inProgressCourses = enrolled
      .map((course) => {
        const id = getCourseId(course)
        const progress = progressMap?.[id] || {}
        const progressPct = Number(progress?.progressPct ?? 35)

        return {
          id,
          title: course?.title || 'Untitled course',
          mentor: course?.mentor || 'Assigned mentor',
          image: course?.image || HERO,
          progressPct,
          completedLessons: Number(progress?.completedLessons ?? Math.max(1, Math.floor((progressPct / 100) * 30))),
          totalLessons: Number(progress?.totalLessons ?? 30),
          currentLesson: progress?.currentLesson || 'Continue from your last lesson',
          lastWatched: progress?.lastWatched || '10:20 / 38:00',
          moduleNum: Number(progress?.moduleNum ?? 4),
        }
      })
      .filter((course) => course.progressPct > 0 && course.progressPct < 100)

    return inProgressCourses.length > 0 ? inProgressCourses : [DEFAULT_CONTINUE_COURSE]
  } catch {
    return [DEFAULT_CONTINUE_COURSE]
  }
}

const modules = [
  { num: 1, title: 'Introduction to UI/UX', meta: '3 / 3 | 45 min', locked: false, open: false, lessons: [] },
  { num: 2, title: 'Typography Fundamentals', meta: '5 / 5 | 1h 20m', locked: false, open: false, lessons: [] },
  { num: 3, title: 'Color Theory & Systems', meta: '4 / 4 | 1h 05m', locked: false, open: false, lessons: [] },
  {
    num: 4, title: 'Designing for Accessibility', meta: '1 / 5 | 2h 15m', locked: false, open: true,
    lessons: [
      { id: '4.1', title: '4.1 Introduction to WCAG', type: 'Video', duration: '12:45', status: 'done' },
      { id: '4.2', title: '4.2 Screen Readers and Semantic HTML', type: 'Playing', duration: '15:45 / 45:00', status: 'playing' },
      { id: '4.3', title: '4.3 Color Contrast & Visuals', type: 'Video', duration: '25:10', status: 'locked' },
      { id: '4.4', title: '4.4 Keyboard Navigation', type: 'Video', duration: '18:30', status: 'locked' },
      { id: '4.5', title: 'Module 4 Quiz', type: 'Quiz', duration: '10 questions', status: 'locked' },
    ],
  },
  { num: 5, title: 'Advanced Prototyping', meta: '0 / 6 | 3h 00m', locked: true, open: false, lessons: [] },
]

const tabs = ['Overview', 'Q&A', 'Notes', 'Downloads']

// Mock data for Q&A
const discussions = [
  {
    id: 1,
    author: 'David Miller',
    authorAvatar: 'D',
    timeAgo: '2 days ago',
    content: 'Are ARIA attributes always necessary if I use semantic HTML?',
    details: 'The instructor mentioned that semantic HTML is preferred. Does this mean I should avoid ARIA attributes altogether if I’m using elements like `<nav>` and `<main>`?',
    replies: 3,
    repliesData: [
      {
        id: 101,
        author: 'Marcus Chen',
        authorRole: 'Instructor',
        authorAvatar: 'M',
        timeAgo: '1 day ago',
        content: 'Great question! Semantic HTML should always be your first choice. You only need ARIA attributes when native HTML elements cannot adequately describe the structure or behavior (like dynamic UI components).'
      }
    ],
    isFollowed: false,
    isReported: false
  },
  {
    id: 2,
    author: 'Sarah Jenkins',
    authorAvatar: 'S',
    timeAgo: '3 days ago',
    content: 'Testing with Screen Readers',
    details: 'Which screen readers are best for testing web accessibility on Windows and Mac?',
    replies: 0,
    repliesData: [],
    isFollowed: false,
    isReported: false
  },
  {
    id: 3,
    author: 'Michael Wong',
    authorAvatar: 'M',
    timeAgo: '5 days ago',
    content: 'Best practices for focus management?',
    details: 'What are the recommended approaches for managing focus when opening modals or dynamic content?',
    replies: 2,
    repliesData: [],
    isFollowed: false,
    isReported: false
  }
]

// Mock data for Notes
const notes = [
  {
    id: 1,
    content: 'Semantic HTML implies using native tags like `<nav>` and `<header>`. ARIA attributes should only be used as a fallback or for complex custom widgets where native tags fall short.',
    timestamp: 'Added today at 10:24 AM',
    timestampValue: '15:45'
  },
  {
    id: 2,
    content: 'Remember to check WCAG 2.1 AA guidelines when designing color palettes. Contrast ratio should be at least 4.5:1 for normal text and 3:1 for large text.',
    timestamp: 'Added 2 days ago',
    timestampValue: '22:30'
  },
  {
    id: 3,
    content: "Instructor's recommended screen readers:\n- NVDA for Windows (Free)\n- VoiceOver for Mac (Built-in)\n- JAWS for Windows (Enterprise)",
    timestamp: 'Added 2 days ago',
    timestampValue: '35:12'
  }
]

// Mock data for Downloads
const downloads = [
  { name: 'Semantic HTML Cheat Sheet', type: 'PDF Document', size: '2.4 MB', icon: 'pdf' },
  { name: 'Lesson Source Code', type: 'ZIP Archive', size: '5.1 MB', icon: 'zip' },
  { name: 'Presentation Slides', type: 'PPTX Document', size: '12.8 MB', icon: 'pptx' },
  { name: 'Audio Transcript', type: 'TXT File', size: '145 KB', icon: 'txt' }
]

export default function StudentContinueLearning() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [openModule, setOpenModule] = useState(4)
  const [newNote, setNewNote] = useState('')
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [showQuestionInput, setShowQuestionInput] = useState(false)
  const [localDiscussions, setLocalDiscussions] = useState(discussions)
  const [localNotes, setLocalNotes] = useState(notes)
  const [continueCourses, setContinueCourses] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState('')

  useEffect(() => {
    const courseList = readContinueLearningCourses()
    setContinueCourses(courseList)
    setSelectedCourseId(courseList[0]?.id || DEFAULT_CONTINUE_COURSE.id)
  }, [])

  const selectedCourse = useMemo(() => {
    return continueCourses.find((course) => course.id === selectedCourseId) || continueCourses[0] || DEFAULT_CONTINUE_COURSE
  }, [continueCourses, selectedCourseId])

  const progressWidth = `${Math.min(100, Math.max(0, selectedCourse.progressPct || 0))}%`

  const handleContinueLearning = (course) => {
    setSelectedCourseId(course.id)
    setActiveTab('Overview')
    setOpenModule(course.moduleNum || 4)

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      const newNoteObj = {
        id: localNotes.length + 1,
        content: newNote,
        timestamp: 'Added just now',
        timestampValue: '00:00'
      }
      setLocalNotes([newNoteObj, ...localNotes])
      setNewNote('')
      setShowNoteInput(false)
    }
  }

  const handleDeleteNote = (id) => {
    setLocalNotes(localNotes.filter(note => note.id !== id))
  }

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      const newQuestionObj = {
        id: localDiscussions.length + 1,
        author: 'You',
        authorAvatar: 'Y',
        timeAgo: 'Just now',
        content: newQuestion,
        details: '',
        replies: 0,
        repliesData: [],
        isFollowed: false,
        isReported: false
      }
      setLocalDiscussions([newQuestionObj, ...localDiscussions])
      setNewQuestion('')
      setShowQuestionInput(false)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div>
            <p className="text-[14px] text-[#0f172a] leading-relaxed">
              In this lesson, we dive deep into how screen readers interpret web interfaces. You'll learn the difference between structural HTML and visual styling, and why semantic HTML is the foundation of accessible web design. We'll also cover ARIA labels, roles, and when it's appropriate to use them over native elements.
            </p>
            <h2 className="mt-[24px] mb-[12px] text-[16px] font-bold text-[#0f172a]">Resources for this lesson</h2>
            <div className="space-y-[12px]">
              {downloads.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-[8px] border border-black/[0.08] p-[14px]">
                  <div className="flex items-center gap-[12px]">
                    <div className="h-[36px] w-[36px] rounded-[6px] bg-[#e8f5ff] flex items-center justify-center">
                      <FileText className="h-[16px] w-[16px] text-[#5b3df6]" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-[#0f172a]">{file.name}</div>
                      <div className="text-[11px] text-[#94a3b8]">{file.type} • {file.size}</div>
                    </div>
                  </div>
                  <button className="border border-black/[0.08] flex items-center gap-[8px] h-[36px] justify-center px-[14px] rounded-[6px] bg-white hover:bg-gray-50 transition-colors">
                    <Download className="h-[14px] w-[14px] text-[#5b3df6]" />
                    <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[#0f172a] text-[12px]">Download</div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'Q&A':
        return (
          <div>
            {/* Search and Ask Question */}
            <div className="mb-6 flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Search all questions..."
                  className="w-full pl-9 pr-3 py-2 border border-black/[0.08] rounded-[8px] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                />
              </div>
              <button
                onClick={() => setShowQuestionInput(!showQuestionInput)}
                className="px-4 py-2 bg-[#5b3df6] text-white text-[13px] font-medium rounded-[8px] hover:bg-[#4a2ed8] transition-colors"
              >
                Ask Question
              </button>
            </div>

            {/* New Question Input */}
            {showQuestionInput && (
              <div className="mb-6 p-4 border border-[#5b3df6] rounded-[8px] bg-[#faf9ff]">
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full p-3 border border-black/[0.08] rounded-[8px] text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                  rows="3"
                />
                <div className="mt-3 flex gap-2 justify-end">
                  <button
                    onClick={() => setShowQuestionInput(false)}
                    className="px-3 py-1.5 text-[12px] text-[#64748b] hover:bg-gray-100 rounded-[6px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 bg-[#5b3df6] text-white text-[12px] font-medium rounded-[6px] hover:bg-[#4a2ed8]"
                  >
                    Post Question
                  </button>
                </div>
              </div>
            )}

            {/* Discussions List */}
            <div className="space-y-4">
              {localDiscussions.map((discussion) => (
                <div key={discussion.id} className="border border-black/[0.08] rounded-[8px] p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#e8f5ff] flex items-center justify-center text-[12px] font-bold text-[#5b3df6] shrink-0">
                      {discussion.authorAvatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[13px] font-semibold text-[#0f172a]">{discussion.author}</span>
                        {discussion.author === 'Marcus Chen' && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-[#5b3df6] text-white rounded-full">Instructor</span>
                        )}
                        <span className="text-[11px] text-[#94a3b8]">{discussion.timeAgo}</span>
                      </div>
                      <h4 className="text-[14px] font-semibold text-[#0f172a] mt-1">{discussion.content}</h4>
                      {discussion.details && (
                        <p className="text-[12px] text-[#64748b] mt-1">{discussion.details}</p>
                      )}
                      
                      {/* Replies */}
                      {discussion.repliesData && discussion.repliesData.map((reply) => (
                        <div key={reply.id} className="mt-3 pl-4 border-l-2 border-[#5b3df6] bg-[#faf9ff] p-3 rounded-[6px]">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-[#ede7ff] flex items-center justify-center text-[10px] font-bold text-[#5b3df6]">
                              {reply.authorAvatar}
                            </div>
                            <span className="text-[12px] font-semibold text-[#0f172a]">{reply.author}</span>
                            {reply.authorRole && (
                              <span className="text-[9px] px-1.5 py-0.5 bg-[#5b3df6] text-white rounded-full">{reply.authorRole}</span>
                            )}
                            <span className="text-[10px] text-[#94a3b8]">{reply.timeAgo}</span>
                          </div>
                          <p className="text-[12px] text-[#0f172a] mt-1 ml-8">{reply.content}</p>
                        </div>
                      ))}
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 mt-3">
                        <button className="flex items-center gap-1 text-[11px] text-[#64748b] hover:text-[#5b3df6] transition-colors">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>Like</span>
                        </button>
                        <button className="flex items-center gap-1 text-[11px] text-[#64748b] hover:text-[#5b3df6] transition-colors">
                          <Reply className="h-3.5 w-3.5" />
                          <span>Reply</span>
                        </button>
                        <button className="flex items-center gap-1 text-[11px] text-[#64748b] hover:text-[#5b3df6] transition-colors">
                          <Bookmark className="h-3.5 w-3.5" />
                          <span>Follow</span>
                        </button>
                        {discussion.replies > 0 && (
                          <span className="text-[10px] text-[#94a3b8]">{discussion.replies} Replies</span>
                        )}
                      </div>
                    </div>
                    <button className="text-[#94a3b8] hover:text-[#5b3df6]">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'Notes':
        return (
          <div>
            {/* Add Note at Timestamp */}
            <div className="mb-6">
              <button
                onClick={() => setShowNoteInput(!showNoteInput)}
                className="flex items-center gap-2 text-[13px] text-[#5b3df6] hover:text-[#4a2ed8] font-medium"
              >
                <Plus className="h-4 w-4" />
                Add a note at 15:45
              </button>
              
              {showNoteInput && (
                <div className="mt-3 p-4 border border-[#5b3df6] rounded-[8px] bg-[#faf9ff]">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type your note here. Markdown is supported..."
                    className="w-full p-3 border border-black/[0.08] rounded-[8px] text-[13px] resize-none focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                    rows="4"
                  />
                  <div className="mt-3 flex gap-2 justify-end">
                    <button
                      onClick={() => setShowNoteInput(false)}
                      className="px-3 py-1.5 text-[12px] text-[#64748b] hover:bg-gray-100 rounded-[6px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNote}
                      className="px-3 py-1.5 bg-[#5b3df6] text-white text-[12px] font-medium rounded-[6px] hover:bg-[#4a2ed8]"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* My Notes List */}
            <h3 className="text-[14px] font-semibold text-[#0f172a] mb-3">My Notes ({localNotes.length})</h3>
            <div className="space-y-3">
              {localNotes.map((note) => (
                <div key={note.id} className="border border-black/[0.08] rounded-[8px] p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-[13px] text-[#0f172a] leading-relaxed whitespace-pre-wrap">{note.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-[#94a3b8]">{note.timestamp}</span>
                        {note.timestampValue && (
                          <span className="text-[10px] text-[#5b3df6]">at {note.timestampValue}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <button className="text-[#94a3b8] hover:text-[#5b3df6] transition-colors">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-[#94a3b8] hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'Downloads':
        return (
          <div>
            <h3 className="text-[14px] font-semibold text-[#0f172a] mb-4">Lesson Downloads (4)</h3>
            <div className="space-y-3">
              {downloads.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-[8px] border border-black/[0.08] p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-[8px] bg-[#e8f5ff] flex items-center justify-center">
                      <FileText className="h-5 w-5 text-[#5b3df6]" />
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#0f172a]">{file.name}</div>
                      <div className="text-[11px] text-[#94a3b8]">{file.type} • {file.size}</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 border border-black/[0.08] bg-white px-3 py-1.5 rounded-[6px] text-[12px] font-medium text-[#0f172a] hover:bg-gray-50 transition-colors">
                    <Download className="h-3.5 w-3.5 text-[#5b3df6]" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      {/* Main layout */}
      <div className="bg-gradient-to-b flex h-full flex-col gap-[24px] from-[#f6f8fa] p-4 to-[#f7fcff] sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 gap-x-[24px] gap-y-[24px] xl:grid-cols-[1fr_320px]">
          {/* Left: video + lesson info */}
          <div className="flex flex-col gap-[24px]">
            {/* Video player */}
            <div className="relative bg-black select-none rounded-[8px] overflow-hidden border border-black/[0.08]">
              <img src={selectedCourse.image || HERO} alt="lesson" className="h-[240px] w-full object-cover opacity-80 sm:h-[320px] lg:h-[450px]" />
              <div className="absolute inset-0 flex flex-col justify-between p-[24px]">
                <div className="flex-1 flex items-center justify-center">
                  <button className="h-[56px] w-[56px] rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/40 hover:bg-white/35 transition">
                    <PlayCircle className="h-[32px] w-[32px] text-white" />
                  </button>
                </div>
                <div className="space-y-[12px]">
                  <div className="relative h-[4px] rounded-full bg-white/30 cursor-pointer">
                    <div className="absolute left-0 top-0 h-[4px] rounded-full bg-[#5b3df6]" style={{ width: '35%' }} />
                    <div className="absolute top-1/2 -translate-y-1/2 h-[12px] w-[12px] rounded-full bg-white shadow-md" style={{ left: 'calc(35% - 6px)' }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[12px] text-white">
                      <button className="hover:opacity-80"><Pause className="h-[16px] w-[16px]" /></button>
                      <button className="hover:opacity-80"><Volume2 className="h-[16px] w-[16px]" /></button>
                      <span className="text-[12px] font-mono opacity-90">{selectedCourse.lastWatched || '15:45 / 45:00'}</span>
                    </div>
                    <div className="flex items-center gap-[12px] text-white">
                      <button className="hover:opacity-80"><Settings className="h-[16px] w-[16px]" /></button>
                      <button className="hover:opacity-80"><Maximize2 className="h-[16px] w-[16px]" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson header */}
            <div className="bg-white border border-black/[0.08] rounded-[8px] p-[24px]">
              <h1 className="text-[20px] font-bold text-[#0f172a]">{selectedCourse.currentLesson || 'Continue from your last lesson'}</h1>
              <div className="mt-[12px] flex flex-wrap items-center gap-[16px] text-[12px] text-[#94a3b8]">
                <div className="flex items-center gap-[8px]">
                  <div className="h-[28px] w-[28px] rounded-[6px] bg-[#e8f5ff] flex items-center justify-center text-[11px] font-bold text-[#5b3df6]">M</div>
                  <span className="font-medium text-[#0f172a]">{selectedCourse.mentor || 'Mentor'}</span>
                </div>
                <div className="flex items-center gap-[6px]"><Calendar className="h-[14px] w-[14px]" /> Updated Oct 12, 2023</div>
                <div className="flex items-center gap-[6px]"><MessageSquare className="h-[14px] w-[14px]" /> {localDiscussions.length} Discussions</div>
              </div>
              {/* Tabs */}
              <div className="mt-[16px] flex gap-[24px] overflow-x-auto border-b border-black/[0.08]">
                {tabs.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`pb-[12px] text-[13px] font-medium transition-colors border-b-2 ${activeTab === t ? 'border-[#5b3df6] text-[#5b3df6]' : 'border-transparent text-[#94a3b8] hover:text-[#0f172a]'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="mt-[20px]">
                {renderTabContent()}
              </div>
            </div>
          </div>

          {/* Right: Course Content sidebar */}
          <div className="bg-white border border-black/[0.08] rounded-[8px] overflow-y-auto flex flex-col">
            <div className="px-[20px] pt-[20px] pb-[16px] border-b border-black/[0.08]">
              <h2 className="font-bold text-[16px] text-[#0f172a]">Course Content</h2>
              <div className="mt-[12px] flex items-center justify-between text-[12px]">
                <span className="text-[#94a3b8]">Overall Progress</span>
                <span className="font-bold text-[#5b3df6]">{selectedCourse.progressPct}%</span>
              </div>
              <div className="mt-[8px] h-[6px] rounded-full bg-[#f1f5f9]">
                <div className="h-[6px] rounded-full bg-[#5b3df6]" style={{ width: progressWidth }} />
              </div>
              <p className="mt-[8px] text-[11px] text-[#94a3b8]">{selectedCourse.completedLessons} of {selectedCourse.totalLessons} lessons completed</p>
            </div>

            <div className="flex-1">
              {modules.map((mod) => (
                <div key={mod.num} className="border-b border-black/[0.08]">
                  <button
                    className="w-full flex items-start justify-between px-[20px] py-[14px] hover:bg-[#f8fafc] transition-colors text-left"
                    onClick={() => !mod.locked && setOpenModule(openModule === mod.num ? null : mod.num)}
                    disabled={mod.locked}
                  >
                    <div className="flex-1 pr-[8px]">
                      <div className="flex items-center gap-[8px]">
                        {mod.locked && <Lock className="h-[12px] w-[12px] text-[#cbd5e1] shrink-0 mt-[2px]" />}
                        <span className={`text-[13px] font-semibold leading-snug ${mod.locked ? 'text-[#94a3b8]' : 'text-[#0f172a]'}`}>
                          {mod.num}. {mod.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#94a3b8] mt-[4px] pl-[20px]">{mod.meta}</div>
                    </div>
                    {!mod.locked && (
                      openModule === mod.num
                        ? <ChevronUp className="h-[16px] w-[16px] text-[#94a3b8] shrink-0 mt-[2px]" />
                        : <ChevronDown className="h-[16px] w-[16px] text-[#94a3b8] shrink-0 mt-[2px]" />
                    )}
                  </button>

                  {openModule === mod.num && mod.lessons.length > 0 && (
                    <div className="pb-[8px] bg-[#fafbfc]">
                      {mod.lessons.map(lesson => (
                        <div
                          key={lesson.id}
                          className={`mx-[8px] mb-[6px] flex items-center gap-[12px] rounded-[6px] px-[12px] py-[10px] cursor-pointer ${lesson.status === 'playing' ? 'bg-[#f7f4ff] border border-[#5b3df6]' : 'hover:bg-white'}`}
                        >
                          <div className="shrink-0">
                            {lesson.status === 'done' && (
                              <div className="h-[20px] w-[20px] rounded-full bg-[#5b3df6] flex items-center justify-center">
                                <svg className="h-[10px] w-[10px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            {lesson.status === 'playing' && <PlayCircle className="h-[20px] w-[20px] text-[#5b3df6]" />}
                            {lesson.status === 'locked' && <Lock className="h-[14px] w-[14px] text-[#cbd5e1]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-[12px] font-medium leading-snug ${lesson.status === 'playing' ? 'text-[#5b3df6]' : lesson.status === 'locked' ? 'text-[#94a3b8]' : 'text-[#0f172a]'}`}>
                              {lesson.title}
                            </div>
                            <div className="text-[10px] text-[#94a3b8] mt-[2px]">{lesson.type} • {lesson.duration}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
