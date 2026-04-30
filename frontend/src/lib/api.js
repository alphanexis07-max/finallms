const LOCAL_DEV_API_BASE = 'http://localhost:8000/api/v1'
const isLocalDev = import.meta.env.DEV && window.location.hostname === 'localhost'
const DEFAULT_API_BASE = isLocalDev
  ? LOCAL_DEV_API_BASE
  : (import.meta.env.VITE_API_BASE_URL || LOCAL_DEV_API_BASE)
// const FALLBACK_API_BASES = ['http://localhost:8000/api/v1', 'http://localhost:8001/api/v1']
const FALLBACK_API_BASES = []
const savedApiBase = localStorage.getItem('lms_api_base') || ''
let runtimeApiBase = isLocalDev ? LOCAL_DEV_API_BASE : (savedApiBase || DEFAULT_API_BASE)
const GET_CACHE_TTL_MS = 15_000
const responseCache = new Map()
const inflightRequests = new Map()
const parsedConcurrency = Number(import.meta.env.VITE_API_MAX_CONCURRENCY)
const MAX_CONCURRENT_REQUESTS = Number.isFinite(parsedConcurrency) && parsedConcurrency > 0
  ? Math.floor(parsedConcurrency)
  : 4
let activeRequestCount = 0
const pendingRequestQueue = []

function scheduleRequest(task) {
  return new Promise((resolve, reject) => {
    pendingRequestQueue.push({ task, resolve, reject })
    runNextQueuedRequest()
  })
}

function runNextQueuedRequest() {
  if (activeRequestCount >= MAX_CONCURRENT_REQUESTS) return
  const nextRequest = pendingRequestQueue.shift()
  if (!nextRequest) return

  activeRequestCount += 1
  Promise.resolve()
    .then(nextRequest.task)
    .then(nextRequest.resolve)
    .catch(nextRequest.reject)
    .finally(() => {
      activeRequestCount = Math.max(0, activeRequestCount - 1)
      runNextQueuedRequest()
    })
}

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
  if (!isLocalDev && import.meta.env.VITE_WS_BASE_URL) return import.meta.env.VITE_WS_BASE_URL
  if (isLocalDev) return 'ws://localhost:8000'
  return deriveWsBaseFromApi(runtimeApiBase)
}

export function getToken() {
  return (
    localStorage.getItem('lms_token') ||
    localStorage.getItem('token') ||
    localStorage.getItem('access_token') ||
    ''
  )
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
  const method = String(options.method || 'GET').toUpperCase()
  const canCache = method === 'GET'
  const cacheKey = canCache ? `${runtimeApiBase}${path}` : ''
  const now = Date.now()

  if (canCache) {
    const cached = responseCache.get(cacheKey)
    if (cached && cached.expiresAt > now) {
      return cached.data
    }
    if (inflightRequests.has(cacheKey)) {
      return inflightRequests.get(cacheKey)
    }
  }

  const token = getToken()
  const tenantId = localStorage.getItem('lms_tenant_id') || ''
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (token) headers.Authorization = `Bearer ${token}`
  if (tenantId && !headers['X-Tenant-Id']) headers['X-Tenant-Id'] = tenantId
  const candidates = [runtimeApiBase, ...FALLBACK_API_BASES.filter((x) => x !== runtimeApiBase)]
  let lastError

  const requestPromise = scheduleRequest(async () => {
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
          throw new Error(data.detail || 'Request failed')
        }
        if (canCache) {
          responseCache.set(cacheKey, { data, expiresAt: Date.now() + GET_CACHE_TTL_MS })
        } else {
          // Conservative invalidation: writes can stale any cached GET.
          responseCache.clear()
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
  })

  if (canCache) {
    inflightRequests.set(cacheKey, requestPromise)
  }

  try {
    return await requestPromise
  } finally {
    if (canCache) {
      inflightRequests.delete(cacheKey)
    }
  }
}

export function getDashboardPathByRole(role) {
  if (role === 'super_admin') return '/superadmin'
  if (role === 'admin' || role === 'sub_admin') return '/admin'
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

    const existingScript = document.querySelector('script[data-razorpay-checkout="true"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true })
      existingScript.addEventListener('error', () => resolve(false), { once: true })
      return
    }

    const script = document.createElement('script')
    script.dataset.razorpayCheckout = 'true'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}
