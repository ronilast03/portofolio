// Validasi contact form di frontend (PRD §12.5). Backend tetap jadi sumber validasi utama.

export const CONTACT_LIMITS = { name: 100, email: 150, subject: 200, messageMin: 10, messageMax: 2000 }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateContact(values) {
  const errors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const subject = values.subject.trim()
  const message = values.message.trim()

  if (!name) errors.name = 'Nama wajib diisi.'
  else if (name.length > CONTACT_LIMITS.name) errors.name = `Nama maksimal ${CONTACT_LIMITS.name} karakter.`

  if (!email) errors.email = 'Email wajib diisi.'
  else if (!EMAIL.test(email)) errors.email = 'Format email belum benar, contoh: nama@domain.com.'
  else if (email.length > CONTACT_LIMITS.email) errors.email = `Email maksimal ${CONTACT_LIMITS.email} karakter.`

  if (!subject) errors.subject = 'Subjek wajib diisi.'
  else if (subject.length > CONTACT_LIMITS.subject) errors.subject = `Subjek maksimal ${CONTACT_LIMITS.subject} karakter.`

  if (!message) errors.message = 'Pesan wajib diisi.'
  else if (message.length < CONTACT_LIMITS.messageMin) errors.message = `Pesan minimal ${CONTACT_LIMITS.messageMin} karakter.`
  else if (message.length > CONTACT_LIMITS.messageMax) errors.message = `Pesan maksimal ${CONTACT_LIMITS.messageMax} karakter.`

  return errors
}
