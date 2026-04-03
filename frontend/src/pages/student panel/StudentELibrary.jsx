import React, { useState } from 'react'
import { Search, Bell, Download, BookOpen, Bookmark, Star, Users, GraduationCap, Wallet, BarChart3, Upload, Plus } from 'lucide-react'

const AVATAR = 'https://www.figma.com/api/mcp/asset/5b24609b-97ad-4bea-af20-b4f4df404b75'

const HERO_MOCKUP = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'

const books = [
  {
    title: 'Accessibility Handbook for Product Teams',
    tags: ['Ebook', 'Accessibility'],
    desc: 'A practical guide to contrast, keyboard flows, semantic structure, and inclusive components for modern interfaces.',
    pages: '124 pages',
    format: 'PDF',
    readingTime: '2h 15m', 
    author: 'Marcus Chen',
    role: 'Design Mentor',
    rating: 4.9,
    size: '8.4 MB',
    note: 'Offline ready',
    cover: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&w=600&q=80',
    coverBg: '#f0eeff',
  },
  {
    title: 'Design Systems Playbook',
    tags: ['Guide', 'Design Systems'],
    desc: 'Learn how to define tokens, naming standards, contribution workflows, and component governance across teams.',
    pages: '96 pages',
    format: 'EPUB',
    readingTime: '1h 40m',
    author: 'Elena Brooks',
    role: 'Product Designer',
    rating: 4.8,
    size: '5.1 MB',
    note: 'Saved by 2.3k learners',
    cover: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?auto=format&fit=crop&w=600&q=80',
    coverBg: '#f5f5f5',
  },
  {
    title: 'Frontend Patterns Reference',
    tags: ['Reference', 'Frontend'],
    desc: 'A concise handbook covering semantic HTML, layout systems, accessible components, and reusable page patterns.',
    pages: '148 pages',
    format: 'PDF',
    readingTime: '2h 45m',
    author: 'Noah Bennett',
    role: 'Frontend Lead',
    rating: 4.7,
    size: '11.2 MB',
    note: 'Updated this week',
    cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
    coverBg: '#1a0a2e',
  },
  {
    title: 'Portfolio Storytelling Guide',
    tags: ['Career', 'Case study'],
    desc: 'Structure stronger case studies, sharpen hiring narratives, and present your impact with more clarity and confidence.',
    pages: '72 pages',
    format: 'PDF',
    readingTime: '1h 10m',
    author: 'Rina Kapoor',
    role: 'Career Coach',
    rating: 4.9,
    size: '4.3 MB',
    note: 'Mentor notes included',
    cover: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    coverBg: '#1c1c2e',
  },
  {
    title: 'Metrics for Designers',
    tags: ['Analytics', 'Product'],
    desc: 'Understand activation, retention, and funnel thinking so your design decisions connect to measurable outcomes.',
    pages: '88 pages',
    format: 'EPUB',
    readingTime: '1h 25m',
    author: 'Mateo Ruiz',
    role: 'Growth PM',
    rating: 4.6,
    size: '6.8 MB',
    note: 'Workbook included',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    coverBg: '#eeeaff',
  },
  {
    title: 'Mobile Prototyping Notes',
    tags: ['Workshop', 'Prototype'],
    desc: 'Capture the essentials of rapid mobile flows, usability testing plans, and prototype review checklists for product teams.',
    pages: '64 pages',
    format: 'PDF',
    readingTime: '55 min',
    author: 'Yuna Park',
    role: 'Interaction Designer',
    rating: 4.8,
    size: '3.9 MB',
    note: 'New this week',
    cover: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
    coverBg: '#e8e4ff',
  },
]

const filterChips = ['All resources', 'Ebooks', 'Case studies', 'Guides', 'Design', 'Downloadable']

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

function AuthorAvatar({ name }) {
  const initials = name.split(' ').map(n => n[0]).join('')
  const colors = ['#5b3df6', '#2dd4bf', '#ffd966', '#f97316', '#ef4444']
  const color = colors[name.length % colors.length]
  return (
    <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[6px] text-[11px] font-bold text-white" style={{ background: color }}>
      {initials}
    </div>
  )
}

export default function StudentELibrary() {
  const [active, setActive] = useState('All resources')

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="bg-gradient-to-b flex flex-col from-[#f6f8fa] gap-[24px] h-full p-[28px] to-[#f7fcff]">
        {/* Hero Section */}
        <section className="border border-black/[0.08] border-solid content-stretch flex flex-col items-start pb-[23px] pt-[25px] px-[25px] relative rounded-[8px] shrink-0 w-full bg-gradient-to-br from-white to-[#e8f5ff]">
          <div className="flex items-start justify-between w-full">
            <div className="flex-1 pr-6">
              <div className="bg-[#ffd966] inline-flex items-center px-[10px] py-[6.5px] rounded-[12px] mb-[16px]">
                <BookOpen className="h-[14px] w-[14px] mr-[6px] text-[#4b2e00]" />
                <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[#4b2e00] text-[12px]">
                  Curated digital resources
                </div>
              </div>
              <h1 className="text-[28px] font-bold text-[#0f172a] mb-[12px]">Read, save, and revisit your learning resources in one library.</h1>
              <p className="text-[14px] text-[#94a3b8]">
                Access ebooks, design playbooks, handbooks, and downloadable guides across UI/UX, product, frontend, and career growth. Everything is organized for quick reading and offline access.
              </p>
              <div className="mt-4 flex flex-wrap gap-[12px]">
                <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
                  <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                    412 resources available
                  </div>
                </div>
                <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
                  <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                    56 new this month
                  </div>
                </div>
                <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
                  <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                    Top shelves: Design, Frontend, Career
                  </div>
                </div>
              </div>
            </div>
            <div className="shrink-0 ml-[24px]">
              <div className="h-[160px] w-[240px] overflow-hidden rounded-[8px] border border-black/[0.08] shadow-md">
                <img src={HERO_MOCKUP} alt="Library preview" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="font-bold text-[18px] text-[#0f172a]">Explore the library</h2>
              <p className="text-[13px] text-[#94a3b8] mt-[4px]">Browse by format, topic, reading time, or saved collection.</p>
            </div>
            <button className="border border-black/[0.08] flex items-center gap-[8px] h-[40px] justify-center px-[17px] py-[0.25px] rounded-[6px] shrink-0 bg-white">
              <Bookmark className="h-[18px] w-[18px] text-[#5b3df6]" />
              <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[14px]">
                Saved shelf
              </div>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-[12px] w-full">
            <div className="flex-1 min-w-[240px] bg-white border border-black/[0.08] flex items-center gap-[10px] h-[40px] px-[15px] py-[0.25px] relative rounded-[6px]">
              <Search className="h-[18px] w-[18px] text-[#94a3b8]" />
              <input
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none"
                placeholder="Search by title, author, or topic"
              />
            </div>
            {filterChips.map((chip) => (
              <button
                key={chip}
                onClick={() => setActive(chip)}
                className={`inline-flex h-[36px] items-center px-[16px] rounded-[12px] text-[12px] font-medium transition-colors ${
                  active === chip ? 'bg-[#5b3df6] text-white' : 'bg-[#f1f5f9] text-[#0f172a] hover:bg-[#e8f5ff]'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Reading */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-bold text-[20px] text-[#0f172a]">Recommended reading</h2>
              <p className="text-[13px] text-[#94a3b8] mt-[4px]">Based on your recent activity in accessibility, systems thinking, and product fundamentals.</p>
            </div>
            <p className="text-[13px] font-medium text-[#5b3df6]">Showing 6 personalized picks</p>
          </div>

          <div className="grid grid-cols-3 gap-[24px] h-[1000px] w-[1200px]">
            {books.map((book) => (
              <article key={book.title} className="bg-white border border-black/[0.08] border-solid rounded-[8px] overflow-hidden flex flex-col">
                {/* Cover */}
                <div className="relative h-[160px] w-full overflow-hidden" style={{ background: book.coverBg }}>
                  <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
                </div>

                {/* Body */}
                <div className="flex flex-col gap-[12px] p-[20px] ">
                  {/* Tags */}
                  <div className="flex gap-[8px] flex-wrap">
                    {book.tags.map(tag => (
                      <span key={tag} className="inline-flex h-[26px] items-center px-[10px] rounded-[10px] text-[11px] font-medium bg-[#f1f5f9] text-[#0f172a]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-bold text-[16px] text-[#0f172a] leading-snug">{book.title}</h3>
                  <p className="text-[13px] text-[#94a3b8] line-clamp-2">{book.desc}</p>

                  {/* Meta */}
                  <div className="grid grid-cols-3 gap-[8px]">
                    {[['Pages', book.pages], ['Format', book.format], ['Reading time', book.readingTime]].map(([label, val]) => (
                      <div key={label} className="bg-[#f8fafc] rounded-[6px] p-[8px]">
                        <p className="text-[10px] text-[#94a3b8]">{label}</p>
                        <p className="text-[12px] font-semibold text-[#0f172a]">{val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Author + rating */}
                  <div className="flex items-center justify-between pt-[4px]">
                    <div className="flex items-center gap-[10px]">
                      <AuthorAvatar name={book.author} />
                      <div>
                        <p className="font-semibold text-[12px] text-[#0f172a]">{book.author}</p>
                        <p className="text-[10px] text-[#94a3b8]">{book.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[4px] text-[12px] font-semibold text-[#0f172a]">
                      <Star className="h-[12px] w-[12px] text-[#ffd966] fill-[#ffd966]" /> {book.rating}
                    </div>
                  </div>

                  {/* Size + download */}
                  <div className="flex items-center justify-between pt-[8px] border-t border-black/[0.08]">
                    <div>
                      <p className="text-[20px] font-bold text-[#0f172a]">{book.size}</p>
                      <p className="text-[11px] text-[#94a3b8]">{book.note}</p>
                    </div>
                    <button className="bg-[#5b3df6] flex items-center gap-[6px] h-[36px] justify-center px-[14px] rounded-[6px]">
                      <Download className="h-[14px] w-[14px] text-white" />
                      <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-white text-[12px]">
                        Download
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
