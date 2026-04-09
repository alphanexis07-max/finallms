import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, ClipboardCheck, Search, Star } from "lucide-react";

export default (props) => {
    const featuredCourses = [
        {
            title: "Digital Marketing (10 month) Crash Course",
            rating: "4.7",
            reviews: "(450 Review)",
            price: "$20.000",
            oldPrice: "$200.000",
            image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/zdfkwoq9_expires_30_days.png",
        },
        {
            title: "English Language Popular Course (10 month)",
            rating: "4.7",
            reviews: "(450 Review)",
            price: "$20.000",
            oldPrice: "$200.000",
            image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/y2ugpgwn_expires_30_days.png",
        },
        {
            title: "3D Animation Designer(10 month) Adobe After effect",
            rating: "4.7",
            reviews: "(450 Review)",
            price: "$20.000",
            oldPrice: "$200.000",
            image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/pb4ocxvm_expires_30_days.png",
        },
        {
            title: "The complete business plan course includes 10+ templates",
            rating: "4.8",
            reviews: "(380 Review)",
            price: "$18.000",
            oldPrice: "$150.000",
            image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/344cmw5b_expires_30_days.png",
        },
        {
            title: "Education Software and PHP and JS System Script",
            rating: "4.6",
            reviews: "(420 Review)",
            price: "$24.000",
            oldPrice: "$240.000",
            image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/atih781j_expires_30_days.png",
        },
        {
            title: "Full Web Designing Course With 30 Web Template",
            rating: "4.5",
            reviews: "(300 Review)",
            price: "$15.000",
            oldPrice: "$99.000",
            image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/xz2lhbfq_expires_30_days.png",
        },
    ];

    const howItWorksSteps = [
        {
            title: "Find Courses",
            description: "We have helped over 3,400 new students to get into the most popular tech teams. Book Your Seat",
            icon: Search,
            highlighted: false,
        },
        {
            title: "Book Your Seat",
            description: "We have helped over 3,400 new students to get into the most popular tech teams. Book Your Seat",
            icon: ClipboardCheck,
            highlighted: true,
        },
        {
            title: "Get Certificate",
            description: "We have helped over 3,400 new students to get into the most popular tech teams. Book Your Seat",
            icon: BadgeCheck,
            highlighted: false,
        },
    ];

    const { scrollYProgress } = useScroll();
    const heroImageY = useTransform(scrollYProgress, [0, 1], [0, -60]);

    const fadeUp = {
        hidden: { opacity: 0, y: 28 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const stagger = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.08,
            },
        },
    };

    return (
        <div className="relative flex flex-col overflow-hidden bg-white">
            <div className="self-stretch bg-[#F7FCFF]">
                {/* Hero Section - Fixed overlapping issues */}
                <div className="relative flex items-stretch self-stretch min-h-[635px]">
					{/* Left panel — cream/beige */}
					<div className="flex flex-1 flex-col justify-center bg-[#FEF6EE] pl-51 pr-40 py-16 gap-5 relative overflow-hidden">
						{/* Squiggle top-right */}
						<svg className="absolute top-10 right-55 opacity-60" width="70" height="60" viewBox="0 0 70 60" fill="none">
							<path d="M8 50 Q18 8 38 28 Q55 48 62 12" stroke="#FF8A33" strokeWidth="2.5" fill="none" strokeLinecap="round" />
							<path d="M44 52 Q56 34 60 18" stroke="#FF8A33" strokeWidth="2" fill="none" strokeLinecap="round" />
						</svg>
						{/* Arrow squiggle bottom-right */}
						<svg className="absolute bottom-55 right-70 opacity-50" width="55" height="55" viewBox="0 0 55 55" fill="none">
							<path d="M5 45 Q16 5 32 22 Q48 38 50 12" stroke="#FF8A33" strokeWidth="2" fill="none" strokeLinecap="round" />
							<line x1="42" y1="10" x2="52" y2="7" stroke="#FF8A33" strokeWidth="2" strokeLinecap="round" />
							<line x1="52" y1="7" x2="50" y2="18" stroke="#FF8A33" strokeWidth="2" strokeLinecap="round" />
						</svg>

						{/* Badge */}
						<div className="flex items-center gap-2">
							<span style={{ color: "#FF8A33", fontSize: "17px", lineHeight: 1 }}>✳</span>
							<span className="text-slate-500 text-sm">30 Days free trial</span>
						</div>

						{/* Headline */}
						<div>
							<div className="text-[#1a5c3a] text-[50px] font-extrabold leading-[1.1]">Build Your Skills</div>
							<div className="flex items-center gap-3 flex-wrap leading-[1.1] mt-1">
								<span className="text-[#1a5c3a] text-[50px] font-extrabold">on the</span>
								<span className="inline-block bg-[#FF8A33] text-white text-[50px] font-extrabold px-4 rounded-xl leading-tight">Best</span>
							</div>
							<div className="text-[#1a5c3a] text-[50px] font-extrabold leading-[1.1] mt-1">Platform</div>
						</div>

						{/* Subtitle */}
						<p className="text-slate-400 text-[15px] max-w-[360px] leading-relaxed mt-1">
							Find Unlimited Courses That Match Your Niche to Hasten the Process of Developing Your Skills
						</p>

						{/* CTAs */}
						<div className="flex items-center gap-5 mt-1">
							<button
								className="bg-[#1a5c3a] text-white text-sm font-bold py-3 px-8 rounded-lg border-0 cursor-pointer"
								onClick={() => alert("Pressed!")}
							>
								Get Started
							</button>
							<button
								className="flex items-center gap-2 bg-transparent border-0 text-slate-700 text-sm font-semibold cursor-pointer"
								onClick={() => alert("Pressed!")}
							>
								<span
									className="flex items-center justify-center w-10 h-10 rounded-full text-white text-xs"
									style={{ background: "#FF8A33" }}
								>
									▶
								</span>
								Video Play
							</button>
						</div>

						{/* Active students */}
						<div className="flex items-center gap-3 mt-2">
							<div className="flex" style={{ gap: "-8px" }}>
								{[
									"https://randomuser.me/api/portraits/men/32.jpg",
									"https://randomuser.me/api/portraits/men/44.jpg",
									"https://randomuser.me/api/portraits/women/68.jpg",
									"https://randomuser.me/api/portraits/women/44.jpg",
								].map((src, i) => (
									<img
										key={i}
										src={src}
										alt="student"
										style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid white", objectFit: "cover", marginLeft: i === 0 ? 0 : -10 }}
									/>
								))}
							</div>
							<div>
								<div className="text-slate-800 text-sm font-bold">10.00+ Active</div>
								<div className="text-slate-800 text-sm font-bold">Student</div>
							</div>
						</div>
					</div>

					{/* Right panel — teal */}
					<div
						className="flex flex-1 items-center justify-center relative overflow-hidden"
						style={{ background: "#0e7c67" }}
					>
						{/* Top-right cloud outline */}
						<svg
							className="absolute"
							style={{ top: 70, right: 30, opacity: 0.58 }}
							width="1200"
							height="80"
							viewBox="0 0 120 78"
							fill="none"
						>
							<path
								d="M7 33 C12 16 22 9 35 8 C48 6 58 13 63 23 C68 11 77 7 86 9 C96 12 100 20 100 30 C111 31 117 38 116 47 C114 58 103 63 92 62"
								stroke="#9CD7CC"
								strokeWidth="2.2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M7 33 C12 16 22 9 35 8 C48 6 58 13 63 23 C68 11 77 7 86 9 C96 12 100 20 100 30 C111 31 117 38 116 47 C114 58 103 63 92 62"
								stroke="#9CD7CC"
								strokeWidth="2.2"
								strokeLinecap="round"
							/>
						</svg>

						{/* Bottom-right striped circle */}
						<svg
							className="absolute"
							style={{ right: 36, bottom: 28, opacity: 0.62 }}
							width="170"
							height="170"
							viewBox="0 0 170 170"
							fill="none"
						>
							<defs>
								<clipPath id="heroStripeCircle">
									<circle cx="85" cy="85" r="70" />
								</clipPath>
							</defs>
							<circle cx="85" cy="85" r="70" fill="#189987" fillOpacity="0.42" />
							<g clipPath="url(#heroStripeCircle)" stroke="#2CC0AB" strokeWidth="4">
								<line x1="-20" y1="45" x2="65" y2="130" />
								<line x1="-8" y1="33" x2="77" y2="118" />
								<line x1="4" y1="21" x2="89" y2="106" />
								<line x1="16" y1="9" x2="101" y2="94" />
								<line x1="28" y1="-3" x2="113" y2="82" />
								<line x1="40" y1="-15" x2="125" y2="70" />
								<line x1="52" y1="-27" x2="137" y2="58" />
								<line x1="64" y1="-39" x2="149" y2="46" />
								<line x1="76" y1="-51" x2="161" y2="34" />
								<line x1="88" y1="-63" x2="173" y2="22" />
								<line x1="100" y1="-75" x2="185" y2="10" />
							</g>
						</svg>
					</div>

					{/* Center visual card across split */}
					<div className="pointer-events-none absolute inset-y-0 left-250 z-20 hidden -translate-x-1/2 items-center md:flex">
						<div className="relative h-[400px] w-[350px] rounded-[22px] overflow-hidden">
							<div
								className="absolute inset-0 pr-100"
								style={{
									background:
										"repeating-linear-gradient(102deg, #f8c8b8 0px, #f8c8b8 8px, #fde7de 8px, #fde7de 18px)",
								}}
							/>
							<img
								src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/0lfkrcpg_expires_30_days.png"
								alt="Student"
								className="absolute -bottom-1 left-40 z-10 h-[400px] w-auto -translate-x-1/2 object-contain"
							/>
						</div>
					</div>
				</div>

                {/* Featured Courses Section - Fixed padding and margins */}
                <motion.div
                    className="relative self-stretch overflow-hidden bg-[#f7efeb] py-12 md:py-14"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeUp}
                >
                    <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-8 md:px-10 lg:px-14">
                        <div className="mb-8 md:mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <motion.div variants={fadeUp}>
                                <h2 className="text-3xl sm:text-4xl lg:text-[41px] font-extrabold leading-tight text-[#111b2f]">
                                    Explore Our Course Offerings
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    There are many variations of passages of Lorem Ipsum.
                                </p>
                            </motion.div>

                            <motion.div className="flex items-center gap-3" variants={fadeUp}>
                                <button
                                    className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border-2 border-[#0b8276] text-[#0b8276] hover:bg-[#0b8276] hover:text-white transition-colors"
                                    onClick={() => alert("Pressed!")}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#0b8276] text-white hover:bg-[#096b61] transition-colors"
                                    onClick={() => alert("Pressed!")}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </motion.div>
                        </div>

                        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6" variants={stagger}>
                            {featuredCourses.slice(0, 6).map((course) => (
                                <motion.div key={course.title} className="rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow" variants={fadeUp} whileHover={{ y: -5 }}>
                                    <img src={course.image} alt={course.title} className="h-[200px] sm:h-[220px] w-full rounded-xl object-cover" />
                                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                                        <span>{course.rating}</span>
                                        <span>{course.reviews}</span>
                                        <div className="flex items-center gap-0.5 text-[#ff9d67]">
                                            {Array.from({ length: 5 }).map((_, idx) => (
                                                <Star key={idx} size={14} fill="currentColor" strokeWidth={0} />
                                            ))}
                                        </div>
                                    </div>
                                    <h3 className="mt-2 min-h-[70px] text-lg sm:text-xl font-semibold leading-tight text-[#111b2f] line-clamp-2">
                                        {course.title}
                                    </h3>
                                    <div className="flex items-center justify-between gap-3 mt-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl sm:text-[20px] font-bold leading-none text-[#111111]">{course.price}</span>
                                            <span className="text-xs sm:text-sm text-slate-400 line-through">{course.oldPrice}</span>
                                        </div>
                                        <button
                                            className="rounded-xl bg-[#0b8276] px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#096b61] transition-colors"
                                            onClick={() => alert("Pressed!")}
                                        >
                                            View Course
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Who is it for? Section */}
                <div className="self-stretch bg-[#f7efeb] px-4 py-12 sm:py-16">
                    <div className="mx-auto w-full max-w-[1200px]">
                        <div className="text-center">
                            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#111b2f]">Who is it for?</h2>
                            <p className="mt-2 text-base text-slate-500">Made for everyone who helps children learn and grow.</p>
                        </div>
                        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Schools & Classes",
                                    desc: "Bring your school online! Manage classes, teachers, and create a fun learning journey.",
                                    img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/zdfkwoq9_expires_30_days.png",
                                },
                                {
                                    title: "Teachers & Tutors",
                                    desc: "Create magical lessons and share your knowledge with young learners around the world.",
                                    img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/y2ugpgwn_expires_30_days.png",
                                },
                                {
                                    title: "Kids & Parents",
                                    desc: "A safe, colorful, and exciting place where children love to learn new things.",
                                    img: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/pb4ocxvm_expires_30_days.png",
                                },
                            ].map((item) => (
                                <div key={item.title} className="rounded-2xl bg-white/80 p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                                    <img src={item.img} alt={item.title} className="h-[180px] sm:h-[200px] lg:h-[220px] w-full rounded-xl object-cover" />
                                    <h3 className="mt-4 text-2xl sm:text-[28px] font-semibold text-[#111b2f]">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* How It Works Section */}
                <motion.div
                    className="self-stretch bg-[#f7efeb] px-4 py-12 sm:py-16"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    variants={fadeUp}
                >
                    <div className="mx-auto w-full max-w-[1200px] rounded-2xl bg-[#f7efeb] p-4 sm:p-8 lg:p-12">
                        <motion.div className="mx-auto max-w-3xl text-center" variants={fadeUp}>
                            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#111b2f]">How It Works?</h2>
                            <p className="mt-3 text-sm sm:text-base text-slate-500">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                            </p>
                        </motion.div>

                        <motion.div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-5" variants={stagger}>
                            {howItWorksSteps.map((step) => {
                                const Icon = step.icon;
                                const isHighlighted = step.highlighted;

                                return (
                                    <motion.div
                                        key={step.title}
                                        className={`rounded-xl p-6 sm:p-8 text-center transition-all ${isHighlighted ? "bg-[#0b8276] text-white shadow-lg" : "bg-white text-slate-800 shadow-sm hover:shadow-md"
                                            }`}
                                        variants={fadeUp}
                                        whileHover={{ y: -6 }}
                                    >
                                        <div
                                            className={`mx-auto mb-5 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full ${isHighlighted ? "bg-white/90" : "bg-[#e3f0ed]"
                                                }`}
                                        >
                                            <Icon size={28} className={isHighlighted ? "text-[#0b8276]" : "text-[#0b8276]"} />
                                        </div>
                                        <h3 className={`text-xl sm:text-[24px] font-bold ${isHighlighted ? "text-white" : "text-[#111b2f]"}`}>
                                            {step.title}
                                        </h3>
                                        <p className={`mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed ${isHighlighted ? "text-white/90" : "text-slate-500"}`}>
                                            {step.description}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Pricing Section - Fixed layout and spacing */}
                <div className="self-stretch bg-[#f7efeb] px-4 py-12 sm:py-16">
                    <div className="mx-auto w-full max-w-[1200px]">
                        <div className="text-center">
                            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#111b2f]">Simple, transparent pricing</h2>
                            <p className="mt-2 text-base text-slate-500">Choose the perfect plan for your learning community.</p>
                        </div>
                        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Starter Plan */}
                            <div className="flex flex-col items-center gap-4 rounded-xl border border-[#00000012] bg-white px-6 py-8 sm:py-10 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-slate-900 text-2xl font-bold">Starter Plan</h3>
                                <div className="flex items-baseline justify-center">
                                    <span className="text-slate-900 text-5xl sm:text-[56px] font-bold">$29</span>
                                    <span className="text-slate-400 text-lg ml-1">/mo</span>
                                </div>
                                <div className="flex flex-col w-full gap-3 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/pvfwdbgh_expires_30_days.png" className="w-5 h-5 object-contain" alt="check" />
                                        <span className="text-slate-900 text-sm sm:text-base">Up to 100 students</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/l2j0obqq_expires_30_days.png" className="w-5 h-5 object-contain" alt="check" />
                                        <span className="text-slate-900 text-sm sm:text-base">5 Courses</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/6ofzl4vd_expires_30_days.png" className="w-5 h-5 object-contain" alt="check" />
                                        <span className="text-slate-900 text-sm sm:text-base">Standard Support</span>
                                    </div>
                                </div>
                                <button className="w-full bg-transparent py-3 rounded-lg border-2 border-[#00000012] font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                                    onClick={() => alert("Pressed!")}>
                                    Choose Starter
                                </button>
                            </div>

                            {/* Pro Plan - Fixed relative positioning */}
                            <div className="relative flex flex-col items-center rounded-xl shadow-xl overflow-hidden">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                    <button className="bg-[#FF8A33] text-white text-sm font-bold py-2 px-6 rounded-xl hover:bg-[#e07a2e] transition-colors"
                                        onClick={() => alert("Pressed!")}>
                                        Most Popular
                                    </button>
                                </div>
                                <div className="flex flex-col items-center bg-slate-900 py-8 sm:py-10 px-6 w-full h-full">
                                    <h3 className="text-[#F7FCFF] text-2xl font-bold">Pro Plan</h3>
                                    <div className="flex items-baseline justify-center mt-2">
                                        <span className="text-[#F7FCFF] text-5xl sm:text-[56px] font-bold">$79</span>
                                        <span className="text-white text-lg ml-1">/mo</span>
                                    </div>
                                    <div className="flex flex-col w-full gap-3 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/nhxhg5xw_expires_30_days.png" className="w-5 h-5 object-contain" alt="check" />
                                            <span className="text-[#F7FCFF] text-sm sm:text-base">Unlimited students</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/hzzmuy09_expires_30_days.png" className="w-5 h-5 object-contain" alt="check" />
                                            <span className="text-[#F7FCFF] text-sm sm:text-base">Unlimited Courses</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/jvllqhem_expires_30_days.png" className="w-5 h-5 object-contain" alt="check" />
                                            <span className="text-[#F7FCFF] text-sm sm:text-base">Custom Domain</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/s5hbyste_expires_30_days.png" className="w-5 h-5 object-contain" alt="check" />
                                            <span className="text-[#F7FCFF] text-sm sm:text-base">Priority Support</span>
                                        </div>
                                    </div>
                                    <button className="w-full bg-[#FF8A33] text-white font-bold py-3 rounded-lg hover:bg-[#e07a2e] transition-colors"
                                        onClick={() => alert("Pressed!")}>
                                        Choose Pro
                                    </button>
                                </div>
                            </div>

                            {/* Enterprise Plan */}
                            <div className="flex flex-col items-center gap-4 rounded-xl border border-[#00000012] bg-white px-6 py-8 sm:py-10 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-slate-900 text-2xl font-bold">Enterprise Plan</h3>
                                <div className="text-slate-900 text-4xl sm:text-5xl font-bold">Custom</div>
                                <div className="flex flex-col w-full gap-3 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/rog5oi83_expires_30_days.png" className="w-5 h-5 object-contain" alt="check" />
                                        <span className="text-slate-900 text-sm sm:text-base">Multi-Tenant setup</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/fepgjc9p_expires_30_days.png" className="w-5 h-5 object-contain" alt="check" />
                                        <span className="text-slate-900 text-sm sm:text-base">Dedicated Manager</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/ibqboa75_expires_30_days.png" className="w-5 h-5 object-contain" alt="check" />
                                        <span className="text-slate-900 text-sm sm:text-base">Advanced Integrations</span>
                                    </div>
                                </div>
                                <button className="w-full bg-transparent py-3 rounded-lg border-2 border-[#00000012] font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                                    onClick={() => alert("Pressed!")}>
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section - Fixed layout */}
                <motion.div
                    className="self-stretch bg-[#f7efeb] px-4 py-12 sm:py-16"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    variants={fadeUp}
                >
                    <div className="mx-auto w-full max-w-[1200px] rounded-2xl bg-[#f7efeb] p-4 sm:p-8 lg:p-10">
                        <motion.div className="mx-auto max-w-3xl text-center" variants={fadeUp}>
                            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#111b2f]">Our Students Reviews</h2>
                            <p className="mt-3 text-sm sm:text-base text-slate-500">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                            </p>
                        </motion.div>

                        <div className="mt-8 flex items-center gap-3">
                            <button
                                className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-[#4D73EE] hover:bg-slate-100 transition-colors"
                                onClick={() => alert("Pressed!")}
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <motion.div className="grid flex-1 grid-cols-1 md:grid-cols-3 gap-5" variants={stagger}>
                                {[
                                    {
                                        name: "Emma",
                                        role: "student",
                                        avatar: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/344cmw5b_expires_30_days.png",
                                    },
                                    {
                                        name: "John Doe",
                                        role: "CEO",
                                        avatar: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/atih781j_expires_30_days.png",
                                    },
                                    {
                                        name: "Zoey",
                                        role: "Web Developer",
                                        avatar: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ffSyZzeazd/xz2lhbfq_expires_30_days.png",
                                    },
                                ].map((review) => (
                                    <motion.div
                                        key={review.name}
                                        className="rounded-xl bg-white p-5 sm:p-6 text-center shadow-sm hover:shadow-md transition-all"
                                        variants={fadeUp}
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <img src={review.avatar} alt={review.name} className="h-12 w-12 rounded-full object-cover" />
                                            <p className="text-sm italic leading-relaxed text-slate-500">
                                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo."
                                            </p>
                                        </div>
                                        <h3 className="mt-4 text-xl sm:text-[24px] font-semibold text-slate-700">{review.name}</h3>
                                        <p className="text-sm italic text-[#0b8276]">{review.role}</p>
                                    </motion.div>
                                ))}
                            </motion.div>

                            <button
                                className="hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-[#4D73EE] hover:bg-slate-100 transition-colors"
                                onClick={() => alert("Pressed!")}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#4D73EE]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}