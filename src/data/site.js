// Konfigurasi umum website. URL dibaca dari .env (lihat .env.example).

const trimSlash = (url) => String(url || '').replace(/\/+$/, '')

export const site = {
  name: 'Roni Lesmana',
  title: 'Roni Lesmana — Web Developer & IT Service Management',
  description:
    'Portofolio dan blog Roni Lesmana: proyek web development, catatan belajar, dan pengalaman di bidang IT Service Management.',
  url: trimSlash(import.meta.env.VITE_SITE_URL || 'http://localhost:5173'),
  locale: 'id_ID',
  language: 'id',
  defaultOgImage: '/images/og-default.png',
  cvPath: '/cv/cv-ronilesmana.pdf',
}

export const apiBaseUrl = trimSlash(import.meta.env.VITE_API_URL || 'http://localhost:8000')

export const navigation = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]
