// import React, { useEffect, useMemo, useState } from 'react'
// import { Users, DollarSign, BookOpen, Video, Calendar, FileText, Plus, BarChart3, Wallet, GraduationCap, Check } from 'lucide-react'
// import { api } from '../../lib/api'
// import useRealtime from '../../hooks/useRealtime'

const onlineClassItems = [
    {
        icon: "🖥",
        title: "Provision for conducting live online classes",
        meta: "Teachers can schedule, start, and manage live sessions with easy student joining flow.",
    },
    {
        icon: "🧪",
        title: "Integrated practical lab sessions",
        meta: "Support for virtual, recorded, and live practical labs based on subject requirements.",
    },
    {
        icon: "📊",
        title: "Separate teacher training module",
        meta: "Dedicated live training sessions for educators with attendance and session overview.",
    },
    {
        icon: "👥",
        title: "User-friendly access for students and teachers",
        meta: "Simple join links, recorded class access, and clear session management controls.",
    },
];

const weeklyTestItems = [
    {
        title: "Weekly live tests in MCQ format",
        meta: "Structured tests can be published every week for class-wise assessment.",
        pill: { label: "Live", type: "secondary" },
    },
    {
        title: "Automatic result calculation system",
        meta: "Scores are generated automatically without manual checking delays.",
        pill: { label: "Auto", type: "success" },
    },
    {
        title: "Morning test, evening result visibility",
        meta: "If a test is conducted in the morning, the result becomes visible to the user by evening.",
        pill: { label: "Same day", type: "warning" },
    },
    {
        title: "Result dashboard for performance tracking",
        meta: "Users can review accuracy, score history, and test-by-test progress in one view.",
        btn: true,
    },
];

const teacherTrainingItems = [
    {
        icon: "🎤",
        title: "Live teaching workshops",
        text: "Session-based training for pedagogy, digital delivery, and classroom engagement best practices.",
    },
    {
        icon: "🖥",
        title: "Platform usage enablement",
        text: "Hands-on walkthroughs to help teachers join, host, record, and manage sessions confidently.",
    },
   {
         icon: "✅",
         title: "Attendance and completion records",
         text: "Track participation and completion status for each training cohort and live session.",
    },
 ];

const schoolEvents = [
    {
        icon: "✏️",
        title: "Writing Competitions",
        meta: "Topic details, submission deadlines, and participation registration are available.",
        pill: { label: "Open", type: "secondary" },
    },
    {
        icon: "🏆",
        title: "Sports Activities",
        meta: "Fixture updates, house participation, and event announcements are visible here.",
        pill: { label: "Updated", type: "success" },
    },
    {
        icon: "🔬",
        title: "Science Exhibitions",
        meta: "Project themes, lab requirements, and exhibition schedule can be managed.",
        pill: { label: "3 upcoming", type: "secondary" },
    },
    {
        icon: "🧠",
        title: "Quizzes & Annual Function",
        meta: "Participation links, event updates, and stage schedule are available for both sections.",
        btn: true,
    },
];

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const pillVariants = {
//     success: "bg-[#2dd4bf] text-[#023b33]",
//     warning: "bg-[#ffd966] text-[#4b2e00]",
//     secondary: "bg-[#e8f5ff] text-[#0f172a]",
// };

// function Pill({ type = "secondary", children }) {
//     return (
//         <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${pillVariants[type]}`}>
//             {children}
//         </span>
//     );
// }

// function BtnPrimary({ children, className = "" }) {
//     return (
//         <button className={`inline-flex items-center gap-2 h-[40px] px-[16px] rounded-[6px] text-[14px] font-medium bg-[#5b3df6] text-white hover:bg-[#4c2dd9] transition-colors cursor-pointer ${className}`}>
//             {children}
//         </button>
//     );
// }

// function BtnOutline({ children, className = "" }) {
//     return (
//         <button className={`inline-flex items-center gap-2 h-[40px] px-[17px] rounded-[6px] text-[14px] font-medium bg-white text-[#0f172a] border border-black/[0.08] hover:bg-[#f1f5f9] transition-colors cursor-pointer whitespace-nowrap ${className}`}>
//             {children}
//         </button>
//     );
// }

// function BtnOutlineSm({ children, className = "" }) {
//     return (
//         <button className={`inline-flex items-center gap-1.5 h-[36px] px-[12px] rounded-[6px] text-[13px] font-medium bg-white text-[#0f172a] border border-black/[0.08] hover:bg-[#f1f5f9] transition-colors cursor-pointer whitespace-nowrap ${className}`}>
//             {children}
//         </button>
//     );
// }

// function IconBox({ icon }) {
//     return (
//         <div className="bg-[#e8f5ff] w-[42px] h-[42px] rounded-[6px] flex items-center justify-center flex-shrink-0 text-xl">
//             {icon}
//         </div>
//     );
// }

// function Stat({ title, value, meta, icon }) {
//     return (
//         <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[19px] rounded-[8px]">
//             <div className="flex items-center justify-between w-full">
//                 <div className="flex flex-col items-start">
//                     <div className="text-[13px] font-medium text-[#94a3b8] sm:text-[14px]">{title}</div>
//                     <div className="text-[28px] font-bold leading-tight tracking-[-0.6px] text-[#0f172a] sm:text-[30px]">{value}</div>
//                 </div>
//                 <div className="bg-[#e8f5ff] flex items-center justify-center relative rounded-[6px] shrink-0 size-[40px]">
//                     {icon}
//                 </div>
//             </div>
//             <div className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${
//                 meta.includes('scheduled') || meta.includes('open') ? 'bg-[#2dd4bf] text-[#023b33]' : 
//                 meta.includes('evening') ? 'bg-[#ffd966] text-[#4b2e00]' : 
//                 'bg-[#e8f5ff] text-[#0f172a]'
//             }`}>
//                 {meta}
//             </div>
//         </div>
//     );
// }

// // ─── Sub-sections ─────────────────────────────────────────────────────────────
// function OnlineClassesCard() {
//     return (
//         <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
//             <div className="px-[21px] pt-[21px] pb-[16px] flex flex-col justify-between items-start gap-4 sm:flex-row">
//                 <div>
//                     <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Online Classes &amp; Practical Labs</h3>
//                     <p className="text-[13px] text-[#94a3b8] mt-[4px]">Live classes, recorded lessons, lab sessions, and session management</p>
//                 </div>
//                 <BtnOutlineSm className="w-full justify-center sm:w-auto">Manage</BtnOutlineSm>
//             </div>
//             <div className="flex flex-col gap-[16px] px-[21px] pb-[21px]">
//                 {onlineClassItems.map((item, i) => (
//                     <div key={i} className="flex items-start gap-[16px] p-[16px] border border-black/[0.08] rounded-[6px]">
//                         <IconBox icon={item.icon} />
//                         <div className="flex-1 min-w-0">
//                             <div className="text-[14px] font-semibold text-[#0f172a] leading-snug">{item.title}</div>
//                             <div className="text-[13px] text-[#94a3b8] mt-[4px] leading-relaxed">{item.meta}</div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// function WeeklyTestsCard() {
//     return (
//         <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
//             <div className="px-[21px] pt-[21px] pb-[16px] flex flex-col justify-between items-start gap-4 sm:flex-row">
//                 <div>
//                     <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Weekly Tests</h3>
//                     <p className="text-[13px] text-[#94a3b8] mt-[4px]">MCQ-based assessments with automatic evaluation and performance tracking</p>
//                 </div>
//                 <BtnOutlineSm className="w-full justify-center sm:w-auto">Create test</BtnOutlineSm>
//             </div>
//             <div className="flex flex-col px-[21px] pb-[21px]">
//                 {weeklyTestItems.map((item, i) => (
//                     <div
//                         key={i}
//                         className={`flex flex-col items-start gap-[12px] py-[14px] sm:flex-row sm:items-center sm:justify-between
//               ${i !== weeklyTestItems.length - 1 ? "border-b border-black/[0.08]" : ""}
//               ${i === 0 ? "pt-[8px]" : ""}
//               ${i === weeklyTestItems.length - 1 ? "pb-[8px]" : ""}
//             `}
//                     >
//                         <div className="flex-1 min-w-0">
//                             <div className="text-[14px] font-semibold text-[#0f172a] leading-snug">{item.title}</div>
//                             <div className="text-[13px] text-[#94a3b8] mt-[4px] leading-relaxed">{item.meta}</div>
//                         </div>
//                         <div className="flex-shrink-0">
//                             {item.btn ? (
//                                 <button className="inline-flex items-center h-[36px] px-[12px] rounded-[6px] text-[13px] font-medium bg-[#5b3df6] text-white hover:bg-[#4c2dd9] transition-colors cursor-pointer whitespace-nowrap">
//                                     View results
//                                 </button>
//                             ) : (
//                                 <Pill type={item.pill.type}>{item.pill.label}</Pill>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// function TeacherTrainingCard() {
//     return (
//         <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
//             <div className="px-[21px] pt-[21px] pb-[16px] flex flex-col justify-between items-start gap-4 sm:flex-row">
//                 <div>
//                     <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Teacher Training</h3>
//                     <p className="text-[13px] text-[#94a3b8] mt-[4px]">Live session plan for onboarding, methodology refreshers, and platform enablement</p>
//                 </div>
//                 <BtnOutlineSm className="w-full justify-center sm:w-auto">Schedule</BtnOutlineSm>
//             </div>
//             <div className="flex flex-col gap-[16px] px-[21px] pb-[21px]">
//                 {teacherTrainingItems.map((item, i) => (
//                     <div key={i} className="flex items-start gap-[12px]">
//                         <IconBox icon={item.icon} />
//                         <div className="flex-1 min-w-0">
//                             <div className="text-[14px] font-semibold text-[#0f172a] leading-snug mb-[4px]">{item.title}</div>
//                             <div className="text-[13px] text-[#94a3b8] leading-relaxed">{item.text}</div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// function SchoolEventsCard() {
//     return (
//         <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
//             <div className="px-[21px] pt-[21px] pb-[16px] flex flex-col justify-between items-start gap-4 sm:flex-row">
//                 <div>
//                     <h3 className="text-[18px] font-bold text-[#0f172a] m-0">School Events</h3>
//                     <p className="text-[13px] text-[#94a3b8] mt-[4px]">Showcase event details, participation options, and updates</p>
//                 </div>
//                 <BtnOutlineSm className="w-full justify-center sm:w-auto">View all</BtnOutlineSm>
//             </div>
//             <div className="flex flex-col gap-[16px] px-[21px] pb-[21px]">
//                 {schoolEvents.map((item, i) => (
//                     <div key={i} className="flex flex-col items-start gap-[12px] p-[16px] border border-black/[0.08] rounded-[6px] sm:flex-row sm:items-center">
//                         <IconBox icon={item.icon} />
//                         <div className="flex-1 min-w-0">
//                             <div className="text-[14px] font-semibold text-[#0f172a] leading-snug">{item.title}</div>
//                             <div className="text-[13px] text-[#94a3b8] mt-[4px] leading-relaxed">{item.meta}</div>
//                         </div>
//                         <div className="flex-shrink-0">
//                             {item.btn ? (
//                                 <BtnOutlineSm>Participate</BtnOutlineSm>
//                             ) : (
//                                 <Pill type={item.pill.type}>{item.pill.label}</Pill>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────
// export default function InstructorDashboard() {
//     const [statsData, setStatsData] = useState({
//         live_sessions: 0,
//         upcoming_classes: 0,
//         tests: 0,
//         courses: 0,
//         labs: 0,
//         events: 0,
//     })
//     const tenantId = localStorage.getItem('lms_tenant_id')

//     useEffect(() => {
//         api('/lms/dashboard/instructor').then(setStatsData).catch(() => {})
//     }, [])

//     useRealtime(tenantId ? `tenant:${tenantId}` : '', () => {
//         api('/lms/dashboard/instructor').then(setStatsData).catch(() => {})
//     })

//     const stats = useMemo(() => ([
//         {
//             id: "sessions",
//             title: "Live Sessions This Week",
//             value: String(statsData.live_sessions_week ?? 0),
//             icon: <Video className="h-[18px] w-[18px] text-[#5b3df6]" />,
//             pill: { label: "Auto synced", type: "success" },
//         },
//         {
//             id: "labs",
//             title: "Practical Lab Modules",
//             value: String(statsData.lab_modules ?? 0),
//             icon: <GraduationCap className="h-[18px] w-[18px] text-[#5b3df6]" />,
//             pill: { label: "Auto synced", type: "secondary" },
//         },
//         {
//             id: "tests",
//             title: "Weekly MCQ Tests",
//             value: String(statsData.weekly_tests ?? 0),
//             icon: <FileText className="h-[18px] w-[18px] text-[#5b3df6]" />,
//             pill: { label: "Auto synced", type: "warning" },
//         },
//         {
//             id: "events",
//             title: "Active School Events",
//             value: String(statsData.events ?? 0),
//             icon: <Calendar className="h-[18px] w-[18px] text-[#5b3df6]" />,
//             pill: { label: "Auto synced", type: "success" },
//         },
//     ]), [statsData])

//     return (
//         <div className="min-h-full bg-[#F7FAFD]">
//             <div className="bg-gradient-to-b flex h-full flex-col gap-[24px] from-[#f6f8fa] p-4 to-[#f7fcff] sm:p-6 lg:p-7">
//                 {/* ── Hero Card ── */}
//                 <section className="w-full shrink-0 rounded-[8px] border border-black/[0.08] border-solid bg-gradient-to-br from-white to-[#e8f5ff] px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
//                     <div className="flex flex-col items-start gap-[11px]">
//                         <div className="bg-[#ffd966] flex items-center px-[10px] py-[6.5px] rounded-[12px] shrink-0">
//                             <div className="text-[12px] font-medium text-[#4b2e00]">
//                                 Learning platform snapshot
//                             </div>
//                         </div>
//                         <div className="text-[22px] font-bold leading-tight text-[#0f172a] sm:text-[26px] lg:text-[28px]">
//                             Online classes, practical labs, tests, and school events in one place.
//                         </div>
//                         <div className="text-[13px] leading-relaxed text-[#94a3b8] sm:text-[14px]">
//                             A unified dashboard for live and recorded classes, teacher training, MCQ-based weekly tests with same-day results, and active participation in school events.
//                         </div>
//                     </div>
//                     <div className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
//                         <BtnPrimary className="w-full justify-center sm:w-auto">📹 Open Classes</BtnPrimary>
//                         <BtnOutline className="w-full justify-center sm:w-auto">📅 This week</BtnOutline>
//                     </div>
//                 </section>

//                 {/* ── Stats Grid ── */}
//                 <div className="grid grid-cols-1 gap-x-[16px] gap-y-[16px] sm:grid-cols-2 xl:grid-cols-4">
//                     {stats.map((s) => (
//                         <Stat 
//                             key={s.id}
//                             title={s.title}
//                             value={s.value}
//                             meta={s.pill.label}
//                             icon={s.icon}
//                         />
//                     ))}
//                 </div>

//                 {/* ── Content Grid 2×2 ── */}
//                 <div className="grid grid-cols-1 gap-x-[24px] gap-y-[24px] xl:grid-cols-2">
//                     <OnlineClassesCard />
//                     <WeeklyTestsCard />4
//                     <TeacherTrainingCard />
//                     <SchoolEventsCard />
//                 </div>
//             </div>
//         </div>
//     );
// }


// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Video,
//   Calendar,
//   FileText,
//   BookOpen,
// } from "lucide-react";
// import { api } from "../../lib/api";
// import useRealtime from "../../hooks/useRealtime";

// /* ────────────────────────────────────────────────
//    Reusable UI Components
// ──────────────────────────────────────────────── */

// const pillVariants = {
//   success: "bg-[#2dd4bf] text-[#023b33]",
//   warning: "bg-[#ffd966] text-[#4b2e00]",
//   secondary: "bg-[#e8f5ff] text-[#0f172a]",
// };

// const Pill = ({ type = "secondary", children }) => (
//   <span
//     className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${pillVariants[type]}`}
//   >
//     {children}
//   </span>
// );

// const BtnPrimary = ({ children, onClick }) => (
//   <button
//     onClick={onClick}
//     className="inline-flex items-center gap-2 h-[40px] px-[16px] rounded-[6px] text-[14px] font-medium bg-[#5b3df6] text-white hover:bg-[#4c2dd9] transition"
//   >
//     {children}
//   </button>
// );

// const BtnOutline = ({ children, onClick }) => (
//   <button
//     onClick={onClick}
//     className="inline-flex items-center gap-2 h-[40px] px-[17px] rounded-[6px] text-[14px] font-medium bg-white border border-black/[0.08] hover:bg-[#f1f5f9]"
//   >
//     {children}
//   </button>
// );

// const Stat = ({ title, value, icon, meta }) => (
//   <div className="bg-white border border-black/[0.08] p-5 rounded-[8px] flex flex-col gap-4">
//     <div className="flex justify-between items-center">
//       <div>
//         <p className="text-sm text-gray-400">{title}</p>
//         <h2 className="text-2xl font-bold">{value}</h2>
//       </div>
//       <div className="bg-[#e8f5ff] p-2 rounded">{icon}</div>
//     </div>
//     <Pill type="secondary">{meta}</Pill>
//   </div>
// );

// /* ────────────────────────────────────────────────
//    MAIN COMPONENT
// ──────────────────────────────────────────────── */

// export default function InstructorDashboard() {
//   const [data, setData] = useState(null);
//   const tenantId = localStorage.getItem("lms_tenant_id");

//   // 🔥 Fetch Dashboard Data
//   const fetchDashboard = async () => {
//     try {
//       const res = await api("/instructor/dashboard");
//       setData(res);
//     } catch (err) {
//       console.error("Dashboard Error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   // 🔁 Realtime Updates
//   useRealtime(tenantId ? `tenant:${tenantId}` : "", fetchDashboard);

//   // 📊 Stats Mapping
//   const stats = useMemo(() => {
//     if (!data) return [];

//     return [
//       {
//         title: "Live Sessions",
//         value: data.live_sessions || 0,
//         icon: <Video size={18} className="text-[#5b3df6]" />,
//         meta: "Live now",
//       },
//       {
//         title: "Upcoming Classes",
//         value: data.upcoming_classes || 0,
//         icon: <Calendar size={18} className="text-[#5b3df6]" />,
//         meta: "Scheduled",
//       },
//       {
//         title: "Tests Created",
//         value: data.tests || 0,
//         icon: <FileText size={18} className="text-[#5b3df6]" />,
//         meta: "Auto counted",
//       },
//       {
//         title: "My Courses",
//         value: data.courses || 0,
//         icon: <BookOpen size={18} className="text-[#5b3df6]" />,
//         meta: "Active",
//       },
//     ];
//   }, [data]);


//   if (!data) {
//     return (
//       <div className="p-6 text-center text-gray-500">
//         Loading dashboard...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-full bg-[#F7FAFD] p-6 space-y-6">
//       {/* ── Hero Section ── */}
//       <div className="bg-white p-6 rounded shadow-sm border">
//         <h1 className="text-2xl font-bold">
//           Instructor Dashboard
//         </h1>
//         <p className="text-gray-500 mt-2">
//           Manage your courses, tests, and live sessions.
//         </p>

//         <div className="mt-4 flex gap-3">
//           <BtnPrimary onClick={() => window.location.href = "/instructor/online-classes"}>
//             📹 Open Classes
//           </BtnPrimary>

//           <BtnOutline onClick={() => window.location.href = "/instructor/my-courses"}>
//             📚 My Courses
//           </BtnOutline>
//         </div>
//       </div>

//       {/* ── Stats Grid ── */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((s, i) => (
//           <Stat key={i} {...s} />
//         ))}
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Calendar, FileText, BookOpen } from "lucide-react";
import { api, getToken } from "../../lib/api";
import useRealtime from "../../hooks/useRealtime";

const StatCard = ({ title, value, icon, meta }) => (
  <div className="rounded-[8px] border border-black/[0.08] bg-white p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[13px] text-[#94a3b8]">{title}</p>
        <h2 className="mt-1 text-[30px] font-bold text-[#0f172a]">{value}</h2>
      </div>
      <div className="rounded-[6px] bg-[#e8f5ff] p-2">{icon}</div>
    </div>
    <p className="mt-3 inline-flex rounded-full bg-[#f1f5f9] px-3 py-1 text-[11px] text-[#475569]">
      {meta}
    </p>
  </div>
);

const ListCard = ({ title, description, items, emptyText, renderItem }) => (
  <div className="rounded-[8px] border border-black/[0.08] bg-white">
    <div className="border-b border-black/[0.06] px-5 py-4">
      <h3 className="text-[17px] font-semibold text-[#0f172a]">{title}</h3>
      <p className="text-[12px] text-[#94a3b8]">{description}</p>
    </div>
    <div className="space-y-3 p-5">
      {items.length === 0 ? (
        <p className="rounded-[6px] border border-dashed border-black/[0.1] p-3 text-[12px] text-[#94a3b8]">
          {emptyText}
        </p>
      ) : (
        items.map(renderItem)
      )}
    </div>
  </div>
);

const getClassTime = (item) => item.start_time || item.start_at || item.scheduled_at;

export default function InstructorDashboard() {
  const navigate = useNavigate();
  const tenantId = localStorage.getItem("lms_tenant_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState({});
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [tests, setTests] = useState([]);

  const handleUnauthorized = () => {
    navigate("/login", { replace: true });
  };

  const fetchDashboard = async () => {
    const token = getToken();
    if (!token) {
      setError("Session expired. Please login again.");
      setLoading(false);
      handleUnauthorized();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [dashboardRes, coursesRes, classesRes, testsRes] = await Promise.all([
        api("/instructor/dashboard"),
        api("/instructor/courses"),
        api("/instructor/classes"),
        api("/instructor/tests"),
      ]);

      setDashboard(dashboardRes || {});
      setCourses(Array.isArray(coursesRes) ? coursesRes : []);
      setClasses(Array.isArray(classesRes) ? classesRes : []);
      setTests(Array.isArray(testsRes) ? testsRes : []);
    } catch (err) {
      const message = err?.message || "Failed to load dashboard";
      setError(message);
      if (message.toLowerCase().includes("not authenticated")) {
        handleUnauthorized();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useRealtime(tenantId ? `tenant:${tenantId}` : "", fetchDashboard);

  const sortedClasses = useMemo(() => {
    return [...classes]
      .sort((a, b) => new Date(getClassTime(b) || 0) - new Date(getClassTime(a) || 0))
      .slice(0, 4);
  }, [classes]);

  const sortedTests = useMemo(() => {
    return [...tests]
      .sort((a, b) => new Date(b.scheduled_at || b.created_at || 0) - new Date(a.scheduled_at || a.created_at || 0))
      .slice(0, 4);
  }, [tests]);

  const recentCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 4);
  }, [courses]);

  const stats = [
    {
      title: "Live Sessions",
      value: dashboard.live_sessions ?? 0,
      icon: <Video size={18} className="text-[#5b3df6]" />,
      meta: "Live right now",
    },
    {
      title: "Upcoming Classes",
      value: dashboard.upcoming_classes ?? 0,
      icon: <Calendar size={18} className="text-[#5b3df6]" />,
      meta: "Scheduled next",
    },
    {
      title: "Tests Created",
      value: dashboard.tests ?? tests.length,
      icon: <FileText size={18} className="text-[#5b3df6]" />,
      meta: "From backend",
    },
    {
      title: "My Courses",
      value: dashboard.courses ?? courses.length,
      icon: <BookOpen size={18} className="text-[#5b3df6]" />,
      meta: "Published by you",
    },
  ];

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="mb-3 text-red-500">{error}</p>
        <button
          onClick={fetchDashboard}
          className="rounded bg-[#5b3df6] px-4 py-2 text-sm text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-[#F7FAFD] p-6">
      <div className="rounded-[8px] border border-black/[0.08] bg-white p-6">
        <h1 className="text-xl font-bold text-[#0f172a]">Instructor Dashboard</h1>
        <p className="mt-1 text-sm text-[#64748b]">
          Live metrics and recent activity from your backend data.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ListCard
          title="Recent Classes"
          description="Latest class sessions assigned to you"
          items={sortedClasses}
          emptyText="No classes found yet."
          renderItem={(c) => (
            <div key={c._id} className="rounded-[6px] border border-black/[0.08] p-3">
              <p className="text-[14px] font-semibold text-[#0f172a]">{c.title || "Untitled class"}</p>
              <p className="mt-1 text-[12px] text-[#64748b]">
                {getClassTime(c) ? new Date(getClassTime(c)).toLocaleString() : "No schedule"}
              </p>
              <p className="mt-1 text-[11px] text-[#475569]">Status: {c.status || "upcoming"}</p>
            </div>
          )}
        />

        <ListCard
          title="Recent Tests"
          description="Most recently created tests"
          items={sortedTests}
          emptyText="No tests created yet."
          renderItem={(t) => (
            <div key={t._id} className="rounded-[6px] border border-black/[0.08] p-3">
              <p className="text-[14px] font-semibold text-[#0f172a]">{t.title || "Untitled test"}</p>
              <p className="mt-1 text-[12px] text-[#64748b]">
                {t.scheduled_at ? new Date(t.scheduled_at).toLocaleString() : "Not scheduled"}
              </p>
              <p className="mt-1 text-[11px] text-[#475569]">
                Questions: {t.total_questions ?? 0} - Duration: {t.duration ?? 0} mins
              </p>
            </div>
          )}
        />

        <ListCard
          title="Recent Courses"
          description="Courses published by you"
          items={recentCourses}
          emptyText="No courses available yet."
          renderItem={(c) => (
            <div key={c._id} className="rounded-[6px] border border-black/[0.08] p-3">
              <p className="text-[14px] font-semibold text-[#0f172a]">{c.title || "Untitled course"}</p>
              <p className="mt-1 line-clamp-2 text-[12px] text-[#64748b]">
                {c.description || "No description"}
              </p>
              <p className="mt-1 text-[11px] text-[#475569]">Price: {c.price || "free"}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
}

