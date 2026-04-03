import React, { useEffect, useState } from 'react'
import { BookOpen, Clock, Star, User, PlayCircle, CheckCircle2, X } from 'lucide-react'

const ENROLLED_COURSES_KEY = 'student-enrolled-courses'
const COURSE_PROGRESS_KEY = 'student-course-progress'
const COURSE_CERTIFICATES_KEY = 'student-course-certificates'
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80'

function getCourseId(course) {
	return `${course?.title || 'course'}-${course?.mentor || 'mentor'}`
}

function readEnrolledCourses() {
	if (typeof window === 'undefined') return []

	try {
		const raw = window.localStorage.getItem(ENROLLED_COURSES_KEY)
		const parsed = raw ? JSON.parse(raw) : []
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

function formatDate(value) {
	if (!value) return 'Recently enrolled'

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return 'Recently enrolled'

	return date.toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
}

function getTags(course) {
	if (Array.isArray(course?.tags) && course.tags.length > 0) return course.tags
	return ['Enrolled']
}

function buildLearningContent(course) {
	const fallbackModules = [
		{
			title: 'Module 1 - Fundamentals',
			videos: ['Introduction and goals', 'Core concepts walkthrough', 'Quick practice task'],
		},
		{
			title: 'Module 2 - Applied Learning',
			videos: ['Project setup', 'Hands-on implementation', 'Mentor review checkpoints'],
		},
		{
			title: 'Module 3 - Final Track',
			videos: ['Capstone briefing', 'Submission guidelines', 'Certificate roadmap'],
		},
	]

	if (!Array.isArray(course?.meta) || course.meta.length === 0) return fallbackModules

	return course.meta.slice(0, 3).map((item, index) => ({
		title: `Module ${index + 1} - ${item}`,
		videos: [
			`${course?.title || 'Course'} lesson ${index * 3 + 1}`,
			`${course?.title || 'Course'} lesson ${index * 3 + 2}`,
			`${course?.title || 'Course'} lesson ${index * 3 + 3}`,
		],
	}))
}

function LearningModal({ course, onClose }) {
	if (!course) return null

	const modules = buildLearningContent(course)
	const [activeModuleIndex, setActiveModuleIndex] = useState(0)
	const [activeVideoIndex, setActiveVideoIndex] = useState(0)

	const activeModule = modules[activeModuleIndex]
	const activeVideo = activeModule?.videos?.[activeVideoIndex]

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-4" onClick={onClose}>
			<div
				className="relative flex w-full max-w-[1100px] max-h-[calc(100vh-32px)] flex-col overflow-hidden rounded-[20px] border border-black/[0.08] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.3)]"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex items-center justify-between border-b border-black/[0.08] px-5 py-4 sm:px-6">
					<div>
						<span className="inline-flex h-[28px] items-center rounded-[10px] bg-[#e8f5ff] px-3 text-[11px] font-medium text-[#2563eb]">
							Learning started
						</span>
						<h2 className="mt-2 text-[22px] font-bold text-[#0f172a]">{course?.title || 'Course'}</h2>
						<p className="mt-1 text-[13px] text-[#64748b]">Modules aur videos load ho gaye hain. Aap learning continue kar sakte ho.</p>
					</div>
					<button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
						<X className="h-5 w-5 text-[#94a3b8]" />
					</button>
				</div>

				<div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
					<div className="min-h-0 overflow-y-auto border-b border-black/[0.08] bg-[#fafcff] p-4 sm:p-5 lg:border-b-0 lg:border-r">
						<h3 className="text-[15px] font-bold text-[#0f172a]">Course Modules</h3>
						<div className="mt-3 space-y-2">
							{modules.map((module, moduleIndex) => (
								<button
									key={module.title}
									type="button"
									onClick={() => {
										setActiveModuleIndex(moduleIndex)
										setActiveVideoIndex(0)
									}}
									className={`w-full rounded-[12px] border px-3 py-3 text-left transition ${
										moduleIndex === activeModuleIndex ? 'border-[#5b3df6] bg-[#f7f4ff]' : 'border-black/[0.08] bg-white hover:bg-gray-50'
									}`}
								>
									<p className="text-[13px] font-semibold text-[#0f172a]">{module.title}</p>
									<p className="mt-1 text-[11px] text-[#64748b]">{module.videos.length} videos</p>
								</button>
							))}
						</div>
					</div>

					<div className="min-h-0 overflow-y-auto p-4 sm:p-6">
						<div className="rounded-[16px] border border-black/[0.08] bg-white p-4">
							<p className="text-[12px] text-[#94a3b8]">Now learning</p>
							<h3 className="mt-1 text-[18px] font-bold text-[#0f172a]">{activeModule?.title}</h3>
							<div className="mt-3 inline-flex items-center gap-2 rounded-[10px] bg-[#ecfdf3] px-3 py-1 text-[12px] font-medium text-[#065f46]">
								<CheckCircle2 className="h-4 w-4" />
								Learning Started
							</div>
						</div>

						<div className="mt-4 rounded-[16px] border border-black/[0.08] bg-white p-4">
							<h4 className="text-[14px] font-bold text-[#0f172a]">All Videos</h4>
							<div className="mt-3 space-y-2">
								{activeModule?.videos?.map((video, videoIndex) => (
									<button
										key={video}
										type="button"
										onClick={() => setActiveVideoIndex(videoIndex)}
										className={`flex w-full items-center justify-between rounded-[12px] border px-3 py-3 text-left transition ${
											videoIndex === activeVideoIndex ? 'border-[#5b3df6] bg-[#f7f4ff]' : 'border-black/[0.08] bg-[#fafcff] hover:bg-gray-50'
										}`}
									>
										<div className="flex items-center gap-2">
											<PlayCircle className={`h-4 w-4 ${videoIndex === activeVideoIndex ? 'text-[#5b3df6]' : 'text-[#64748b]'}`} />
											<span className="text-[13px] font-medium text-[#0f172a]">{video}</span>
										</div>
										<span className="text-[11px] text-[#64748b]">8:00 min</span>
									</button>
								))}
							</div>
						</div>

						<div className="mt-4 rounded-[16px] border border-[#ffd966] bg-[#fff8e7] p-4">
							<p className="text-[13px] font-semibold text-[#4b2e00]">Playing now</p>
							<p className="mt-1 text-[12px] text-[#6b4b00]">{activeVideo || 'Select a video to start learning.'}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function StudentMyCourses() {
	const [courses, setCourses] = useState([])
	const [learningCourse, setLearningCourse] = useState(null)
	const [courseProgress, setCourseProgress] = useState({})
	const [courseCertificates, setCourseCertificates] = useState({})

	useEffect(() => {
		setCourses(readEnrolledCourses())

		if (typeof window !== 'undefined') {
			try {
				const progressRaw = window.localStorage.getItem(COURSE_PROGRESS_KEY)
				const certificateRaw = window.localStorage.getItem(COURSE_CERTIFICATES_KEY)
				setCourseProgress(progressRaw ? JSON.parse(progressRaw) : {})
				setCourseCertificates(certificateRaw ? JSON.parse(certificateRaw) : {})
			} catch {
				setCourseProgress({})
				setCourseCertificates({})
			}
		}
	}, [])

	return (
		<div className="min-h-full bg-[#F7FAFD]">
			<div className="bg-gradient-to-b from-[#f6f8fa] to-[#f7fcff] p-4 sm:p-6 lg:p-7">
				<section className="rounded-[8px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] px-4 py-5 sm:px-6 sm:py-6">
					<span className="inline-flex h-[28px] items-center rounded-[12px] bg-[#ffd966] px-[10px] text-[12px] font-medium text-[#4b2e00]">
						Student Dashboard
					</span>
					<h1 className="mt-3 text-[24px] font-bold leading-tight text-[#0f172a] sm:text-[30px]">My Courses</h1>
					<p className="mt-2 max-w-[760px] text-[14px] text-[#64748b]">
						Yahan aapke saare enrolled courses cards me dikh rahe hain. Checkout successful hone ke baad course automatically yahin add ho jayega.
					</p>
					<div className="mt-4 inline-flex h-[36px] items-center rounded-[12px] border border-black/[0.08] bg-white px-[16px] text-[12px] font-medium text-[#0f172a]">
						Total enrolled courses: {courses.length}
					</div>
				</section>

				<section className="mt-6 rounded-[8px] border border-black/[0.08] bg-white p-4 sm:p-5">
					<div className="mb-4 flex items-center justify-between gap-3">
						<h2 className="text-[20px] font-bold text-[#0f172a]">Enrolled Courses</h2>
						<span className="inline-flex items-center rounded-[10px] bg-[#e8f5ff] px-3 py-1 text-[11px] font-medium text-[#2563eb]">
							{courses.length} active
						</span>
					</div>

					{courses.length > 0 ? (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
							{courses.map((course, index) => (
								<article key={`${course?.title || 'course'}-${index}`} className="overflow-hidden rounded-[16px] border border-black/[0.08] bg-[#fafcff]">
									<img
										src={course?.image || FALLBACK_IMAGE}
										alt={course?.title || 'Course'}
										className="h-[170px] w-full object-cover"
									/>

									{(() => {
										const courseId = getCourseId(course)
										const progress = Number(courseProgress?.[courseId]?.progressPct ?? 0)
										const isCompleted = progress >= 100
										const certificateEntry = courseCertificates?.[courseId]
										const certificateUrl = typeof certificateEntry === 'string' ? certificateEntry : certificateEntry?.url

										return (
									<div className="space-y-4 p-4">
										<div className="flex flex-wrap gap-2">
											{getTags(course).map((tag) => (
												<span key={tag} className="inline-flex h-[26px] items-center rounded-[10px] bg-[#f1f5f9] px-[10px] text-[11px] font-medium text-[#0f172a]">
													{tag}
												</span>
											))}
										</div>

										<div>
											<h3 className="text-[18px] font-bold text-[#0f172a]">{course?.title || 'Untitled course'}</h3>
											<p className="mt-1 text-[13px] text-[#64748b]">{course?.desc || 'Course details available in learning view.'}</p>
										</div>

										<div className="grid grid-cols-2 gap-2 text-[12px]">
											<div className="rounded-[10px] bg-white p-2.5">
												<p className="text-[#94a3b8]">Price</p>
												<p className="mt-1 font-semibold text-[#0f172a]">{course?.price || '$0'}</p>
											</div>
											<div className="rounded-[10px] bg-white p-2.5">
												<p className="text-[#94a3b8]">Enrolled</p>
												<p className="mt-1 font-semibold text-[#0f172a]">{formatDate(course?.enrolledAt)}</p>
											</div>
										</div>

										<div className="space-y-2 text-[12px] text-[#64748b]">
											<div className="flex items-center gap-2">
												<User className="h-4 w-4 text-[#5b3df6]" />
												<span>{course?.mentor || 'Assigned mentor'}</span>
											</div>
											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-[#5b3df6]" />
												<span>{Array.isArray(course?.meta) && course.meta[1] ? course.meta[1] : 'Self-paced'}</span>
											</div>
											<div className="flex items-center gap-2">
												<Star className="h-4 w-4 text-[#5b3df6]" />
												<span>{course?.rating ? `Rating ${course.rating}` : 'Top learner pick'}</span>
											</div>
										</div>

										<button
											type="button"
											onClick={() => setLearningCourse(course)}
											className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4a2ed8]"
										>
											<PlayCircle className="h-4 w-4" />
											Start Learning
										</button>

										{isCompleted && (
											<div className="space-y-2">
												{certificateUrl ? (
													<a
														href={certificateUrl}
														download
														target="_blank"
														rel="noreferrer"
														className="inline-flex h-10 w-full items-center justify-center rounded-[10px] border border-[#16a34a] bg-[#ecfdf3] px-4 text-[13px] font-semibold text-[#166534] hover:bg-[#dcfce7]"
													>
														Download Certificate
													</a>
												) : (
													<button
														type="button"
														disabled
														className="inline-flex h-10 w-full cursor-not-allowed items-center justify-center rounded-[10px] border border-[#16a34a]/30 bg-[#ecfdf3] px-4 text-[13px] font-semibold text-[#166534]/70"
													>
														Download Certificate
													</button>
												)}
												{!certificateUrl && (
													<p className="text-[11px] text-[#64748b]">Certificate admin upload karega. Upload ke baad yahin se download hoga.</p>
												)}
											</div>
										)}
									</div>
										)
									})()}
								</article>
							))}
						</div>
					) : (
						<div className="rounded-[16px] border border-dashed border-black/[0.12] bg-[#fafcff] p-8 text-center">
							<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ede7ff] text-[#5b3df6]">
								<BookOpen className="h-7 w-7" />
							</div>
							<h3 className="mt-4 text-[18px] font-bold text-[#0f172a]">No enrolled courses yet</h3>
							<p className="mt-2 text-[13px] text-[#64748b]">
								Browse Courses page se enroll karo, successful checkout ke baad courses yahan cards me dikhenge.
							</p>
						</div>
					)}
				</section>
			</div>
			<LearningModal course={learningCourse} onClose={() => setLearningCourse(null)} />
		</div>
	)
}
