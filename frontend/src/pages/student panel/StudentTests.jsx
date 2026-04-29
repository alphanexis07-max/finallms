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
	const [activeTest, setActiveTest] = useState(null);
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState({});
	const [openingTestId, setOpeningTestId] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [resultModal, setResultModal] = useState(null);

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

	const handleStartTest = async (test) => {
		try {
			setOpeningTestId(test._id);
			const res = await api(`/student/tests/${test._id}/questions`);
			const loadedQuestions = Array.isArray(res?.items) ? res.items : [];
			setQuestions(loadedQuestions);
			setAnswers({});
			setActiveTest(test);
		} catch (err) {
			window.alert(err?.message || "Unable to start this test.");
		} finally {
			setOpeningTestId("");
		}
	};

	const handleViewResult = (test) => {
		const score = Number(test.score || 0);
		const total = Number(test.max_score || 0);
		const percentage = total > 0 ? ((score / total) * 100).toFixed(2) : "0.00";
		setResultModal({
			title: test.title || "Test",
			score,
			total,
			percentage,
		});
	};

	const canSubmit = questions.length > 0 && questions.every((q) => String(answers[q._id] || "").trim().length > 0);

	const handleSubmitTest = async () => {
		if (!activeTest?._id || submitting) return;
		if (!canSubmit) {
			window.alert("Please answer all questions before submitting.");
			return;
		}
		try {
			setSubmitting(true);
			const submission = await api(`/student/tests/${activeTest._id}/submit`, {
				method: "POST",
				body: JSON.stringify({ answers }),
			});
			setTests((prev) =>
				prev.map((t) =>
					t._id === activeTest._id
						? {
								...t,
								status: "completed",
								score: submission?.score ?? t.score,
								max_score: submission?.total ?? t.max_score,
						  }
						: t,
				),
			);
			setResultModal({
				title: activeTest.title || "Test",
				score: Number(submission?.score || 0),
				total: Number(submission?.total || 0),
				percentage: Number(submission?.percentage || 0).toFixed(2),
			});
			setActiveTest(null);
			setQuestions([]);
			setAnswers({});
		} catch (err) {
			window.alert(err?.message || "Failed to submit test.");
		} finally {
			setSubmitting(false);
		}
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
														onClick={() => handleViewResult(test)}
														className="flex-1 h-9 rounded-[8px] bg-[#5b3df6] text-[12px] font-semibold text-white flex items-center justify-center gap-1.5 hover:bg-[#4a2ed8] transition-colors"
													>
														<CheckCircle2 className="h-4 w-4" /> View Result
													</button>
												) : (
													<button
														onClick={() => handleStartTest(test)}
														disabled={openingTestId === test._id}
														className="flex-1 h-9 rounded-[8px] bg-[#ef4444] text-[12px] font-semibold text-white flex items-center justify-center gap-1.5 hover:bg-[#dc2626] transition-colors"
													>
														<PlayCircle className="h-4 w-4" /> {openingTestId === test._id ? "Opening..." : status === "ongoing" ? "Resume Test" : "Start Test"}
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

			{activeTest ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-[12px] bg-white shadow-2xl">
						<div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/[0.08] bg-white px-5 py-4">
							<div>
								<h3 className="text-[18px] font-bold text-[#0f172a]">{activeTest.title}</h3>
								<p className="text-[12px] text-[#64748b]">{questions.length} questions</p>
							</div>
							<button
								onClick={() => {
									setActiveTest(null);
									setQuestions([]);
									setAnswers({});
								}}
								className="rounded-full p-1.5 text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#334155]"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						<div className="space-y-4 px-5 py-4">
							{questions.length === 0 ? (
								<div className="rounded-[10px] border border-dashed border-black/[0.12] bg-[#fafcff] p-6 text-center text-[13px] text-[#64748b]">
									No questions available for this test.
								</div>
							) : (
								questions.map((q, index) => (
									<div key={q._id} className="rounded-[10px] border border-black/[0.08] bg-[#fcfdff] p-4">
										<p className="text-[13px] font-semibold text-[#334155]">Q{index + 1}</p>
										<p className="mt-1 text-[14px] font-medium text-[#0f172a]">{q.question}</p>
										<div className="mt-3 space-y-2">
											{(q.options || []).map((option, optionIndex) => (
												<label key={`${q._id}-${optionIndex}`} className="flex cursor-pointer items-center gap-2 rounded-[8px] border border-black/[0.06] bg-white px-3 py-2 text-[13px] text-[#334155]">
													<input
														type="radio"
														name={`question-${q._id}`}
														value={option}
														checked={answers[q._id] === option}
														onChange={(e) => setAnswers((prev) => ({ ...prev, [q._id]: e.target.value }))}
													/>
													<span>{option}</span>
												</label>
											))}
										</div>
									</div>
								))
							)}
						</div>
						<div className="sticky bottom-0 flex justify-end border-t border-black/[0.08] bg-white px-5 py-4">
							<button
								onClick={handleSubmitTest}
								disabled={!canSubmit || submitting || questions.length === 0}
								className="h-10 rounded-[8px] bg-[#5b3df6] px-5 text-[13px] font-semibold text-white hover:bg-[#4a2ed8] disabled:cursor-not-allowed disabled:opacity-60"
							>
								{submitting ? "Submitting..." : "Submit Test"}
							</button>
						</div>
					</div>
				</div>
			) : null}

			{resultModal ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-[420px] rounded-[12px] bg-white p-5 shadow-2xl">
						<h3 className="text-[20px] font-bold text-[#0f172a]">Result Submitted</h3>
						<p className="mt-1 text-[13px] text-[#64748b]">{resultModal.title}</p>
						<div className="mt-4 rounded-[10px] border border-black/[0.08] bg-[#f8fafc] p-4">
							<p className="text-[14px] text-[#334155]">
								Score: <span className="font-bold text-[#0f172a]">{resultModal.score}/{resultModal.total}</span>
							</p>
							<p className="mt-1 text-[13px] text-[#64748b]">Percentage: {resultModal.percentage}%</p>
						</div>
						<div className="mt-4 flex justify-end">
							<button
								onClick={() => setResultModal(null)}
								className="h-10 rounded-[8px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white hover:bg-[#4a2ed8]"
							>
								OK
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default StudentTests;
