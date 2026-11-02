import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import { SeoContext, seoToHtml } from '@/components/common/Seo'
import { projects } from '@/data/projects'
import { site } from '@/data/site'
import { posts } from '@/utils/blog'

/** Dipanggil oleh scripts/prerender.mjs untuk setiap URL. */
export function render(url) {
  const seo = { current: null }
  const html = renderToString(
    <StrictMode>
      <SeoContext.Provider value={seo}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </SeoContext.Provider>
    </StrictMode>,
  )
  return { html, head: seoToHtml(seo.current) }
}

/** Semua halaman publik yang di-prerender dan dimasukkan ke sitemap.xml. */
export function getRoutes() {
  const lastmodOf = (p) => p.updatedAt || p.date
  const latestPost = posts[0] ? lastmodOf(posts[0]) : undefined
  return [
    { path: '/', priority: '1.0', lastmod: latestPost },
    { path: '/about', priority: '0.8' },
    { path: '/projects', priority: '0.8' },
    ...projects.map((p) => ({ path: `/projects/${p.slug}`, priority: '0.7' })),
    { path: '/blog', priority: '0.8', lastmod: latestPost },
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, priority: '0.7', lastmod: lastmodOf(p) })),
    { path: '/contact', priority: '0.6' },
    { path: '/privacy-policy', priority: '0.3' },
  ]
}

export { site }
