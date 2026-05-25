import React, { useEffect, useMemo, useState } from 'react'
import { Search, Award, Download, Sparkles } from 'lucide-react'
import { api } from '../../lib/api'

const COURSE_PROGRESS_KEY = 'student-course-progress'
const EXPORT_WIDTH = 1600
const EXPORT_HEIGHT = 1200

export default function StudentCertificates() {
  const [q, setQ] = useState('')
  const [me, setMe] = useState(null)
  const [courses, setCourses] = useState([])
  const [certificates, setCertificates] = useState([])
  const [certificateImages, setCertificateImages] = useState({})

  useEffect(() => {
    Promise.all([
      api('/auth/me').catch(() => null),
      api('/lms/courses?limit=500').catch(() => ({ items: [] })),
      api('/lms/certificates?limit=300').catch(() => ({ items: [] })),
    ]).then(([user, crs, certRes]) => {
      setMe(user)
      setCourses(crs.items || [])
      setCertificates(certRes.items || [])
    })
  }, [])

  const list = useMemo(() => {
    const courseMap = new Map(courses.map((course) => [String(course._id), course]))

    return certificates
      .map((certificate) => {
        const course = courseMap.get(String(certificate.course_id)) || null
        return {
          ...certificate,
          course_title: course?.title || certificate.title || 'Certificate',
          course_description: course?.description || '',
        }
      })
      .filter((certificate) => String(certificate.course_title || '').toLowerCase().includes(q.toLowerCase()))
  }, [courses, certificates, q])

  const issueDate = (value) => {
    if (!value) return 'Recently'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? 'Recently' : date.toLocaleDateString()
  }

  const certificateId = (value) => {
    const raw = String(value || '').trim()
    if (!raw) return 'EDU-000000'
    return `EDU-${raw.slice(-6).toUpperCase().padStart(6, '0')}`
  }

  const downloadUrl = (url, filename) => {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.rel = 'noreferrer'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }

  const drawCenteredText = (ctx, text, y, font, color) => {
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText(text, EXPORT_WIDTH / 2, y)
  }

  const drawWrappedCenteredText = (ctx, text, y, maxWidth, lineHeight, font, color) => {
    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    const words = String(text || '').split(' ')
    let line = ''
    let currentY = y

    for (let i = 0; i < words.length; i += 1) {
      const testLine = line ? `${line} ${words[i]}` : words[i]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && line) {
        ctx.fillText(line, EXPORT_WIDTH / 2, currentY)
        line = words[i]
        currentY += lineHeight
      } else {
        line = testLine
      }
    }
    if (line) ctx.fillText(line, EXPORT_WIDTH / 2, currentY)
    return currentY
  }

  // const buildCertificateCanvas = (certificate) => {
  //   const canvas = document.createElement('canvas')
  //   canvas.width = EXPORT_WIDTH
  //   canvas.height = EXPORT_HEIGHT
  //   const ctx = canvas.getContext('2d')
  //   if (!ctx) return null

  //   // Background and frame
  //   ctx.fillStyle = '#ffffff'
  //   ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT)
  //   ctx.strokeStyle = '#17315c'
  //   ctx.lineWidth = 6
  //   ctx.strokeRect(24, 24, EXPORT_WIDTH - 48, EXPORT_HEIGHT - 48)
  //   ctx.strokeStyle = '#c8ab52'
  //   ctx.lineWidth = 3
  //   ctx.strokeRect(40, 40, EXPORT_WIDTH - 80, EXPORT_HEIGHT - 80)

  //   drawCenteredText(ctx, 'EDUMART LMS', 108, '700 38px Arial', '#17315c')
  //   drawCenteredText(ctx, 'CERTIFICATE OF COMPLETION', 225, '900 86px Arial', '#17315c')
  //   drawCenteredText(ctx, 'This certifies that', 292, '400 44px Arial', '#8a96ab')

  //   const studentName = me?.full_name || me?.email || 'Student Name'
  //   drawCenteredText(ctx, studentName, 385, '700 90px Arial', '#17315c')

  //   ctx.strokeStyle = '#c8ab52'
  //   ctx.lineWidth = 2
  //   ctx.setLineDash([10, 8])
  //   ctx.beginPath()
  //   ctx.moveTo(220, 455)
  //   ctx.lineTo(EXPORT_WIDTH - 220, 455)
  //   ctx.stroke()
  //   ctx.setLineDash([])

  //   const descY = drawWrappedCenteredText(
  //     ctx,
  //     `has successfully completed the online course ${certificate.course_title || 'Course Name'} through the Edumart LMS learning platform.`,
  //     510,
  //     1240,
  //     56,
  //     '400 40px Arial',
  //     '#46556c',
  //   )

  //   drawCenteredText(ctx, `Certificate ID: ${certificateId(certificate._id)}`, descY + 120, '700 38px Arial', '#17315c')
  //   drawCenteredText(ctx, `Issued: ${issueDate(certificate.created_at)}`, descY + 176, '700 34px Arial', '#17315c')

  //   ctx.strokeStyle = '#17315c'
  //   ctx.lineWidth = 2
  //   ctx.beginPath()
  //   ctx.moveTo(180, EXPORT_HEIGHT - 190)
  //   ctx.lineTo(700, EXPORT_HEIGHT - 190)
  //   ctx.moveTo(EXPORT_WIDTH - 700, EXPORT_HEIGHT - 190)
  //   ctx.lineTo(EXPORT_WIDTH - 180, EXPORT_HEIGHT - 190)
  //   ctx.stroke()

  //   ctx.fillStyle = '#17315c'
  //   ctx.font = '700 32px Arial'
  //   ctx.textAlign = 'left'
  //   ctx.fillText('Authorized Signatory', 180, EXPORT_HEIGHT - 145)
  //   ctx.textAlign = 'right'
  //   ctx.fillText('Program Director', EXPORT_WIDTH - 180, EXPORT_HEIGHT - 145)

  //   return canvas
  // }
  

  const buildCertificateCanvas = (certificate) => {
  const canvas = document.createElement('canvas')
  canvas.width = EXPORT_WIDTH
  canvas.height = EXPORT_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // ── Background: light blue ──
  ctx.fillStyle = '#e8f2fb'
  ctx.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT)

  // ── Top-right blue geometric blobs ──
  // Large blob
  ctx.save()
  ctx.beginPath()
  ctx.ellipse(EXPORT_WIDTH - 60, -80, 420, 280, (-25 * Math.PI) / 180, 0, 2 * Math.PI)
  ctx.fillStyle = '#1565c0'
  ctx.globalAlpha = 0.85
  ctx.fill()
  ctx.restore()
  // Medium blob
  ctx.save()
  ctx.beginPath()
  ctx.ellipse(EXPORT_WIDTH + 20, 60, 280, 180, (-20 * Math.PI) / 180, 0, 2 * Math.PI)
  ctx.fillStyle = '#1a78d4'
  ctx.globalAlpha = 0.7
  ctx.fill()
  ctx.restore()
  // Small blob
  ctx.save()
  ctx.beginPath()
  ctx.ellipse(EXPORT_WIDTH - 200, 160, 180, 120, (15 * Math.PI) / 180, 0, 2 * Math.PI)
  ctx.fillStyle = '#2196f3'
  ctx.globalAlpha = 0.45
  ctx.fill()
  ctx.restore()

  // ── Bottom-left blue geometric blobs ──
  ctx.save()
  ctx.beginPath()
  ctx.ellipse(80, EXPORT_HEIGHT + 40, 380, 240, (20 * Math.PI) / 180, 0, 2 * Math.PI)
  ctx.fillStyle = '#1565c0'
  ctx.globalAlpha = 0.85
  ctx.fill()
  ctx.restore()
  ctx.save()
  ctx.beginPath()
  ctx.ellipse(-40, EXPORT_HEIGHT - 100, 240, 160, (15 * Math.PI) / 180, 0, 2 * Math.PI)
  ctx.fillStyle = '#1a78d4'
  ctx.globalAlpha = 0.65
  ctx.fill()
  ctx.restore()

  // ── White card area ──
  const cardX = 60, cardY = 60, cardW = EXPORT_WIDTH - 120, cardH = EXPORT_HEIGHT - 120
  ctx.save()
  ctx.globalAlpha = 0.93
  ctx.fillStyle = '#ffffff'
  const r = 24
  ctx.beginPath()
  ctx.moveTo(cardX + r, cardY)
  ctx.lineTo(cardX + cardW - r, cardY)
  ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r)
  ctx.lineTo(cardX + cardW, cardY + cardH - r)
  ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH)
  ctx.lineTo(cardX + r, cardY + cardH)
  ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r)
  ctx.lineTo(cardX, cardY + r)
  ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // ── Blue top accent bar ──
  ctx.fillStyle = '#1565c0'
  ctx.fillRect(cardX + r, cardY, cardW - r * 2, 10)

  // ── Company logo diamond ──
  ctx.save()
  ctx.fillStyle = '#1565c0'
  ctx.translate(160, 160)
  ctx.rotate(Math.PI / 4)
  ctx.fillRect(-22, -22, 44, 44)
  ctx.restore()
  ctx.fillStyle = '#1a1a2e'
  ctx.font = 'bold 36px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('COMPANY NAME', 210, 172)

  // ── "Certificate" heading ──
  ctx.fillStyle = '#1565c0'
  ctx.font = 'bold 140px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('Certificate', cardX + 100, 420)

  // ── OF ACHIEVEMENT ──
  ctx.fillStyle = '#334155'
  ctx.font = '500 46px Arial'
  ctx.textAlign = 'left'
  ctx.letterSpacing = '8px'
  ctx.fillText('OF ACHIEVEMENT', cardX + 108, 490)

  // ── Thin divider line ──
  ctx.strokeStyle = '#c7d9f5'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cardX + 108, 520)
  ctx.lineTo(cardX + 108 + 900, 520)
  ctx.stroke()

  // ── "THIS CERTIFICATE IS PRESENTED TO" ──
  ctx.fillStyle = '#94a3b8'
  ctx.font = '400 34px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('THIS CERTIFICATE IS PRESENTED TO', cardX + 108, 590)

  // ── Recipient name ──
  const studentName = me?.full_name || me?.email || 'Name Surname'
  ctx.fillStyle = '#1565c0'
  ctx.font = 'bold 110px Arial'
  ctx.textAlign = 'left'
  ctx.fillText(studentName, cardX + 100, 730)

  // ── Description bold line ──
  const descTitle = certificate.title || `Successfully completed ${certificate.course_title || 'the course'}`
  ctx.fillStyle = '#334155'
  ctx.font = 'bold 36px Arial, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(descTitle, cardX + 108, 810)

  // ── Description body (wrapped) ──
  const descBody = `has successfully completed all requirements of the course "${certificate.course_title || 'Course Name'}" through our learning platform. This certificate acknowledges the dedication and commitment shown throughout the program.`
  ctx.fillStyle = '#64748b'
  ctx.font = '400 32px Arial, sans-serif'
  const words = descBody.split(' ')
  let line = '', lineY = 858
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > cardW - 220 && line) {
      ctx.fillText(line, cardX + 108, lineY)
      line = word; lineY += 44
    } else { line = test }
  }
  if (line) ctx.fillText(line, cardX + 108, lineY)

  // ── Bottom divider ──
  ctx.strokeStyle = '#e2eaf6'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cardX + 80, EXPORT_HEIGHT - 220)
  ctx.lineTo(cardX + cardW - 80, EXPORT_HEIGHT - 220)
  ctx.stroke()

  // ── Date section ──
  const dateStr = issueDate(certificate.created_at).toUpperCase()
  ctx.fillStyle = '#1a1a2e'
  ctx.font = 'bold 34px Arial'
  ctx.textAlign = 'left'
  ctx.fillText(dateStr, cardX + 108, EXPORT_HEIGHT - 160)
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cardX + 108, EXPORT_HEIGHT - 138)
  ctx.lineTo(cardX + 108 + 380, EXPORT_HEIGHT - 138)
  ctx.stroke()
  ctx.fillStyle = '#94a3b8'
  ctx.font = '400 28px Arial'
  ctx.fillText('DATE', cardX + 108, EXPORT_HEIGHT - 104)

  // ── Signature section ──
  ctx.fillStyle = '#334155'
  ctx.font = 'italic bold 48px Georgia, serif'
  ctx.textAlign = 'right'
  ctx.fillText('✦ Director', cardX + cardW - 108, EXPORT_HEIGHT - 160)
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cardX + cardW - 108 - 380, EXPORT_HEIGHT - 138)
  ctx.lineTo(cardX + cardW - 108, EXPORT_HEIGHT - 138)
  ctx.stroke()
  ctx.fillStyle = '#94a3b8'
  ctx.font = '400 28px Arial'
  ctx.textAlign = 'right'
  ctx.fillText('SIGNATURE', cardX + cardW - 108, EXPORT_HEIGHT - 104)

  // ── BEST AWARD badge (top-right of white card) ──
  const bx = cardX + cardW - 220, by = 280
  // Outer circle
  ctx.save()
  ctx.strokeStyle = '#1565c0'
  ctx.lineWidth = 5
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(bx, by, 110, 0, 2 * Math.PI)
  ctx.fill()
  ctx.stroke()
  // Inner circle
  ctx.strokeStyle = '#1565c0'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(bx, by, 88, 0, 2 * Math.PI)
  ctx.stroke()
  // Stars top
  ctx.fillStyle = '#1565c0'
  ctx.font = '500 28px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('★  ★  ★', bx, by - 40)
  // BEST text
  ctx.fillStyle = '#1565c0'
  ctx.font = 'bold 50px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('BEST', bx, by + 14)
  // AWARD text
  ctx.fillStyle = '#475569'
  ctx.font = '400 32px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('AWARD', bx, by + 52)
  // Stars bottom
  ctx.fillStyle = '#1565c0'
  ctx.font = '500 22px Arial'
  ctx.fillText('★  ★  ★', bx, by + 84)
  // Ribbon
  ctx.fillStyle = '#1565c0'
  ctx.globalAlpha = 0.85
  ctx.beginPath()
  ctx.moveTo(bx - 36, by + 108)
  ctx.lineTo(bx + 36, by + 108)
  ctx.lineTo(bx + 28, by + 175)
  ctx.lineTo(bx, by + 155)
  ctx.lineTo(bx - 28, by + 175)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  return canvas
}


  const handleDownloadCertificate = async (certificate) => {
    const filename = `${String(certificate.course_title || 'certificate').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${certificateId(certificate._id)}.png`
    const canvas = buildCertificateCanvas(certificate)
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    downloadUrl(dataUrl, filename)
  }

  useEffect(() => {
    let cancelled = false

    const generateCertificateImages = () => {
      const nextImages = {}
      for (const certificate of list) {
        const canvas = buildCertificateCanvas(certificate)
        if (canvas) {
          nextImages[certificate._id] = canvas.toDataURL('image/png')
        }
      }
      if (!cancelled) {
        setCertificateImages(nextImages)
      }
    }

    generateCertificateImages()

    return () => {
      cancelled = true
    }
  }, [list, me?.email, me?.full_name])

  return (
    <div className="min-h-full bg-[linear-gradient(180deg,#f7f9ff_0%,#f8fbff_100%)] p-4 sm:p-6">
      <div className="overflow-hidden rounded-[18px] border border-[#e8edf3] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(91,61,246,0.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(45,212,191,0.12),transparent_24%),linear-gradient(135deg,#ffffff_0%,#f4f7ff_100%)] px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-[999px] border border-[#e7e1ff] bg-[#f6f2ff] px-3 py-1 text-[11px] font-semibold text-[#5b3df6]">
                <Sparkles className="h-3.5 w-3.5" /> Achievement records
              </span>
              <h1 className="mt-3 text-[30px] font-black leading-[1.02] tracking-[-0.04em] text-[#0f172a] sm:text-[40px]">My Certificates</h1>
              <p className="mt-2 max-w-[720px] text-[13px] leading-6 text-[#64748b] sm:text-[14px]">
                Clean, branded certificates for completed courses and uploaded achievements.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
              <div className="rounded-[14px] border border-[#ece7ff] bg-[#faf8ff] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b7cf6]">Certificates</div>
                <div className="mt-2 text-[28px] font-bold text-[#0f172a]">{list.length}</div>
              </div>
              <div className="rounded-[14px] border border-[#d7f5ef] bg-[#f3fffd] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#12a38a]">Student</div>
                <div className="mt-2 line-clamp-1 text-[16px] font-bold text-[#0f172a]">{me?.full_name || me?.email || 'You'}</div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex h-11 max-w-[460px] items-center gap-2 rounded-[10px] border border-black/[0.08] bg-white px-3">
            <Search className="h-4 w-4 text-[#94a3b8]" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search certificate..." className="w-full bg-transparent text-[13px] outline-none" />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
        {list.length === 0 ? (
          <div className="col-span-full rounded-[18px] border border-dashed border-[#dfe6f2] bg-white px-6 py-14 text-center text-[13px] text-[#64748b] shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            No certificate cards found for the current search.
          </div>
        ) : null}

        {list.map((c) => (
          <div key={c._id} className="overflow-hidden rounded-[18px] border border-[#e8edf3] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_14px_30px_rgba(15,23,42,0.07)] flex flex-col">
            <div className="border-b border-[#eef2f7] px-4 py-3.5">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-[#5b3df6]" />
                <h3 className="text-[14px] font-semibold text-[#0f172a]">{c.course_title}</h3>
              </div>
              <p className="mt-1 text-[11px] text-[#64748b]">Issued certificate for your enrolled course</p>
            </div>

            <div className="bg-[linear-gradient(135deg,#ffffff_0%,#fbfcff_100%)] p-4">
              <div className="overflow-hidden rounded-[24px] border border-[#d9c37a] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                <div className="relative w-full overflow-hidden rounded-[18px] bg-white pb-[75%] p-3">
                  {certificateImages[c._id] ? (
                    <img
                      src={certificateImages[c._id]}
                      alt={`${c.course_title} certificate`}
                      className="absolute inset-0 h-full w-full rounded-[18px] object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center rounded-[18px] border border-dashed border-[#dfe6f2] bg-[#fbfcff] text-[12px] text-[#94a3b8]">
                      Preparing certificate preview...
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-[#e8edf3] px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-[#0f172a]">{c.course_title}</p>
                    <p className="text-[11px] text-[#64748b]">Issued {issueDate(c.created_at)}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadCertificate(c)}
                    disabled={!certificateImages[c._id]}
                    className="inline-flex h-8 items-center justify-center gap-1 rounded-[10px] bg-[#17315c] px-3.5 text-[10px] font-semibold text-white transition-colors hover:bg-[#0f2444] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Download className="h-3 w-3" /> Download
                  </button>
                </div>
              </div>

              {/* {c.file_url ? (
                <div className="mt-4 rounded-[14px] border border-[#eef2f7] bg-[#f8fafc] p-3">
                  {String(c.file_url).startsWith('data:image') ? (
                    <img src={c.file_url} alt={c.course_title} className="h-48 w-full rounded-[12px] object-contain bg-white" />
                  ) : (
                    <div className="flex h-48 items-center justify-center rounded-[12px] border border-dashed border-[#dfe6f2] bg-white text-[12px] text-[#94a3b8]">
                      Certificate file is attached. Use the open button to view it.
                    </div>
                  )}
                </div>
              ) : null} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
