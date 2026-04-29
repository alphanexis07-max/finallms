import React, { useEffect, useMemo, useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Plus, Receipt, ChevronDown, ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { api } from '../../lib/api'
import useRealtime from '../../hooks/useRealtime'

function StatCard({ label, value, badge, badgeClass }) {
  return (
    <div className="rounded-[8px] border border-black/[0.08] bg-white p-[16px]">
      <p className="text-[12px] font-medium text-[#94a3b8]">{label}</p>
      <p className="mt-2 text-[34px] font-bold leading-none text-[#0f172a]">{value}</p>
      <span className={`mt-2 inline-flex rounded-[12px] px-[10px] py-1 text-[11px] font-medium ${badgeClass}`}>{badge}</span>
    </div>
  )
}

function normalizeAmount(value, fallbackPaise) {
  const paise = Number(fallbackPaise)
  if (Number.isFinite(paise) && paise > 0) return paise / 100
  const amount = Number(value)
  if (!Number.isFinite(amount)) return 0
  return amount
}

function resolveDisplayAmount(transaction) {
  const directAmount = Number(transaction?.amount)
  const paiseAmount = Number(transaction?.amount_paise)
  if (Number.isFinite(paiseAmount) && paiseAmount > 0) return paiseAmount / 100
  if (!Number.isFinite(directAmount)) return 0
  const hasDecimal = String(transaction?.amount ?? '').includes('.')
  if (hasDecimal) return directAmount
  if (directAmount >= 1000 && String(transaction?.currency || '').toUpperCase() === 'INR') {
    return directAmount / 100
  }
  return directAmount
}

function formatCurrency(value, fallbackPaise) {
  return `₹${normalizeAmount(value, fallbackPaise).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

function formatResolvedCurrency(transaction) {
  return `₹${resolveDisplayAmount(transaction).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

function formatPdfCurrency(value, fallbackPaise) {
  return `INR ${normalizeAmount(value, fallbackPaise).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

function formatPdfResolvedCurrency(transaction) {
  return `INR ${resolveDisplayAmount(transaction).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

// Transaction Detail Modal
function TransactionModal({ transaction, onClose }) {
  if (!transaction) return null
  const amount = resolveDisplayAmount(transaction)
  const statusColor =
    transaction.status === 'captured'
      ? 'bg-[#2dd4bf] text-[#023b33]'
      : transaction.status === 'failed'
      ? 'bg-red-100 text-red-700'
      : 'bg-[#ffd966] text-[#4b2e00]'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-[12px] border border-black/[0.08] bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-[#0f172a]">Transaction Details</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-5 w-5 text-[#64748b]" />
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-[8px] bg-[#f8fafc] p-4">
          <div>
            <p className="text-[11px] text-[#94a3b8]">Amount</p>
            <p className="text-[28px] font-bold text-[#0f172a]">₹{amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
          <span className={`inline-flex rounded-[12px] px-3 py-1 text-[12px] font-semibold ${statusColor}`}>
            {transaction.status || 'created'}
          </span>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Transaction ID', value: transaction.target_id || transaction._id || '-' },
            { label: 'Order ID', value: transaction.order_id || '-' },
            { label: 'User ID', value: transaction.user_id || '-' },
            { label: 'Currency', value: transaction.currency || 'INR' },
            { label: 'Payment Method', value: transaction.method || '-' },
            { label: 'Created At', value: transaction.created_at ? new Date(transaction.created_at).toLocaleString() : '-' },
            { label: 'Updated At', value: transaction.updated_at ? new Date(transaction.updated_at).toLocaleString() : '-' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between border-b border-black/[0.05] pb-2">
              <p className="text-[12px] text-[#94a3b8]">{label}</p>
              <p className="max-w-[60%] break-all text-right text-[12px] font-medium text-[#0f172a]">{value}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 h-9 w-full rounded-[7px] border border-black/[0.08] bg-white text-[12px] font-semibold text-[#334155]"
        >
          Close
        </button>
      </div>
    </div>
  )
}

// Coupon Detail Modal
function CouponModal({ coupon, onClose }) {
  if (!coupon) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-[12px] border border-black/[0.08] bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-[#0f172a]">Coupon Details</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-5 w-5 text-[#64748b]" />
          </button>
        </div>

        <div className="mb-4 rounded-[8px] border border-[#d9ccff] bg-[#f7f3ff] p-4">
          <p className="text-[20px] font-bold text-[#4a2ed8]">{coupon.code}</p>
          <p className="text-[12px] text-[#64748b]">
            {coupon.discount_type === 'flat'
              ? `Flat ₹${coupon.value} OFF`
              : `${coupon.value}% OFF`}
          </p>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Discount Type', value: coupon.discount_type || '-' },
            { label: 'Value', value: coupon.discount_type === 'flat' ? `₹${coupon.value}` : `${coupon.value}%` },
            { label: 'Total Uses', value: `${coupon.uses || 0}` },
            { label: 'Max Uses', value: `${coupon.max_uses || 0}` },
            { label: 'Remaining', value: `${(coupon.max_uses || 0) - (coupon.uses || 0)}` },
            { label: 'Status', value: 'Active' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between border-b border-black/[0.05] pb-2">
              <p className="text-[12px] text-[#94a3b8]">{label}</p>
              <p className="text-[12px] font-medium text-[#0f172a]">{value}</p>
            </div>
          ))}
        </div>

        {/* Usage bar */}
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[11px] text-[#94a3b8]">
            <span>Usage</span>
            <span>{coupon.uses || 0}/{coupon.max_uses || 0}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#f1f5f9]">
            <div
              className="h-2 rounded-full bg-[#5b3df6]"
              style={{ width: `${coupon.max_uses ? Math.min(100, ((coupon.uses || 0) / coupon.max_uses) * 100) : 0}%` }}
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 h-9 w-full rounded-[7px] border border-black/[0.08] bg-white text-[12px] font-semibold text-[#334155]"
        >
          Close
        </button>
      </div>
    </div>
  )
}

const TRANSACTIONS_PER_PAGE = 5

export default function AdminPaymentsCupons() {
  const [activeView, setActiveView] = useState('list')
  const [transactions, setTransactions] = useState([])
  const [coupons, setCoupons] = useState([])
  const [couponForm, setCouponForm] = useState({ code: '', discount_type: 'percent', value: 10, max_uses: 100 })
  const tenantId = localStorage.getItem('lms_tenant_id')

  // Filter & pagination state
  const [txFilter, setTxFilter] = useState('all') // 'all' | 'captured' | 'failed' | 'month'
  const [txPage, setTxPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [selectedCoupon, setSelectedCoupon] = useState(null)

  const loadData = async () => {
    const [payments, couponRows] = await Promise.all([
      api('/lms/payments').catch(() => ({ items: [] })),
      api('/lms/coupons').catch(() => ({ items: [] })),
    ])
    setTransactions(payments.items || payments || [])
    setCoupons(couponRows.items || couponRows || [])
  }

  useEffect(() => { loadData() }, [])
  useRealtime(tenantId ? `tenant:${tenantId}` : '', () => loadData())

  // Reset page when filter changes
  useEffect(() => { setTxPage(1) }, [txFilter])

  const totalCollected = useMemo(
    () =>
      transactions
        .filter((t) => t.status === 'captured')
        .reduce((sum, t) => sum + normalizeAmount(t.amount, t.amount_paise), 0),
    [transactions],
  )
  const failedPayments = transactions.filter((t) => t.status === 'failed').length
  const pendingPayments = transactions.filter((t) => t.status !== 'captured').length
  const totalCouponUses = coupons.reduce((sum, c) => sum + Number(c.uses || 0), 0)
  const avgOrderValue = transactions.length
    ? Math.round(
        transactions.reduce((sum, t) => sum + normalizeAmount(t.amount, t.amount_paise), 0) / transactions.length,
      )
    : 0

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    switch (txFilter) {
      case 'captured':
        return transactions.filter((t) => t.status === 'captured')
      case 'failed':
        return transactions.filter((t) => t.status === 'failed')
      case 'month':
        return transactions.filter((t) => {
          const d = new Date(t.created_at || t.updated_at || 0)
          return d >= startOfMonth
        })
      default:
        return transactions
    }
  }, [transactions, txFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / TRANSACTIONS_PER_PAGE))
  const paginatedTransactions = filteredTransactions.slice(
    (txPage - 1) * TRANSACTIONS_PER_PAGE,
    txPage * TRANSACTIONS_PER_PAGE,
  )

  // Export coupons as CSV
  const exportCoupons = () => {
    const header = ['Code', 'Discount Type', 'Value', 'Uses', 'Max Uses']
    const rows = coupons.map((c) => [
      c.code || '',
      c.discount_type || '',
      c.value ?? '',
      c.uses || 0,
      c.max_uses || 0,
    ])
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `coupons-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadRevenueReport = () => {
    const doc = new jsPDF()
    const now = new Date()
    doc.setFontSize(18)
    doc.text('Revenue Report', 14, 18)
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generated on ${now.toLocaleString()}`, 14, 25)
    doc.setTextColor(15)
    doc.setFontSize(12)
    doc.text('Summary', 14, 38)
    autoTable(doc, {
      startY: 42,
      head: [['Metric', 'Value']],
      body: [
        ['Total collected', formatPdfCurrency(totalCollected)],
        ['Pending payments', String(pendingPayments)],
        ['Failed payments', String(failedPayments)],
        ['Coupon redemptions', String(totalCouponUses)],
        ['Average order value', formatPdfCurrency(avgOrderValue)],
      ],
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [91, 61, 246] },
    })
    const summaryEndY = doc.lastAutoTable?.finalY || 42
    doc.text('Transactions', 14, summaryEndY + 12)
    autoTable(doc, {
      startY: summaryEndY + 16,
      head: [['Transaction', 'Amount', 'Status', 'User']],
      body: transactions.map((t) => [
        t.target_id || t.order_id || 'Payment',
        formatPdfResolvedCurrency(t),
        t.status || 'created',
        t.user_id || '-',
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [15, 23, 42] },
    })
    const transactionEndY = doc.lastAutoTable?.finalY || summaryEndY + 16
    doc.text('Coupons', 14, transactionEndY + 12)
    autoTable(doc, {
      startY: transactionEndY + 16,
      head: [['Code', 'Type', 'Value', 'Usage']],
      body: coupons.map((c) => [
        c.code || '-',
        c.discount_type || '-',
        c.discount_type === 'flat' ? formatPdfCurrency(c.value) : `${c.value ?? '-'}%`,
        `${c.uses || 0}/${c.max_uses || 0}`,
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [34, 197, 94] },
    })
    doc.save(`revenue-report-${now.toISOString().slice(0, 10)}.pdf`)
  }

  if (activeView === 'create') {
    return (
      <div className="min-h-full bg-[#f6f8fa] p-4 sm:p-5">
        <div className="mx-auto max-w-[1180px] rounded-[10px] border border-black/[0.08] bg-white p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => setActiveView('list')}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-[#5b3df6]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Payments & Coupons
            </button>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                onClick={() => setActiveView('list')}
                className="h-9 rounded-[7px] border border-black/[0.08] bg-white px-3 text-[12px] font-semibold text-[#334155]"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  api('/lms/coupons', { method: 'POST', body: JSON.stringify(couponForm) })
                    .then(() => { setActiveView('list'); loadData() })
                    .catch(() => {})
                }
                className="h-9 rounded-[7px] bg-[#5b3df6] px-3 text-[12px] font-semibold text-white"
              >
                Create Coupon
              </button>
            </div>
          </div>

          <p className="text-[12px] text-[#94a3b8]">Payments & Coupons / Create Coupon</p>
          <h2 className="mt-1 text-[26px] font-bold text-[#0f172a] sm:text-[32px]">Create Coupon</h2>

          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.5fr_1fr]">
            <section className="rounded-[8px] border border-black/[0.08] bg-white p-4">
              <h3 className="text-[18px] font-bold text-[#111827]">Coupon Details</h3>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Coupon code</label>
                  <input value={couponForm.code} onChange={(e) => setCouponForm((f) => ({ ...f, code: e.target.value }))} className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" placeholder="e.g. NEWBATCH25" />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Discount type</label>
                  <div className="relative">
                    <select value={couponForm.discount_type} onChange={(e) => setCouponForm((f) => ({ ...f, discount_type: e.target.value === 'Flat amount' ? 'flat' : 'percent' }))} className="h-10 w-full appearance-none rounded-[7px] border border-black/[0.08] px-3 text-[13px]">
                      <option>Percentage</option>
                      <option>Flat amount</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Value</label>
                  <input value={couponForm.value} onChange={(e) => setCouponForm((f) => ({ ...f, value: Number(e.target.value || 0) }))} className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" placeholder="25" />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Usage limit</label>
                  <input value={couponForm.max_uses} onChange={(e) => setCouponForm((f) => ({ ...f, max_uses: Number(e.target.value || 0) }))} className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" placeholder="300" />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Valid from</label>
                  <input type="date" className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-[#334155]">Valid till</label>
                  <input type="date" className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" />
                </div>
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-[12px] font-medium text-[#334155]">Applicable courses</label>
                <input className="h-10 w-full rounded-[7px] border border-black/[0.08] px-3 text-[13px]" placeholder="Coding + STEM courses" />
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-[12px] font-medium text-[#334155]">Description</label>
                <textarea className="h-24 w-full resize-none rounded-[7px] border border-black/[0.08] px-3 py-2 text-[13px]" placeholder="Campaign objective and notes..." />
              </div>
            </section>

            <aside className="space-y-3">
              <section className="rounded-[8px] border border-black/[0.08] bg-white p-4">
                <h3 className="text-[16px] font-bold text-[#111827]">Preview</h3>
                <div className="mt-2 rounded-[8px] border border-[#d9ccff] bg-[#f7f3ff] p-3">
                  <p className="text-[13px] font-semibold text-[#4a2ed8]">{couponForm.code || 'NEWBATCH25'}</p>
                  <p className="text-[12px] text-[#64748b]">
                    {couponForm.discount_type === 'flat'
                      ? `Flat ₹${couponForm.value} OFF on selected courses`
                      : `${couponForm.value}% OFF on selected courses`}
                  </p>
                </div>
              </section>
              <section className="rounded-[8px] border border-black/[0.08] bg-white p-4">
                <h3 className="text-[16px] font-bold text-[#111827]">Impact Estimate</h3>
                <p className="mt-2 rounded-[8px] border border-[#e6e9f3] bg-[#f6f8ff] p-3 text-[11px] text-[#7a84a1]">
                  If 120 enrollments use this coupon, projected discount cost is 3.5L with expected conversion lift of 9-12%.
                </p>
              </section>
            </aside>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-[#f6f8fa]">
      {/* Modals */}
      {selectedTransaction && (
        <TransactionModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
      )}
      {selectedCoupon && (
        <CouponModal coupon={selectedCoupon} onClose={() => setSelectedCoupon(null)} />
      )}

      <div className="space-y-4 p-4 sm:p-5">
        <section className="rounded-[8px] border border-black/[0.08] bg-[#eaf2fb] p-6">
          <span className="inline-flex rounded-[12px] bg-[#ffd966] px-[10px] py-[5px] text-[11px] font-medium text-[#4b2e00]">Payment operations and coupon creation</span>
          <h2 className="pt-2 text-[24px] font-bold leading-tight text-[#0f172a] sm:text-[28px]">
            Track revenue, review transactions, and create high-performing coupons from one admin workspace.
          </h2>
          <p className="pt-2 text-[14px] text-[#94a3b8]">Monitor collections, failed payments, and redemptions while keeping a ready-to-publish coupon form visible for quick campaign launches.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveView('create')}
              className="inline-flex h-9 items-center gap-1 rounded-[7px] bg-[#5b3df6] px-3 text-[12px] font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Create Coupon
            </button>
            <button
              onClick={downloadRevenueReport}
              className="h-9 rounded-[7px] border border-black/[0.08] bg-white px-3 text-[12px] font-semibold text-[#111827]"
            >
              Revenue Report
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total collected" value={`₹${totalCollected.toLocaleString('en-IN')}`} badge="Synced from payments" badgeClass="bg-[#2dd4bf] text-[#023b33]" />
          <StatCard label="Pending payments" value={String(pendingPayments)} badge="Awaiting capture/verification" badgeClass="bg-[#f0f4f8] text-[#64748b]" />
          <StatCard label="Coupon redemptions" value={String(totalCouponUses)} badge={`${coupons.length} coupon records`} badgeClass="bg-[#ffd966] text-[#4b2e00]" />
          <StatCard label="Failed payments" value={String(failedPayments)} badge="Needs follow-up" badgeClass="bg-[#ffd966] text-[#4b2e00]" />
        </div>

        {/* Main content - removed right sidebar (coupon quick view gone) */}
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.65fr_1fr]">
          <div className="space-y-3">
            {/* Transactions */}
            <section className="rounded-[8px] border border-black/[0.08] bg-white p-4">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-[22px] font-bold text-[#111827]">Transactions</h3>
                  <p className="text-[12px] text-[#94a3b8]">Recent payments across courses, batches, and renewals. Click on any transaction to view details.</p>
                </div>
                <div className="flex flex-wrap gap-1 text-[11px]">
                  {[
                    { key: 'all', label: 'All payments' },
                    { key: 'captured', label: 'Succeeded' },
                    { key: 'failed', label: 'Failed' },
                    { key: 'month', label: 'This month' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setTxFilter(key)}
                      className={`rounded-[7px] border px-2 py-1 transition-colors ${
                        txFilter === key
                          ? 'border-[#5b3df6] bg-[#5b3df6] text-white'
                          : 'border-black/[0.08] bg-white text-[#334155] hover:bg-[#f1f5f9]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction list */}
              <div className="space-y-2">
                {paginatedTransactions.length === 0 ? (
                  <div className="rounded-[8px] border border-black/[0.06] p-6 text-center text-[13px] text-[#94a3b8]">
                    No transactions found for this filter.
                  </div>
                ) : (
                  paginatedTransactions.map((t, i) => (
                    <div
                      key={t._id || i}
                      onClick={() => setSelectedTransaction(t)}
                      className="flex cursor-pointer flex-col gap-3 rounded-[8px] border border-black/[0.06] p-3 transition-colors hover:border-[#5b3df6]/30 hover:bg-[#f7f3ff] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-start gap-2">
                        <Receipt className="mt-0.5 h-4 w-4 shrink-0 text-[#5b3df6]" />
                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-semibold text-[#111827]">{t.target_id || 'Payment transaction'}</p>
                          <p className="text-[11px] text-[#64748b]">{formatResolvedCurrency(t)}</p>
                          <p className="truncate text-[10px] text-[#9aa9c0]">{t.order_id || 'order'} • {t.status || 'created'}</p>
                        </div>
                      </div>
                      <div className="ml-2 text-right">
                        <span className={`inline-flex rounded-[12px] px-2 py-1 text-[10px] font-medium ${t.status === 'captured' ? 'bg-[#2dd4bf] text-[#023b33]' : t.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-[#ffd966] text-[#4b2e00]'}`}>
                          {t.status || 'created'}
                        </span>
                        <p className="mt-1 text-[10px] text-[#9aa9c0]">{t.user_id || '-'}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {filteredTransactions.length > TRANSACTIONS_PER_PAGE && (
                <div className="mt-3 flex items-center justify-between border-t border-black/[0.06] pt-3">
                  <p className="text-[11px] text-[#94a3b8]">
                    Showing {(txPage - 1) * TRANSACTIONS_PER_PAGE + 1}–{Math.min(txPage * TRANSACTIONS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                      disabled={txPage === 1}
                      className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-black/[0.08] bg-white disabled:opacity-40 hover:bg-[#f1f5f9]"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setTxPage(page)}
                        className={`flex h-7 w-7 items-center justify-center rounded-[6px] border text-[11px] font-medium transition-colors ${
                          page === txPage
                            ? 'border-[#5b3df6] bg-[#5b3df6] text-white'
                            : 'border-black/[0.08] bg-white text-[#334155] hover:bg-[#f1f5f9]'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setTxPage((p) => Math.min(totalPages, p + 1))}
                      disabled={txPage === totalPages}
                      className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-black/[0.08] bg-white disabled:opacity-40 hover:bg-[#f1f5f9]"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Active Coupons */}
            <section className="rounded-[8px] border border-black/[0.08] bg-white p-4">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-[22px] font-bold text-[#111827]">Active coupons</h3>
                  <p className="text-[12px] text-[#94a3b8]">Performance, limits, and quick actions for live campaigns.</p>
                </div>
                <button
                  onClick={exportCoupons}
                  className="rounded-[7px] border border-black/[0.08] bg-[#f1f5f9] px-3 py-1 text-[11px] font-medium text-[#111827] hover:bg-[#e2e8f0] transition-colors"
                >
                  Export list
                </button>
              </div>
              <div className="space-y-2">
                {coupons.length === 0 ? (
                  <div className="rounded-[8px] border border-black/[0.06] p-6 text-center text-[13px] text-[#94a3b8]">
                    No coupons created yet.
                  </div>
                ) : (
                  coupons.map((c, i) => (
                    <div key={c._id || i} className="flex flex-col gap-3 rounded-[8px] border border-black/[0.06] p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-[#111827]">{c.code}</p>
                        <p className="truncate text-[10px] text-[#9aa9c0]">
                          {c.discount_type} • {c.discount_type === 'flat' ? `₹${c.value}` : `${c.value}%`} • used {c.uses || 0}/{c.max_uses || 0}
                        </p>
                        {/* Usage progress bar */}
                        <div className="mt-1.5 h-1.5 w-full max-w-[160px] rounded-full bg-[#f1f5f9]">
                          <div
                            className="h-1.5 rounded-full bg-[#5b3df6]"
                            style={{ width: `${c.max_uses ? Math.min(100, ((c.uses || 0) / c.max_uses) * 100) : 0}%` }}
                          />
                        </div>
                      </div>
                      <div className="ml-0 flex flex-wrap items-center gap-2 sm:ml-2">
                        <span className="inline-flex rounded-[12px] px-2 py-1 text-[10px] font-medium bg-[#2dd4bf] text-[#023b33]">Active</span>
                        <button
                          onClick={() => setSelectedCoupon(c)}
                          className="rounded-[6px] border border-black/[0.08] bg-white px-2 py-1 text-[10px] font-semibold text-[#111827] hover:bg-[#f1f5f9] transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right sidebar - Revenue insights only (Coupon quick view removed) */}
          <div className="space-y-3">
            <section className="rounded-[8px] border border-black/[0.08] bg-white p-4">
              <h3 className="text-[22px] font-bold text-[#111827]">Revenue insights</h3>
              <p className="text-[12px] text-[#94a3b8]">Computed from real payment records.</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-[8px] bg-[#f1f5f9] p-2">
                  <p className="text-[10px] text-[#94a3b8]">Avg order value</p>
                  <p className="text-[18px] font-bold text-[#111827]">₹{avgOrderValue.toLocaleString('en-IN')}</p>
                </div>
                <div className="rounded-[8px] bg-[#f1f5f9] p-2">
                  <p className="text-[10px] text-[#94a3b8]">Captured payments</p>
                  <p className="text-[18px] font-bold text-[#111827]">{transactions.filter((t) => t.status === 'captured').length}</p>
                </div>
                <div className="rounded-[8px] bg-[#f1f5f9] p-2">
                  <p className="text-[10px] text-[#94a3b8]">Collection success</p>
                  <p className="text-[18px] font-bold text-[#111827]">
                    {transactions.length ? `${Math.round((transactions.filter((t) => t.status === 'captured').length / transactions.length) * 100)}%` : '0%'}
                  </p>
                </div>
                <div className="rounded-[8px] bg-[#f1f5f9] p-2">
                  <p className="text-[10px] text-[#94a3b8]">Active coupons</p>
                  <p className="text-[18px] font-bold text-[#111827]">{coupons.length}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
