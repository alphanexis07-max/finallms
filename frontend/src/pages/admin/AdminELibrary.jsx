import React, { useState } from 'react'
import { Upload, PlusCircle, FileText, BookOpen, X } from 'lucide-react'

const initialResources = [
	{
		id: 1,
		title: 'Science Chapter 4 Notes',
		grade: 'Class 9',
		format: 'PDF',
		uploadedBy: 'Rahul Mehta',
		uploadedOn: 'Today',
	},
	{
		id: 2,
		title: 'Math Practice Worksheet Set 2',
		grade: 'Class 10',
		format: 'DOCX',
		uploadedBy: 'Rahul Mehta',
		uploadedOn: 'Yesterday',
	},
]

export default function AdminELibrary() {
	const [resources, setResources] = useState(initialResources)
	const [showUploadModal, setShowUploadModal] = useState(false)
	const [title, setTitle] = useState('')
	const [grade, setGrade] = useState('Class 9')
	const [format, setFormat] = useState('PDF')

	const handleUpload = () => {
		if (!title.trim()) return

		setResources([
			{
				id: Date.now(),
				title: title.trim(),
				grade,
				format,
				uploadedBy: 'Rahul Mehta',
				uploadedOn: 'Just now',
			},
			...resources,
		])

		setTitle('')
		setGrade('Class 9')
		setFormat('PDF')
		setShowUploadModal(false)
	}

	return (
		<div className="min-h-full bg-[#F7FAFD] p-4 sm:p-6 lg:p-7">
			<div className="rounded-[8px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] p-5 sm:p-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<div className="inline-flex items-center gap-2 rounded-[12px] bg-[#e8f5ff] px-[10px] py-[6px] text-[12px] font-medium text-[#0f172a]">
							<BookOpen className="h-4 w-4 text-[#5b3df6]" />
							Admin managed library
						</div>
						<h2 className="mt-3 text-[26px] font-bold text-[#0f172a] sm:text-[30px]">E-Library Resource Uploads</h2>
						<p className="mt-2 text-[14px] text-[#64748b]">
							Library resources are uploaded and managed by admin only. Students can only view and download published files.
						</p>
					</div>
					<button
						onClick={() => setShowUploadModal(true)}
						className="inline-flex h-[40px] items-center gap-2 rounded-[6px] bg-[#5b3df6] px-[16px] text-[14px] font-medium text-white hover:bg-[#4c2dd9]"
					>
						<PlusCircle className="h-[18px] w-[18px]" />
						Upload library file
					</button>
				</div>
			</div>

			<section className="mt-6 rounded-[8px] border border-black/[0.08] bg-white p-5 sm:p-6">
				<h3 className="text-[18px] font-bold text-[#0f172a]">Uploaded resources</h3>
				<p className="mt-1 text-[13px] text-[#94a3b8]">Latest files available for students in E-Library.</p>

				<div className="mt-4 space-y-3">
					{resources.map((item) => (
						<div key={item.id} className="flex flex-col gap-3 rounded-[6px] border border-black/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-start gap-3">
								<div className="inline-flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#f1f5f9]">
									<FileText className="h-5 w-5 text-[#5b3df6]" />
								</div>
								<div>
									<p className="text-[14px] font-semibold text-[#0f172a]">{item.title}</p>
									<p className="mt-1 text-[12px] text-[#94a3b8]">
										{item.grade} • {item.format} • Uploaded by {item.uploadedBy} • {item.uploadedOn}
									</p>
								</div>
							</div>
							<span className="inline-flex h-[28px] items-center rounded-[12px] bg-[#2dd4bf] px-[10px] text-[12px] font-medium text-[#023b33]">
								Published
							</span>
						</div>
					))}
				</div>
			</section>

			{showUploadModal ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
					<div className="w-[95vw] max-w-[560px] rounded-[8px] bg-white shadow-xl">
						<div className="flex items-center justify-between border-b border-black/[0.08] p-5">
							<h3 className="text-[18px] font-bold text-[#0f172a]">Upload library resource</h3>
							<button onClick={() => setShowUploadModal(false)} className="text-[#94a3b8] hover:text-[#0f172a]">
								<X className="h-5 w-5" />
							</button>
						</div>

						<div className="space-y-4 p-5">
							<div>
								<label className="mb-1 block text-[13px] font-semibold text-[#0f172a]">Title</label>
								<input
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="Enter resource title"
									className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
								/>
							</div>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div>
									<label className="mb-1 block text-[13px] font-semibold text-[#0f172a]">Class</label>
									<select
										value={grade}
										onChange={(e) => setGrade(e.target.value)}
										className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
									>
										<option>Class 9</option>
										<option>Class 10</option>
										<option>Class 11</option>
										<option>Class 12</option>
									</select>
								</div>
								<div>
									<label className="mb-1 block text-[13px] font-semibold text-[#0f172a]">Format</label>
									<select
										value={format}
										onChange={(e) => setFormat(e.target.value)}
										className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
									>
										<option>PDF</option>
										<option>DOCX</option>
										<option>PPT</option>
										<option>MP4</option>
									</select>
								</div>
							</div>

							<label className="flex cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-dashed border-[#94a3b8] bg-[#f8fafc] p-4 text-[13px] font-medium text-[#64748b]">
								<Upload className="h-4 w-4" />
								Choose file (demo UI)
							</label>
						</div>

						<div className="flex gap-3 border-t border-black/[0.08] p-5">
							<button
								onClick={() => setShowUploadModal(false)}
								className="h-10 flex-1 rounded-[6px] border border-black/[0.08] text-[13px] font-medium text-[#64748b] hover:bg-[#f8fafc]"
							>
								Cancel
							</button>
							<button
								onClick={handleUpload}
								className="h-10 flex-1 rounded-[6px] bg-[#5b3df6] text-[13px] font-medium text-white hover:bg-[#4c2dd9]"
							>
								Publish resource
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	)
}
