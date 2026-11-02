import { apiBaseUrl } from '@/data/site'

export class ApiError extends Error {
  constructor(message, { status = 0, errors = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

/**
 * Wrapper fetch untuk Laravel API: JSON, timeout, dan pesan error yang ramah pengguna (NFR-009).
 */
export async function apiRequest(path, { method = 'GET', body, timeout = 15000, headers = {} } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  let response
  try {
    response = await fetch(`${apiBaseUrl}/api/v1${path}`, {
      method,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...headers },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
  } catch (error) {
    const message =
      error.name === 'AbortError'
        ? 'Server terlalu lama merespons. Periksa koneksi lalu coba lagi.'
        : 'Tidak dapat terhubung ke server. Periksa koneksi internet kamu lalu coba lagi.'
    throw new ApiError(message, { status: 0 })
  } finally {
    clearTimeout(timer)
  }

  const data = await response.json().catch(() => ({}))

  if (response.ok) return data

  if (response.status === 422) {
    throw new ApiError(data.message || 'Data yang dikirim belum valid.', { status: 422, errors: data.errors || null })
  }
  if (response.status === 429) {
    const retry = Number(response.headers.get('Retry-After'))
    const wait = retry > 0 ? ` Coba lagi dalam ${Math.ceil(retry / 60)} menit.` : ' Coba lagi beberapa saat lagi.'
    throw new ApiError(`Terlalu banyak percobaan pengiriman.${wait}`, { status: 429 })
  }
  throw new ApiError('Terjadi kesalahan di server. Silakan coba lagi nanti.', { status: response.status })
}
