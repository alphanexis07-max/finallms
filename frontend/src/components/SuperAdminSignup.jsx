import React, { useMemo, useState } from 'react'
import { Shield, Building2, Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

const DECORATIVE_IMG = 'https://www.figma.com/api/mcp/asset/ce009895-65be-4c55-8e2c-8114666b793d'

export default function SuperAdminSignup() {
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
		formData.instituteName.trim() &&
		formData.email.trim() &&
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
		// Replace with API call when backend is connected.
		console.log('Super admin signup payload:', formData)
	}

	return (
		<div className="h-screen w-screen overflow-hidden flex items-center justify-center p-8 box-border bg-gradient-to-br from-[#1c113b] via-[#3a2286] to-[#5d3df0] font-[Inter,_'Segoe_UI',_Roboto,_sans-serif]">
			<div className="h-full w-full max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_460px] items-center gap-13">
				<section className="text-white">
					<div className="inline-flex items-center gap-2 rounded-[12px] bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-[#ffb76a]">
						<Shield className="h-4 w-4" />
						Super Admin Access
					</div>

					<h1 className="mt-4 m-0 text-[64px] leading-[1.12] font-extrabold tracking-[-1.2px] whitespace-pre-line max-lg:text-[44px] max-sm:text-[34px]">
						Create & Manage{`\n`}Your Platform{`\n`}
						<span className="text-[#ff8a33]">as Super Admin</span>
					</h1>

					<p className="mt-5.5 max-w-[490px] text-lg leading-relaxed text-white/70">
						Configure institutions, manage subscriptions, monitor platform revenue, and onboard admins from one secure super admin panel.
					</p>

					<ul className="mt-8 p-0 list-none flex flex-col gap-4">
						{[
							'Tenant management and onboarding controls',
							'Role-based access with secure workflows',
							'Revenue and subscription visibility at platform level',
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
						alt="Super admin"
						className="absolute -top-9 -right-9 w-[110px] h-[110px] rounded-full border-6 border-white object-cover shadow-lg bg-white max-lg:hidden z-1"
					/>
					<div className="relative h-full max-h-[820px] bg-white rounded-2xl shadow-2xl p-10 max-sm:p-5 flex flex-col">
						<h2 className="m-0 text-[#0b1020] text-[30px] leading-[1.15] font-extrabold">Sign up as Super Admin</h2>
						<p className="mt-2 text-[#6b7480] text-sm">Fill details to set up your super admin account.</p>

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
							placeholder="name@institute.com"
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
								I agree to the Terms and Privacy Policy for super admin account access.
							</label>

							{submitted && !isFormValid ? (
								<p className="rounded-[6px] border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[12px] text-[#b91c1c]">
									Please fill all fields correctly and confirm terms before submitting.
								</p>
							) : null}

							<button
								type="submit"
								className="border-0 rounded-md bg-[#ff8a33] text-white text-base font-bold p-3.5 cursor-pointer mt-1"
							>
								Create Super Admin Account
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
