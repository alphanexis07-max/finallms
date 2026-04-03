import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, BookOpen, Lock, Eye, EyeOff, CheckCircle2, GraduationCap } from 'lucide-react'

const DECORATIVE_IMG = 'https://www.figma.com/api/mcp/asset/a41cf675-38f9-4801-90f3-b9a095bc404c'

export default function InstructorSignup() {
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		expertise: '',
		password: '',
		confirmPassword: '',
		agreeToTerms: false,
	})
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [submitted, setSubmitted] = useState(false)

	const passwordStrength = useMemo(() => {
		const value = formData.password
		let score = 0
		if (value.length >= 8) score += 1
		if (/[A-Z]/.test(value)) score += 1
		if (/[0-9]/.test(value)) score += 1
		if (/[^A-Za-z0-9]/.test(value)) score += 1
		return score
	}, [formData.password])

	const isFormValid =
		formData.fullName.trim() &&
		formData.email.trim() &&
		formData.expertise.trim() &&
		formData.password &&
		formData.confirmPassword &&
		formData.password === formData.confirmPassword &&
		formData.agreeToTerms

	const handleChange = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		setSubmitted(true)
		if (!isFormValid) return
		// Replace with API integration when backend is ready.
		console.log('Instructor signup payload:', formData)
	}

	return (
		<div className="h-screen w-screen overflow-hidden flex items-center justify-center p-8 box-border bg-gradient-to-br from-[#1c113b] via-[#3a2286] to-[#5d3df0] font-[Inter,_'Segoe_UI',_Roboto,_sans-serif]">
			<div className="h-full w-full max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_460px] items-center gap-13">
				<section className="text-white">
					<div className="inline-flex items-center gap-2 rounded-[12px] bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-[#ffb76a]">
						<GraduationCap className="h-4 w-4" />
						Instructor Onboarding
					</div>

					<h1 className="m-0 mt-4 text-[64px] leading-[1.12] font-extrabold tracking-[-1.2px] whitespace-pre-line max-lg:text-[44px] max-sm:text-[34px]">
						Teach, Inspire &{`\n`}Grow with your{`\n`}
						<span className="text-[#ff8a33]">Digital Classroom</span>
					</h1>

					<p className="mt-5.5 max-w-[490px] text-lg leading-relaxed text-white/70">
						Join as an instructor to create engaging lessons, host live classes, and support learners with structured course journeys.
					</p>

					<ul className="mt-8 p-0 list-none flex flex-col gap-4">
						{[
							'Create and manage your course content',
							'Run live classes and track attendance',
							'Monitor learner progress and performance',
						].map((text) => (
							<li key={text} className="flex items-center gap-3 text-base">
								<span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33]">
									<CheckCircle2 className="h-4 w-4" />
								</span>
								{text}
							</li>
						))}
					</ul>
				</section>

				<section className="relative h-full max-lg:max-w-[520px] max-lg:mx-auto">
					<img
						src={DECORATIVE_IMG}
						alt="Instructor signup"
						className="absolute -top-9 -right-9 w-[110px] h-[110px] rounded-full border-6 border-white object-cover shadow-lg bg-white max-lg:hidden z-1"
					/>

					<div className="relative h-full max-h-[820px] bg-white rounded-2xl shadow-2xl p-10 max-sm:p-5 flex flex-col">
						<div className="flex gap-1.5 p-1.5 rounded-xl bg-[#f3f6f8] mb-7">
							<Link
								to="/login"
								className="flex-1 text-center border-0 rounded-lg py-3 px-2.5 bg-transparent text-[#6b7480] text-sm font-semibold cursor-pointer no-underline"
							>
								Login
							</Link>
							<button type="button" className="flex-1 border-0 rounded-lg py-3 px-2.5 bg-white text-[#0b1020] shadow-sm text-sm font-semibold cursor-pointer">
								Instructor Sign Up
							</button>
						</div>

						<h2 className="m-0 text-[#0b1020] text-[30px] leading-[1.15] font-extrabold">Create Instructor Account</h2>
						<p className="mt-2 text-[#6b7480] text-sm">Fill details to join as instructor.</p>

						<div className="mt-6 flex-1 overflow-y-auto pr-1">
						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							<Field
								icon={<User className="h-4 w-4" />}
								label="Full Name"
								value={formData.fullName}
								onChange={(v) => handleChange('fullName', v)}
								placeholder="Enter full name"
							/>

							<Field
								icon={<Mail className="h-4 w-4" />}
								label="Email Address"
								type="email"
								value={formData.email}
								onChange={(v) => handleChange('email', v)}
								placeholder="you@example.com"
							/>

							<Field
								icon={<BookOpen className="h-4 w-4" />}
								label="Subject Expertise"
								value={formData.expertise}
								onChange={(v) => handleChange('expertise', v)}
								placeholder="Science, Math, Coding..."
							/>

							<Field
								icon={<Lock className="h-4 w-4" />}
								label="Password"
								type={showPassword ? 'text' : 'password'}
								value={formData.password}
								onChange={(v) => handleChange('password', v)}
								placeholder="Create password"
								rightControl={
									<button
										type="button"
										onClick={() => setShowPassword((p) => !p)}
										className="text-[#64748b] hover:text-[#0f172a]"
									>
										{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
									</button>
								}
							/>

							<div className="space-y-1">
								<div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eef2ff]">
									<div
										className={`h-full rounded-full transition-all ${
											passwordStrength <= 1
												? 'w-1/4 bg-[#f97316]'
												: passwordStrength === 2
													? 'w-2/4 bg-[#facc15]'
													: passwordStrength === 3
														? 'w-3/4 bg-[#2dd4bf]'
														: 'w-full bg-[#16a34a]'
										}`}
									/>
								</div>
								<p className="text-[11px] text-[#94a3b8]">Use 8+ chars with uppercase, number, and special character.</p>
							</div>

							<Field
								icon={<Lock className="h-4 w-4" />}
								label="Confirm Password"
								type={showConfirmPassword ? 'text' : 'password'}
								value={formData.confirmPassword}
								onChange={(v) => handleChange('confirmPassword', v)}
								placeholder="Re-enter password"
								rightControl={
									<button
										type="button"
										onClick={() => setShowConfirmPassword((p) => !p)}
										className="text-[#64748b] hover:text-[#0f172a]"
									>
										{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
									</button>
								}
							/>

							<label className="flex items-start gap-2 text-[12px] text-[#64748b]">
								<input
									type="checkbox"
									checked={formData.agreeToTerms}
									onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
									className="mt-0.5 h-4 w-4 rounded border-black/[0.2] text-[#5b3df6]"
								/>
								I agree to the Terms and Privacy Policy for instructor account access.
							</label>

							{submitted && !isFormValid ? (
								<p className="rounded-[6px] border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[12px] text-[#b91c1c]">
									Please fill all fields correctly and confirm terms before submitting.
								</p>
							) : null}

							<button type="submit" className="border-0 rounded-md bg-[#ff8a33] text-white text-base font-bold p-3.5 cursor-pointer mt-1">
								Create Instructor Account
							</button>
						</form>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}

function Field({ icon, label, type = 'text', value, onChange, placeholder, rightControl }) {
	return (
		<div>
			<label className="flex flex-col gap-2">
				<span className="text-[#0b1020] text-sm font-semibold">{label}</span>
				<div className="border border-black/10 rounded-md p-3.5 text-sm text-[#0b1020] outline-none focus-within:border-[#5a3bd6] focus-within:ring-3 focus-within:ring-[#5a3bd6]/20 flex items-center gap-2">
					<span className="text-[#94a3b8]">{icon}</span>
					<input
						type={type}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder={placeholder}
						className="w-full bg-transparent text-[14px] text-[#0b1020] placeholder:text-[#94a3b8] focus:outline-none"
					/>
					{rightControl ? <span className="shrink-0">{rightControl}</span> : null}
				</div>
			</label>
		</div>
	)
}
