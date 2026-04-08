import React, { useEffect, useMemo, useState } from 'react'
import { Search, Bell, CheckCheck, Filter, BookOpen, Calendar, Award, CreditCard } from 'lucide-react'
import { api } from '../../lib/api'
import useRealtime from '../../hooks/useRealtime'

const AVATAR = 'https://www.figma.com/api/mcp/asset/5b24609b-97ad-4bea-af20-b4f4df404b75'

function iconFor(type) {
  if (type === 'class') return Calendar
  if (type === 'course') return BookOpen
  if (type === 'achievement') return Award
  return CreditCard
}

export default function Notification() {
  const [tab, setTab] = useState('all')
  const [items, setItems] = useState([])
  const tenantId = localStorage.getItem('lms_tenant_id')

  const load = () =>
    api('/lms/notifications')
      .then((res) => {
        const data = res.items || res || []
        const normalized = data.map((n) => ({
          id: n._id,
          title: n.title,
          message: n.message,
          time: new Date(n.created_at || Date.now()).toLocaleString(),
          type: 'course',
          unread: !n.read,
        }))
        setItems(normalized)
      })
      .catch(() => {})

  useEffect(() => {
    load()
  }, [])

  useRealtime(tenantId ? `tenant:${tenantId}` : '', () => load())

  const filtered = useMemo(() => {
    if (tab === 'unread') return items.filter((x) => x.unread)
    return items
  }, [tab])

  return (
    <div className="min-h-full bg-[#f8fbff]">
      <div className="space-y-4 p-4">
        <section className="rounded-[12px] border border-[#e8edf3] bg-[#f3f9ff] p-5">
          <span className="rounded-[999px] bg-[#ede7ff] px-3 py-1 text-[11px] font-semibold text-[#5b3df6]">
            Real-time updates
          </span>
          <h2 className="mt-3 text-[44px] font-bold leading-[1.03] text-[#0f172a]">
            Stay in sync with classes, assignments, and achievements.
          </h2>
          <p className="mt-2 max-w-[860px] text-[13px] text-[#64748b]">
            Get reminders for live sessions, submission feedback, certificate unlocks, and payment updates in one place.
          </p>
        </section>

        <section className="rounded-[12px] border border-[#e8edf3] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setTab('all')}
                className={`rounded-[999px] px-3 py-1.5 text-[12px] font-semibold ${tab === 'all' ? 'bg-[#ede7ff] text-[#5b3df6]' : 'bg-[#f1f5f9] text-[#64748b]'}`}
              >
                All
              </button>
              <button
                onClick={() => setTab('unread')}
                className={`rounded-[999px] px-3 py-1.5 text-[12px] font-semibold ${tab === 'unread' ? 'bg-[#ede7ff] text-[#5b3df6]' : 'bg-[#f1f5f9] text-[#64748b]'}`}
              >
                Unread
              </button>
            </div>
            <button
              onClick={() => api('/lms/notifications/read-all', { method: 'PATCH' }).then(load).catch(() => {})}
              className="inline-flex items-center gap-1 rounded-[8px] border border-black/[0.08] px-3 py-1.5 text-[12px] font-semibold"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          </div>

          <div className="space-y-2">
            {filtered.map((item) => {
              const Icon = iconFor(item.type)
              return (
                <article
                  key={item.id}
                  className={`flex items-start justify-between rounded-[10px] border p-3 ${
                    item.unread ? 'border-[#d9d1ff] bg-[#faf7ff]' : 'border-[#e8edf3] bg-[#fbfdff]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-[8px] p-2 ${item.unread ? 'bg-[#ede7ff]' : 'bg-[#f1f5f9]'}`}>
                      <Icon className={`h-4 w-4 ${item.unread ? 'text-[#5b3df6]' : 'text-[#64748b]'}`} />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold text-[#0f172a]">{item.title}</h3>
                      <p className="mt-1 text-[12px] text-[#64748b]">{item.message}</p>
                      <p className="mt-1 text-[11px] text-[#94a3b8]">{item.time}</p>
                    </div>
                  </div>
                  {item.unread && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#5b3df6]" />}
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
