import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, ClipboardCheck, Search, Star, Mail, Radio, Clock, Calendar, Users, Play } from "lucide-react";
import { api } from "../lib/api";

// ─── In-memory cache (persists across re-renders, cleared on page reload) ────
const CACHE = {};
const CACHE_TTL = 60_000; // 1 minute

function getCached(key) {
  const entry = CACHE[key];
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    delete CACHE[key];
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  CACHE[key] = { data, ts: Date.now() };
}

// ─── Timeout-aware fetch wrapper ──────────────────────────────────────────────
async function apiWithTimeout(endpoint, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // pass signal if your api() wrapper supports it; otherwise fall back
    const res = await api(endpoint);
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// ─── Cached API call ──────────────────────────────────────────────────────────
async function cachedApi(endpoint, timeoutMs = 5000) {
  const cached = getCached(endpoint);
  if (cached) return cached;
  const res = await apiWithTimeout(endpoint, timeoutMs);
  setCache(endpoint, res);
  return res;
}

// ─── LiveClassCard ────────────────────────────────────────────────────────────
function LiveClassCard({ cls, fadeUp, getSubjectColor, formatStart, navigate }) {
  const subjectColor = getSubjectColor(cls.subject);
  const imgSrc = cls.thumbnail || "";

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -5 }}
      className="min-w-[280px] sm:min-w-0 snap-start rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
      onClick={() => navigate('/signup')}
    >
      <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={cls.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 text-sm font-medium">
            No class image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute top-3 left-3">
          {cls.isLive ? (
            <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-[#1a5c3a] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <Calendar size={10} />
              UPCOMING
            </span>
          )}
        </div>

        {cls.subject && (
          <div className="absolute top-3 right-3">
            <span
              className="text-white text-xs font-semibold px-2 py-1 rounded-lg"
              style={{ backgroundColor: `${subjectColor}cc` }}
            >
              {cls.subject}
            </span>
          </div>
        )}

        {cls.isLive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/40">
              <Play size={22} className="text-white fill-white" />
            </div>
          </div>
        )}

        {!cls.isLive && cls.startDate && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium">
            <Clock size={12} />
            {formatStart(cls.startDate)}
          </div>
        )}
        {cls.isLive && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-xs font-medium">
            <Radio size={12} />
            Happening now
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="text-[#111b2f] text-lg sm:text-xl font-semibold leading-tight line-clamp-2 min-h-[70px]">
          {cls.title}
        </h3>

        <div className="flex items-center gap-2 mt-auto">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: subjectColor }}
          >
            {cls.instructor.charAt(0)}
          </div>
          <span className="text-slate-600 text-sm truncate">{cls.instructor}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-1">
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <Users size={13} />
            <span>{cls.enrolledCount.toLocaleString("en-IN")} enrolled</span>
          </div>
          {cls.duration && (
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <Clock size={13} />
              <span>{cls.duration} min</span>
            </div>
          )}
          <button
            className={`text-xs font-bold py-1.5 px-4 rounded-lg transition-colors ${
              cls.isLive
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-[#0b8276] text-white hover:bg-[#096b61]"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              navigate('/signup');
            }}
          >
            {cls.isLive ? "Join Now" : "Register"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton card shown while loading ───────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="min-w-[280px] sm:min-w-0 rounded-2xl bg-white border border-slate-100 overflow-hidden">
      <div className="h-[180px] bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2" />
        <div className="h-8 bg-slate-100 rounded animate-pulse w-full mt-4" />
      </div>
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage(props) {
  const [liveClasses, setLiveClasses] = useState(() => getCached("/lms/public/live-classes?limit=3")?.items || []);
  const [liveClassesLoading, setLiveClassesLoading] = useState(liveClasses.length === 0);
  const [liveClassesError, setLiveClassesError] = useState(false);

  const [uploadedCourses, setUploadedCourses] = useState(() => getCached("/lms/public/courses?limit=300")?.items || []);
  const [coursesLoading, setCoursesLoading] = useState(uploadedCourses.length === 0);

  const [subscriptionPlans, setSubscriptionPlans] = useState(() => getCached("/lms/public/plans?limit=100&active_only=true")?.items || []);
  const [plansLoading, setPlansLoading] = useState(subscriptionPlans.length === 0);

  const [activeLiveTab, setActiveLiveTab] = useState("all");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const navigate = useNavigate();

  // ── Fetch ALL data in parallel on mount ─────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    // Live classes — highest priority, shown first
    const loadLiveClasses = async () => {
      // Already have cached data — show it immediately, then silently refresh
      const alreadyHasData = liveClasses.length > 0;
      if (!alreadyHasData) setLiveClassesLoading(true);
      setLiveClassesError(false);

      try {
        const res = await cachedApi("/lms/public/live-classes?limit=3", 8000);
        if (!mounted) return;
        const items = Array.isArray(res?.items) ? res.items : [];
        setLiveClasses(items);
        setLiveClassesError(false);
      } catch {
        if (!mounted) return;
        // Don't clear existing cached data on error
        if (liveClasses.length === 0) setLiveClassesError(true);
      } finally {
        if (mounted) setLiveClassesLoading(false);
      }
    };

    // Courses — parallel fetch
    const loadCourses = async () => {
      if (uploadedCourses.length > 0) return; // already cached
      try {
        setCoursesLoading(true);
        const res = await cachedApi("/lms/public/courses?limit=300", 10000);
        if (!mounted) return;
        setUploadedCourses(Array.isArray(res?.items) ? res.items : []);
      } catch {
        if (!mounted) return;
        setUploadedCourses([]);
      } finally {
        if (mounted) setCoursesLoading(false);
      }
    };

    // Plans — parallel fetch
    const loadPlans = async () => {
      if (subscriptionPlans.length > 0) return; // already cached
      try {
        setPlansLoading(true);
        const res = await cachedApi("/lms/public/plans?limit=100&active_only=true", 10000);
        if (!mounted) return;
        setSubscriptionPlans(Array.isArray(res?.items) ? res.items : []);
      } catch {
        if (!mounted) return;
        setSubscriptionPlans([]);
      } finally {
        if (mounted) setPlansLoading(false);
      }
    };

    // Fire all three simultaneously — no waterfall
    Promise.all([loadLiveClasses(), loadCourses(), loadPlans()]);

    return () => { mounted = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getYoutubeVideoId = useCallback((url) => {
    if (!url) return "";
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, "");
      if (host === "youtu.be") return parsed.pathname.split("/").filter(Boolean)[0] || "";
      if (host === "youtube.com" || host === "m.youtube.com") {
        const fromQuery = parsed.searchParams.get("v");
        if (fromQuery) return fromQuery;
        const parts = parsed.pathname.split("/").filter(Boolean);
        if (parts[0] === "embed" || parts[0] === "shorts") return parts[1] || "";
      }
    } catch { return ""; }
    return "";
  }, []);

  const featuredCourses = useMemo(() => {
    return uploadedCourses.slice(0, 6).map((course) => {
      const priceValue = Number(course?.price || 0);
      const videoId = getYoutubeVideoId(course?.youtube_url || "");
      const image = videoId
        ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
        : "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80";
      return {
        id: course?._id,
        title: course?.title || "Untitled Course",
        rating: "4.8",
        reviews: `(${course?.students_count || 0} Learners)`,
        price: `₹${priceValue.toLocaleString("en-IN")}`,
        oldPrice: priceValue > 0 ? `₹${Math.round(priceValue * 1.25).toLocaleString("en-IN")}` : "",
        image,
        youtube_url: course?.youtube_url || "",
      };
    });
  }, [uploadedCourses, getYoutubeVideoId]);

  const howItWorksSteps = [
    { title: "Find Courses", description: "We have helped over 3,400 new students to get into the most popular tech teams. Book Your Seat", icon: Search, highlighted: false },
    { title: "Book Your Seat", description: "We have helped over 3,400 new students to get into the most popular tech teams. Book Your Seat", icon: ClipboardCheck, highlighted: true },
    { title: "Get Certificate", description: "We have helped over 3,400 new students to get into the most popular tech teams. Book Your Seat", icon: BadgeCheck, highlighted: false },
  ];

  const { scrollYProgress } = useScroll();
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
  };

  const coursesRef = useRef(null);
  const reviewsRef = useRef(null);
  const liveClassesRef = useRef(null);

  const scroll = useCallback((ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      ref.current.scrollTo({
        left: direction === "left" ? scrollLeft - clientWidth * 0.7 : scrollLeft + clientWidth * 0.7,
        behavior: "smooth",
      });
    }
  }, []);

  const subjectColors = {
    "Web Development": "#0b8276", "Data Science": "#7c3aed", "Design": "#db2777",
    "Marketing": "#d97706", "AI / ML": "#2563eb", "Backend": "#059669",
  };
  const getSubjectColor = useCallback((subject) => subjectColors[subject] || "#0b8276", []);

  const formatStart = useCallback((date) => {
    if (!date) return "";
    const now = new Date();
    const diff = date - now;
    if (diff < 0) return "Started";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (h > 24) return `${Math.floor(h / 24)}d ${h % 24}h away`;
    if (h > 0) return `Starts in ${h}h ${m}m`;
    return `Starts in ${m}m`;
  }, []);

  const displayClasses = useMemo(() => {
    const now = new Date();
    return liveClasses
      .map((cls) => {
        const startRaw = cls?.start_at || cls?.start_time || cls?.scheduled_at || cls?.starts_at || null;
        const startDate = startRaw ? new Date(startRaw) : null;
        const hasValidDate = startDate instanceof Date && !Number.isNaN(startDate.getTime());
        const isLive = cls?.status === "live" || cls?.is_live === true
          || (hasValidDate && Math.abs(now - startDate) < 30 * 60 * 1000);
        const isUpcoming = !isLive && hasValidDate && startDate > now;
        return {
          id: cls?._id || cls?.id,
          title: cls?.title || "Untitled Class",
          instructor: cls?.instructor_name || cls?.teacher_name || cls?.host || "Instructor",
          thumbnail: cls?.image_url || cls?.thumbnail_url || cls?.cover_image || null,
          subject: cls?.subject || cls?.category || cls?.topic || "",
          startDate: hasValidDate ? startDate : null,
          isLive,
          isUpcoming,
          enrolledCount: cls?.attendee_ids?.length || cls?.enrolled_count || cls?.students_count || cls?.participants || 0,
          duration: cls?.duration_minutes || cls?.duration || null,
        };
      })
      .filter((cls) => cls.id);
  }, [liveClasses]);

  const filteredLiveClasses = useMemo(() => {
    if (activeLiveTab === "live") return displayClasses.filter((c) => c.isLive);
    if (activeLiveTab === "upcoming") return displayClasses.filter((c) => c.isUpcoming);
    return displayClasses;
  }, [activeLiveTab, displayClasses]);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newsletterEmail)) { setNewsletterMessage("Please enter a valid email address"); return; }
    setNewsletterSubmitted(true);
    try {
      await api('/inquire/newsletter', { 
        method: "POST", 
        body: JSON.stringify({ email: newsletterEmail }) 
      });
      setNewsletterMessage("Thank you for subscribing! You'll receive updates soon."); 
      setNewsletterEmail("");
    } catch (err) { 
      setNewsletterMessage("Failed to subscribe. Please try again later."); 
    }
    setTimeout(() => { setNewsletterMessage(""); setNewsletterSubmitted(false); }, 5000);
  };

  return (
    <div className="relative flex flex-col overflow-hidden bg-[#F7FCFF]">
      <div className="self-stretch bg-[#F7FCFF]">
        {/* ── Hero ── */}
        <div className="relative flex flex-col lg:flex-row items-stretch self-stretch lg:min-h-[635px] lg:overflow-visible">
          <div className="flex-1 lg:flex-[0.6] flex flex-col justify-center bg-[#FEF6EE] px-6 pt-3 pb-6 sm:px-12 lg:pl-32 lg:pr-24 gap-5 relative overflow-hidden">
            <motion.svg animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-2 right-35 opacity-60 hidden sm:block" width="70" height="60" viewBox="0 0 70 60" fill="none">
              <path d="M8 50 Q18 8 38 28 Q55 48 62 12" stroke="#FF8A33" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M44 52 Q56 34 60 18" stroke="#FF8A33" strokeWidth="2" fill="none" strokeLinecap="round" />
            </motion.svg>
            <motion.svg animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-45 right-50 opacity-50 hidden md:block" width="55" height="55" viewBox="0 0 55 55" fill="none">
              <path d="M5 45 Q16 5 32 22 Q48 38 50 12" stroke="#FF8A33" strokeWidth="2" fill="none" strokeLinecap="round" />
            </motion.svg>

            <motion.div className="mb-1 lg:pl-20 space-y-1" initial="hidden" animate="show" variants={stagger}>
              <motion.h1 variants={fadeUp} className="text-[#1a5c3a] text-3xl sm:text-4xl lg:text-[50px] font-extrabold leading-[1.1]">Learn Smarter.</motion.h1>
              <motion.div variants={fadeUp} className="leading-[1.1]">
                <span className="text-[#1a5c3a] text-3xl sm:text-4xl lg:text-[50px] font-extrabold">Grow Faster.</span>
              </motion.div>
              <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap leading-[1.1]">
                <span className="text-[#1a5c3a] text-3xl sm:text-4xl lg:text-[50px] font-extrabold">Become the</span>
                <motion.span whileHover={{ scale: 1.1, rotate: 2 }} className="inline-block bg-[#FF8A33] text-white text-3xl sm:text-4xl lg:text-[50px] font-extrabold px-3 sm:px-4 rounded-xl leading-tight shadow-sm cursor-default">Best</motion.span>
              </motion.div>
              <motion.div variants={fadeUp} className="text-[#1a5c3a] text-3xl sm:text-4xl lg:text-[50px] font-extrabold leading-[1.1]">Version of You</motion.div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" className="block lg:hidden w-full mt-2 mb-2">
              <div className="relative w-full h-[240px] sm:h-[300px] rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(102deg, #f8c8b8 0px, #f8c8b8 8px, #fde7de 8px, #fde7de 18px)" }} />
                <img src="/iStock-1216256788-crop.webp" alt="Student" className="absolute inset-0 z-10 w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.p variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.4 }} className="text-slate-500 lg:pl-20 text-sm sm:text-base max-w-[420px] leading-relaxed font-medium">
              Unlimited courses, expert mentors, and real-world skills — everything you need to succeed in one place.
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.5 }} className="flex items-center gap-5 lg:pl-20">
              <button className="bg-[#1a5c3a] text-white text-sm sm:text-base font-bold py-3 px-8 sm:px-10 rounded-lg border-0 cursor-pointer hover:bg-[#144d31] transition-all transform hover:scale-105" onClick={() => navigate("/login")}>
                Get Started
              </button>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.6 }} className="flex items-center gap-4 lg:pl-20">
              <div className="flex -space-x-3">
                {[32, 44, 68, 44].map((n, i) => (
                  <motion.img whileHover={{ y: -5, zIndex: 20 }} key={i} src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${n}.jpg`} alt="student" className="w-10 h-10 border-2 border-white rounded-full object-cover cursor-pointer" />
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-slate-800 text-xs sm:text-sm font-bold">Trusted by 10K+</span>
                <span className="text-slate-800 text-xs sm:text-sm font-bold">active students worldwide 🌍</span>
              </div>
            </motion.div>
          </div>

          <div className="hidden lg:flex lg:flex-[0.53] items-center justify-center relative bg-[#0e7c67] min-h-0">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.svg animate={{ x: [0, 20, 0], y: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute top-10 right-30 opacity-30" width="200" height="100" viewBox="0 0 120 78" fill="none">
                <path d="M7 33 C12 16 22 9 35 8 C48 6 58 13 63 23 C68 11 77 7 86 9 C96 12 100 20 100 30 C111 31 117 38 116 47 C114 58 103 63 92 62" stroke="#9CD7CC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
              <motion.svg animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute right-14 bottom-14 opacity-50" width="140" height="140" viewBox="0 0 170 170" fill="none">
                <defs>
                  <pattern id="heroStripes" patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="16" stroke="#2CC0AB" strokeWidth="4" />
                  </pattern>
                </defs>
                <circle cx="85" cy="85" r="70" fill="#189987" fillOpacity="0.42" />
                <circle cx="85" cy="85" r="70" fill="url(#heroStripes)" />
              </motion.svg>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.8, x: 100 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10 lg:absolute lg:top-75 lg:left-15 lg:-translate-x-[38%] lg:-translate-y-1/2">
              <div className="relative rounded-[22px] overflow-hidden shadow-2xl w-[450px] h-[350px]">
                <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(102deg, #f8c8b8 0px, #f8c8b8 8px, #fde7de 8px, #fde7de 18px)" }} />
                <img src="/iStock-1216256788-crop.webp" alt="Student" className="absolute inset-0 z-10 w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Live Classes Section ── */}
      <motion.div
        className="self-stretch px-4 py-10 md:py-16 bg-[#f7efeb]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between text-center md:text-left">
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl sm:text-4xl lg:text-[41px] font-extrabold leading-tight text-[#111b2f]">
                Explore Our Live Classes
              </h2>
              <p className="mt-2 text-sm text-slate-600 md:text-left">
                Join real-time sessions with expert instructors — interactive, engaging, and career-focused.
              </p>
            </motion.div>
          </div>

          {/* ── Cards: skeleton → real data, no long blank wait ── */}
          {liveClassesLoading ? (
            // Show 3 skeleton placeholders instantly while fetching
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" variants={stagger}>
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </motion.div>
          ) : liveClassesError ? (
            // Friendly error with retry button — don't leave users hanging
            <motion.div
              className="rounded-2xl bg-white border border-dashed border-red-200 p-10 text-center"
              variants={fadeUp}
            >
              <p className="text-slate-500 mb-4">Could not load live classes right now.</p>
              <button
                onClick={() => {
                  delete CACHE["/lms/public/live-classes?limit=3"];
                  setLiveClassesLoading(true);
                  setLiveClassesError(false);
                  cachedApi("/lms/public/live-classes?limit=3", 8000)
                    .then((res) => setLiveClasses(Array.isArray(res?.items) ? res.items : []))
                    .catch(() => setLiveClassesError(true))
                    .finally(() => setLiveClassesLoading(false));
                }}
                className="bg-[#0b8276] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#096b61] transition-colors"
              >
                Retry
              </button>
            </motion.div>
          ) : filteredLiveClasses.length === 0 ? (
            <motion.div className="rounded-2xl bg-slate-50 border border-dashed border-slate-300 p-10 text-center text-slate-400" variants={fadeUp}>
              No {activeLiveTab === "live" ? "live" : activeLiveTab === "upcoming" ? "upcoming" : ""} classes right now. Check back soon!
            </motion.div>
          ) : (
            <motion.div
              ref={liveClassesRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 md:gap-6 no-scrollbar"
              variants={stagger}
            >
              {filteredLiveClasses.map((cls) => (
                <LiveClassCard key={cls.id} cls={cls} fadeUp={fadeUp} getSubjectColor={getSubjectColor} formatStart={formatStart} navigate={navigate} />
              ))}
            </motion.div>
          )}

        </div>
      </motion.div>

      {/* ── Featured Courses ── */}
      <motion.div className="relative self-stretch overflow-hidden bg-[#f7efeb] py-1 md:py-14" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
        <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-8 md:px-10 lg:px-14">
          <div className="mb-8 md:mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-center md:text-left">
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl sm:text-4xl lg:text-[41px] font-extrabold leading-tight text-[#111b2f]">Explore Our Course Offerings</h2>
              <p className="mt-2 text-sm text-slate-500 md:text-left">Explore top-rated courses designed to help you gain real-world skills and advance your career.</p>
            </motion.div>
          </div>
          <motion.div ref={coursesRef} className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 md:gap-6 no-scrollbar" variants={stagger}>
            {coursesLoading ? (
              [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            ) : featuredCourses.length === 0 ? (
              <motion.div className="col-span-full rounded-2xl bg-white p-6 text-center text-slate-500" variants={fadeUp}>No uploaded courses found.</motion.div>
            ) : featuredCourses.map((course) => (
              <motion.div
                key={course.title}
                className="min-w-[280px] sm:min-w-0 snap-start rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                variants={fadeUp}
                whileHover={{ y: -5 }}
                onClick={() => navigate('/signup')}
              >
                <img src={course.image} alt={course.title} className="h-[200px] sm:h-[220px] w-full rounded-xl object-cover" loading="lazy" decoding="async" />
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <span>{course.rating}</span>
                  <span>{course.reviews}</span>
                  <div className="flex items-center gap-0.5 text-[#ff9d67]">
                    {Array.from({ length: 5 }).map((_, idx) => <Star key={idx} size={14} fill="currentColor" strokeWidth={0} />)}
                  </div>
                </div>
                <h3 className="mt-2 min-h-[70px] text-lg sm:text-xl font-semibold leading-tight text-[#111b2f] line-clamp-2">{course.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-[20px] font-bold leading-none text-[#111111]">{course.price}</span>
                    {course.oldPrice ? <span className="text-xs sm:text-sm text-slate-400 line-through">{course.oldPrice}</span> : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Who is it for ── */}
      <motion.div className="self-stretch bg-[#f7efeb] px-4 py-1 sm:py-2" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <div className="mx-auto w-full max-w-[1200px]">
          <motion.div className="text-center" variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#111b2f]">Who is it for?</h2>
            <p className="mt-2 text-base text-slate-500">Built for learners, educators, and institutions who believe in smarter education.</p>
          </motion.div>
          <motion.div className="mt-8 sm:mt-10 flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 no-scrollbar" variants={stagger}>
            {[
              { title: "Schools & Classes", desc: "Bring your school online! Manage classes, teachers, and create a fun learning journey.", img: "/schools_classes.png" },
              { title: "Teachers & Tutors", desc: "Create magical lessons and share your knowledge with young learners around the world.", img: "/teachers_tutors.png" },
              { title: "Kids & Parents", desc: "A safe, colorful, and exciting place where children love to learn new things.", img: "/kids_parents.png" },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp} whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }} className="min-w-[280px] sm:min-w-0 snap-start rounded-2xl bg-white/80 p-4 text-center shadow-sm transition-all duration-300">
                <img src={item.img} alt={item.title} className="h-[180px] sm:h-[200px] lg:h-[220px] w-full rounded-xl object-cover" loading="lazy" />
                <h3 className="mt-4 text-2xl sm:text-[28px] font-semibold text-[#111b2f]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── How It Works ── */}
      <motion.div className="self-stretch bg-[#f7efeb] px-4 py-5 sm:py-2" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={fadeUp}>
        <div className="mx-auto w-full max-w-[1200px] rounded-2xl bg-[#f7efeb] p-4 sm:p-8 lg:p-12">
          <motion.div className="mx-auto max-w-3xl text-center" variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#111b2f]">How It Works?</h2>
            <p className="mt-3 text-sm sm:text-base text-slate-500">Start your learning journey in just a few simple steps and achieve your goals faster than ever.</p>
          </motion.div>
          <motion.div className="mt-8 sm:mt-10 flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 no-scrollbar" variants={stagger}>
            {howItWorksSteps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.title} className={`min-w-[280px] sm:min-w-0 snap-start rounded-xl p-6 sm:p-8 text-center transition-all ${step.highlighted ? "bg-[#0b8276] text-white shadow-lg" : "bg-white text-slate-800 shadow-sm hover:shadow-md"}`} variants={fadeUp} whileHover={{ y: -6 }}>
                  <div className={`mx-auto mb-5 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full ${step.highlighted ? "bg-white/90" : "bg-[#e3f0ed]"}`}>
                    <Icon size={28} className="text-[#0b8276]" />
                  </div>
                  <h3 className={`text-xl sm:text-[24px] font-bold ${step.highlighted ? "text-white" : "text-[#111b2f]"}`}>{step.title}</h3>
                  <p className={`mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed ${step.highlighted ? "text-white/90" : "text-slate-500"}`}>{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Pricing ── */}
      <motion.div className="self-stretch bg-[#f7efeb] px-4 py-5 sm:py-2" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <div className="mx-auto w-full max-w-[1200px]">
          <motion.div className="text-center" variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#111b2f]">Simple, transparent pricing</h2>
            <p className="mt-2 text-base text-slate-500">Simple pricing. Powerful learning. No hidden costs.</p>
          </motion.div>
          <motion.div className="mt-8 sm:mt-10 flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 no-scrollbar" variants={stagger}>
            {plansLoading ? (
              [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            ) : subscriptionPlans.length === 0 ? (
              <div className="col-span-full rounded-xl bg-white p-6 text-center text-slate-500">No uploaded subscriptions found.</div>
            ) : subscriptionPlans.slice(0, 3).map((plan, idx) => {
              const isHighlighted = idx === 1;
              const planName = plan?.name || "Subscription";
              const billing = plan?.billing_period || "monthly";
              const price = Number(plan?.price || 0);
              const priceLabel = `₹${price.toLocaleString("en-IN")}`;
              if (isHighlighted) {
                return (
                  <motion.div
                    key={plan?._id || `${planName}-${idx}`}
                    variants={fadeUp}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => navigate('/login')}
                    className="min-w-[300px] sm:min-w-0 snap-center relative flex cursor-pointer flex-col items-center rounded-xl shadow-xl"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="pointer-events-none absolute left-1/2 top-2 z-30 -translate-x-1/2"
                    >
                      <span className="inline-flex h-7 items-center bg-[#FF8A33] text-white text-sm font-bold px-5 rounded-xl shadow-lg whitespace-nowrap">
                        Most Popular
                      </span>
                    </motion.div>
                    <div className="flex flex-col items-center bg-slate-900 py-8 sm:py-10 px-6 w-full h-full rounded-xl overflow-hidden">
                      <h3 className="text-[#F7FCFF] text-2xl font-bold">{planName}</h3>
                      <div className="flex items-baseline justify-center mt-2">
                        <span className="text-[#F7FCFF] text-5xl sm:text-[56px] font-bold">{priceLabel}</span>
                        <span className="text-white text-lg ml-1">/{billing}</span>
                      </div>
                      <div className="flex flex-col w-full gap-3 py-4 text-[#F7FCFF] text-sm sm:text-base">
                        <span>Flexible plan billing</span><span>Access to platform courses</span><span>Live class eligibility</span><span>Student support included</span>
                      </div>
                      <button
                        className="w-full bg-[#FF8A33] text-white font-bold py-3 rounded-lg hover:bg-[#e07a2e] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/login');
                        }}
                      >
                        Choose {planName}
                      </button>
                    </div>
                  </motion.div>
                );
              }
              return (
                <motion.div
                  key={plan?._id || `${planName}-${idx}`}
                  variants={fadeUp}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate('/login')}
                  className="min-w-[300px] sm:min-w-0 snap-center flex cursor-pointer flex-col items-center gap-4 rounded-xl border border-[#00000012] bg-white px-6 py-8 sm:py-10 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <h3 className="text-slate-900 text-2xl font-bold">{planName}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-slate-900 text-5xl sm:text-[56px] font-bold">{priceLabel}</span>
                    <span className="text-slate-400 text-lg ml-1">/{billing}</span>
                  </div>
                  <div className="flex flex-col w-full gap-3 py-4 text-slate-900 text-sm sm:text-base">
                    <span>Self-paced learning access</span><span>Course progress tracking</span><span>Certification support</span>
                  </div>
                  <button
                    className="w-full bg-transparent py-3 rounded-lg border-2 border-[#00000012] font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/login');
                    }}
                  >
                    Choose {planName}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Reviews ── */}
      <motion.div className="self-stretch bg-[#f7efeb] px-4 py-5 sm:py-2" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={fadeUp}>
        <div className="mx-auto w-full max-w-[1200px] rounded-2xl bg-[#f7efeb] p-4 sm:p-8 lg:p-10">
          <motion.div className="mx-auto max-w-3xl text-center" variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#111b2f]">Our Students Reviews</h2>
            <p className="mt-3 text-sm sm:text-base text-slate-500">Hear from our students who have transformed their learning journey with EduMart.</p>
          </motion.div>
          <div className="mt-8 flex items-center gap-3">
            <button className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-[#4D73EE] hover:bg-slate-100 transition-colors" onClick={() => scroll(reviewsRef, "left")}><ChevronLeft size={18} /></button>
            <motion.div ref={reviewsRef} className="flex-1 flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 md:grid md:grid-cols-3 no-scrollbar" variants={stagger}>
              {[
                { name: "Emma", role: "student", avatar: "/StudentAvtar.jpg" },
                { name: "John Doe", role: "CEO", avatar: "/Ceo.png" },
                { name: "Zoey", role: "Web Developer", avatar: "/lms-software-gestion-aprendizaje.webp" },
              ].map((review) => (
                <motion.div key={review.name} className="min-w-[280px] sm:min-w-0 snap-start rounded-xl bg-white p-5 sm:p-6 text-center shadow-sm hover:shadow-md transition-all" variants={fadeUp} whileHover={{ y: -5 }}>
                  <div className="flex flex-col items-center gap-3">
                    <img src={review.avatar} alt={review.name} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                    <p className="text-sm italic leading-relaxed text-slate-500">"This platform completely changed how I learn. The courses are practical, engaging, and truly valuable."</p>
                  </div>
                  <h3 className="mt-4 text-xl sm:text-[24px] font-semibold text-slate-700">{review.name}</h3>
                  <p className="text-sm italic text-[#0b8276]">{review.role}</p>
                </motion.div>
              ))}
            </motion.div>
            <button className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-[#4D73EE] hover:bg-slate-100 transition-colors" onClick={() => scroll(reviewsRef, "right")}><ChevronRight size={18} /></button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#4D73EE]" />
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          </div>
        </div>
      </motion.div>

      {/* ── Newsletter ── */}
      <motion.div className="self-stretch bg-[#0e7c67] px-4 py-16 sm:py-20" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}>
        <div className="mx-auto w-full max-w-[800px] text-center">
          <motion.div variants={fadeUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white">Stay Updated with EduMart</h2>
            <p className="mt-3 text-base text-white/80 max-w-2xl mx-auto">Get exclusive updates, new course launches, and learning tips directly in your inbox.</p>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-8">
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input type="email" placeholder="Enter your email address" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} className="flex-1 px-6 py-4 rounded-xl bg-white text-slate-700 placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-[#FF8A33] border-0" required />
              <button type="submit" className="bg-[#FF8A33] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#e07a2e] transition-colors whitespace-nowrap">Subscribe Now</button>
            </form>
            {newsletterMessage && (
              <p className={`mt-4 text-sm ${newsletterSubmitted ? "text-green-200" : "text-red-200"}`}>{newsletterMessage}</p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}