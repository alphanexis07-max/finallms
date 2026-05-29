import React, { useEffect, useState } from 'react'
import { AlertCircle, BookOpen, Clock, PlayCircle, Star } from 'lucide-react'
import { api } from '../../lib/api'
import useRealtime from '../../hooks/useRealtime'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80'

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
	if (!value) return 'Recently enrolled'

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return 'Recently enrolled'

	return date.toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	})
}

function isCourseActive(course) {
	return course?.is_active !== false
}

export default function StudentMyCourses() {
	const [courses, setCourses] = useState([])
	const [courseRatings, setCourseRatings] = useState({})
	const [ratingSavingFor, setRatingSavingFor] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const tenantId = localStorage.getItem('lms_tenant_id') || ''

	const handleRateCourse = async (courseId, ratingValue) => {
		setRatingSavingFor(courseId)
		try {
			const saved = await api('/lms/ratings', {
				method: 'POST',
				body: JSON.stringify({
					target_type: 'course',
					target_id: courseId,
					rating: ratingValue,
				}),
			})
			setCourseRatings((prev) => ({ ...prev, [courseId]: Number(saved?.rating || ratingValue) }))
		} catch (err) {
			setError(err?.message || 'Unable to save rating.')
		} finally {
			setRatingSavingFor('')
		}
	}

	const loadCourses = () => {
		setLoading(true)
		setError('')
		Promise.all([
			api(`/lms/enrollments?limit=200&_=${Date.now()}`).catch(() => ({ items: [] })),
			api(`/lms/courses?limit=500&_=${Date.now()}`).catch(() => ({ items: [] })),
			api('/lms/ratings?mine=true&target_type=course&limit=500').catch(() => ({ items: [] })),
		])
			.then(([enr, crs, ratingsRes]) => {
				const enrollMap = new Map((enr.items || []).map((x) => [x.course_id, x]))
				const mapped = (crs.items || [])
					.filter((course) => enrollMap.has(course._id))
					.map((course) => ({ ...course, enrolledAt: enrollMap.get(course._id)?.created_at || null }))
				setCourses(mapped)
				const ratingsMap = {}
				for (const row of ratingsRes.items || []) {
					if (row?.target_id) ratingsMap[row.target_id] = Number(row?.rating || 0)
				}
				setCourseRatings(ratingsMap)
			})
			.catch((err) => {
				setCourses([])
				setError(err?.message || 'Unable to load courses.')
			})
			.finally(() => setLoading(false))
	}

	useEffect(() => {
		loadCourses()
	}, [])

	useRealtime(tenantId ? `tenant:${tenantId}` : '', (payload) => {
		if (String(payload?.type || '').startsWith('course.')) loadCourses()
	})

	return (
		<div className="min-h-full bg-[#F7FAFD]">
			<div className="bg-gradient-to-b from-[#f6f8fa] to-[#f7fcff] p-4 sm:p-6 lg:p-7">
				<section className="rounded-[8px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] px-4 py-5 sm:px-6 sm:py-6">
					<span className="inline-flex h-[28px] items-center rounded-[12px] bg-[#ffd966] px-[10px] text-[12px] font-medium text-[#4b2e00]">
						Student Dashboard
					</span>
					<h1 className="mt-3 text-[24px] font-bold leading-tight text-[#0f172a] sm:text-[30px]">My Courses</h1>
					<p className="mt-2 max-w-[800px] text-[14px] text-[#64748b]">
						Here are all your enrolled courses displayed as cards. After a successful checkout, the course will automatically be added here.
					</p>
					<div className="mt-4 inline-flex h-[36px] items-center rounded-[12px] border border-black/[0.08] bg-white px-[16px] text-[12px] font-medium text-[#0f172a]">
						Total enrolled courses: {courses.length}
					</div>
				</section>

				<section className="mt-6 rounded-[8px] border border-black/[0.08] bg-white p-4 sm:p-5">
					<div className="mb-4 flex items-center justify-between gap-3">
						<h2 className="text-[20px] font-bold text-[#0f172a]">Enrolled Courses</h2>
						<span className="inline-flex items-center rounded-[10px] bg-[#e8f5ff] px-3 py-1 text-[11px] font-medium text-[#2563eb]">
							{courses.filter(isCourseActive).length} active
						</span>
					</div>

					{error ? <p className="mb-3 text-[12px] text-red-600">{error}</p> : null}

					{loading ? (
						<div className="rounded-[16px] border border-black/[0.08] bg-[#fafcff] p-8 text-center text-[13px] text-[#64748b]">
							Loading enrolled courses...
						</div>
					) : courses.length > 0 ? (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
							{courses.map((course, index) => (
								<article key={`${course?.title || 'course'}-${index}`} className={`overflow-hidden rounded-[16px] border bg-[#fafcff] ${isCourseActive(course) ? 'border-black/[0.08]' : 'border-red-200'}`}>
									<img
										src={getCourseImage(course)}
										alt={course?.title || 'Course'}
										className="h-[170px] w-full object-cover"
									/>

									<div className="space-y-4 p-4">
										<div className="flex flex-wrap gap-2">
												<span className="inline-flex h-[26px] items-center rounded-[10px] bg-[#f1f5f9] px-[10px] text-[11px] font-medium text-[#0f172a]">
													{course?.course_type || 'Course'}
												</span>
												<span className={`inline-flex h-[26px] items-center rounded-[10px] px-[10px] text-[11px] font-medium ${isCourseActive(course) ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
													{isCourseActive(course) ? 'Active' : 'Inactive'}
												</span>
										</div>

										<div>
											<h3 className="text-[18px] font-bold text-[#0f172a]">{course?.title || 'Untitled course'}</h3>
												<p className="mt-1 text-[13px] text-[#64748b]">{course?.description || 'No description available.'}</p>
										</div>

										<div className="grid grid-cols-2 gap-2 text-[12px]">
											<div className="rounded-[10px] bg-white p-2.5">
												<p className="text-[#94a3b8]">Price</p>
													<p className="mt-1 font-semibold text-[#0f172a]">Rs. {Number(course?.price || 0)}</p>
											</div>
											<div className="rounded-[10px] bg-white p-2.5">
												<p className="text-[#94a3b8]">Enrolled</p>
												<p className="mt-1 font-semibold text-[#0f172a]">{formatDate(course?.enrolledAt)}</p>
											</div>
										</div>

										<div className="space-y-2 text-[12px] text-[#64748b]">
											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-[#5b3df6]" />
													<span>{course?.course_type === 'paid' ? 'Paid access' : 'Self-paced'}</span>
											</div>
										</div>

										{!isCourseActive(course) ? (
											<div className="flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 p-3 text-[12px] font-medium text-red-700">
												<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
												<span>This course is currently inactive.</span>
											</div>
										) : null}

										<div className="rounded-[10px] border border-black/[0.08] bg-[#f8fafc] p-2.5 text-[11px] font-medium text-[#475569]">
											<div className="inline-flex items-center gap-1.5">
												<Star className={`h-3.5 w-3.5 ${Number(course?.avg_rating || course?.rating || 0) > 0 ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#cbd5e1]'}`} />
												<span>
													{Number(course?.avg_rating || course?.rating || 0) > 0
														? `Community rating: ${Number(course?.avg_rating || course?.rating || 0).toFixed(1)} (${Number(course?.rating_count || 0)})`
														: 'Community rating: Not rated yet'}
												</span>
											</div>
										</div>

										<div className="rounded-[10px] border border-black/[0.08] bg-white p-2.5">
											<p className="text-[11px] font-medium text-[#64748b]">Rate this course</p>
											<div className="mt-1 flex items-center gap-1">
												{[1, 2, 3, 4, 5].map((value) => {
													const current = Number(courseRatings[course?._id] || 0)
													return (
														<button
															key={value}
															type="button"
															onClick={() => handleRateCourse(course?._id, value)}
															disabled={ratingSavingFor === course?._id}
															className="rounded p-0.5 disabled:opacity-60"
														>
															<Star className={`h-4 w-4 ${value <= current ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#cbd5e1]'}`} />
														</button>
													)
												})}
												<span className="ml-1 text-[11px] text-[#94a3b8]">{Number(courseRatings[course?._id] || 0) || 'Not rated'}</span>
											</div>
										</div>

										<button
											type="button"
												onClick={() => {
													if (isCourseActive(course) && course?.youtube_url) window.open(course.youtube_url, '_blank')
												}}
												disabled={!isCourseActive(course) || !course?.youtube_url}
											className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4a2ed8] disabled:cursor-not-allowed disabled:opacity-60"
										>
											<PlayCircle className="h-4 w-4" />
												{!isCourseActive(course) ? 'Course Inactive' : course?.youtube_url ? 'Start Learning' : 'Content Not Available'}
										</button>
									</div>
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
		</div>
	)
}
