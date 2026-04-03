import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Building2, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react'

const DECORATIVE_IMG = 'https://www.figma.com/api/mcp/asset/ce009895-65be-4c55-8e2c-8114666b793d'
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PHONE_REGEX = /^\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/

export default function AdminSignup() {
	const [formData, setFormData] = useState({
		fullName: '',
		instituteName: '',
		email: '',
		password: '',
		confirmPassword: '',
		agreeToTerms: false,
	})
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [submitted, setSubmitted] = useState(false)
	const [phone, setPhone] = useState('')

	const passwordStrength = useMemo(() => {
		const value = formData.password
		let score = 0
		if (value.length >= 8) score += 1
		if (/[A-Z]/.test(value)) score += 1
		if (/[0-9]/.test(value)) score += 1
		if (/[^A-Za-z0-9]/.test(value)) score += 1
		return score
	}, [formData.password])

	const isEmailValid = EMAIL_REGEX.test(formData.email)
	const isPhoneValid = PHONE_REGEX.test(phone)

	const isFormValid =
		formData.fullName.trim() &&
		formData.instituteName.trim() &&
		isEmailValid &&
		isPhoneValid &&
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
		console.log('Admin signup payload:', formData)
	}

	return (
		<div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-gradient-to-br from-[#1c113b] via-[#3a2286] to-[#5d3df0] p-4 font-[Inter,_'Segoe_UI',_Roboto,_sans-serif] sm:p-6 lg:p-8">
			<div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1300px] grid-cols-1 items-start gap-8 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_460px] lg:items-center lg:gap-13">
				<section className="text-white">
					<div className="inline-flex items-center gap-2 rounded-[12px] bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-[#ffb76a]">
						<ShieldCheck className="h-4 w-4" />
						Admin Onboarding
					</div>

					<h1 className="m-0 mt-4 text-[64px] leading-[1.12] font-extrabold tracking-[-1.2px] whitespace-pre-line max-lg:text-[44px] max-sm:text-[34px]">
						Manage Your{`\n`}Institute with{`\n`}
						<span className="text-[#ff8a33]">Smart Admin Tools</span>
					</h1>

					<p className="mt-5.5 max-w-[490px] text-lg leading-relaxed text-white/70">
						Sign up as institute admin to manage courses, instructors, students, live classes, and payments from one LMS dashboard.
					</p>

					<ul className="mt-8 p-0 list-none flex flex-col gap-4">
						{[
							'Set up and publish your course catalog',
							'Assign instructors and monitor classes',
							'Track enrollments, payments, and performance',
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

				<section className="relative mx-auto w-full max-w-[520px] lg:h-full lg:max-w-none">
					<img
						src={DECORATIVE_IMG}
						alt="Admin signup"
						className="absolute -top-9 -right-9 w-[110px] h-[110px] rounded-full border-6 border-white object-cover shadow-lg bg-white max-lg:hidden z-[1]"
					/>

					<div className="relative flex w-full flex-col rounded-2xl bg-white p-5 shadow-2xl sm:p-8 lg:h-full lg:max-h-[820px] lg:p-10">
						<div className="flex gap-1.5 p-1.5 rounded-xl bg-[#f3f6f8] mb-7">
							<Link
								to="/login"
								className="flex-1 text-center border-0 rounded-lg py-3 px-2.5 bg-transparent text-[#6b7480] text-sm font-semibold cursor-pointer no-underline"
							>
								Login
							</Link>
							<button type="button" className="flex-1 border-0 rounded-lg py-3 px-2.5 bg-white text-[#0b1020] shadow-sm text-sm font-semibold cursor-pointer">
								Admin Sign Up
							</button>
						</div>

						<h2 className="m-0 text-[#0b1020] text-[30px] leading-[1.15] font-extrabold">Create Admin Account</h2>
						<p className="mt-2 text-[#6b7480] text-sm">Fill details to set up your admin account.</p>

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
								icon={<Building2 className="h-4 w-4" />}
								label="Institute Name"
								value={formData.instituteName}
								onChange={(v) => handleChange('instituteName', v)}
								placeholder="Enter institute name"
							/>

							<Field
								icon={<Mail className="h-4 w-4" />}
								label="Work Email"
								type="email"
								value={formData.email}
								onChange={(v) => handleChange('email', v)}
								placeholder="admin@institute.com"
							/>

							<div>
								<label className="flex flex-col gap-2">
									<span className="text-[#0b1020] text-sm font-semibold">Phone Number</span>
									<input
										type="tel"
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
										placeholder="(123) 456-7890"
										className="border border-black/10 rounded-md p-3.5 text-sm text-[#0b1020] outline-none focus:border-[#5a3bd6] focus:ring-3 focus:ring-[#5a3bd6]/20"
									/>
									{submitted && !isPhoneValid ? <span className="text-xs font-medium text-[#dc2626]">Enter a valid phone number.</span> : null}
								</label>
							</div>

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
								I agree to the Terms and Privacy Policy for admin account access.
							</label>

							{submitted && !isFormValid ? (
								<p className="rounded-[6px] border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[12px] text-[#b91c1c]">
									Please fill all fields correctly and confirm terms before submitting.
								</p>
							) : null}

							<button type="submit" disabled={!isFormValid} className="border-0 rounded-md bg-[#ff8a33] text-white text-base font-bold p-3.5 cursor-pointer mt-1 disabled:cursor-not-allowed disabled:opacity-60">
								Create Admin Account
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
