import React, { useEffect, useMemo, useState } from 'react'
import { api, getToken } from '../../lib/api'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Download, Eye, Printer, X, Calendar, CreditCard, Building, User, FileText, Receipt } from 'lucide-react'

function formatDate(value) {
  if (!value) return '-'
  try {
    const d = new Date(value)
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    })
  } catch {
    return String(value)
  }
}

function formatDateTime(value) {
  if (!value) return '-'
  try {
    const d = new Date(value)
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    })
  } catch {
    return String(value)
  }
}

function formatMoney(value) {
  return `\u20b9${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function getInvoiceNumber(inv) {
  const raw = String(inv?.order_id || inv?._id || '').trim()
  if (!raw) return 'INV-00000000'
  // Create a proper invoice number
  const timestamp = inv.created_at ? new Date(inv.created_at).getTime().toString().slice(-6) : Math.random().toString(36).substring(2, 8).toUpperCase()
  return `INV-${timestamp}${raw.slice(-4)}`
}

function getInvoiceKindLabel(inv) {
  const kind = String(inv?.enrollment_type || inv?.billingType || inv?.payment_for || 'payment').toLowerCase()
  if (kind.includes('live')) return 'Live Class Enrollment'
  if (kind.includes('subscription')) return 'Subscription Payment'
  if (kind.includes('course')) return 'Course Enrollment'
  return 'Payment'
}

// Enhanced function to get course/item name from various possible fields
function getItemName(inv) {
  if (!inv) return 'LMS Service'

  const candidates = [
    inv.target_title,
    inv.course_name,
    inv.courseName,
    inv.course_title,
    inv.courseTitle,
    inv.itemName,
    inv.item_name,
    inv.product_name,
    inv.productName,
    inv.title,
    inv.name,
    inv.description,
    inv.target_name,
    inv.target?.name,
    inv.target?.title,
    inv.course?.name,
    inv.course?.title,
    inv.product?.title,
    inv.items?.[0]?.name,
    inv.items?.[0]?.title,
    inv.cart?.items?.[0]?.name,
    inv.cart?.items?.[0]?.title,
    inv.meta?.course?.name,
    inv.meta?.title,
  ]

  for (const c of candidates) {
    if (c) return String(c).trim()
  }

  // Try nested order/item structures
  if (inv.order && Array.isArray(inv.order.items) && inv.order.items.length > 0) {
    const it = inv.order.items[0]
    if (it?.name) return String(it.name).trim()
    if (it?.title) return String(it.title).trim()
  }

  // Let the backend resolver fill legacy rows that only have ids.
  if (inv?.target_id || inv?.course_id) return ''

  return 'LMS Service'
}

function getInvoiceItems(inv) {
  const rawItems = Array.isArray(inv?.items) ? inv.items : []
  const items = rawItems
    .map((item) => {
      const description = String(item?.description || item?.title || item?.name || '').trim()
      const amount = Number(item?.amount ?? item?.price ?? 0)
      return {
        description,
        hsnSac: String(item?.hsn_sac || item?.hsnSac || '998429'),
        amount: Number.isFinite(amount) ? Math.max(0, amount) : 0,
      }
    })
    .filter((item) => item.description)

  if (items.length > 0) return items

  const fallbackAmount = Number(inv?.original_price ?? inv?.amount ?? 0)
  return [
    {
      description: getItemName(inv),
      hsnSac: '998429',
      amount: Number.isFinite(fallbackAmount) ? Math.max(0, fallbackAmount) : 0,
    },
  ]
}

function getInvoiceTotals(inv) {
  const items = getInvoiceItems(inv)
  const subtotal = Number(items.reduce((sum, item) => sum + Number(item.amount || 0), 0).toFixed(2))
  const explicitDiscount = Number(inv?.discount_amount ?? inv?.coupon_discount ?? 0)
  const paidAmount = Number(inv?.amount || 0)
  const inferredDiscount = subtotal > paidAmount ? subtotal - paidAmount : 0
  const discount = Number(Math.max(0, explicitDiscount || inferredDiscount).toFixed(2))
  const taxable = Number(Math.max(0, subtotal - discount).toFixed(2))
  const cgst = Number((taxable * 0.09).toFixed(2))
  const sgst = Number((taxable * 0.09).toFixed(2))
  const total = Number((taxable + cgst + sgst).toFixed(2))

  return { items, subtotal, discount, taxable, cgst, sgst, total }
}

function getCouponText(inv) {
  const code = String(inv?.coupon_code || '').trim()
  if (!code) return ''

  const type = String(inv?.coupon_type || inv?.discount_type || '').toLowerCase()
  const value = Number(inv?.coupon_value ?? inv?.coupon_percent ?? inv?.coupon_amount ?? 0)
  if (type === 'percent' || type === 'percentage') return `${code} - ${Number(value || 0)}% off`
  if (type === 'flat') return `${code} - Flat ${formatMoney(value)} off`
  return code
}

function getCustomerFullName(customer) {
  const fullName = String(customer?.full_name || '').trim()
  if (fullName) return fullName

  const firstLast = [customer?.first_name, customer?.last_name].map((part) => String(part || '').trim()).filter(Boolean).join(' ')
  if (firstLast) return firstLast

  return 'Student'
}

function getPaymentDateValue(inv) {
  return (
    inv?.captured_at ||
    inv?.paid_at ||
    inv?.payment_date ||
    inv?.paymentDate ||
    inv?.capturedAt ||
    inv?.paidAt ||
    inv?.created_at ||
    inv?.createdAt ||
    inv?.created
  )
}

// Updated business information
function getGSTNumber() {
  return '23AAHFK1234F1Z9'
}

function getBusinessAddress() {
  return 'Scheme No 54, Vijay Nagar, Indore, Madhya Pradesh - 452010, India'
}

function getBusinessEmail() {
  return 'karominfo@kacpl.in'
}

function getBusinessPhone() {
  return '+91 78987 81533'
}

function buildInvoiceHtml(inv, customer) {
  const invoiceNo = getInvoiceNumber(inv)
  const invoiceDate = formatDate(inv.created_at || inv.createdAt || inv.created)
  const dueDate = formatDate(new Date(new Date(inv.created_at || inv.createdAt || inv.created).getTime() + 15 * 24 * 60 * 60 * 1000))
  const paymentStatus = String(inv.status || 'captured').toUpperCase()
  const totals = getInvoiceTotals(inv)
  const couponText = getCouponText(inv)
  const customerName = getCustomerFullName(customer)
  const customerEmail = String(customer?.email || '-').trim()
  const customerPhone = String(customer?.phone || '-').trim()
  const paymentMethod = inv?.payment_method || 'Razorpay'
  const paymentId = inv?.payment_id || '-'
  const orderId = inv?.order_id || '-'
  const itemRows = totals.items.map((item) => `
              <tr>
                <td>
                  <div class="item-title">${escapeHtml(item.description)}</div>
                </td>
                <td>${escapeHtml(item.hsnSac)}</td>
                <td style="text-align: right">${formatMoney(item.amount)}</td>
              </tr>`).join('')
  const discountRows = totals.discount > 0 ? `
              <div class="totals-row discount">
                <span>Discount Applied</span>
                <span>-${formatMoney(totals.discount)}</span>
              </div>
              ${couponText ? `<div class="coupon-row">Coupon: ${escapeHtml(couponText)}</div>` : ''}` : ''

  const statusColor = paymentStatus === 'CAPTURED' ? '#166534' : paymentStatus === 'FAILED' ? '#991b1b' : '#92400e'
  const statusBg = paymentStatus === 'CAPTURED' ? '#dcfce7' : paymentStatus === 'FAILED' ? '#fee2e2' : '#fef3c7'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${invoiceNo} - Tax Invoice</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          background: #e2e8f0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          color: #1e293b;
          padding: 40px 20px;
        }
        
        .invoice-container {
          max-width: 1100px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }
        
        .invoice-header {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          padding: 40px 50px;
          color: white;
        }
        
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }
        
        .logo-section h1 {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }
        
        .logo-section p {
          color: #94a3b8;
          font-size: 13px;
        }
        
        .invoice-title {
          text-align: right;
        }
        
        .invoice-title .invoice-badge {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #94a3b8;
          margin-bottom: 8px;
        }
        
        .invoice-title .invoice-number {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }
        
        .invoice-title .invoice-date {
          font-size: 13px;
          color: #94a3b8;
        }
        
        .header-bottom {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .company-info h3, .customer-info h3 {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #94a3b8;
          margin-bottom: 12px;
        }
        
        .company-info p, .customer-info p {
          font-size: 13px;
          line-height: 1.6;
          color: #cbd5e1;
        }
        
        .company-info p:first-of-type, .customer-info p:first-of-type {
          color: white;
          font-weight: 500;
          margin-bottom: 4px;
        }
        
        .invoice-body {
          padding: 40px 50px;
        }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 600;
          background: ${statusBg};
          color: ${statusColor};
          margin-bottom: 30px;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .detail-card {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        
        .detail-card .label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #64748b;
          margin-bottom: 8px;
        }
        
        .detail-card .value {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
        }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        
        .items-table th {
          text-align: left;
          padding: 15px 0;
          border-bottom: 2px solid #e2e8f0;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #64748b;
        }
        
        .items-table td {
          padding: 15px 0;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
        }
        
        .items-table .item-title {
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 4px;
        }
        
        .items-table .item-desc {
          font-size: 12px;
          color: #64748b;
        }
        
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }
        
        .totals-box {
          width: 320px;
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }
        
        .totals-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 14px;
        }

        .totals-row.discount {
          color: #b91c1c;
        }

        .coupon-row {
          padding: 0 0 10px;
          font-size: 12px;
          color: #64748b;
        }
        
        .totals-row.total {
          border-top: 2px solid #e2e8f0;
          margin-top: 10px;
          padding-top: 15px;
          font-size: 18px;
          font-weight: 700;
          color: #5b3df6;
        }
        
        .payment-info {
          margin-top: 40px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        
        .payment-info h4 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #0f172a;
        }
        
        .payment-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .payment-detail {
          font-size: 13px;
        }
        
        .payment-detail strong {
          color: #64748b;
          font-weight: 500;
          margin-right: 8px;
        }
        
        .footer {
          background: #f8fafc;
          padding: 30px 50px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
          font-size: 12px;
          color: #64748b;
        }
        
        .footer p {
          margin-bottom: 8px;
        }
        
        .footer a {
          color: #5b3df6;
          text-decoration: none;
        }
        
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .invoice-container {
            box-shadow: none;
            border-radius: 0;
          }
          .status-badge {
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="header-top">
            <div class="logo-section">
              <h1>KACPL</h1>
              <p>Knowledge Accelerator Corporate Private Limited</p>
            </div>
            <div class="invoice-title">
              <div class="invoice-badge">TAX INVOICE</div>
              <div class="invoice-number">${invoiceNo}</div>
              <div class="invoice-date">Issue Date: ${invoiceDate}</div>
            </div>
          </div>
          <div class="header-bottom">
            <div class="company-info">
              <h3>From</h3>
              <p>KACPL Learning Hub Pvt Ltd</p>
              <p>${getBusinessAddress()}</p>
              <p>GST: ${getGSTNumber()}</p>
              <p>Email: ${getBusinessEmail()}</p>
              <p>Phone: ${getBusinessPhone()}</p>
            </div>
            <div class="customer-info">
              <h3>Bill To</h3>
              <p>${escapeHtml(customerName)}</p>
              <p>Email: ${escapeHtml(customerEmail)}</p>
              <p>Phone: ${escapeHtml(customerPhone)}</p>
            </div>
          </div>
        </div>
        
        <div class="invoice-body">
          <div class="status-badge">
            <span>●</span> Payment Status: ${paymentStatus}
          </div>
          
          <div class="details-grid">
            <div class="detail-card">
              <div class="label">Invoice Date</div>
              <div class="value">${invoiceDate}</div>
            </div>
            <div class="detail-card">
              <div class="label">Due Date</div>
              <div class="value">${dueDate}</div>
            </div>
            <div class="detail-card">
              <div class="label">Payment Mode</div>
              <div class="value">${paymentMethod}</div>
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 50%">Description</th>
                <th style="width: 25%">HSN/SAC</th>
                <th style="width: 25%">Amount (${formatMoney(0).slice(0, 1)})</th>
              </tr>
            </thead>
            <tbody>
${itemRows}
            </tbody>
          </table>
          
          <div class="totals-section">
            <div class="totals-box">
              <div class="totals-row">
                <span>Subtotal (Before GST)</span>
                <span>${formatMoney(totals.subtotal)}</span>
              </div>
${discountRows}
              <div class="totals-row">
                <span>Taxable Amount</span>
                <span>${formatMoney(totals.taxable)}</span>
              </div>
              <div class="totals-row">
                <span>CGST (9%)</span>
                <span>${formatMoney(totals.cgst)}</span>
              </div>
              <div class="totals-row">
                <span>SGST (9%)</span>
                <span>${formatMoney(totals.sgst)}</span>
              </div>
              <div class="totals-row total">
                <span>Total Amount Paid</span>
                <span>${formatMoney(totals.total)}</span>
              </div>
            </div>
          </div>
          
          <div class="payment-info">
            <h4>Payment Information</h4>
            <div class="payment-details">
              <div class="payment-detail"><strong>Transaction Ref:</strong> ${escapeHtml(paymentId)}</div>
              <div class="payment-detail"><strong>Order Ref:</strong> ${escapeHtml(orderId)}</div>
              <div class="payment-detail"><strong>Payment Date:</strong> ${formatDateTime(getPaymentDateValue(inv))}</div>
              <div class="payment-detail"><strong>Payment Gateway:</strong> ${paymentMethod}</div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>This is a system generated invoice and does not require a physical signature.</p>
          <p>For any queries, please contact <a href="mailto:${getBusinessEmail()}">${getBusinessEmail()}</a> or call ${getBusinessPhone()}</p>
          <p>Thank you for choosing KACPL Learning Hub!</p>
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

    const token = getToken()
    if (!token) {
      const redirectTimer = setTimeout(() => {
        if (!mounted) return
        setError('You must be logged in to view invoices')
        setLoading(false)
        navigate('/login')
      }, 600)
      return () => {
        mounted = false
        clearTimeout(redirectTimer)
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
        
        // Sort invoices by date (newest first)
        const fetched = (paymentsRes?.items || []).sort((a, b) => 
          new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0)
        )

        // For older payments that don't have a title, try resolving from backend
        const needResolve = fetched.filter((inv) => {
          const name = getItemName(inv)
          const hasTarget = Boolean((inv.target_id || inv.course_id || '').toString().trim())
          return (!name || name === 'LMS Service') && hasTarget
        })

        if (needResolve.length === 0) {
          setInvoices(fetched)
          return
        }

        // Resolve titles in parallel (non-blocking)
        Promise.all(
          needResolve.map((inv) =>
            api(`/lms/payments/resolve-title?target_id=${encodeURIComponent(inv.target_id || inv.course_id || '')}&enrollment_type=${encodeURIComponent(inv.enrollment_type || inv.billingType || inv.payment_for || '')}`).then((res) => ({ id: inv._id, title: res?.title || '' })).catch(() => ({ id: inv._id, title: '' }))
          )
        ).then((resolved) => {
          const map = Object.fromEntries(resolved.map((r) => [r.id, r.title || '']))
          const patched = fetched.map((inv) => ({ ...inv, target_title: inv.target_title || map[inv._id] || inv.target_title }))
          setInvoices(patched)
        }).catch(() => {
          setInvoices(fetched)
        })
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
  }, [navigate])

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
    const invoiceNo = getInvoiceNumber(inv)
    a.download = `${invoiceNo}.html`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const printInvoice = (inv) => {
    const win = window.open('', '_blank')
    if (!win) return
    const html = buildInvoiceHtml(inv, customer)
    win.document.open()
    win.document.write(html)
    win.document.close()
    setTimeout(() => win.print(), 500)
  }

  const getStatusColor = (status) => {
    const s = String(status || '').toLowerCase()
    if (s === 'captured' || s === 'paid') return 'bg-green-100 text-green-700'
    if (s === 'failed') return 'bg-red-100 text-red-700'
    if (s === 'pending') return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="min-h-full bg-[#F7FAFD] p-4 sm:p-6 lg:p-7">
      <section className="rounded-[8px] border border-black/[0.08] bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#ede7ff] rounded-lg">
            <Receipt className="h-6 w-6 text-[#5b3df6]" />
          </div>
          <div>
            <h2 className="text-[24px] font-bold text-[#0f172a]">My Invoices</h2>
            <p className="text-[13px] text-[#64748b]">View and download all your payment invoices</p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[8px] border border-black/[0.08] bg-white overflow-hidden">
        {error ? (
          <div className="p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5b3df6]"></div>
            <p className="mt-3 text-[13px] text-[#94a3b8]">Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-[14px] font-medium text-[#0f172a]">No invoices found</p>
            <p className="text-[12px] text-[#94a3b8] mt-1">You haven't made any payments yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8fafc] border-b border-black/[0.08]">
                <tr className="text-left text-[12px] font-semibold text-[#64748b]">
                  <th className="px-4 py-3">Invoice No.</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const totals = getInvoiceTotals(inv)
                  return (
                  <tr key={inv._id} className="border-b border-black/[0.05] hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-[#0f172a]">{getInvoiceNumber(inv)}</p>
                        <p className="text-[10px] text-[#94a3b8] mt-0.5">{inv.order_id?.slice(-8) || '—'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#475569]">{formatDate(inv.created_at || inv.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[13px] font-medium text-[#0f172a]">{getItemName(inv)}</p>
                        <p className="text-[11px] text-[#94a3b8]">{getInvoiceKindLabel(inv)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="font-bold text-[#0f172a]">{formatMoney(totals.total)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusColor(inv.status)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${inv.status === 'captured' ? 'bg-green-600' : inv.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'}`}></span>
                        {String(inv.status || 'captured').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openInvoice(inv)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="View Invoice"
                        >
                          <Eye className="h-4 w-4 text-[#64748b]" />
                        </button>
                        <button
                          onClick={() => downloadInvoice(inv)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Download Invoice"
                        >
                          <Download className="h-4 w-4 text-[#64748b]" />
                        </button>
                        <button
                          onClick={() => printInvoice(inv)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Print Invoice"
                        >
                          <Printer className="h-4 w-4 text-[#64748b]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Invoice Modal Preview */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5" onClick={() => setSelectedInvoiceId('')}>
          <div className="max-h-[92vh] w-full max-w-[1100px] overflow-hidden rounded-[20px] bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-black/[0.08] bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">Invoice Preview</p>
                <h3 className="mt-1 text-[18px] font-bold text-[#0f172a]">{getInvoiceNumber(selectedInvoice)}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => printInvoice(selectedInvoice)}
                  className="inline-flex items-center gap-2 rounded-[10px] border border-black/[0.08] bg-white px-3 py-2 text-[13px] font-medium text-[#0f172a] hover:bg-gray-50 transition-colors"
                >
                  <Printer className="h-4 w-4" /> Print
                </button>
                <button
                  onClick={() => downloadInvoice(selectedInvoice)}
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#5b3df6] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#4a2ed8] transition-colors"
                >
                  <Download className="h-4 w-4" /> Download
                </button>
                <button 
                  onClick={() => setSelectedInvoiceId('')} 
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-[#64748b]" />
                </button>
              </div>
            </div>
            <div className="max-h-[calc(92vh-70px)] overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: buildInvoiceHtml(selectedInvoice, customer) }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
