import React from 'react'
import { Search, Bell, SlidersHorizontal, Plus, Star, Users, GraduationCap, Wallet, BarChart3, Upload } from 'lucide-react'

const AVATAR = 'https://www.figma.com/api/mcp/asset/5b24609b-97ad-4bea-af20-b4f4df404b75'
const HERO = 'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=80'
const HERO_SIDE = 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?auto=format&fit=crop&w=900&q=80'

const CARDS = [
  {
    image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=1200&q=80',
    tags: ['Accessibility', 'Intermediate'],
    title: 'Advanced Accessibility for Designers',
    desc: 'Learn audit workflows, inclusive interaction patterns, and accessible design systems for modern product teams.',
    meta: ['Lessons 28', 'Duration 6h 40m', 'Level Intermediate'],
    mentor: 'Marcus Chen',
    role: 'Design Mentor',
    rating: '4.9',
    price: '$39',
    note: 'Certificate included',
  },
  {
    image: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?auto=format&fit=crop&w=1200&q=80',
    tags: ['Design Systems', 'Popular'],
    title: 'Design Systems from Scratch',
    desc: 'Build scalable foundations, token libraries, component standards, and documentation workflows your team can ship with.',
    meta: ['Lessons 34', 'Duration 8h 10m', 'Level All levels'],
    mentor: 'Elena Brooks',
    role: 'Product Designer',
    rating: '4.8',
    price: '$49',
    note: 'Best seller',
  },
  {
    image: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Frontend', 'Hands-on'],
    title: 'Frontend for Product Designers',
    desc: 'Translate layouts into production-ready HTML and CSS, collaborate better with engineers, and prototype with confidence.',
    meta: ['Lessons 22', 'Duration 5h 20m', 'Level Beginner'],
    mentor: 'Noah Bennett',
    role: 'Frontend Lead',
    rating: '4.7',
    price: '$29',
    note: 'Project-based',
  },
  {
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Career', 'Cohort'],
    title: 'Portfolio Review Bootcamp',
    desc: 'Refine case studies, storytelling, and hiring presentation skills with structured mentor feedback over four weeks.',
    meta: ['Lessons 16', 'Duration 4 weeks', 'Level Advanced'],
    mentor: 'Rina Kapoor',
    role: 'Career Coach',
    rating: '4.9',
    price: '$79',
    note: 'Mentor reviews',
  },
  {
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Product', 'Data'],
    title: 'Product Metrics for Designers',
    desc: 'Understand funnels, activation metrics, and experimentation basics so your design decisions map to measurable outcomes.',
    meta: ['Lessons 19', 'Duration 4h 55m', 'Level Intermediate'],
    mentor: 'Mateo Ruiz',
    role: 'Growth PM',
    rating: '4.6',
    price: '$35',
    note: 'Includes workbook',
  },
  {
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Prototype', 'Workshop'],
    title: 'Mobile App Prototyping Lab',
    desc: 'Create polished app flows, structure rapid usability tests, and present interactive prototypes clearly to teams and clients.',
    meta: ['Lessons 24', 'Duration 5h 45m', 'Level Beginner'],
    mentor: 'Yuna Park',
    role: 'Interaction Designer',
    rating: '4.8',
    price: '$32',
    note: 'Updated this week',
  },
]

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

export default function StudentBrowseCourse() {
  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="bg-gradient-to-b flex flex-col from-[#f6f8fa] gap-[24px] h-full p-[28px] to-[#f7fcff]">
        {/* Hero Section */}
        <section className="border border-black/[0.08] border-solid content-stretch flex flex-col items-start pb-[23px] pt-[25px] px-[25px] relative rounded-[8px] shrink-0 w-full bg-gradient-to-br from-white to-[#e8f5ff]">
          <div className="flex flex-col gap-[11px] items-start relative shrink-0">
            <div className="bg-[#ffd966] flex items-center px-[10px] py-[6.5px] rounded-[12px] shrink-0">
              <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[#4b2e00] text-[12px]">
                Create-ready course discovery
              </div>
            </div>
            <div className="flex flex-col font-bold h-[31.59px] justify-center leading-[0] text-[#0f172a] text-[28px]">
              Browse courses built to help you level up faster.
            </div>
            <div className="flex flex-col font-normal h-[17px] justify-center leading-[0] text-[#94a3b8] text-[14px]">
              Explore guided paths across UI/UX, product design, frontend development, and career growth.
              Personalized picks, top-rated cohorts, and new releases are surfaced in one clean catalog.
            </div>
          </div>
          <div className="mt-4 flex items-center gap-[12px] flex-wrap">
            <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                128 courses available
              </div>
            </div>
            <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                34 new this month
              </div>
            </div>
            <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                Top categories: UI/UX, Frontend, Product
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
          <div>
            <h2 className="font-bold text-[18px] text-[#0f172a]">Explore the catalog</h2>
            <p className="text-[13px] text-[#94a3b8] mt-[4px]">Use filters to narrow by topic, level, duration, or certificate track.</p>
          </div>
          <div className="flex flex-wrap items-center gap-[12px] w-full">
            <div className="flex-1 min-w-[280px] bg-white border border-black/[0.08] flex items-center gap-[10px] h-[40px] px-[15px] py-[0.25px] relative rounded-[6px]">
              <Search className="h-[18px] w-[18px] text-[#94a3b8]" />
              <input
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none"
                placeholder="Search by course name, instructor, or skill"
              />
            </div>
            <button className="border border-black/[0.08] flex items-center gap-[8px] h-[40px] justify-center px-[17px] py-[0.25px] rounded-[6px] shrink-0 bg-white">
              <SlidersHorizontal className="h-[18px] w-[18px] text-[#0f172a]" />
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[14px]">
                Advanced filters
              </div>
            </button>
            {['All courses', 'Beginner', 'Intermediate', 'Design', 'Development', 'Certificate'].map((chip, idx) => (
              <button
                key={chip}
                className={`inline-flex h-[36px] items-center px-[16px] rounded-[12px] text-[12px] font-medium transition-colors ${
                  idx === 0 ? 'bg-[#5b3df6] text-white' : 'bg-[#f1f5f9] text-[#0f172a] hover:bg-[#e8f5ff]'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Section */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="font-bold text-[24px] text-[#0f172a]">Recommended for you</h3>
              <p className="text-[13px] text-[#94a3b8] mt-[4px]">Based on your recent progress in UI/UX Masterclass and accessibility topics.</p>
            </div>
            <p className="text-[13px] font-medium text-[#94a3b8]">Showing 6 curated matches</p>
          </div>

          <div className="grid grid-cols-3 gap-[24px] h-[1115px] w-[1200px]">
            {CARDS.map((course) => (
              <article key={course.title} className="bg-white border border-black/[0.08] border-solid rounded-[8px] overflow-hidden flex flex-col">
                <img src={course.image} alt="" className="h-[200px] w-full object-cover" />
                <div className="flex flex-col gap-[16px] p-[20px]">
                  <div className="flex gap-[8px] flex-wrap">
                    {course.tags.map((tag) => (
                      <span key={tag} className="inline-flex h-[26px] items-center px-[10px] rounded-[10px] text-[11px] font-medium bg-[#f1f5f9] text-[#0f172a]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="font-bold text-[20px] text-[#0f172a] leading-tight">{course.title}</h4>
                  <p className="text-[13px] text-[#94a3b8] line-clamp-2">{course.desc}</p>
                  <div className="grid grid-cols-3 gap-[8px]">
                    {course.meta.map((m) => (
                      <div key={m} className="bg-[#f8fafc] rounded-[6px] p-[8px] text-[11px] font-medium text-[#475569] text-center">
                        {m}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[12px]">
                      <img src={AVATAR} alt="" className="h-[32px] w-[32px] rounded-[6px] object-cover" />
                      <div>
                        <p className="font-semibold text-[13px] text-[#0f172a]">{course.mentor}</p>
                        <p className="text-[11px] text-[#94a3b8]">{course.role}</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-[4px] text-[13px] font-semibold text-[#0f172a]">
                      <Star className="h-[14px] w-[14px] text-[#ffd966] fill-[#ffd966]" />
                      {course.rating}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-black/[0.08]">
                    <div>
                      <p className="text-[28px] pt-2 font-bold text-[#0f172a] leading-none">{course.price}</p>
                      <p className="text-[11px] text-[#94a3b8] mt-[4px]">{course.note}</p>
                    </div>
                    <button className="bg-[#5b3df6] flex items-center gap-[8px] h-[40px] justify-center px-[16px] rounded-[6px]">
                      <Plus className="h-[16px] w-[16px] text-white" />
                      <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-white text-[14px]">
                        Enroll now
                      </div>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
