// Central date helpers — parse server timestamps and format in IST (Asia/Kolkata).
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000

export function parseServerDate(value) {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value

  const raw = String(value).trim()
  if (!raw) return null

  // If string contains explicit timezone (Z or ±hh:mm), let Date parse it.
  if (/([zZ]|[+-]\d{2}:\d{2})$/.test(raw)) {
    const parsed = new Date(raw)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  // Legacy timestamps without timezone are treated as IST wall time.
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?$/)
  if (!m) {
    const fallback = new Date(raw)
    return Number.isNaN(fallback.getTime()) ? null : fallback
  }

  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  const hour = Number(m[4])
  const minute = Number(m[5])
  const second = Number(m[6] || 0)
  const millisecond = Number(String(m[7] || '0').padEnd(3, '0'))

  // Interpret the parsed wall-time as IST local time and convert to an absolute UTC timestamp
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second, millisecond) - IST_OFFSET_MS
  return new Date(utcMs)
}

export function formatDateInIst(value) {
  const d = parseServerDate(value)
  if (!d) return 'Not scheduled'
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(d)
}

export function formatTimeInIst(value) {
  const d = parseServerDate(value)
  if (!d) return '-'
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(d)
}

export function formatDateTimeInIst(value) {
  const d = parseServerDate(value)
  if (!d) return 'Not scheduled'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
    timeZone: 'Asia/Kolkata'
  }).format(d)
}

export default { parseServerDate, formatDateInIst, formatTimeInIst, formatDateTimeInIst }
