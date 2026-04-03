import { Link } from 'react-router-dom'

const DECORATIVE_IMG = 'https://www.figma.com/api/mcp/asset/ce009895-65be-4c55-8e2c-8114666b793d'

export default function Login() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8 box-border bg-gradient-to-br from-[#1c113b] via-[#3a2286] to-[#5d3df0] font-[Inter,_'Segoe_UI',_Roboto,_sans-serif]">
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1fr_460px] items-center gap-13">
        {/* Left Section */}
        <section className="text-white">
          <h1 className="m-0 text-[64px] leading-[1.15] font-extrabold tracking-[-1.2px] whitespace-pre-line max-lg:text-[44px] max-sm:text-[34px]">
            Build, Sell &{'\n'}Scale Your{'\n'}
            <span className="text-[#ff8a33]">Online Courses</span>
          </h1>
          <p className="mt-5.5 max-w-[490px] text-lg leading-relaxed text-white/70">
            Multi-tenant LMS SaaS platform designed for institutes, educators, and learners.
            Launch your own learning platform in minutes.
          </p>
          <ul className="mt-8 p-0 list-none flex flex-col gap-4">
            <li className="flex items-center gap-3 text-base">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
              Multi-Tenant LMS System
            </li>
            <li className="flex items-center gap-3 text-base">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
              Live &amp; Recorded Learning
            </li>
            <li className="flex items-center gap-3 text-base">
              <span className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-white/15 text-[#ff8a33] font-bold">✓</span>
              Secure Payments Integration
            </li>
          </ul>
        </section>

        {/* Card Section */}
        <section className="relative max-lg:max-w-[520px] max-lg:mx-auto">
          <img 
            src={DECORATIVE_IMG} 
            alt="Education icon" 
            className="absolute -top-9 -right-9 w-[110px] h-[110px] rounded-full border-6 border-white object-cover shadow-lg bg-white max-lg:hidden z-1" 
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-10 max-sm:p-5">
            {/* Tabs */}
            <div className="flex gap-1.5 p-1.5 rounded-xl bg-[#f3f6f8] mb-7">
              <button type="button" className="flex-1 border-0 rounded-lg py-3 px-2.5 bg-white text-[#0b1020] shadow-sm text-sm font-semibold cursor-pointer">
                Login
              </button>
              <Link 
                to="/signup" 
                className="flex-1 text-center border-0 rounded-lg py-3 px-2.5 bg-transparent text-[#6b7480] text-sm font-semibold cursor-pointer no-underline"
              >
                Sign Up
              </Link>
            </div>

            <h2 className="m-0 text-[#0b1020] text-[30px] leading-[1.15] font-extrabold">Welcome back</h2>
            <p className="mt-2 text-[#6b7480] text-sm">Enter your details to access your account.</p>

            <form className="mt-6 flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
              <label className="flex flex-col gap-2">
                <span className="text-[#0b1020] text-sm font-semibold">Email Address</span>
                <input 
                  className="border border-black/10 rounded-md p-3.5 text-sm text-[#0b1020] outline-none focus:border-[#5a3bd6] focus:ring-3 focus:ring-[#5a3bd6]/20" 
                  type="email" 
                  placeholder="you@example.com" 
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[#0b1020] text-sm font-semibold">Password</span>
                <input 
                  className="border border-black/10 rounded-md p-3.5 text-sm text-[#0b1020] outline-none focus:border-[#5a3bd6] focus:ring-3 focus:ring-[#5a3bd6]/20" 
                  type="password" 
                  placeholder="••••••••" 
                />
              </label>

              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2.5 text-[#6b7480] text-sm">
                  <input type="checkbox" defaultChecked /> Remember me
                </label>
                <button type="button" className="border-0 bg-none text-[#5d3df0] text-sm font-semibold cursor-pointer p-0">
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="border-0 rounded-md bg-[#ff8a33] text-white text-base font-bold p-3.5 cursor-pointer mt-1">
                Login to your account
              </button>
            </form>

            <div className="my-5.5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-[#6b7480] text-xs font-semibold">
              <div className="border-t border-black/10"></div>
              <span>Or continue with</span>
              <div className="border-t border-black/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <button type="button" className="border border-black/10 rounded-md bg-white text-[#0b1020] p-3 text-sm font-bold cursor-pointer">
                Google
              </button>
              <button type="button" className="border border-black/10 rounded-md bg-white text-[#0b1020] p-3 text-sm font-bold cursor-pointer">
                Apple
              </button>
            </div>

            <div className="mt-5 text-center text-[13px] text-[#6b7480]">
              Need platform-level access?{' '}
              <Link to="/superadmin-signup" className="font-semibold text-[#5d3df0] no-underline">
                Super Admin Signup
              </Link>
            </div>

            <div className="mt-2 text-center text-[13px] text-[#6b7480]">
              Joining as educator?{' '}
              <Link to="/instructor-signup" className="font-semibold text-[#5d3df0] no-underline">
                Instructor Signup
              </Link>
            </div>

            <div className="mt-2 text-center text-[13px] text-[#6b7480]">
              Running an institute?{' '}
              <Link to="/admin-signup" className="font-semibold text-[#5d3df0] no-underline">
                Admin Signup
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
