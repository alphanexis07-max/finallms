import React, { useEffect, useMemo, useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { api } from '../../lib/api'

export default function AdminSubscription() {
  const [plans, setPlans] = useState([])
  const [commission, setCommission] = useState(null)
  const [form, setForm] = useState({ name: '', duration_days: 30, price: 0, description: '' })
  const role = localStorage.getItem('lms_role')

  const canCreatePlan = role === 'super_admin'
  const canReadPlatformSettings = role === 'super_admin'

  const load = async () => {
    const [p, s] = await Promise.all([
      api('/lms/plans').catch(() => ({ items: [] })),
      canReadPlatformSettings
        ? api('/lms/platform/settings').catch(() => null)
        : Promise.resolve(null),
    ])
    setPlans(p.items || [])
    setCommission(s?.commission_percent ?? null)
  }

  useEffect(() => {
    load()
  }, [])

  const createPlan = async () => {
    if (!canCreatePlan || !form.name.trim()) return
    await api('/lms/plans', {
      method: 'POST',
      body: JSON.stringify({
        name: form.name.trim(),
        duration_days: Number(form.duration_days) || 30,
        price: Number(form.price) || 0,
        description: form.description.trim(),
      }),
    }).catch(() => {})
    setForm({ name: '', duration_days: 30, price: 0, description: '' })
    load()
  }

  const avgPrice = useMemo(() => {
    if (!plans.length) return 0
    return Math.round(plans.reduce((sum, p) => sum + Number(p.price || 0), 0) / plans.length)
  }, [plans])

  return (
    <div className="min-h-full bg-[#F7FAFD] p-4 sm:p-6">
      <section className="rounded-[8px] border border-black/[0.08] bg-white p-5">
        <h1 className="text-[24px] font-bold text-[#0f172a]">Subscriptions</h1>
        <p className="text-[13px] text-[#94a3b8]">Subscription data is loaded from backend plans/settings APIs.</p>
      </section>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Metric label="Total Plans" value={plans.length} />
        <Metric label="Average Price" value={`₹${avgPrice.toLocaleString('en-IN')}`} />
        <Metric label="Platform Commission" value={commission == null ? '-' : `${commission}%`} />
      </div>

      <section className="mt-4 rounded-[8px] border border-black/[0.08] bg-white p-4">
        <div className="mb-3 text-[14px] font-semibold text-[#0f172a]">Plan List ({plans.length})</div>
        <div className="space-y-2">
          {plans.map((p) => (
            <div key={p._id} className="rounded-[6px] border border-black/[0.08] p-3">
              <div className="text-[14px] font-semibold text-[#0f172a]">{p.name}</div>
              <div className="mt-1 text-[12px] text-[#64748b]">
                {p.duration_days} days • ₹{Number(p.price || 0).toLocaleString('en-IN')}
              </div>
              {p.description ? <div className="mt-1 text-[11px] text-[#94a3b8]">{p.description}</div> : null}
            </div>
          ))}
          {plans.length === 0 && <p className="text-[12px] text-[#94a3b8]">No plans found.</p>}
        </div>
      </section>

      <section className="mt-4 rounded-[8px] border border-black/[0.08] bg-white p-4">
        <div className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-[#0f172a]">
          <PlusCircle className="h-4 w-4 text-[#5b3df6]" />
          Create Plan
        </div>
        {!canCreatePlan && (
          <p className="mb-2 text-[12px] text-[#b45309]">
            Your role has read-only access for plans.
          </p>
        )}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input className="h-10 rounded-[6px] border border-black/[0.08] px-3 text-[13px]" placeholder="Plan name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          <input type="number" min="1" className="h-10 rounded-[6px] border border-black/[0.08] px-3 text-[13px]" placeholder="Duration (days)" value={form.duration_days} onChange={(e) => setForm((f) => ({ ...f, duration_days: Number(e.target.value || 30) }))} />
          <input type="number" min="0" className="h-10 rounded-[6px] border border-black/[0.08] px-3 text-[13px]" placeholder="Price" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value || 0) }))} />
          <input className="h-10 rounded-[6px] border border-black/[0.08] px-3 text-[13px]" placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>
        <button disabled={!canCreatePlan} onClick={createPlan} className="mt-3 h-9 rounded-[6px] bg-[#5b3df6] px-4 text-[12px] font-semibold text-white disabled:opacity-50">
          Save Plan
        </button>
      </section>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-[8px] border border-black/[0.08] bg-white p-4">
      <div className="text-[12px] text-[#94a3b8]">{label}</div>
      <div className="mt-1 text-[28px] font-bold text-[#0f172a]">{value}</div>
    </div>
  )
}
