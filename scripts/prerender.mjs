// Prerender semua halaman publik menjadi HTML statis + sitemap.xml + robots.txt (PRD §10.2, §14.2).
// Dijalankan otomatis oleh `npm run build`.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js')

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')
const { render, getRoutes, site, preloadAll } = await import(pathToFileURL(ssrEntry).href)

// Halaman dimuat terpisah (code splitting); muat semuanya dulu agar HTML hasil prerender lengkap.
await preloadAll()

// File sumber tiap halaman (harus sama dengan pageFor di src/routes/AppRoutes.jsx).
const PAGE_SOURCES = [
  [/^\/$/, 'src/pages/Home/HomePage.jsx'],
  [/^\/about$/, 'src/pages/About/AboutPage.jsx'],
  [/^\/layanan$/, 'src/pages/Services/ServicesPage.jsx'],
  [/^\/projects$/, 'src/pages/Projects/ProjectsPage.jsx'],
  [/^\/projects\/[^/]+$/, 'src/pages/Projects/ProjectDetailPage.jsx'],
  [/^\/blog$/, 'src/pages/Blog/BlogPage.jsx'],
  [/^\/blog\/[^/]+$/, 'src/pages/Blog/BlogDetailPage.jsx'],
  [/^\/contact$/, 'src/pages/Contact/ContactPage.jsx'],
  [/^\/privacy-policy$/, 'src/pages/Legal/PrivacyPolicyPage.jsx'],
  [/^\/changelog$/, 'src/pages/Changelog/ChangelogPage.jsx'],
  [/^\/kartu$/, 'src/pages/Card/CardPage.jsx'],
  [/^\/cmdb$/, 'src/pages/Cmdb/CmdbPage.jsx'],
]
const manifestPath = path.join(dist, '.vite', 'manifest.json')
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8').catch(() => '{}'))
const entryFile = manifest['index.html']?.file

/** <link rel="modulepreload"> untuk file JS halaman ini, supaya diunduh bersamaan dengan file utama. */
function preloadTags(url) {
  const source = (PAGE_SOURCES.find(([re]) => re.test(url)) || [null, 'src/pages/NotFound/NotFoundPage.jsx'])[1]
  const files = new Set()
  const visit = (key) => {
    const chunk = manifest[key]
    if (!chunk || files.has(chunk.file) || chunk.file === entryFile) return
    if (template.includes(`/${chunk.file}`)) return // sudah dimuat oleh template
    files.add(chunk.file)
    ;(chunk.imports || []).forEach(visit)
  }
  visit(source)
  return [...files].map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`).join('\n    ')
}

const fill = ({ html, head }, url) =>
  template
    .replace('<!--app-head-->', `${head}\n    ${preloadTags(url)}`)
    .replace('<!--app-html-->', html)

const routes = getRoutes()
for (const route of routes) {
  const output = fill(render(route.path), route.path)
  const file = route.path === '/' ? path.join(dist, 'index.html') : path.join(dist, route.path, 'index.html')
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, output)
  console.log(`  prerender  ${route.path}`)
}

// 404 untuk hosting statis (Vercel, Netlify, dsb.).
// File ini dipakai untuk SEMUA alamat yang tidak ada, jadi ditandai data-fallback:
// di browser halaman dirender ulang (bukan di-hydrate) agar cocok dengan alamat sebenarnya.
const notFound = fill(render('/404'), '/404').replace('<div id="root">', '<div id="root" data-fallback>')
await fs.writeFile(path.join(dist, '404.html'), notFound)
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
await fs.rm(path.join(dist, '.vite'), { recursive: true, force: true }) // manifest tidak perlu ikut dipublikasikan
console.log(`\n✓ ${routes.length + 1} halaman, sitemap.xml, dan robots.txt dibuat di dist/ (site: ${site.url})`)
