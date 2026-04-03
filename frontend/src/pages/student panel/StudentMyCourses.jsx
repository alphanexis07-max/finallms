import React from 'react'
import { Search, Bell, PlayCircle, Download, Users, BookOpen, Wallet, BarChart3, GraduationCap, Upload, Plus } from 'lucide-react'

const AVATAR = 'https://www.figma.com/api/mcp/asset/5b24609b-97ad-4bea-af20-b4f4df404b75'
const HERO = 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80'

function Pill({ children, variant }) {
    const style =
        variant === 'success'
            ? 'bg-[#2dd4bf] text-[#023b33]'
            : variant === 'warning'
                ? 'bg-[#ffd966] text-[#4b2e00]'
                : variant === 'primary'
                    ? 'bg-[#5b3df6] text-white'
                    : 'bg-[#e8f5ff] text-[#0f172a]'

    return <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${style}`}>{children}</span>
}

export default function StudentMyCourses() {
    return (
        <div className="min-h-full bg-[#F7FAFD]">
            <div className="bg-gradient-to-b flex flex-col from-[#f6f8fa] gap-[24px] h-full p-[28px] to-[#f7fcff]">
                {/* Main Content Grid */}
                <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[1.7fr_1fr]">
                    {/* Left Column */}
                    <div className="flex flex-col gap-[24px]">
                        {/* Hero Banner */}
                        <div className="relative overflow-hidden rounded-[8px] border border-black/[0.08]">
                            <img src={HERO} alt="" className="h-[240px] w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                            <div className="absolute left-6 top-5 text-[11px] text-[#e5e7eb]">
                                My Courses &gt; UI/UX Masterclass
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-6">
                                <div>
                                    <p className="mb-1 inline-flex h-[26px] items-center px-[10px] rounded-[12px] text-[11px] font-medium bg-white/15 text-[#e5e7eb]">
                                        7 modules • design systems • accessibility
                                    </p>
                                    <h1 className="mt-1 text-[30px] font-bold text-white">
                                        UI/UX Masterclass
                                    </h1>
                                    <p className="mt-1 max-w-[460px] text-[12px] text-[#e5e7eb]">
                                        Build production‑ready design systems, user flows, wireframes, prototypes, and portfolio
                                        case studies with guided sessions and weekly feedback.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
                            <div className="flex items-center justify-between">
                                <h1 className="text-[34px] font-bold leading-none">Design systems, prototyping, and accessibility in one guided path</h1> <button className="bg-[#ffd966] flex items-center gap-[8px] h-[40px] justify-center px-[16px] rounded-[6px] shrink-0">
                                    <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#4b2e00] text-[14px]">
                                        Resume learning
                                    </div>
                                </button>
                            </div>
                            <p className="mt-1 max-w-[460px] text-[12px] text-[#94a3b8]">This course helps you apply design systems, interaction patterns, and multi-level assessments as you progress from fundamentals to production-ready UI decisions.</p>
                            <div className="grid grid-cols-4 gap-[16px]">
                                {[
                                    ['Lessons completed', '24 / 36'],
                                    ['Total watch time', '18h 20m'],
                                    ['Assignments passed', '7 / 9'],
                                    ['Certificate status', 'In progress'],
                                ].map(([label, value]) => (
                                    <div key={label} className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[8px] items-start p-[14px] rounded-[8px]">
                                        <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[#94a3b8] text-[11px]">
                                            {label}
                                        </div>
                                        <div className="flex flex-col font-bold h-[24px] justify-center leading-[0] text-[#0f172a] text-[18px]">
                                            {value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-[16px] border-b border-black/[0.08] pb-[12px]">
                            <button className="border-b-2 border-[#5b3df6] pb-[8px] font-semibold text-[13px] text-[#0f172a]">
                                Overview
                            </button>
                            <button className="text-[13px] text-[#94a3b8] hover:text-[#0f172a] transition-colors">Curriculum</button>
                            <button className="text-[13px] text-[#94a3b8] hover:text-[#0f172a] transition-colors">Resources</button>
                            <button className="text-[13px] text-[#94a3b8] hover:text-[#0f172a] transition-colors">Discussion</button>
                        </div>

                        {/* What you'll continue learning */}
                        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
                            <h2 className="font-bold text-[20px] text-[#0f172a]">What you'll continue learning</h2>
                            <p className="text-[14px] text-[#94a3b8]">
                                You are currently in the advanced part of the course where lessons shift from visual
                                foundations into workflow decisions, scalable UI patterns, and accessibility reviews. The next
                                modules focus on creating reusable components, validating design decisions, and preparing
                                polished handoff files for engineering teams.
                            </p>
                            <div className="grid grid-cols-2 gap-[12px] w-full">
                                {['System‑first lessons', 'Hands‑on projects', 'Mentor feedback', 'Accessibility reviews'].map((item) => (
                                    <div key={item} className="p-[12px] border border-black/[0.08] rounded-[6px] bg-[#f8fafc]">
                                        <p className="font-semibold text-[13px] text-[#0f172a]">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Module preview */}
                        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
                            <h2 className="font-bold text-[20px] text-[#0f172a]">Module preview</h2>
                            <div className="flex flex-col w-full gap-[12px]">
                                {[
                                    ['1. Introduction to UI/UX', 'Completed • 3 lessons • 45 min', 'Done', 'success'],
                                    ['2. Typography fundamentals', 'Completed • 5 lessons • 1h 20m', 'Done', 'success'],
                                    ['3. Building components and patterns', 'In progress • 8 lessons • 2h 05m', 'Current', 'primary'],
                                    ['4. Prototyping and handoff', 'Up next • 4 lessons • 1h 40m', 'Locked', 'secondary'],
                                ].map(([title, meta, status, variant], index) => (
                                    <div key={title} className={`flex items-center justify-between p-[14px] border rounded-[6px] ${index === 2 ? 'border-[#5b3df6] bg-[#f7f4ff]' : 'border-black/[0.08]'}`}>
                                        <div>
                                            <p className={`font-semibold text-[14px] ${index === 2 ? 'text-[#5b3df6]' : 'text-[#0f172a]'}`}>{title}</p>
                                            <p className="text-[12px] text-[#94a3b8] mt-[2px]">{meta}</p>
                                        </div>
                                        <Pill variant={variant}>{status}</Pill>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="flex flex-col gap-[24px]">
                        {/* Course progress */}
                        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
                            <h3 className="font-bold text-[20px] text-[#0f172a]">Course progress</h3>
                            <p className="text-[12px] text-[#94a3b8]">Overall progress</p>
                            <div className="text-[32px] font-bold text-[#0f172a]">68%</div>
                            <div className="w-full h-[8px] rounded-full bg-[#f1f5f9]">
                                <div className="h-[8px] w-[68%] rounded-full bg-[#5b3df6]" />
                            </div>
                            <p className="text-[12px] text-[#94a3b8]">24 of 35 lessons completed so far.</p>
                        </div>

                        {/* Your mentor */}
                        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[12px] items-start p-[21px] rounded-[8px]">
                            <h3 className="font-bold text-[20px] text-[#0f172a]">Your mentor</h3>
                            <div>
                                <p className="font-semibold text-[14px] text-[#0f172a]">Marcus Chen</p>
                                <p className="text-[12px] text-[#94a3b8] mt-[2px]">Lead Product Designer • Weekly mentor sessions</p>
                            </div>
                        </div>

                        {/* Continue from here */}
                        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
                            <h3 className="font-bold text-[20px] text-[#0f172a]">Continue from here</h3>
                            <div className="flex flex-col w-full gap-[12px]">
                                {[
                                    '3.1 Component inventory',
                                    '3.2 Mapping reusable patterns',
                                    '3.3 States and variants',
                                    '3.4 Review with annotations',
                                ].map((label, idx) => (
                                    <div key={label} className={`flex items-center justify-between p-[14px] border rounded-[6px] ${idx === 1 ? 'border-[#5b3df6] bg-[#f7f4ff]' : 'border-black/[0.08]'}`}>
                                        <p className={`font-semibold text-[14px] ${idx === 1 ? 'text-[#5b3df6]' : 'text-[#0f172a]'}`}>{label}</p>
                                        <PlayCircle className={`h-[18px] w-[18px] ${idx === 1 ? 'text-[#5b3df6]' : 'text-[#94a3b8]'}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col w-full gap-[12px] pt-[8px]">
                                <button className="border border-black/[0.08] flex items-center justify-center gap-[8px] h-[40px] rounded-[6px] bg-white">
                                    <Download className="h-[16px] w-[16px] text-[#5b3df6]" />
                                    <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[14px]">
                                        Download resources
                                    </div>
                                </button>
                                <button className="border border-black/[0.08] flex items-center justify-center h-[40px] rounded-[6px] bg-white">
                                    <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[14px]">
                                        Open discussion
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
