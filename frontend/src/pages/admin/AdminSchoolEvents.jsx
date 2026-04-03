import React, { useState } from 'react'
import { Search, Calendar, Plus, CalendarDays, MapPin, Users, X, ChevronDown, Clock, FileText, Bell, CheckCircle } from 'lucide-react'

export default function InstructorSchoolEvents() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [eventName, setEventName] = useState('')
  const [eventCategory, setEventCategory] = useState('Academic')
  const [expectedAttendees, setExpectedAttendees] = useState(0)
  const [eventDate, setEventDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [venue, setVenue] = useState('')
  const [coordinator, setCoordinator] = useState('')
  const [description, setDescription] = useState('')
  const [publishToCalendar, setPublishToCalendar] = useState(true)

  const events = [
    ['Annual Science Fair', 'Student project showcase with live judging, invited parents, and inter-class innovation awards.', 'Apr 12', '7:00 AM to 2:00 PM', 'Main auditorium', '420 attendees', 'View'],
    ['Parent teacher meeting', 'Grade-wise meetings for progress review, attendance feedback, and individual parent discussions.', 'Apr 18', '8:30 AM to 12:30 PM', 'Senior block classrooms', '280 families', 'Review'],
    ['Inter-house sports day', 'Track events, team points, house announcements, and volunteer allocation across the school ground.', 'Apr 24', '7:30 AM to 1:30 PM', 'School ground', '680 students', 'Open'],
    ['Student council induction', 'New council onboarding, leadership briefing, and student representative introductions.', 'May 03', '11:00 AM to 12:00 PM', 'Assembly hall', '95 invitees', 'Edit'],
  ]

  const handleCreateEvent = () => {
    console.log('Creating event:', {
      eventName,
      eventCategory,
      expectedAttendees,
      eventDate,
      startTime,
      endTime,
      venue,
      coordinator,
      description,
      publishToCalendar
    })
    setShowCreateModal(false)
    setEventName('')
    setEventCategory('Academic')
    setExpectedAttendees(0)
    setEventDate('')
    setStartTime('')
    setEndTime('')
    setVenue('')
    setCoordinator('')
    setDescription('')
    setPublishToCalendar(true)
  }

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="bg-gradient-to-b flex flex-col from-[#f6f8fa] gap-[24px] h-full p-[28px] to-[#f7fcff]">
        {/* Hero Section */}
        <section className="border border-black/[0.08] border-solid content-stretch flex flex-col items-start pb-[23px] pt-[25px] px-[25px] relative rounded-[8px] shrink-0 w-full bg-gradient-to-br from-white to-[#e8f5ff]">
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-[11px] items-start relative shrink-0">
              <div className="flex gap-2">
                <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#e8f5ff] text-[#0f172a]">Academic year 2025</span>
                <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#2dd4bf] text-[#023b33]">12 upcoming events</span>
              </div>
              <div className="flex flex-col font-bold h-[31.59px] justify-center leading-[0] text-[#0f172a] text-[28px]">
                Annual school events and activities
              </div>
              <div className="flex flex-col font-normal h-[17px] justify-center leading-[0] text-[#94a3b8] text-[14px]">
                Plan assemblies, competitions, parent meetings, and celebration days across the term. Track status, coordinators, and participation from a single schedule view.
              </div>
              <div className="flex gap-4 text-[13px] text-[#94a3b8]">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4 text-[#5b3df6]" />
                  1,240 expected participants this month
                </span>
                <span>8 major events in the next 30 days</span>
                <span>Auditorium, sports ground, and main hall booked</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 h-[40px] px-[16px] rounded-[6px] text-[14px] font-medium bg-[#5b3df6] text-white hover:bg-[#4c2dd9] transition-colors cursor-pointer"
              >
                <Plus className="h-[18px] w-[18px]" />
                Create event
              </button>
              <button className="inline-flex items-center gap-2 h-[40px] px-[17px] rounded-[6px] text-[14px] font-medium bg-white text-[#0f172a] border border-black/[0.08] hover:bg-[#f1f5f9] transition-colors cursor-pointer">
                <Calendar className="h-[18px] w-[18px]" />
                Export calendar
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(2,minmax(0,1fr))]">
          <div className="bg-white border border-black/[0.08] rounded-[8px] p-[21px]">
            <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Events overview</h3>
            <p className="text-[13px] text-[#94a3b8] mt-[4px] mb-[16px]">Monitor planned activities, approvals, and venue coordination.</p>
            <div className="grid grid-cols-3 gap-[16px]">
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Scheduled events</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">18</div>
              </div>
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Pending approvals</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">4</div>
              </div>
              <div className="bg-[#f8fafc] rounded-[6px] p-[14px]">
                <div className="text-[13px] font-medium text-[#94a3b8]">Confirmed venues</div>
                <div className="text-[30px] font-bold text-[#0f172a] mt-[6px]">11</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-black/[0.08] rounded-[8px] p-[21px]">
            <h3 className="text-[18px] font-bold text-[#0f172a] m-0">This month</h3>
            <p className="text-[13px] text-[#94a3b8] mt-[4px] mb-[16px]">Current readiness and event execution pace.</p>
            <div className="text-[30px] font-bold text-[#0f172a] mb-[8px]">76%</div>
            <div className="h-2 rounded-full bg-[#edf2ff] mb-[16px]">
              <div className="h-2 w-[76%] rounded-full bg-[#5b3df6]" />
            </div>
            <div className="flex gap-2">
              <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#f1f5f9] text-[#0f172a]">14 planned</span>
              <span className="inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium bg-[#2dd4bf] text-[#023b33]">5 fully ready</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[1.7fr_1fr]">
          {/* Upcoming events */}
          <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
            <div className="px-[21px] pt-[21px] pb-[16px] flex justify-between items-start gap-4">
              <div>
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Upcoming events</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Key school activities, celebrations, and meetings planned this term.</p>
              </div>
              <button className="inline-flex items-center gap-1.5 h-[36px] px-[12px] rounded-[6px] text-[13px] font-medium bg-white text-[#0f172a] border border-black/[0.08] hover:bg-[#f1f5f9] transition-colors cursor-pointer">
                All events
              </button>
            </div>
            <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
              {events.map(([title, desc, date, time, venue, count, cta], i) => (
                <div key={i} className="p-[16px] border border-black/[0.08] rounded-[6px]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="rounded-[6px] bg-[#f8fafc] px-3 py-2 text-center flex-shrink-0 min-w-[50px]">
                        <div className="text-[10px] font-medium text-[#94a3b8] uppercase">{date.split(' ')[0]}</div>
                        <div className="text-[20px] font-bold text-[#0f172a] leading-tight">{date.split(' ')[1]}</div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-semibold text-[#0f172a] leading-snug">{title}</div>
                        <div className="text-[12px] text-[#94a3b8] mt-[4px] line-clamp-2">{desc}</div>
                        <div className="flex gap-3 mt-2 text-[11px] text-[#94a3b8]">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {time}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {venue}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {count}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button className="inline-flex items-center h-[36px] px-[12px] rounded-[6px] text-[13px] font-medium bg-white text-[#0f172a] border border-black/[0.08] hover:bg-[#f1f5f9] transition-colors cursor-pointer whitespace-nowrap">
                        {cta}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-[24px]">
            {/* Quick actions */}
            <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
              <div className="px-[21px] pt-[21px] pb-[16px]">
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Quick actions</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Frequently used event management shortcuts.</p>
              </div>
              <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="w-full text-left p-[16px] border border-black/[0.08] rounded-[6px] hover:bg-[#f8fafc] transition-colors cursor-pointer"
                >
                  <div className="text-[14px] font-semibold text-[#0f172a]">Create a new event</div>
                  <div className="text-[12px] text-[#94a3b8] mt-[4px]">Action shortcut</div>
                </button>
                <div className="p-[16px] border border-black/[0.08] rounded-[6px]">
                  <div className="text-[14px] font-semibold text-[#0f172a]">Check venue availability</div>
                  <div className="text-[12px] text-[#94a3b8] mt-[4px]">Action shortcut</div>
                </div>
                <div className="p-[16px] border border-black/[0.08] rounded-[6px]">
                  <div className="text-[14px] font-semibold text-[#0f172a]">Assign staff coordinators</div>
                  <div className="text-[12px] text-[#94a3b8] mt-[4px]">Action shortcut</div>
                </div>
              </div>
            </div>

            {/* Notices */}
            <div className="bg-white border border-black/[0.08] rounded-[8px] flex flex-col">
              <div className="px-[21px] pt-[21px] pb-[16px]">
                <h3 className="text-[18px] font-bold text-[#0f172a] m-0">Notices</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Important reminders before the next event cycle.</p>
              </div>
              <div className="flex flex-col gap-[12px] px-[21px] pb-[21px]">
                {['Volunteer briefing due today', 'Science fair booths approved', 'Transport request pending'].map((notice, i) => (
                  <div key={i} className="p-[16px] border border-black/[0.08] rounded-[6px]">
                    <div className="flex items-start gap-2">
                      <Bell className="h-4 w-4 text-[#ffd966] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-[14px] font-semibold text-[#0f172a]">{notice}</div>
                        <div className="text-[12px] text-[#94a3b8] mt-[4px]">Review and confirm</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[560px] max-h-[90vh] overflow-y-auto bg-white rounded-[8px] shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-black/[0.08] sticky top-0 bg-white">
              <h2 className="text-[20px] font-bold text-[#0f172a]">Create new event</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-[#94a3b8] hover:text-[#0f172a] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-5">
              <p className="text-[13px] text-[#64748b] mb-2">
                Add details for the upcoming school activity.
              </p>

              {/* Event Name */}
              <div>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">
                  Event name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g., Annual Science Fair"
                  className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] placeholder:text-[#94a3b8]"
                />
              </div>

              {/* Category and Expected Attendees */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Category</label>
                  <div className="relative">
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value)}
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
                    value={expectedAttendees}
                    onChange={(e) => setExpectedAttendees(Number(e.target.value))}
                    className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                    min="0"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] text-[#94a3b8] mb-1">Start time *</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] text-[#94a3b8] mb-1">End time *</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
                    />
                  </div>
                </div>
              </div>

              {/* Venue and Coordinator */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Venue</label>
                  <div className="relative">
                    <select
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="w-full appearance-none rounded-[6px] border border-black/[0.08] bg-white px-3 py-2.5 text-[13px] text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] cursor-pointer"
                    >
                      <option value="">Select location</option>
                      <option>Main auditorium</option>
                      <option>Senior block classrooms</option>
                      <option>School ground</option>
                      <option>Assembly hall</option>
                      <option>Science lab</option>
                      <option>Conference room</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Coordinator</label>
                  <div className="relative">
                    <select
                      value={coordinator}
                      onChange={(e) => setCoordinator(e.target.value)}
                      className="w-full appearance-none rounded-[6px] border border-black/[0.08] bg-white px-3 py-2.5 text-[13px] text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] cursor-pointer"
                    >
                      <option value="">Select staff member</option>
                      <option>Marcus Chen</option>
                      <option>Sarah Jenkins</option>
                      <option>David Miller</option>
                      <option>Elena Brooks</option>
                      <option>Mateo Ruiz</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[13px] font-semibold text-[#0f172a] mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add event details, schedule, or important notes..."
                  rows="3"
                  className="w-full rounded-[6px] border border-black/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6] resize-none placeholder:text-[#94a3b8]"
                />
              </div>

              {/* Publish to Calendar */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={publishToCalendar}
                  onChange={(e) => setPublishToCalendar(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-black/[0.2] text-[#5b3df6] focus:ring-[#5b3df6]"
                />
                <div>
                  <label className="text-[13px] font-semibold text-[#0f172a]">Publish to school calendar</label>
                  <p className="text-[11px] text-[#94a3b8] mt-0.5">Event will be visible to parents and students immediately.</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-5 border-t border-black/[0.08] sticky bottom-0 bg-white">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 h-10 border border-black/[0.08] rounded-[6px] text-[13px] font-medium text-[#64748b] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="flex-1 h-10 bg-[#5b3df6] rounded-[6px] text-[13px] font-medium text-white hover:bg-[#4a2ed8] transition-colors"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
