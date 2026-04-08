import React, { useEffect, useMemo, useState } from 'react'
import { Calendar, Clock, MapPin, Plus, Users, X } from 'lucide-react'
import { api } from '../../lib/api'
import useRealtime from '../../hooks/useRealtime'

export default function AdminSchoolEvents() {
  const tenantId = localStorage.getItem('lms_tenant_id')
  const [events, setEvents] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  })

  const loadEvents = () =>
    api('/lms/events?limit=100')
      .then((res) => setEvents(res.items || []))
      .catch(() => setEvents([]))

  const getEventDate = (event) => event?.starts_at || event?.date || null

  useEffect(() => {
    loadEvents()
  }, [])

  useRealtime(tenantId ? `tenant:${tenantId}` : '', (payload) => {
    if (payload?.type?.startsWith('event.')) loadEvents()
  })

  const upcoming = useMemo(
    () =>
      events
        .filter((e) => getEventDate(e))
        .sort((a, b) => new Date(getEventDate(a)) - new Date(getEventDate(b)))
        .slice(0, 12),
    [events],
  )

  const handleCreate = async () => {
    if (!eventForm.title.trim() || !eventForm.date) return
    try {
      setLoading(true)
      setError('')
      await api('/lms/events', {
        method: 'POST',
        body: JSON.stringify({
          title: eventForm.title.trim(),
          description: eventForm.description.trim(),
          starts_at: new Date(eventForm.date).toISOString(),
          location: eventForm.location.trim(),
        }),
      })
      setShowCreateModal(false)
      setEventForm({ title: '', description: '', date: '', location: '' })
      loadEvents()
    } catch (err) {
      setError(err?.message || 'Unable to create event.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full bg-[#F7FAFD] p-4 sm:p-6">
      <section className="rounded-[8px] border border-black/[0.08] bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#0f172a]">School Events</h1>
            <p className="text-[13px] text-[#94a3b8]">All events are now live from backend data.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-[#5b3df6] px-4 text-[13px] font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Create Event
          </button>
        </div>
      </section>

      <section className="mt-4 rounded-[8px] border border-black/[0.08] bg-white p-5">
        {error && (
          <div className="mb-3 rounded-[6px] border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
            {error}
          </div>
        )}
        <div className="mb-3 text-[14px] font-semibold text-[#0f172a]">
          Upcoming Events ({upcoming.length})
        </div>
        <div className="space-y-2">
          {upcoming.map((event) => (
            <div key={event._id} className="rounded-[6px] border border-black/[0.08] p-3">
              <div className="text-[14px] font-semibold text-[#0f172a]">{event.title}</div>
              <div className="mt-1 text-[12px] text-[#64748b]">{event.description || 'No description'}</div>
              <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-[#94a3b8]">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {getEventDate(event) ? new Date(getEventDate(event)).toLocaleDateString() : '-'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {getEventDate(event) ? new Date(getEventDate(event)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location || 'TBA'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Tenant Event
                </span>
              </div>
            </div>
          ))}
          {upcoming.length === 0 && <p className="text-[12px] text-[#94a3b8]">No events found.</p>}
        </div>
      </section>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[520px] rounded-[8px] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#0f172a]">Create Event</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="h-5 w-5 text-[#94a3b8]" />
              </button>
            </div>
            <div className="space-y-3">
              <input className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px]" placeholder="Event title" value={eventForm.title} onChange={(e) => setEventForm((f) => ({ ...f, title: e.target.value }))} />
              <input type="datetime-local" className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px]" value={eventForm.date} onChange={(e) => setEventForm((f) => ({ ...f, date: e.target.value }))} />
              <input className="h-10 w-full rounded-[6px] border border-black/[0.08] px-3 text-[13px]" placeholder="Location" value={eventForm.location} onChange={(e) => setEventForm((f) => ({ ...f, location: e.target.value }))} />
              <textarea className="h-20 w-full rounded-[6px] border border-black/[0.08] px-3 py-2 text-[13px]" placeholder="Description" value={eventForm.description} onChange={(e) => setEventForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setShowCreateModal(false)} className="h-9 flex-1 rounded-[6px] border border-black/[0.08] text-[12px] font-semibold text-[#334155]">Cancel</button>
              <button disabled={loading} onClick={handleCreate} className="h-9 flex-1 rounded-[6px] bg-[#5b3df6] text-[12px] font-semibold text-white disabled:opacity-60">
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
