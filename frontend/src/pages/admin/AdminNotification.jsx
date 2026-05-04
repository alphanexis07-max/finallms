import React, { useEffect, useMemo, useState } from 'react'
import { CheckCheck, BookOpen, Calendar, Award, CreditCard, Sparkles, ArrowUpRight, Trash2 } from 'lucide-react'
import { api } from '../../lib/api'
import useRealtime from '../../hooks/useRealtime'

function iconFor(type) {
  if (type === 'class') return Calendar
  if (type === 'course') return BookOpen
  if (type === 'achievement') return Award
  return CreditCard
}

export default function Notification() {
  const [tab, setTab] = useState('all')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
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
          type: n.type || 'course',
          unread: !n.read,
        }))
        setItems(normalized)
      })
      .catch(() => {
        setItems([])
      })
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  useRealtime(tenantId ? `tenant:${tenantId}` : '', () => load())

  const filtered = useMemo(() => {
    if (tab === 'unread') return items.filter((x) => x.unread)
    return items
  }, [tab, items])

  const unreadCount = useMemo(() => items.filter((item) => item.unread).length, [items])
  const latestNotification = useMemo(() => items[0] || null, [items])

  return (
    <div className="relative min-h-full overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(91,61,246,0.09),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(45,212,191,0.12),_transparent_24%),linear-gradient(180deg,_#f8fbff_0%,_#f5f8ff_100%)]">
      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#ede7ff]/60 blur-3xl" />
      <div className="pointer-events-none absolute right-[-70px] top-56 h-72 w-72 rounded-full bg-[#d9fbf5]/70 blur-3xl" />
      <div className="relative space-y-4 p-4 sm:p-5 lg:p-6">
        <section className="overflow-hidden rounded-[18px] border border-[#e8edf3] bg-white/85 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-6 lg:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <span className="inline-flex items-center gap-1.5 rounded-[999px] border border-[#e7e1ff] bg-[#f6f2ff] px-3 py-1 text-[11px] font-semibold text-[#5b3df6]">
                <Sparkles className="h-3.5 w-3.5" />
                Admin notifications
              </span>
              <h2 className="mt-3 max-w-[760px] text-[34px] font-black leading-[1.02] tracking-[-0.04em] text-[#0f172a] sm:text-[42px] lg:text-[48px]">
                Track tenant updates, approvals, and school operations in one place.
              </h2>
              <p className="mt-3 max-w-[860px] text-[13px] leading-6 text-[#64748b] sm:text-[14px]">
                Review operational alerts, student activity, course events, and payment updates for your institute.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:min-w-[320px]">
              <div className="rounded-[14px] border border-[#ece7ff] bg-[#faf8ff] p-4 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b7cf6]">Total</div>
                <div className="mt-2 text-[28px] font-bold text-[#0f172a]">{items.length}</div>
              </div>
              <div className="rounded-[14px] border border-[#d7f5ef] bg-[#f3fffd] p-4 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#12a38a]">Unread</div>
                <div className="mt-2 text-[28px] font-bold text-[#0f172a]">{unreadCount}</div>
              </div>
              <div className="rounded-[14px] border border-[#e8edf3] bg-white p-4 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#94a3b8]">Latest</div>
                <div className="mt-2 line-clamp-2 text-[13px] font-semibold text-[#0f172a]">
                  {latestNotification?.title || 'No recent notification'}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[18px] border border-[#e8edf3] bg-white/90 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)] backdrop-blur-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3 border-b border-[#eef2f7] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTab('all')}
                className={`rounded-[999px] px-3.5 py-2 text-[12px] font-semibold transition-colors ${tab === 'all' ? 'bg-[#5b3df6] text-white shadow-sm' : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e9edf5]'}`}
              >
                All
              </button>
              <button
                onClick={() => setTab('unread')}
                className={`rounded-[999px] px-3.5 py-2 text-[12px] font-semibold transition-colors ${tab === 'unread' ? 'bg-[#5b3df6] text-white shadow-sm' : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e9edf5]'}`}
              >
                Unread
              </button>
            </div>
            <button
              onClick={() => api('/lms/notifications/read-all', { method: 'PATCH' }).then(load).catch(() => {})}
              className="inline-flex items-center gap-1.5 self-start rounded-[10px] border border-black/[0.08] bg-white px-3.5 py-2 text-[12px] font-semibold text-[#0f172a] transition-colors hover:bg-[#f8fafc]"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          </div>

          <div className="space-y-3">
            {loading && <p className="rounded-[12px] border border-dashed border-[#dfe6f2] bg-[#fbfdff] px-4 py-6 text-[12px] text-[#94a3b8]">Loading notifications...</p>}
            {!loading && filtered.length === 0 && (
              <div className="rounded-[14px] border border-dashed border-[#dfe6f2] bg-[#fbfdff] p-6 text-[13px] text-[#64748b]">
                No notifications found.
              </div>
            )}
            {filtered.map((item) => {
              const Icon = iconFor(item.type)
              return (
                <article
                  key={item.id}
                  className={`group flex items-start justify-between rounded-[16px] border p-4 transition-all duration-200 ${
                    item.unread
                      ? 'border-[#cfc4ff] bg-gradient-to-r from-[#f7f3ff] to-[#fcfbff] shadow-[0_10px_28px_rgba(91,61,246,0.07)]'
                      : 'border-[#e8edf3] bg-white hover:border-[#d8e1ee] hover:shadow-[0_8px_22px_rgba(15,23,42,0.04)]'
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3.5">
                    <div className={`rounded-[12px] p-2.5 ring-1 ${item.unread ? 'bg-[#ede7ff] ring-[#d9d1ff]' : 'bg-[#f8fafc] ring-[#e8edf3]'}`}>
                      <Icon className={`h-4.5 w-4.5 ${item.unread ? 'text-[#5b3df6]' : 'text-[#64748b]'}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-[15px] font-semibold text-[#0f172a]">{item.title}</h3>
                      <p className="mt-1 max-w-[820px] text-[13px] leading-6 text-[#64748b]">{item.message}</p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-[#94a3b8]">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {item.unread && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#5b3df6] shadow-[0_0_0_4px_rgba(91,61,246,0.12)]" />}
                    <button
                      title="Delete notification"
                      className="p-1 rounded hover:bg-red-50"
                      onClick={async () => {
                        if (window.confirm('Delete this notification?')) {
                          await api(`/lms/notifications/${item.id}`, { method: 'DELETE' })
                          load()
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
