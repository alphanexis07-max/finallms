import React, { useEffect, useMemo, useState } from 'react'
import { Calendar, Clock, MapPin, Users, X } from 'lucide-react'
import { api } from '../../lib/api'
import useRealtime from '../../hooks/useRealtime'

function parseEventMeta(event) {
  const description = String(event?.description || '')
  const pick = (label) => {
    const match = description.match(new RegExp(`${label}:\\s*(.+)`, 'i'))
    return match?.[1]?.split('\n')?.[0]?.trim() || ''
  }

  return {
    category: event?.category || pick('Category') || 'School Event',
    venue: event?.location || pick('Venue') || pick('Location') || 'TBA',
    coordinator: event?.coordinator || pick('Coordinator') || 'School Team',
    expectedAttendees: event?.expected_attendees || pick('Expected attendees') || '',
  }
}

function formatEventDate(event) {
  const startsAt = event?.starts_at || event?.date || null
  if (!startsAt) return { dateLabel: '-', timeLabel: '-' }
  const date = new Date(startsAt)
  if (Number.isNaN(date.getTime())) return { dateLabel: '-', timeLabel: '-' }
  return {
    dateLabel: date.toLocaleDateString(),
    timeLabel: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

function parseEndTimeFromDescription(event) {
  const description = String(event?.description || '')
  const timeLine = description.match(/Time:\s*([^\n]+)/i)?.[1] || ''
  if (!timeLine) return null

  const endToken =
    timeLine.match(/\bto\s+([0-9]{1,2}:[0-9]{2}(?:\s*[AP]M)?)\b/i)?.[1] ||
    timeLine.match(/-\s*([0-9]{1,2}:[0-9]{2}(?:\s*[AP]M)?)\b/i)?.[1] ||
    ''
  if (!endToken) return null

  return endToken.trim()
}

function buildEventEndDate(startDate, endToken) {
  if (!startDate || Number.isNaN(startDate.getTime()) || !endToken) return null
  const endDate = new Date(startDate)

  const timeMatch = endToken.match(/^([0-9]{1,2}):([0-9]{2})(?:\s*([AP]M))?$/i)
  if (!timeMatch) return null

  let hours = Number(timeMatch[1])
  const minutes = Number(timeMatch[2])
  const meridiem = String(timeMatch[3] || '').toUpperCase()

  if (meridiem === 'PM' && hours < 12) hours += 12
  if (meridiem === 'AM' && hours === 12) hours = 0
  if (hours > 23 || minutes > 59) return null

  endDate.setHours(hours, minutes, 0, 0)
  if (endDate < startDate) {
    // Handle events that cross midnight.
    endDate.setDate(endDate.getDate() + 1)
  }
  return endDate
}

function isUpcomingOrLiveEvent(event, now) {
  const startsAt = new Date(event?.starts_at || event?.date || 0)
  if (Number.isNaN(startsAt.getTime())) return false
  if (startsAt >= now) return true

  const parsedEndToken = parseEndTimeFromDescription(event)
  const parsedEndAt = buildEventEndDate(startsAt, parsedEndToken)
  if (parsedEndAt) return parsedEndAt >= now

  // Fallback: if end time is unavailable, keep event visible for a default live window.
  const fallbackEndAt = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000)
  return fallbackEndAt >= now
}

export default function StudentSchoolEvents() {
  const tenantId = localStorage.getItem('lms_tenant_id')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api('/lms/events?limit=200')
      const items = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : []
      setEvents(items)
    } catch (err) {
      setEvents([])
      setError(err?.message || 'Unable to load school events.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  useRealtime(tenantId ? `tenant:${tenantId}` : '', (payload) => {
    if (String(payload?.type || '').startsWith('event.')) {
      loadEvents()
    }
  })

  const sortedEvents = useMemo(() => {
    return [...events]
      .filter((event) => event?.starts_at || event?.date)
      .sort((a, b) => new Date(a.starts_at || a.date || 0) - new Date(b.starts_at || b.date || 0))
  }, [events])

  const upcoming = useMemo(() => {
    const now = new Date()
    return sortedEvents.filter((event) => isUpcomingOrLiveEvent(event, now))
  }, [sortedEvents])

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-7">
        <section className="rounded-[10px] border border-black/[0.08] bg-gradient-to-br from-white to-[#e8f5ff] px-5 py-5 sm:px-6">
          <h1 className="text-[26px] font-bold leading-tight text-[#0f172a]">School Events</h1>
          <p className="mt-2 text-[13px] text-[#94a3b8]">
            View all upcoming and announced school events uploaded by your institute.
          </p>
          <div className="mt-4 inline-flex h-8 items-center rounded-[10px] border border-black/[0.08] bg-white px-3 text-[11px] font-medium text-[#0f172a]">
            {upcoming.length} total events
          </div>
        </section>

        {error ? (
          <div className="rounded-[8px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</div>
        ) : null}

        <section className="rounded-[10px] border border-black/[0.08] bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[#0f172a]">Upcoming Events</h2>
            <span className="text-[12px] text-[#94a3b8]">{upcoming.length} upcoming</span>
          </div>

          {loading ? (
            <div className="rounded-[10px] border border-dashed border-black/[0.12] bg-[#fafcff] py-10 text-center text-[13px] text-[#94a3b8]">
              Loading events...
            </div>
          ) : upcoming.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-black/[0.12] bg-[#fafcff] py-10 text-center text-[13px] text-[#94a3b8]">
              No school events available right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {upcoming.map((event) => {
                const { dateLabel, timeLabel } = formatEventDate(event)
                const meta = parseEventMeta(event)
                return (
                  <button
                    type="button"
                    key={event._id}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full rounded-[10px] border border-black/[0.08] bg-[#fcfdff] p-4 text-left transition-colors hover:border-[#5b3df6]/30 hover:bg-[#faf8ff]"
                  >
                    <p className="text-[15px] font-bold text-[#0f172a]">{event.title || 'Untitled Event'}</p>
                    <p className="mt-1 text-[12px] text-[#64748b] line-clamp-2">{event.description || 'No description available.'}</p>
                    <div className="mt-3 space-y-1.5 text-[11px] text-[#64748b]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#94a3b8]" />
                        <span>{dateLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#94a3b8]" />
                        <span>{timeLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#94a3b8]" />
                        <span>{meta.venue}</span>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {selectedEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-[10px] bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-black/[0.08] bg-white p-5">
              <div>
                <h2 className="text-[22px] font-bold text-[#0f172a]">{selectedEvent.title || 'Event details'}</h2>
                <p className="mt-1 text-[12px] text-[#94a3b8]">School event details</p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="rounded-md p-1 text-[#94a3b8] hover:bg-[#f8fafc]" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-[8px] border border-black/[0.08] p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Date</div>
                  <div className="mt-1 text-[14px] text-[#0f172a]">{formatEventDate(selectedEvent).dateLabel}</div>
                </div>
                <div className="rounded-[8px] border border-black/[0.08] p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Time</div>
                  <div className="mt-1 text-[14px] text-[#0f172a]">{formatEventDate(selectedEvent).timeLabel}</div>
                </div>
                <div className="rounded-[8px] border border-black/[0.08] p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Venue</div>
                  <div className="mt-1 text-[14px] text-[#0f172a]">{parseEventMeta(selectedEvent).venue}</div>
                </div>
                <div className="rounded-[8px] border border-black/[0.08] p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Expected attendees</div>
                  <div className="mt-1 flex items-center gap-2 text-[14px] text-[#0f172a]">
                    <Users className="h-4 w-4 text-[#5b3df6]" />
                    {parseEventMeta(selectedEvent).expectedAttendees || 'TBA'}
                  </div>
                </div>
              </div>

              <div className="rounded-[8px] border border-black/[0.08] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Description</div>
                <p className="mt-1 whitespace-pre-line text-[13px] text-[#334155]">
                  {selectedEvent.description || 'No description available.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
