import { apiRequest } from './api'

/** POST /api/v1/contact */
export function sendContactMessage({ name, email, subject, message, website = '' }) {
  return apiRequest('/contact', {
    method: 'POST',
    body: {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      website, // honeypot, harus kosong
    },
  })
}
