import { apiRequest, ApiError } from './api'

/**
 * Pengiriman pesan dari form tiket/kontak.
 *
 * - Jika VITE_WEB3FORMS_KEY diisi: pesan dikirim lewat Web3Forms dan langsung masuk ke email kamu
 *   (tidak butuh backend). Daftar gratis di https://web3forms.com.
 * - Jika kosong: pesan dikirim ke Laravel API (POST /api/v1/contact).
 */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY
const WEB3FORMS_URL = 'https://api.web3forms.com/submit'

export const contactProvider = WEB3FORMS_KEY ? 'web3forms' : 'api'

/** Nomor tiket seperti REQ-2026-4821 untuk ditampilkan dan dimasukkan ke subjek email. */
export function createTicketId(date = new Date()) {
  return `REQ-${date.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
}

async function sendViaWeb3Forms(payload) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  let response
  try {
    response = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...payload }),
      signal: controller.signal,
    })
  } catch (error) {
    throw new ApiError(
      error.name === 'AbortError'
        ? 'Server terlalu lama merespons. Periksa koneksi lalu coba lagi.'
        : 'Tidak dapat terhubung ke server. Periksa koneksi internet kamu lalu coba lagi.',
    )
  } finally {
    clearTimeout(timer)
  }

  const data = await response.json().catch(() => ({}))
  if (response.ok && data.success) return { success: true, message: 'Pesan kamu berhasil dikirim.' }
  if (response.status === 429) {
    throw new ApiError('Terlalu banyak percobaan pengiriman. Coba lagi beberapa saat lagi.', { status: 429 })
  }
  throw new ApiError('Pesan gagal dikirim. Silakan coba lagi atau hubungi lewat email.', { status: response.status })
}

export async function sendContactMessage({ name, email, subject, message, category = '', ticketId = '', website = '' }) {
  // Honeypot terisi = kemungkinan bot. Pura-pura berhasil tanpa mengirim apa pun.
  if (website) return { success: true, message: 'Pesan kamu berhasil dikirim.' }

  const cleanSubject = subject.trim()
  const topic = [category, cleanSubject].filter(Boolean).join(' · ')
  const fullSubject = ticketId ? `[${ticketId}] ${topic}` : topic

  if (WEB3FORMS_KEY) {
    return sendViaWeb3Forms({
      subject: fullSubject,
      from_name: 'Website Portofolio',
      name: name.trim(),
      email: email.trim(),
      nomor_tiket: ticketId,
      kategori: category,
      ringkasan: cleanSubject,
      message: message.trim(),
    })
  }

  return apiRequest('/contact', {
    method: 'POST',
    body: {
      name: name.trim(),
      email: email.trim(),
      subject: fullSubject.slice(0, 200),
      message: message.trim(),
      website,
    },
  })
}
