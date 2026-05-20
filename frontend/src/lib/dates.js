export function parseServerDate(value) {
  if (!value) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value

  const raw = String(value).trim()
  if (!raw) return null

  // If string contains explicit timezone (Z or ±hh:mm), let Date parse it directly.
  if (/([zZ]|[+-]\d{2}:\d{2})$/.test(raw)) {
    const parsed = new Date(raw)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  // ✅ FIX: Bare timestamps (no timezone suffix) from the server are stored as UTC.
  // Previously this code was treating them as IST wall-time and subtracting 5:30,
  // which caused times to appear 5h30m behind. Appending 'Z' forces UTC interpretation.
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?$/)
  if (m) {
    const withZ = raw.replace(' ', 'T') + 'Z'
    const parsed = new Date(withZ)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  // Last-resort fallback
  const fallback = new Date(raw)
  return Number.isNaN(fallback.getTime()) ? null : fallback
}

export function formatDateInIst(value) {
  const d = parseServerDate(value)
  if (!d) return 'Not scheduled'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(d)
}

export function formatTimeInIst(value) {
  const d = parseServerDate(value)
  if (!d) return '-'
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(d)
}

export function formatDateTimeInIst(value) {
  const d = parseServerDate(value)
  if (!d) return 'Not scheduled'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(d)
}

export default { parseServerDate, formatDateInIst, formatTimeInIst, formatDateTimeInIst }