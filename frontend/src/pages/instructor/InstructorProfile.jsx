import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Bell, BookOpen, FileText, RefreshCcw, Save, Users } from 'lucide-react'
import { api } from '../../lib/api'

const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-[#e8f5ff] text-[#5b3df6]',
    green: 'bg-[#2dd4bf] text-[#023b33]',
    purple: 'bg-[#ede7ff] text-[#4c2dd9]',
  }
  return (
    <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}

const InfoField = ({ label, value }) => (
  <div className="bg-[#f8fafc] rounded-[8px] p-[12px] border border-black/[0.08]">
    <p className="text-[11px] text-[#94a3b8] mb-[4px]">{label}</p>
    <p className="text-[13px] font-medium text-[#0f172a] break-words">{value || '-'}</p>
  </div>
)

const ActivityItem = ({ title, subtitle, badge, badgeColor }) => (
  <div className="flex items-start gap-[12px] py-[12px] border-b border-black/[0.08] last:border-0">
    <div className="w-[32px] h-[32px] rounded-[6px] bg-[#e8f5ff] flex items-center justify-center text-[#5b3df6] flex-shrink-0 text-[14px]">
      <Bell className="h-4 w-4" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-semibold text-[#0f172a] break-words">{title}</p>
      <p className="text-[11px] text-[#94a3b8] mt-[4px] break-words">{subtitle}</p>
    </div>
    {badge && (
      <span
        className={`inline-flex h-[24px] items-center px-[8px] rounded-[10px] text-[10px] font-medium ${
          badgeColor === 'green' ? 'bg-[#2dd4bf] text-[#023b33]' : 'bg-[#f1f5f9] text-[#64748b]'
        }`}
      >
        {badge}
      </span>
    )}
  </div>
)

function formatDate(value) {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '-'
  return parsed.toLocaleString()
}

function formatRole(role) {
  if (!role) return 'Instructor'
  return String(role)
    .split('_')
    .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1))
    .join(' ')
}

function initials(name) {
  const text = String(name || '').trim()
  if (!text) return 'IN'
  const parts = text.split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] || ''
  const second = parts[1]?.[0] || parts[0]?.[1] || ''
  return `${first}${second}`.toUpperCase()
}

export default function InstructorProfile() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [me, setMe] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [courses, setCourses] = useState([])
  const [liveClasses, setLiveClasses] = useState([])
  const [notifications, setNotifications] = useState([])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      setError('')

      const [meRes, dashboardRes, courseRes, classRes, notificationRes] = await Promise.all([
        api('/auth/me'),
        api('/instructor/dashboard'),
        api('/instructor/courses'),
        api('/lms/live-classes?limit=100'),
        api('/lms/notifications?limit=20'),
      ])

      setMe(meRes || null)
      setDashboard(dashboardRes || null)
      setCourses(Array.isArray(courseRes) ? courseRes : [])

      const classItems = Array.isArray(classRes?.items) ? classRes.items : Array.isArray(classRes) ? classRes : []
      const userIds = new Set([String(meRes?._id || ''), String(meRes?.id || ''), String(meRes?.sub || '')].filter(Boolean))
      const assignedClasses = classItems.filter((item) => item?.instructor_id && userIds.has(String(item.instructor_id)))
      setLiveClasses(assignedClasses)

      const notificationItems = Array.isArray(notificationRes?.items)
        ? notificationRes.items
        : Array.isArray(notificationRes)
        ? notificationRes
        : []
      setNotifications(notificationItems)
    } catch (err) {
      setError(err?.message || 'Failed to load profile data')
      setMe(null)
      setDashboard(null)
      setCourses([])
      setLiveClasses([])
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfileData()
  }, [])

  const profileName = useMemo(() => {
    return me?.full_name || me?.name || me?.username || 'Instructor'
  }, [me])

  const roleText = useMemo(() => formatRole(me?.role), [me])

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n?.read).length
  }, [notifications])

  const recentActivity = useMemo(() => {
    return notifications.slice(0, 3)
  }, [notifications])

  const classStats = useMemo(() => {
    const now = Date.now()
    let live = 0
    let upcoming = 0
    let completed = 0

    liveClasses.forEach((item) => {
      const start = new Date(item?.start_at || item?.start_time || 0).getTime()
      const end = item?.duration_minutes ? start + Number(item.duration_minutes) * 60000 : NaN

      if (!Number.isNaN(start) && !Number.isNaN(end)) {
        if (start <= now && now <= end) live += 1
        else if (start > now) upcoming += 1
        else completed += 1
      }
    })

    return { live, upcoming, completed }
  }, [liveClasses])

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="bg-gradient-to-b flex flex-col from-[#f6f8fa] gap-[24px] h-full p-[16px] sm:p-[24px] lg:p-[28px] to-[#f7fcff]">
        <div className="border border-black/[0.08] border-solid content-stretch flex flex-col items-start pb-[23px] pt-[25px] px-[18px] sm:px-[25px] relative rounded-[8px] shrink-0 w-full bg-gradient-to-br from-white to-[#e8f5ff]">
          <div className="flex flex-col gap-[14px] sm:gap-[16px] sm:flex-row sm:items-center sm:justify-between w-full">
            <div className="flex items-center gap-[14px] sm:gap-[16px] min-w-0">
              <div className="w-[64px] h-[64px] rounded-[8px] bg-gradient-to-br from-[#5b3df6] to-[#2dd4bf] flex items-center justify-center text-white text-[20px] font-bold flex-shrink-0 shadow-md">
                {initials(profileName)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-[8px] mb-[8px] flex-wrap">
                  <Badge color="blue">{roleText}</Badge>
                  <Badge color="green">{courses.length} active courses</Badge>
                </div>
                <h2 className="text-[24px] sm:text-[28px] font-bold text-[#0f172a] break-words">{profileName}</h2>
                <p className="text-[14px] text-[#94a3b8] mt-[4px] max-w-2xl">
                  Real-time profile details and instructor activity from your LMS workspace.
                </p>
              </div>
            </div>
            <button
              onClick={loadProfileData}
              className="bg-[#5b3df6] flex items-center gap-[8px] h-[40px] justify-center px-[16px] rounded-[6px] shrink-0 text-white text-[14px] font-medium"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh data
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-[8px] border border-red-200 bg-red-50 p-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <p className="text-[13px] text-red-700">{error}</p>
          </div>
        ) : null}

        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
          <div className="flex items-center justify-between w-full gap-4 flex-wrap">
            <div>
              <h3 className="font-bold text-[18px] text-[#0f172a]">Workspace access</h3>
              <p className="text-[13px] text-[#94a3b8] mt-[4px]">Instructor scope and current workload</p>
            </div>
            <Badge color="purple">Tenant: {me?.tenant_id || 'N/A'}</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[16px] w-full">
            <div className="bg-[#f8fafc] rounded-[8px] p-[14px] border border-black/[0.08]">
              <p className="text-[11px] text-[#94a3b8] mb-[4px]">Managed courses</p>
              <p className="text-[20px] font-bold text-[#0f172a]">{courses.length}</p>
            </div>
            <div className="bg-[#f8fafc] rounded-[8px] p-[14px] border border-black/[0.08]">
              <p className="text-[11px] text-[#94a3b8] mb-[4px]">Live classes now</p>
              <p className="text-[20px] font-bold text-[#0f172a]">{classStats.live}</p>
            </div>
            <div className="bg-[#f8fafc] rounded-[8px] p-[14px] border border-black/[0.08]">
              <p className="text-[11px] text-[#94a3b8] mb-[4px]">Upcoming classes</p>
              <p className="text-[20px] font-bold text-[#0f172a]">{dashboard?.upcoming_classes ?? classStats.upcoming}</p>
            </div>
            <div className="bg-[#f8fafc] rounded-[8px] p-[14px] border border-black/[0.08]">
              <p className="text-[11px] text-[#94a3b8] mb-[4px]">Last updated</p>
              <p className="text-[13px] font-bold text-[#0f172a]">{formatDate(me?.updated_at)}</p>
            </div>
          </div>
        </div>

        <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-1 xl:grid-cols-2">
          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
            <div className="flex items-center justify-between w-full flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-[18px] text-[#0f172a]">Personal information</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Loaded from your authenticated account record</p>
              </div>
              <Badge color="green">{loading ? 'Loading...' : 'Live data'}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] w-full">
              <InfoField label="Full name" value={profileName} />
              <InfoField label="Role" value={roleText} />
              <InfoField label="Email address" value={me?.email} />
              <InfoField label="Phone" value={me?.phone || me?.mobile || me?.phone_number} />
              <InfoField label="Tenant ID" value={me?.tenant_id} />
              <InfoField label="User ID" value={me?._id || me?.id || me?.sub} />
            </div>
            <div className="bg-[#f8fafc] rounded-[8px] p-[12px] border border-black/[0.08] w-full">
              <p className="text-[11px] text-[#94a3b8] mb-[4px]">Account timeline</p>
              <p className="text-[13px] text-[#0f172a] leading-relaxed">
                Created: {formatDate(me?.created_at)} | Last updated: {formatDate(me?.updated_at)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-[24px]">
            <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
              <div>
                <h3 className="font-bold text-[18px] text-[#0f172a]">Teaching snapshot</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Current instructor metrics from dashboard APIs</p>
              </div>
              <div className="grid grid-cols-2 gap-[12px] w-full">
                <InfoField label="Dashboard tests" value={dashboard?.tests ?? 0} />
                <InfoField label="Dashboard courses" value={dashboard?.courses ?? courses.length} />
                <InfoField label="Live sessions" value={dashboard?.live_sessions ?? classStats.live} />
                <InfoField label="Upcoming sessions" value={dashboard?.upcoming_classes ?? classStats.upcoming} />
              </div>
            </div>

            <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
              <div>
                <h3 className="font-bold text-[18px] text-[#0f172a]">Recent activity</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Latest entries from notification feed</p>
              </div>
              <div className="flex flex-col w-full">
                {recentActivity.length === 0 ? (
                  <div className="text-[13px] text-[#94a3b8] py-2">No recent notifications available.</div>
                ) : (
                  recentActivity.map((item) => (
                    <ActivityItem
                      key={item._id || item.id || `${item.title}-${item.created_at}`}
                      title={item.title || 'Notification'}
                      subtitle={`${item.message || ''} ${item.created_at ? `| ${formatDate(item.created_at)}` : ''}`.trim()}
                      badge={item.read ? 'Read' : 'Unread'}
                      badgeColor={item.read ? 'slate' : 'green'}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
          <div>
            <h3 className="font-bold text-[18px] text-[#0f172a]">Notification summary</h3>
            <p className="text-[13px] text-[#94a3b8] mt-[4px]">Real inbox totals for this instructor account</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px] w-full">
            <div className="flex items-center gap-[12px] rounded-[8px] border border-black/[0.08] bg-[#f8fafc] p-[14px]">
              <Users className="h-4 w-4 text-[#5b3df6]" />
              <div>
                <p className="text-[11px] text-[#94a3b8]">Total notifications</p>
                <p className="text-[14px] font-semibold text-[#0f172a]">{notifications.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-[12px] rounded-[8px] border border-black/[0.08] bg-[#f8fafc] p-[14px]">
              <BookOpen className="h-4 w-4 text-[#5b3df6]" />
              <div>
                <p className="text-[11px] text-[#94a3b8]">Unread</p>
                <p className="text-[14px] font-semibold text-[#0f172a]">{unreadCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-[12px] rounded-[8px] border border-black/[0.08] bg-[#f8fafc] p-[14px]">
              <FileText className="h-4 w-4 text-[#5b3df6]" />
              <div>
                <p className="text-[11px] text-[#94a3b8]">Assigned classes</p>
                <p className="text-[14px] font-semibold text-[#0f172a]">{liveClasses.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={loadProfileData}
            className="bg-[#5b3df6] flex items-center gap-[8px] h-[44px] justify-center px-[24px] rounded-[8px] text-white text-[14px] font-medium"
          >
            <Save className="h-[16px] w-[16px] text-white" />
            Sync latest data
          </button>
        </div>
      </div>
    </div>
  )
}
