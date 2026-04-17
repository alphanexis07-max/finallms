import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { BookOpen, CalendarDays, Clock3, CheckCircle2, X, Star, PlayCircle } from "lucide-react";

const STATUS_CONFIG = {
	upcoming: { label: "Upcoming", bg: "bg-[#fef9c3]", text: "text-[#854d0e]", dot: "bg-[#eab308]" },
	completed: { label: "Completed", bg: "bg-[#dcfce7]", text: "text-[#14532d]", dot: "bg-[#22c55e]" },
	ongoing: { label: "Ongoing", bg: "bg-[#fee2e2]", text: "text-[#991b1b]", dot: "bg-[#ef4444]" },
};

function StatusBadge({ status }) {
	const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming;
	return (
		<span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
			<span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${status === "ongoing" ? "animate-pulse" : ""}`} />
			{cfg.label}
		</span>
	);
}


const StudentTests = () => {
	const [tests, setTests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [enrolledIds, setEnrolledIds] = useState([]);

	useEffect(() => {
		async function fetchData() {
			try {
				// Fetch enrollments and tests in parallel
				const [enrollmentsRes, testsRes] = await Promise.all([
					api("/lms/enrollments?mine=true"),
					api("/student/tests"),
				]);
				// Extract enrolled class/course IDs
				const enrolled = Array.isArray(enrollmentsRes?.items)
					? enrollmentsRes.items
					: enrollmentsRes;
				const ids = (enrolled || [])
					.map((e) => e.class_id || e.course_id || e.classId || e.courseId)
					.filter(Boolean);
				setEnrolledIds(ids);
				// Set all tests
				const allTests = Array.isArray(testsRes) ? testsRes : testsRes.tests || testsRes.items || [];
				setTests(allTests);
			} catch (err) {
				setError(err.message || "Failed to load tests");
			}
			setLoading(false);
		}
		fetchData();
	}, []);

	const handleStartTest = (testId) => {
		alert(`Start Test ID: ${testId}`);
		// Implement navigation or logic to start the test
	};

	const handleViewResult = (testId) => {
		alert(`View Result for Test ID: ${testId}`);
		// Implement navigation or logic to view the result
	};

	if (loading) {
		return <div className="p-10 text-center text-[#64748b]">Loading tests...</div>;
	}
	if (error) {
		return <div className="p-10 text-center text-red-600">{error}</div>;
	}

	const normalize = (value) => String(value || "").trim().toLowerCase();
	const enrolledKeySet = new Set(enrolledIds.map(normalize).filter(Boolean));

	// Filter tests to only those for enrolled classes/courses/subjects (case-insensitive)
	const filteredTests = enrolledKeySet.size
		? tests.filter((test) => {
				const courseKey = normalize(test.class_id || test.course_id || test.classId || test.courseId);
				const subjectKey = normalize(test.subject);
				const classNameKey = normalize(test.class_name || test.className);
				return (
					(enrolledKeySet.has(courseKey) && courseKey) ||
					(enrolledKeySet.has(subjectKey) && subjectKey) ||
					(enrolledKeySet.has(classNameKey) && classNameKey)
				);
		  })
		: [];

	return (
		<div className="min-h-full bg-[#F7FAFD]">
			<div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-7">
				{/* Hero Banner */}
				<section className="rounded-[10px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] px-5 py-5 sm:px-6">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div className="flex-1">
							<div className="inline-flex items-center gap-1.5 rounded-[12px] bg-[#ffd966] px-3 py-1.5 text-[12px] font-medium text-[#4b2e00]">
								<BookOpen className="h-3.5 w-3.5" /> Weekly & Course Tests
							</div>
							<h1 className="mt-3 text-[26px] font-bold leading-tight text-[#0f172a]">Attempt tests, track your progress, and improve your scores.</h1>
							<p className="mt-2 text-[13px] text-[#94a3b8]">Start scheduled tests, view results, and check your performance history here.</p>
							<div className="mt-4 flex flex-wrap gap-2">
								<div className="inline-flex h-8 items-center rounded-[10px] border border-black/[0.08] bg-white px-3 text-[11px] font-medium text-[#0f172a]">
									{filteredTests.length} tests
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Tests Grid */}
				<div>
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-[18px] font-bold text-[#0f172a]">My Tests</h2>
						<span className="text-[12px] text-[#94a3b8]">{filteredTests.length} tests</span>
					</div>

					{filteredTests.length === 0 ? (
						<div className="rounded-[12px] border border-dashed border-black/[0.12] bg-white py-14 text-center">
							<BookOpen className="mx-auto h-8 w-8 text-[#cbd5e1]" />
							<p className="mt-3 text-[14px] font-medium text-[#94a3b8]">No tests found</p>
							<p className="text-[12px] text-[#cbd5e1] mt-1">You have no scheduled or completed tests yet.</p>
						</div>
					) : (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
							{filteredTests.map((test) => {
								const status = test.status === "completed" ? "completed" : (test.status === "ongoing" ? "ongoing" : "upcoming");
								return (
									<div key={test._id} className={`group relative overflow-hidden rounded-[14px] border transition-all duration-200 hover:shadow-md ${status === "ongoing" ? "border-[#ef4444]/30 bg-[#fff5f5]" : "border-black/[0.08] bg-white"}`}>
										<div className="p-4">
											<div className="flex items-start justify-between gap-2 flex-wrap">
												<StatusBadge status={status} />
												{test.score !== undefined && status === "completed" && (
													<span className="inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-2.5 py-1 text-[10px] font-semibold text-[#14532d]">
														<CheckCircle2 className="h-3 w-3" /> Scored {test.score}
													</span>
												)}
											</div>
											<div className="mt-3 flex items-center gap-2">
												<div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] ${status === "ongoing" ? "bg-[#ef4444]" : "bg-[#f7f4ff]"}`}>
													<BookOpen className={`h-4 w-4 ${status === "ongoing" ? "text-white" : "text-[#5b3df6]"}`} />
												</div>
												<div>
													<p className="text-[14px] font-bold text-[#0f172a] leading-tight">{test.title}</p>
													<p className="text-[11px] text-[#64748b]">{test.subject || "General"}</p>
												</div>
											</div>
											<div className="mt-3 space-y-1.5">
												<div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
													<CalendarDays className="h-3.5 w-3.5 text-[#94a3b8]" />
													<span>{test.scheduled_at ? new Date(test.scheduled_at).toLocaleDateString() : "-"}</span>
												</div>
												<div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
													<Clock3 className="h-3.5 w-3.5 text-[#94a3b8]" />
													<span>{test.duration ? `${test.duration} mins` : "-"}</span>
												</div>
												{test.max_score !== undefined && (
													<div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
														<Star className="h-3.5 w-3.5 text-[#eab308] fill-[#eab308]" />
														<span>Max Score: {test.max_score}</span>
													</div>
												)}
											</div>
											<div className="mt-4 flex gap-2">
												{status === "completed" ? (
													<button
														onClick={() => handleViewResult(test._id)}
														className="flex-1 h-9 rounded-[8px] bg-[#5b3df6] text-[12px] font-semibold text-white flex items-center justify-center gap-1.5 hover:bg-[#4a2ed8] transition-colors"
													>
														<CheckCircle2 className="h-4 w-4" /> View Result
													</button>
												) : (
													<button
														onClick={() => handleStartTest(test._id)}
														className="flex-1 h-9 rounded-[8px] bg-[#ef4444] text-[12px] font-semibold text-white flex items-center justify-center gap-1.5 hover:bg-[#dc2626] transition-colors"
													>
														<PlayCircle className="h-4 w-4" /> {status === "ongoing" ? "Resume Test" : "Start Test"}
													</button>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default StudentTests;
