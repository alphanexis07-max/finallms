import React, { useEffect, useMemo, useState } from 'react'
import { Search, BookOpen, Bookmark, Download, Calendar, FileText, User } from 'lucide-react'
import { api } from '../../lib/api'

function estimateSize(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string') return '-'
  const marker = ';base64,'
  const markerIndex = fileUrl.indexOf(marker)
  if (markerIndex < 0) return '-'
  const base64 = fileUrl.slice(markerIndex + marker.length)
  if (!base64) return '-'

  const bytes = Math.floor((base64.length * 3) / 4)
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function StudentELibrary() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [active, setActive] = useState('All resources')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadAllResources = async () => {
      setLoading(true)
      setError('')

      const limit = 200
      let skip = 0
      let collected = []

      try {
        while (true) {
          const response = await api(`/lms/library-resources?skip=${skip}&limit=${limit}`)
          const batch = response?.items || []
          collected = [...collected, ...batch]

          if (batch.length < limit) break
          skip += limit
        }

        if (!cancelled) setItems(collected)
      } catch (err) {
        if (!cancelled) {
          setItems([])
          setError(err?.message || 'Unable to load E-Library resources.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadAllResources()
    return () => {
      cancelled = true
    }
  }, [])

  const filterChips = useMemo(() => {
    const formats = [...new Set(items.map((item) => String(item?.format || '').trim()).filter(Boolean))]
      .filter((format) => format.toLowerCase() !== 'png')
    return ['All resources', ...formats]
  }, [items])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()

    return items.filter((item) => {
      const format = String(item?.format || '').trim()
      const byChip = active === 'All resources' || format === active

      const title = String(item?.title || '').toLowerCase()
      const grade = String(item?.grade || '').toLowerCase()
      const uploadedBy = String(item?.uploaded_by || '').toLowerCase()
      const bySearch = !term || title.includes(term) || grade.includes(term) || format.toLowerCase().includes(term) || uploadedBy.includes(term)

      return byChip && bySearch
    })
  }, [items, q, active])

  const thisMonthCount = useMemo(() => {
    const now = new Date()
    return items.filter((item) => {
      const created = new Date(item?.created_at)
      return !Number.isNaN(created.getTime()) && created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length
  }, [items])

  const topShelvesText = useMemo(() => {
    const counts = {}
    items.forEach((item) => {
      const grade = String(item?.grade || '').trim()
      if (!grade) return
      counts[grade] = (counts[grade] || 0) + 1
    })

    const top = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([grade]) => grade)

    return top.length > 0 ? top.join(', ') : 'No shelf data yet'
  }, [items])

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="bg-gradient-to-b flex h-full flex-col gap-[24px] from-[#f6f8fa] p-4 to-[#f7fcff] sm:p-6 lg:p-7">
        <section className="w-full shrink-0 rounded-[8px] border border-black/[0.08] border-solid bg-gradient-to-br from-white to-[#e8f5ff] px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <div className="flex flex-col items-start justify-between gap-4 w-full lg:flex-row lg:items-start">
            <div className="flex-1 min-w-0 lg:pr-6">
              <div className="bg-[#ffd966] inline-flex items-center px-[10px] py-[6.5px] rounded-[12px] mb-[16px]">
                <BookOpen className="h-[14px] w-[14px] mr-[6px] text-[#4b2e00]" />
                <div className="text-[12px] font-medium text-[#4b2e00]">Curated digital resources</div>
              </div>
              <h1 className="mb-[12px] text-[22px] font-bold text-[#0f172a] sm:text-[26px] lg:text-[28px]">
                Read, save, and revisit your learning resources in one library.
              </h1>
              <p className="text-[14px] text-[#94a3b8]">
                This section contains only resources uploaded.
              </p>
              <div className="mt-4 flex flex-wrap gap-[12px]">
                <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
                  <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                    {items.length} resources available
                  </div>
                </div>
                <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
                  <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                    {thisMonthCount} new this month
                  </div>
                </div>
                <div className="bg-white border border-black/[0.08] flex items-center h-[36px] justify-center px-[16px] rounded-[12px] shrink-0">
                  <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-[#0f172a] text-[12px]">
                    Top shelves: {topShelvesText}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full shrink-0 lg:ml-[24px] lg:w-[260px]">
              <div className="h-[160px] rounded-[8px] border border-black/[0.08] bg-white p-4">
                <p className="text-[12px] text-[#94a3b8]">Library Snapshot</p>
                <p className="mt-2 text-[26px] font-bold text-[#0f172a]">{filtered.length}</p>
                <p className="text-[12px] text-[#64748b]">resources in current view</p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
          <div className="flex flex-col items-start justify-between gap-3 w-full sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-[18px] text-[#0f172a]">Explore the library</h2>
              <p className="text-[13px] text-[#94a3b8] mt-[4px]">Browse by title, class, format, or uploader ID.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-[12px] w-full">
            <div className="flex-1 min-w-0 sm:min-w-[240px] bg-white border border-black/[0.08] flex items-center gap-[10px] h-[40px] px-[15px] py-[0.25px] relative rounded-[6px]">
              <Search className="h-[18px] w-[18px] text-[#94a3b8]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none"
                placeholder="Search by title, grade, format, or uploader"
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

        {error ? <p className="text-[13px] text-red-600">{error}</p> : null}
        {loading ? (
          <div className="rounded-[10px] border border-black/[0.08] bg-white p-6 text-[13px] text-[#64748b]">
            Loading uploaded resources...
          </div>
        ) : null}

        {!loading ? (
          <div className="flex flex-col gap-[16px]">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-bold text-[20px] text-[#0f172a]">Uploaded resources</h2>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Showing real resources available for your account.</p>
              </div>
              <p className="text-[13px] font-medium text-[#5b3df6]">Showing {filtered.length} results</p>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((resource) => (
                  <article key={resource._id} className="bg-white border border-black/[0.08] border-solid rounded-[8px] overflow-hidden flex flex-col">
                    {resource.image_url ? (
                      <img src={resource.image_url} alt={resource.title || 'Resource'} className="h-[120px] w-full object-cover" />
                    ) : (
                      <div className="h-[120px] w-full bg-gradient-to-r from-[#ede9ff] to-[#dbeafe] flex items-center justify-center">
                        <FileText className="h-10 w-10 text-[#5b3df6]" />
                      </div>
                    )}

                    <div className="flex flex-col gap-[12px] p-[20px]">
                      <div className="flex gap-[8px] flex-wrap">
                        <span className="inline-flex h-[26px] items-center px-[10px] rounded-[10px] text-[11px] font-medium bg-[#f1f5f9] text-[#0f172a]">
                          {resource.format || 'Unknown format'}
                        </span>
                        <span className="inline-flex h-[26px] items-center px-[10px] rounded-[10px] text-[11px] font-medium bg-[#e8f5ff] text-[#0f172a]">
                          {resource.grade || 'Unassigned class'}
                        </span>
                      </div>

                      <h3 className="font-bold text-[16px] text-[#0f172a] leading-snug">{resource.title || 'Untitled resource'}</h3>

                      <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-3">
                        <div className="bg-[#f8fafc] rounded-[6px] p-[8px]">
                          <p className="text-[10px] text-[#94a3b8]">Size</p>
                          <p className="text-[12px] font-semibold text-[#0f172a]">{estimateSize(resource.file_url)}</p>
                        </div>
                        <div className="bg-[#f8fafc] rounded-[6px] p-[8px]">
                          <p className="text-[10px] text-[#94a3b8]">Status</p>
                          <p className="text-[12px] font-semibold text-[#0f172a]">{resource.published ? 'Published' : 'Draft'}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-[4px]">
                        <div className="flex items-center gap-[10px] min-w-0">
                          <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[6px] bg-[#ede9ff] text-[#5b3df6]">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[12px] text-[#0f172a] truncate">{resource.uploaded_by || 'Unknown uploader'}</p>
                            <p className="text-[10px] text-[#94a3b8]">Uploader ID</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-[4px] text-[12px] font-semibold text-[#0f172a]">
                          <Calendar className="h-[12px] w-[12px] text-[#5b3df6]" />
                          {resource.updated_at ? 'Updated' : 'Created'}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 border-t border-black/[0.08] pt-[8px] sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[16px] font-bold text-[#0f172a]">{resource._id || '-'}</p>
                          <p className="text-[11px] text-[#94a3b8]">Resource ID</p>
                        </div>
                        {resource.file_url ? (
                          <a
                            href={resource.file_url}
                            download={resource.title ? `${resource.title}.pdf` : 'resource.pdf'}
                            className="bg-[#5b3df6] inline-flex items-center gap-[6px] h-[36px] justify-center px-[5px] rounded-[6px]"
                          >
                            <Download className="h-[14px] w-[14px] text-white" />
                            <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-white text-[12px]">
                              Download
                            </div>
                          </a>
                        ) : (
                          <div className="inline-flex items-center gap-[6px] h-[36px] justify-center px-[14px] rounded-[6px] bg-[#e2e8f0] text-[12px] font-medium text-[#64748b]">
                            File missing
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[10px] border border-dashed border-black/[0.12] bg-white p-5 text-[13px] text-[#64748b]">
                No uploaded resources found.
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
