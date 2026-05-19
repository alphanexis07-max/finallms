import React, { useEffect, useMemo, useState } from 'react'
import { api, getToken } from '../../lib/api'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Download, Eye, Printer, X } from 'lucide-react'

function formatDateTime(value) {
  if (!value) return '-'
  try {
    const d = new Date(value)
    return d.toLocaleString()
  } catch {
    return String(value)
  }
}

function formatMoney(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`
}

function getInvoiceKindLabel(inv) {
  const kind = String(inv?.enrollment_type || inv?.billingType || 'payment').toLowerCase()
  if (kind.includes('live')) return 'Live Class Enrollment'
  if (kind.includes('subscription')) return 'Subscription Payment'
  if (kind.includes('course')) return 'Course Payment'
  return 'Payment Receipt'
}

function getInvoiceItemLabel(inv) {
  return String(inv?.itemName || inv?.target_name || inv?.target_id || '-').trim() || '-'
}

function getInvoiceNumber(inv) {
  const raw = String(inv?.order_id || inv?._id || '').trim()
  if (!raw) return 'INV-0000'
  return `INV-${raw.slice(-8).toUpperCase()}`
}

function buildInvoiceHtml(inv, customer) {
  const invoiceNo = getInvoiceNumber(inv)
  const issuedAt = formatDateTime(inv.created_at || inv.createdAt || inv.created)
  const paymentStatus = String(inv.status || 'created').toUpperCase()
  const amount = Number(inv.amount || 0)
  const kind = getInvoiceKindLabel(inv)
  const itemLabel = getInvoiceItemLabel(inv)
  const customerName = String(customer?.full_name || customer?.name || customer?.email || 'Student').trim()
  const customerEmail = String(customer?.email || '-').trim()
  const customerId = String(customer?._id || customer?.sub || '-').trim()

  return `
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${invoiceNo}</title>
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; background: #f3f6fb; color: #0f172a; font-family: Inter, Arial, Helvetica, sans-serif; }
        .page { max-width: 980px; margin: 0 auto; padding: 28px; }
        .sheet { background: #fff; border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 24px; overflow: hidden; box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08); }
        .topbar { display: flex; justify-content: space-between; gap: 24px; padding: 28px 30px; background: linear-gradient(135deg, #5b3df6 0%, #2a1d74 100%); color: #fff; }
        .brand { display: flex; align-items: center; gap: 14px; }
        .brand-mark { width: 52px; height: 52px; border-radius: 16px; background: rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; font-size: 26px; font-weight: 800; }
        .brand-title { font-size: 24px; font-weight: 800; line-height: 1; }
        .brand-sub { margin-top: 4px; font-size: 12px; opacity: 0.8; }
        .invoice-badge { text-align: right; }
        .invoice-badge .label { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.8; }
        .invoice-badge .number { margin-top: 6px; font-size: 26px; font-weight: 800; }
        .invoice-badge .meta { margin-top: 8px; font-size: 13px; opacity: 0.9; }
        .content { padding: 30px; }
        .grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 18px; }
        .card { border: 1px solid rgba(15, 23, 42, 0.08); border-radius: 18px; padding: 18px; background: #fff; }
        .section-title { font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; }
        .row { display:flex; justify-content:space-between; gap: 12px; padding: 10px 0; font-size: 14px; }
        .row + .row { border-top: 1px dashed rgba(15, 23, 42, 0.10); }
        .muted { color: #64748b; }
        .status { display:inline-block; padding: 7px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; background: ${paymentStatus === 'CAPTURED' ? '#dcfce7' : paymentStatus === 'FAILED' ? '#fee2e2' : '#fef3c7'}; color: ${paymentStatus === 'CAPTURED' ? '#166534' : paymentStatus === 'FAILED' ? '#991b1b' : '#92400e'}; }
        table { width: 100%; border-collapse: collapse; margin-top: 18px; }
        th, td { padding: 14px 12px; text-align: left; border-bottom: 1px solid rgba(15, 23, 42, 0.08); vertical-align: top; }
        th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; }
        .totals { margin-top: 16px; display: grid; justify-content: end; }
        .totals-box { min-width: 320px; border-radius: 18px; border: 1px solid rgba(91, 61, 246, 0.16); background: linear-gradient(180deg, #faf8ff, #ffffff); padding: 18px; }
        .totals-line { display:flex; justify-content:space-between; gap: 20px; padding: 8px 0; font-size: 14px; }
        .totals-line.total { margin-top: 4px; padding-top: 12px; border-top: 1px solid rgba(15, 23, 42, 0.08); font-size: 18px; font-weight: 800; }
        .footer { padding: 0 30px 28px; display:flex; justify-content:space-between; gap: 16px; font-size: 12px; color:#64748b; }
        .footer strong { color:#0f172a; }
        @media print {
          body { background: #fff; }
          .page { padding: 0; }
          .sheet { border: none; border-radius: 0; box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="sheet">
          <div class="topbar">
            <div class="brand">
              <div class="brand-mark">L</div>
              <div>
                <div class="brand-title">LMS Learning Hub</div>
                <div class="brand-sub">Official payment invoice</div>
              </div>
            </div>
            <div class="invoice-badge">
              <div class="label">Invoice</div>
              <div class="number">${invoiceNo}</div>
              <div class="meta">Issued ${issuedAt}</div>
            </div>
          </div>

          <div class="content">
            <div class="grid">
              <div class="card">
                <div class="section-title">Bill To</div>
                <div style="margin-top: 12px; font-size: 18px; font-weight: 800;">${customerName}</div>
                <div class="muted" style="margin-top: 6px;">${customerEmail}</div>
                <div class="muted" style="margin-top: 4px;">Student ID: ${customerId}</div>
              </div>
              <div class="card">
                <div class="section-title">Payment Summary</div>
                <div class="row"><span class="muted">Status</span><span class="status">${paymentStatus}</span></div>
                <div class="row"><span class="muted">Payment ID</span><span>${inv.payment_id || '-'}</span></div>
                <div class="row"><span class="muted">Order ID</span><span>${inv.order_id || '-'}</span></div>
              </div>
            </div>

            <div class="card" style="margin-top: 18px;">
              <div class="section-title">Invoice Details</div>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Reference</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div style="font-weight: 800; font-size: 15px;">${kind}</div>
                      <div class="muted" style="margin-top: 6px;">${itemLabel}</div>
                    </td>
                    <td>${inv.target_id || '-'}</td>
                    <td style="font-weight: 800;">${formatMoney(amount)}</td>
                  </tr>
                </tbody>
              </table>

              <div class="totals">
                <div class="totals-box">
                  <div class="totals-line"><span class="muted">Subtotal</span><span>${formatMoney(amount)}</span></div>
                  <div class="totals-line"><span class="muted">Tax</span><span>${formatMoney(0)}</span></div>
                  <div class="totals-line total"><span>Total</span><span>${formatMoney(amount)}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div class="footer">
            <div><strong>Note:</strong> This invoice is generated from your LMS payment record and can be used for payment proof.</div>
            <div>Thank you for your payment.</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

export default function StudentInvoices() {
  const [invoices, setInvoices] = useState([])
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('')
  const navigate = useNavigate()

  const selectedInvoice = useMemo(
    () => invoices.find((item) => String(item?._id) === String(selectedInvoiceId)) || null,
    [invoices, selectedInvoiceId],
  )

  useEffect(() => {
    let mounted = true
    setLoading(true)

    // Require auth token before calling protected endpoint
    const token = getToken()
    if (!token) {
      setError('You must be logged in to view invoices')
      setLoading(false)
      // redirect to login after a short delay
      setTimeout(() => navigate('/login'), 600)
      return () => {
        mounted = false
      }
    }

    Promise.all([
      api('/auth/me').catch(() => null),
      api('/lms/payments/mine?limit=500').catch((err) => ({ error: err })),
    ])
      .then(([meRes, paymentsRes]) => {
        if (!mounted) return
        if (meRes) setCustomer(meRes)
        if (paymentsRes?.error) throw paymentsRes.error
        setInvoices(paymentsRes?.items || [])
      })
      .catch((err) => {
        if (!mounted) return
        setError(err?.message || 'Failed to load invoices')
        setInvoices([])
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  const openInvoice = (inv) => {
    const win = window.open('', '_blank')
    if (!win) return
    const html = buildInvoiceHtml(inv, customer)
    win.document.open()
    win.document.write(html)
    win.document.close()
  }

  const downloadInvoice = (inv) => {
    const html = buildInvoiceHtml(inv, customer)

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const fname = `invoice-${String(inv.order_id || inv._id).replace(/[^a-z0-9_-]/gi, '_')}.html`
    a.download = fname
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const printInvoice = (inv) => {
    const win = window.open('', '_blank')
    if (!win) return
    const html = `${buildInvoiceHtml(inv, customer)}<script>setTimeout(() => window.print(), 250)</script>`
    win.document.open()
    win.document.write(html)
    win.document.close()
  }

  return (
    <div className="min-h-full bg-[#F7FAFD] p-4 sm:p-6 lg:p-7">
      <section className="rounded-[8px] border border-black/[0.08] bg-white p-5 sm:p-6">
        <h2 className="text-[20px] font-bold">My Invoices</h2>
        <p className="mt-2 text-[13px] text-[#64748b]">All your payment invoices are listed here.</p>
      </section>

      <section className="mt-6 rounded-[8px] border border-black/[0.08] bg-white p-5 sm:p-6">
        {error ? <p className="text-red-600">{error}</p> : null}
        {loading ? (
          <p>Loading...</p>
        ) : invoices.length === 0 ? (
          <p>No invoices found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#64748b]">
                  <th className="px-2 py-2">Date</th>
                  <th className="px-2 py-2">Amount (INR)</th>
                  <th className="px-2 py-2">Type</th>
                  <th className="px-2 py-2">Item</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Order</th>
                  <th className="px-2 py-2">Payment</th>
                  <th className="px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv._id} className="border-t">
                    <td className="px-2 py-3">{formatDateTime(inv.created_at || inv.createdAt)}</td>
                    <td className="px-2 py-3 font-semibold">₹{Number(inv.amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-2 py-3">{inv.enrollment_type || inv.billingType || '-'}</td>
                    <td className="px-2 py-3">{inv.target_id || inv.itemName || '-'}</td>
                    <td className="px-2 py-3">{inv.status || '-'}</td>
                    <td className="px-2 py-3">{inv.order_id || '-'}</td>
                    <td className="px-2 py-3">{inv.payment_id || '-'}</td>
                    <td className="px-2 py-3 flex gap-2">
                      <button onClick={() => setSelectedInvoiceId(inv._id)} className="inline-flex items-center gap-1.5 rounded px-3 py-1 bg-[#5b3df6] text-white">
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                      <button onClick={() => downloadInvoice(inv)} className="inline-flex items-center gap-1.5 rounded px-3 py-1 border border-black/[0.08] bg-white text-[#0f172a]">
                        <Download className="h-3.5 w-3.5" /> Download
                      </button>
                      <button onClick={() => printInvoice(inv)} className="inline-flex items-center gap-1.5 rounded px-3 py-1 border border-black/[0.08] bg-white text-[#0f172a]">
                        <Printer className="h-3.5 w-3.5" /> Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedInvoice ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5" onClick={() => setSelectedInvoiceId('')}>
          <div className="max-h-[92vh] w-full max-w-[1040px] overflow-hidden rounded-[24px] bg-[#f3f6fb] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-black/[0.08] bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Invoice Preview</p>
                <h3 className="mt-1 text-[18px] font-bold text-[#0f172a]">{getInvoiceNumber(selectedInvoice)}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => printInvoice(selectedInvoice)}
                  className="inline-flex items-center gap-2 rounded-[10px] border border-black/[0.08] bg-white px-3 py-2 text-[13px] font-medium text-[#0f172a]"
                >
                  <Printer className="h-4 w-4" /> Print
                </button>
                <button
                  onClick={() => downloadInvoice(selectedInvoice)}
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#5b3df6] px-3 py-2 text-[13px] font-medium text-white"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
                <button onClick={() => setSelectedInvoiceId('')} className="rounded-full p-2 hover:bg-[#f1f5f9]">
                  <X className="h-5 w-5 text-[#64748b]" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(92vh-72px)] overflow-y-auto p-4 sm:p-6">
              <div className="rounded-[24px] border border-black/[0.08] bg-white shadow-[0_16px_60px_rgba(15,23,42,0.08)] overflow-hidden">
                <div className="bg-gradient-to-r from-[#5b3df6] to-[#2a1d74] px-6 py-6 text-white sm:px-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-[24px] font-black">L</div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Learning Management System</p>
                        <h4 className="text-[24px] font-black leading-none">Invoice</h4>
                        <p className="mt-1 text-[13px] text-white/80">Official fee receipt for your payment</p>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-4 py-3 text-right backdrop-blur">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">Invoice No</p>
                      <p className="mt-1 text-[18px] font-black">{getInvoiceNumber(selectedInvoice)}</p>
                      <p className="mt-1 text-[12px] text-white/75">Issued on {formatDateTime(selectedInvoice.created_at || selectedInvoice.createdAt || selectedInvoice.created)}</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6 sm:px-8">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-black/[0.08] bg-[#f8fafc] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748b]">Bill To</p>
                      <div className="mt-3 flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ede7ff] text-[#5b3df6] font-black">{String(customer?.full_name || customer?.name || 'S').trim().slice(0, 1).toUpperCase()}</div>
                        <div>
                          <p className="text-[18px] font-bold text-[#0f172a]">{customer?.full_name || customer?.name || 'Student'}</p>
                          <p className="mt-1 text-[13px] text-[#64748b]">{customer?.email || '-'}</p>
                          <p className="mt-1 text-[12px] text-[#94a3b8]">Student ID: {customer?._id || customer?.sub || '-'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/[0.08] bg-[#f8fafc] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748b]">Payment Details</p>
                      <div className="mt-3 space-y-2 text-[13px]">
                        <div className="flex items-center justify-between gap-4"><span className="text-[#64748b]">Status</span><span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] bg-[#eef2ff] text-[#4338ca]"><CheckCircle2 className="h-3.5 w-3.5" /> {String(selectedInvoice.status || 'created')}</span></div>
                        <div className="flex items-center justify-between gap-4"><span className="text-[#64748b]">Payment ID</span><span className="font-medium text-[#0f172a]">{selectedInvoice.payment_id || '-'}</span></div>
                        <div className="flex items-center justify-between gap-4"><span className="text-[#64748b]">Order ID</span><span className="font-medium text-[#0f172a]">{selectedInvoice.order_id || '-'}</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-2xl border border-black/[0.08]">
                    <table className="w-full border-separate border-spacing-0">
                      <thead className="bg-[#f8fafc]">
                        <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748b]">
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3">Reference</th>
                          <th className="px-4 py-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-4 align-top">
                            <p className="text-[15px] font-bold text-[#0f172a]">{getInvoiceKindLabel(selectedInvoice)}</p>
                            <p className="mt-1 text-[13px] text-[#64748b]">{getInvoiceItemLabel(selectedInvoice)}</p>
                            <p className="mt-1 text-[12px] text-[#94a3b8]">Payment received for your LMS transaction.</p>
                          </td>
                          <td className="px-4 py-4 align-top text-[13px] text-[#0f172a]">{selectedInvoice.target_id || '-'}</td>
                          <td className="px-4 py-4 align-top text-right text-[15px] font-bold text-[#0f172a]">{formatMoney(selectedInvoice.amount)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_360px] lg:items-start">
                    <div className="rounded-2xl border border-black/[0.08] bg-[#f8fafc] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748b]">Notes</p>
                      <p className="mt-2 text-[13px] leading-6 text-[#475569]">
                        This invoice is generated from your LMS payment record. You can print it or download it anytime for your records.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#5b3df6]/15 bg-gradient-to-br from-[#f7f4ff] to-white p-4">
                      <div className="flex items-center justify-between text-[13px] text-[#64748b]"><span>Subtotal</span><span>{formatMoney(selectedInvoice.amount)}</span></div>
                      <div className="mt-2 flex items-center justify-between text-[13px] text-[#64748b]"><span>Tax</span><span>{formatMoney(0)}</span></div>
                      <div className="mt-4 border-t border-black/[0.08] pt-4 flex items-center justify-between text-[18px] font-black text-[#5b3df6]"><span>Total</span><span>{formatMoney(selectedInvoice.amount)}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
