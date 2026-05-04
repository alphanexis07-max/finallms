import React, { useEffect, useMemo, useState } from 'react'
import { Calendar, Clock, MapPin, Plus, Users, X, ChevronDown, FileText, Bell, CheckCircle } from 'lucide-react'
import { api } from '../../lib/api'
import useRealtime from '../../hooks/useRealtime'

function Pill({ children, variant = 'neutral' }) {
  const style =
    variant === 'success'
      ? 'bg-[#2dd4bf] text-[#023b33]'
      : variant === 'warning'
        ? 'bg-[#ffd966] text-[#4b2e00]'
        : variant === 'accent'
          ? 'bg-[#e8f5ff] text-[#0f172a]'
          : 'bg-[#f1f5f9] text-[#0f172a]'

  return <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${style}`}>{children}</span>
}

function parseEventMeta(event) {
  const description = String(event?.description || '')
  const pick = (label) => {
    const match = description.match(new RegExp(`${label}:\\s*(.+)`, 'i'))
    return match?.[1]?.split('\n')?.[0]?.trim() || ''
  }

  return {
    category: event?.category || pick('Category') || 'Academic',
    venue: event?.location || pick('Venue') || pick('Location') || 'TBA',
    coordinator: event?.coordinator || pick('Coordinator') || 'TBA',
    expectedAttendees: event?.expected_attendees || pick('Expected attendees') || '',
    notes: description,
  }
}

function formatEventDate(event) {
  const startsAt = event?.starts_at || event?.date || null
  if (!startsAt) return { dateLabel: '-', timeLabel: '-' }
  const date = new Date(startsAt)
  return {
    dateLabel: date.toLocaleDateString(),
    timeLabel: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
}

export default function AdminSchoolEvents() {
  const tenantId = localStorage.getItem('lms_tenant_id')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [createBusy, setCreateBusy] = useState(false)
  const [error, setError] = useState('')
  const [events, setEvents] = useState([])
  const [eventForm, setEventForm] = useState({
    eventName: '',
    eventCategory: 'Academic',
    expectedAttendees: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    venue: '',
    coordinator: '',
    description: '',
    publishToCalendar: true,
  })

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await api('/lms/events?limit=100').catch(() => ({ items: [] }))
      setEvents(res.items || res || [])
    } catch (err) {
      setEvents([])
      setError(err?.message || 'Unable to load events.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  useRealtime(tenantId ? `tenant:${tenantId}` : '', (payload) => {
    if (payload?.type?.startsWith('event.')) loadEvents()
  })

  const normalizedEvents = useMemo(() => {
    return [...events]
      .filter((event) => event?.starts_at || event?.date)
      .sort((left, right) => new Date(left.starts_at || left.date || 0) - new Date(right.starts_at || right.date || 0))
  }, [events])

  const upcoming = useMemo(() => normalizedEvents.slice(0, 12), [normalizedEvents])

  const stats = useMemo(() => {
    const now = new Date()
    const next30Days = new Date(now)
    next30Days.setDate(now.getDate() + 30)

    const upcoming30 = normalizedEvents.filter((event) => {
      const startsAt = new Date(event.starts_at || event.date || 0)
      return startsAt >= now && startsAt <= next30Days
    })

    const confirmedVenues = normalizedEvents.filter((event) => parseEventMeta(event).venue !== 'TBA').length
    const fullyReady = normalizedEvents.filter((event) => {
      const meta = parseEventMeta(event)
      return Boolean(meta.venue !== 'TBA' && meta.coordinator !== 'TBA' && event.starts_at)
    }).length

    return {
      scheduled: normalizedEvents.length,
      upcoming30: upcoming30.length,
      confirmedVenues,
      fullyReady,
      readiness: normalizedEvents.length ? Math.round((fullyReady / normalizedEvents.length) * 100) : 0,
      participantsThisMonth: upcoming30.length * 120,
    }
  }, [normalizedEvents])

  const handleCreateEvent = async () => {
    if (!eventForm.eventName.trim() || !eventForm.eventDate) return

    const startValue = eventForm.startTime ? `${eventForm.eventDate}T${eventForm.startTime}` : `${eventForm.eventDate}T09:00`
    const endTimeText = eventForm.endTime ? `${eventForm.startTime || '09:00'} to ${eventForm.endTime}` : eventForm.startTime || '09:00'
    const notes = [
      `Category: ${eventForm.eventCategory}`,
      `Venue: ${eventForm.venue.trim() || 'TBA'}`,
      `Coordinator: ${eventForm.coordinator.trim() || 'TBA'}`,
      `Expected attendees: ${eventForm.expectedAttendees || '0'}`,
      `Time: ${endTimeText}`,
      eventForm.description.trim(),
      eventForm.publishToCalendar ? 'Publish to calendar: Yes' : 'Publish to calendar: No',
    ]
      .filter(Boolean)
      .join('\n')

    try {
      setCreateBusy(true)
      setError('')
      await api('/lms/events', {
        method: 'POST',
        body: JSON.stringify({
          title: eventForm.eventName.trim(),
          description: notes,
          starts_at: new Date(startValue).toISOString(),
        }),
      })
      setShowCreateModal(false)
      setEventForm({
        eventName: '',
        eventCategory: 'Academic',
        expectedAttendees: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        venue: '',
        coordinator: '',
        description: '',
        publishToCalendar: true,
      })
      loadEvents()
    } catch (err) {
      setError(err?.message || 'Unable to create event.')
    } finally {
      setCreateBusy(false)
    }
  }

  const handleViewEvent = (event) => {
    setSelectedEvent(event || null)
  }

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="bg-gradient-to-b flex h-full flex-col gap-[24px] from-[#f6f8fa] p-4 to-[#f7fcff] sm:p-6 lg:p-7">
        <section className="border border-black/[0.08] border-solid content-stretch flex flex-col items-start pb-[23px] pt-[25px] px-[25px] relative rounded-[8px] shrink-0 w-full bg-gradient-to-br from-white to-[#e8f5ff]">
          <div className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row">
            <div className="flex flex-col gap-[11px] items-start relative shrink-0">
              <div className="flex gap-2 flex-wrap">
                <Pill variant="accent">Academic year 2025</Pill>
                <Pill variant="success">{stats.upcoming30} upcoming events</Pill>
              </div>
              <div className="text-[24px] font-bold leading-tight text-[#0f172a] sm:text-[28px]">
                Annual school events and activities
              </div>
              <div className="text-[14px] text-[#94a3b8]">
                Plan assemblies, competitions, parent meetings, and celebration days across the term. Track status, coordinators, and participation from a single schedule view.
              </div>
              <div className="flex flex-wrap gap-3 text-[13px] text-[#94a3b8]">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4 text-[#5b3df6]" />
                  {stats.participantsThisMonth.toLocaleString('en-IN')} expected participants this month
                </span>
                <span>{stats.upcoming30} major events in the next 30 days</span>
                <span>{stats.confirmedVenues} venues confirmed</span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 h-[40px] px-[16px] rounded-[6px] text-[14px] font-medium bg-[#5b3df6] text-white hover:bg-[#4c2dd9] transition-colors cursor-pointer"
              >
                <Plus className="h-[18px] w-[18px]" />
                Create event
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-x-[16px] gap-y-[16px] xl:grid-cols-[repeat(2,minmax(0,1fr))]">
          <div className="bg-white border border-black/[0.08] rounded-[8px] p-[21px]">
            <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Events overview</h3>
            <p className="text-[13px] text-[#94a3b8] mt-[4px] mb-[16px]">Monitor planned activities, approvals, and venue coordination.</p>
            <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-3">
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Scheduled events</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">{stats.scheduled}</div>
              </div>
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Pending approvals</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">{Math.max(stats.scheduled - stats.fullyReady, 0)}</div>
              </div>
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Confirmed venues</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">{stats.confirmedVenues}</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] rounded-[8px] p-[21px]">
            <h3 className="text-[18px] font-bold text-[#0f172a] m-0">This month</h3>
            <p className="text-[13px] text-[#94a3b8] mt-[4px] mb-[16px]">Current readiness and event execution pace.</p>
            <div className="text-[30px] font-bold text-[#0f172a] mb-[8px]">{stats.readiness}%</div>
            <div className="h-2 rounded-full bg-[#edf2ff] mb-[16px]">
              <div className="h-2 rounded-full bg-[#5b3df6]" style={{ width: `${stats.readiness}%` }} />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Pill>{stats.scheduled} planned</Pill>
              <Pill variant="success">{stats.fullyReady} fully ready</Pill>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-[24px] gap-y-[24px] xl:grid-cols-[1.7fr_1fr]">
          <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
            <div className="px-[21px] pt-[21px] pb-[16px] flex justify-between items-start gap-4">
              <div>
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Upcoming events</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Key school activities, celebrations, and meetings planned this term.</p>
              </div>
              <button className="inline-flex items-center gap-1.5 h-[36px] px-[12px] rounded-[6px] text-[13px] font-medium bg-white text-[#0f172a] border border-black/[0.08] hover:bg-[#f1f5f9] transition-colors cursor-pointer whitespace-nowrap">
                All events
              </button>
            </div>
            <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
              {upcoming.map((event) => {
                const meta = parseEventMeta(event)
                const { dateLabel, timeLabel } = formatEventDate(event)
                const dayParts = dateLabel !== '-' ? dateLabel.split('/') : ['-', '-']

                return (
                  <div key={event._id} className="p-[16px] border border-black/[0.08] rounded-[6px]">
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="rounded-[6px] bg-[#f8fafc] px-3 py-2 text-center flex-shrink-0 min-w-[50px]">
                          <div className="text-[10px] font-medium text-[#94a3b8] uppercase">{dayParts[0] || '-'}</div>
                          <div className="text-[20px] font-bold text-[#0f172a] leading-tight">{dayParts[1] || '-'}</div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-semibold text-[#0f172a] leading-snug">{event.title}</div>
                          <div className="text-[12px] text-[#94a3b8] mt-[4px] line-clamp-2">
                            {event.description || 'No description'}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-[#94a3b8]">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {timeLabel}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {meta.venue}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {meta.expectedAttendees || 'TBA'} attendees
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 sm:ml-4 flex gap-2">
                        <Pill variant="accent">{meta.category}</Pill>
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="inline-flex items-center h-[36px] px-[12px] rounded-[6px] text-[13px] font-medium bg-white text-[#0f172a] border border-black/[0.08] hover:bg-[#f1f5f9] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
              {!loading && upcoming.length === 0 && <p className="text-[12px] text-[#94a3b8]">No events found.</p>}
              {loading && <p className="text-[12px] text-[#94a3b8]">Loading events...</p>}
            </div>
          </div>

          <div className="flex flex-col gap-[24px]">
            <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
              <div className="px-[21px] pt-[21px] pb-[16px]">
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Notices</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Important reminders before the next event cycle.</p>
              </div>
              <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
                {normalizedEvents.slice(0, 3).map((event) => (
                  <div key={event._id} className="p-[16px] border border-black/[0.08] rounded-[6px]">
                    <div className="flex items-start gap-2">
                      <Bell className="h-4 w-4 text-[#ffd966] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-[14px] font-semibold text-[#0f172a]">{event.title}</div>
                        <div className="text-[12px] text-[#94a3b8] mt-[4px]">
                          {parseEventMeta(event).coordinator !== 'TBA'
                            ? `Coordinator: ${parseEventMeta(event).coordinator}`
                            : 'Review and confirm'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {normalizedEvents.length === 0 && (
                  <div className="p-[16px] border border-black/[0.08] rounded-[6px] text-[12px] text-[#94a3b8]">
                    No notices available yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-white rounded-[8px] shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-black/[0.08] sticky top-0 bg-white">
              <h2 className="text-[20px] font-bold text-[#0f172a]">Create new event</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="h-5 w-5 text-[#94a3b8]" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <p className="text-[13px] text-[#64748b] mb-2">Add details for the upcoming school activity.</p>

              {error ? <div className="rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">{error}</div> : null}

              <div>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">
                  Event name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={eventForm.eventName}
                  onChange={(e) => setEventForm((f) => ({ ...f, eventName: e.target.value }))}
                  placeholder="e.g., Annual Science Fair"
                  className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] placeholder:text-[#94a3b8]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Category</label>
                  <div className="relative">
                    <select
                      value={eventForm.eventCategory}
                      onChange={(e) => setEventForm((f) => ({ ...f, eventCategory: e.target.value }))}
                      className="w-full appearance-none rounded-[6px] border border-black/[0.08] bg-white px-3 py-2.5 text-[13px] text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] cursor-pointer"
                    >
                      <option>Academic</option>
                      <option>Sports</option>
                      <option>Cultural</option>
                      <option>Workshop</option>
                      <option>Meeting</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Expected attendees</label>
                  <input
                    type="number"
                    value={eventForm.expectedAttendees}
                    onChange={(e) => setEventForm((f) => ({ ...f, expectedAttendees: e.target.value }))}
                    className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="col-span-1">
                    <input
                      type="date"
                      value={eventForm.eventDate}
                      onChange={(e) => setEventForm((f) => ({ ...f, eventDate: e.target.value }))}
                      className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] text-[#94a3b8] mb-1">Start time</label>
                    <input
                      type="time"
                      value={eventForm.startTime}
                      onChange={(e) => setEventForm((f) => ({ ...f, startTime: e.target.value }))}
                      className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] text-[#94a3b8] mb-1">End time</label>
                    <input
                      type="time"
                      value={eventForm.endTime}
                      onChange={(e) => setEventForm((f) => ({ ...f, endTime: e.target.value }))}
                      className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Venue</label>
                  <input
                    value={eventForm.venue}
                    onChange={(e) => setEventForm((f) => ({ ...f, venue: e.target.value }))}
                    placeholder="Main auditorium"
                    className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Coordinator</label>
                  <input
                    value={eventForm.coordinator}
                    onChange={(e) => setEventForm((f) => ({ ...f, coordinator: e.target.value }))}
                    placeholder="Marcus Chen"
                    className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Add event details, schedule, or important notes..."
                  rows="3"
                  className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] resize-none placeholder:text-[#94a3b8]"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={eventForm.publishToCalendar}
                  onChange={(e) => setEventForm((f) => ({ ...f, publishToCalendar: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 rounded border-black/[0.2] text-[#5b3df6] focus:ring-[#5b3df6]"
                />
                <div>
                  <label className="text-[13px] font-semibold text-[#0f172a]">Publish to school calendar</label>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">Event will be visible to parents and students immediately.</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 flex flex-col gap-3 border-t border-black/[0.08] bg-white p-5 sm:flex-row">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 h-10 border border-black/[0.08] rounded-[6px] text-[13px] font-medium text-[#64748b] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                disabled={createBusy}
                className="flex-1 h-10 bg-[#5b3df6] rounded-[6px] text-[13px] font-medium text-white hover:bg-[#4a2ed8] transition-colors disabled:opacity-60"
              >
                {createBusy ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-[10px] bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-black/[0.08] bg-white p-5">
              <div>
                <h2 className="text-[22px] font-bold text-[#0f172a]">{selectedEvent.title || 'Event details'}</h2>
                <p className="mt-1 text-[12px] text-[#94a3b8]">Review complete event information</p>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="rounded-md p-1 text-[#94a3b8] hover:bg-[#f8fafc]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Pill variant="accent">{parseEventMeta(selectedEvent).category}</Pill>
                <Pill variant="success">{formatEventDate(selectedEvent).dateLabel}</Pill>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-[8px] border border-black/[0.08] p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Time</div>
                  <div className="mt-1 flex items-center gap-2 text-[14px] text-[#0f172a]">
                    <Clock className="h-4 w-4 text-[#5b3df6]" />
                    {formatEventDate(selectedEvent).timeLabel}
                  </div>
                </div>
                <div className="rounded-[8px] border border-black/[0.08] p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Venue</div>
                  <div className="mt-1 flex items-center gap-2 text-[14px] text-[#0f172a]">
                    <MapPin className="h-4 w-4 text-[#5b3df6]" />
                    {parseEventMeta(selectedEvent).venue}
                  </div>
                </div>
                <div className="rounded-[8px] border border-black/[0.08] p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">Coordinator</div>
                  <div className="mt-1 flex items-center gap-2 text-[14px] text-[#0f172a]">
                    <CheckCircle className="h-4 w-4 text-[#2dd4bf]" />
                    {parseEventMeta(selectedEvent).coordinator}
                  </div>
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
                <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                  <FileText className="h-4 w-4" />
                  Event description
                </div>
                <p className="whitespace-pre-line text-[13px] text-[#334155]">
                  {selectedEvent.description || 'No description available for this event.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
