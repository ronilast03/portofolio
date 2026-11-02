// Prerender semua halaman publik menjadi HTML statis + sitemap.xml + robots.txt (PRD §10.2, §14.2).
// Dijalankan otomatis oleh `npm run build`.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js')

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')
const { render, getRoutes, site } = await import(pathToFileURL(ssrEntry).href)

const fill = ({ html, head }) => template.replace('<!--app-head-->', head).replace('<!--app-html-->', html)

const routes = getRoutes()
for (const route of routes) {
  const output = fill(render(route.path))
  const file = route.path === '/' ? path.join(dist, 'index.html') : path.join(dist, route.path, 'index.html')
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, output)
  console.log(`  prerender  ${route.path}`)
}

// 404 untuk hosting statis (Netlify, dsb.)
await fs.writeFile(path.join(dist, '404.html'), fill(render('/404')))
console.log('  prerender  /404.html')

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${site.url}${r.path === '/' ? '/' : r.path}</loc>
    <lastmod>${r.lastmod || today}</lastmod>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`
await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap)

const robots = `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`
await fs.writeFile(path.join(dist, 'robots.txt'), robots)

await fs.rm(path.join(root, 'dist-ssr'), { recursive: true, force: true })
console.log(`\n✓ ${routes.length + 1} halaman, sitemap.xml, dan robots.txt dibuat di dist/ (site: ${site.url})`)
