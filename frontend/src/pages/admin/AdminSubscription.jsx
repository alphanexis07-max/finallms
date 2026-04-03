import React, { useMemo, useState } from 'react'
import { PlusCircle, Trash2, Save, IndianRupee } from 'lucide-react'

const initialPlans = [
	{ id: 1, name: 'Free Trial (1 Day Demo Class)', duration: '1 day', price: 0, enabled: true },
	{ id: 2, name: 'Half Yearly', duration: 'Until half course completion', price: 299, enabled: true },
	{ id: 3, name: 'Yearly', duration: 'Until full course completion', price: 500, enabled: true },
]

export default function AdminSubscription() {
	const [plans, setPlans] = useState(initialPlans)
	const [adminShare, setAdminShare] = useState(30)
	const [newPlanName, setNewPlanName] = useState('')
	const [newDuration, setNewDuration] = useState('')
	const [newPrice, setNewPrice] = useState('')

	const instructorShare = useMemo(() => Math.max(0, 100 - adminShare), [adminShare])
	const sampleCoursePrice = 500
	const adminAmount = useMemo(() => Math.round((sampleCoursePrice * adminShare) / 100), [adminShare])
	const instructorAmount = useMemo(() => Math.max(0, sampleCoursePrice - adminAmount), [adminAmount])

	const addPlan = () => {
		if (!newPlanName.trim() || !newDuration.trim()) return
		const parsedPrice = Number(newPrice)
		setPlans([
			...plans,
			{
				id: Date.now(),
				name: newPlanName.trim(),
				duration: newDuration.trim(),
				price: Number.isNaN(parsedPrice) ? 0 : parsedPrice,
				enabled: true,
			},
		])
		setNewPlanName('')
		setNewDuration('')
		setNewPrice('')
	}

	const updatePlan = (id, key, value) => {
		setPlans(plans.map((plan) => (plan.id === id ? { ...plan, [key]: value } : plan)))
	}

	const deletePlan = (id) => {
		setPlans(plans.filter((plan) => plan.id !== id))
	}

	return (
		<div className="min-h-full bg-[#F7FAFD] p-4 sm:p-6 lg:p-7">
			<section className="rounded-[8px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] p-5 sm:p-6">
				<h2 className="text-[26px] font-bold text-[#0f172a] sm:text-[30px]">Course Subscription Management</h2>
				<p className="mt-2 text-[14px] text-[#64748b]">
					Admin controls subscription plans and pricing for each course. Students only see available plans while enrolling.
				</p>
			</section>

			<section className="mt-6 rounded-[8px] border border-black/[0.08] bg-white p-5 sm:p-6">
				<div className="flex items-center justify-between">
					<h3 className="text-[18px] font-bold text-[#0f172a]">Subscription plans</h3>
					<span className="rounded-[12px] bg-[#eef2ff] px-3 py-1 text-[12px] font-medium text-[#4338ca]">Admin only controls</span>
				</div>

				<div className="mt-4 overflow-x-auto">
					<table className="w-full min-w-[760px] border-separate border-spacing-y-2">
						<thead>
							<tr className="text-left text-[12px] font-semibold text-[#64748b]">
								<th className="px-3 py-2">Plan</th>
								<th className="px-3 py-2">Duration</th>
								<th className="px-3 py-2">Price (INR)</th>
								<th className="px-3 py-2">Status</th>
								<th className="px-3 py-2">Action</th>
							</tr>
						</thead>
						<tbody>
							{plans.map((plan) => (
								<tr key={plan.id} className="rounded-[6px] border border-black/[0.08] bg-[#f8fafc]">
									<td className="px-3 py-2">
										<input
											value={plan.name}
											onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
											className="h-9 w-full rounded-[6px] border border-black/[0.08] px-2 text-[13px]"
										/>
									</td>
									<td className="px-3 py-2">
										<input
											value={plan.duration}
											onChange={(e) => updatePlan(plan.id, 'duration', e.target.value)}
											className="h-9 w-full rounded-[6px] border border-black/[0.08] px-2 text-[13px]"
										/>
									</td>
									<td className="px-3 py-2">
										<div className="relative">
											<IndianRupee className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
											<input
												type="number"
												min="0"
												value={plan.price}
												onChange={(e) => updatePlan(plan.id, 'price', Number(e.target.value))}
												className="h-9 w-full rounded-[6px] border border-black/[0.08] pl-8 pr-2 text-[13px]"
											/>
										</div>
									</td>
									<td className="px-3 py-2">
										<select
											value={plan.enabled ? 'enabled' : 'disabled'}
											onChange={(e) => updatePlan(plan.id, 'enabled', e.target.value === 'enabled')}
											className="h-9 rounded-[6px] border border-black/[0.08] px-2 text-[13px]"
										>
											<option value="enabled">Enabled</option>
											<option value="disabled">Disabled</option>
										</select>
									</td>
									<td className="px-3 py-2">
										<button
											onClick={() => deletePlan(plan.id)}
											className="inline-flex h-9 items-center gap-1 rounded-[6px] border border-black/[0.08] px-3 text-[12px] font-medium text-[#b91c1c] hover:bg-[#fff1f2]"
										>
											<Trash2 className="h-4 w-4" />
											Remove
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="mt-4 grid grid-cols-1 gap-3 rounded-[8px] border border-dashed border-black/[0.15] bg-[#fcfdff] p-4 sm:grid-cols-[1.3fr_1fr_0.7fr_auto]">
					<input
						value={newPlanName}
						onChange={(e) => setNewPlanName(e.target.value)}
						placeholder="New plan name"
						className="h-10 rounded-[6px] border border-black/[0.08] px-3 text-[13px]"
					/>
					<input
						value={newDuration}
						onChange={(e) => setNewDuration(e.target.value)}
						placeholder="Duration / rule"
						className="h-10 rounded-[6px] border border-black/[0.08] px-3 text-[13px]"
					/>
					<input
						value={newPrice}
						onChange={(e) => setNewPrice(e.target.value)}
						type="number"
						min="0"
						placeholder="Price"
						className="h-10 rounded-[6px] border border-black/[0.08] px-3 text-[13px]"
					/>
					<button
						onClick={addPlan}
						className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] bg-[#5b3df6] px-4 text-[13px] font-medium text-white hover:bg-[#4c2dd9]"
					>
						<PlusCircle className="h-4 w-4" />
						Add plan
					</button>
				</div>
			</section>

			<section className="mt-6 rounded-[8px] border border-black/[0.08] bg-white p-5 sm:p-6">
				<h3 className="text-[18px] font-bold text-[#0f172a]">Revenue share (Admin vs Instructor)</h3>
				<p className="mt-1 text-[13px] text-[#94a3b8]">
					Configure how course payment gets split. Example below uses a ₹500 course price.
				</p>

				<div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
					<div className="rounded-[8px] border border-black/[0.08] bg-[#f8fafc] p-4">
						<label className="text-[13px] font-semibold text-[#0f172a]">Admin share (%)</label>
						<input
							type="number"
							min="0"
							max="100"
							value={adminShare}
							onChange={(e) => setAdminShare(Math.min(100, Math.max(0, Number(e.target.value))))}
							className="mt-2 h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px]"
						/>
						<p className="mt-2 text-[12px] text-[#64748b]">Instructor share auto-calculated: {instructorShare}%</p>
					</div>

					<div className="rounded-[8px] border border-black/[0.08] bg-[#eef2ff] p-4">
						<p className="text-[13px] font-semibold text-[#0f172a]">Example calculation for ₹500 course</p>
						<p className="mt-2 text-[13px] text-[#334155]">Admin ({adminShare}%): ₹{adminAmount}</p>
						<p className="mt-1 text-[13px] text-[#334155]">Instructor ({instructorShare}%): ₹{instructorAmount}</p>
						<button className="mt-3 inline-flex h-9 items-center gap-2 rounded-[6px] bg-[#5b3df6] px-3 text-[12px] font-medium text-white hover:bg-[#4c2dd9]">
							<Save className="h-4 w-4" />
							Save split settings
						</button>
					</div>
				</div>
			</section>
		</div>
	)
}
