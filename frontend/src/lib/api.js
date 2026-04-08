const DEFAULT_API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
const FALLBACK_API_BASES = ['http://localhost:8000/api/v1', 'http://localhost:8001/api/v1']
let runtimeApiBase = localStorage.getItem('lms_api_base') || DEFAULT_API_BASE

function deriveWsBaseFromApi(apiBase) {
  try {
    const url = new URL(apiBase)
    const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${wsProtocol}//${url.host}`
  } catch {
    return 'ws://localhost:8000'
  }
}

function getWsBase() {
  if (import.meta.env.VITE_WS_BASE_URL) return import.meta.env.VITE_WS_BASE_URL
  return deriveWsBaseFromApi(runtimeApiBase)
}

export function getToken() {
  return localStorage.getItem('lms_token') || ''
}

export function setAuthSession(token, role, tenantId) {
  localStorage.setItem('lms_token', token)
  localStorage.setItem('lms_role', role)
  if (tenantId) localStorage.setItem('lms_tenant_id', tenantId)
}

export function clearAuthSession() {
  localStorage.removeItem('lms_token')
  localStorage.removeItem('lms_role')
  localStorage.removeItem('lms_tenant_id')
}

export async function api(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (token) headers.Authorization = `Bearer ${token}`
  const candidates = [runtimeApiBase, ...FALLBACK_API_BASES.filter((x) => x !== runtimeApiBase)]
  let lastError

  for (const base of candidates) {
    try {
      const response = await fetch(`${base}${path}`, {
        ...options,
        headers,
      })
      const data = await response.json().catch(() => ({}))
      runtimeApiBase = base
      localStorage.setItem('lms_api_base', base)
      if (!response.ok) {
        let message = 'Request failed'
        if (typeof data?.detail === 'string') {
          message = data.detail
        } else if (Array.isArray(data?.detail)) {
          message = data.detail
            .map((item) => {
              if (typeof item === 'string') return item
              if (item?.msg && Array.isArray(item?.loc)) return `${item.loc.join('.')} - ${item.msg}`
              if (item?.msg) return item.msg
              return JSON.stringify(item)
            })
            .join('; ')
        } else if (data?.detail && typeof data.detail === 'object') {
          message = data.detail.msg || JSON.stringify(data.detail)
        }
        throw new Error(message)
      }
      return data
    } catch (error) {
      lastError = error
      // Retry next base only for network issues where fetch itself fails.
      if (!(error instanceof TypeError)) {
        break
      }
    }
  }
  throw lastError || new Error('Request failed')
}

export function getDashboardPathByRole(role) {
  if (role === 'super_admin') return '/superadmin'
  if (role === 'admin') return '/admin'
  if (role === 'instructor') return '/instructor'
  return '/student-panel'
}

export function createRoomSocket(room) {
  const wsBase = getWsBase()
  return new WebSocket(`${wsBase}/ws/${encodeURIComponent(room)}`)
}

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}
