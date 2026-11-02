import { createContext, useContext, useEffect } from 'react'
import { site } from '@/data/site'

/**
 * SEO per halaman (PRD §14).
 * - Saat prerender (server), metadata dikumpulkan lewat SeoContext lalu disisipkan ke <head>.
 * - Di browser, metadata diperbarui setiap pindah halaman.
 */
export const SeoContext = createContext(null)

const absolute = (path) => (path?.startsWith('http') ? path : `${site.url}${path || ''}`)

export function buildSeo({ title, description, path = '/', image, type = 'website', noindex = false, jsonLd }) {
  const fullTitle = title ? `${title} — ${site.name}` : site.title
  return {
    title: fullTitle,
    description: description || site.description,
    canonical: absolute(path === '/' ? '/' : path.replace(/\/$/, '')),
    image: absolute(image || site.defaultOgImage),
    type,
    noindex,
    jsonLd: Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [],
  }
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

/** Dipakai oleh scripts/prerender.mjs untuk menulis tag <head>. */
export function seoToHtml(seo) {
  if (!seo) return ''
  const tags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
    seo.noindex ? '<meta name="robots" content="noindex" />' : '',
    `<meta property="og:site_name" content="${escapeHtml(site.name)}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:type" content="${seo.type}" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(seo.canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(seo.image)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(seo.image)}" />`,
    ...seo.jsonLd.map(
      (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`,
    ),
  ]
  return tags.filter(Boolean).join('\n    ')
}

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export default function Seo(props) {
  const collector = useContext(SeoContext)
  const seo = buildSeo(props)

  // Server: simpan untuk prerender.
  if (collector) collector.current = seo

  useEffect(() => {
    document.title = seo.title
    setMeta('name', 'description', seo.description)
    setMeta('property', 'og:title', seo.title)
    setMeta('property', 'og:description', seo.description)
    setMeta('property', 'og:url', seo.canonical)
    setMeta('property', 'og:image', seo.image)
    setMeta('property', 'og:type', seo.type)
    setMeta('name', 'twitter:title', seo.title)
    setMeta('name', 'twitter:description', seo.description)
    setMeta('name', 'twitter:image', seo.image)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = seo.canonical

    const robots = document.head.querySelector('meta[name="robots"]')
    if (seo.noindex) setMeta('name', 'robots', 'noindex')
    else robots?.remove()

    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove())
    seo.jsonLd.forEach((data) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(data)
      document.head.appendChild(script)
    })
  }, [seo.title, seo.description, seo.canonical, seo.image, seo.type, seo.noindex, JSON.stringify(seo.jsonLd)])

  return null
}
