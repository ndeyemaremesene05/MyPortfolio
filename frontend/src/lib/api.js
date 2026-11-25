// Client de l'API Laravel. Si l'API est absente ou lente, le site reste complet :
// il utilise le contenu intégré au build (content/portfolio.json).

const RAW_BASE = import.meta.env.VITE_API_URL
export const API_BASE = (RAW_BASE ?? '/api').replace(/\/$/, '')
export const API_ENABLED = API_BASE !== ''

async function request(path, { method = 'GET', body, timeout = 4000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const type = response.headers.get('content-type') || ''
    const data = type.includes('application/json') ? await response.json() : null
    return { ok: response.ok, status: response.status, data }
  } catch {
    return { ok: false, status: 0, data: null }
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchPortfolio() {
  if (!API_ENABLED) return null
  const { ok, data } = await request('/portfolio')
  if (!ok || !data || !Array.isArray(data.projects)) return null
  return data
}

/**
 * Envoie le formulaire de contact.
 * Renvoie { status: 'sent' } | { status: 'invalid', errors } | { status: 'unavailable' }
 */
export async function sendContact(payload) {
  if (!API_ENABLED) return { status: 'unavailable' }
  const { ok, status, data } = await request('/contact', { method: 'POST', body: payload, timeout: 10000 })
  if (ok) return { status: 'sent' }
  if (status === 422 && data?.errors) return { status: 'invalid', errors: data.errors }
  if (status === 429) return { status: 'throttled' }
  return { status: 'unavailable' }
}
