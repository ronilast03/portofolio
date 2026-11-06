import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '@fontsource-variable/inter'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource-variable/jetbrains-mono'
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import './index.css'
import App from './App'
import { initSpotlight } from './utils/spotlight'
import { preloadAll, preloadRoute } from './routes/AppRoutes'

initSpotlight()

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Unduh halaman lain saat browser sedang senggang, supaya pindah halaman tetap instan.
// Ditunda beberapa detik agar tidak berebut dengan pemuatan halaman yang sedang dibuka.
const prefetchRest = () => {
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1))
  setTimeout(() => idle(() => preloadAll().catch(() => {})), 3000)
}

// Halaman hasil prerender di-hydrate; saat `npm run dev` dirender biasa.
// File JavaScript halaman yang sedang dibuka dimuat dulu supaya hydrate langsung cocok dengan HTML.
preloadRoute(window.location.pathname)
  .catch(() => {})
  .finally(() => {
    // 404.html (data-fallback) dipakai untuk semua alamat yang tidak ada, jadi isinya tidak selalu cocok
    // dengan alamat yang dibuka (misalnya menu aktif di navbar). Render ulang saja, jangan hydrate.
    if (container.firstElementChild && !container.hasAttribute('data-fallback')) hydrateRoot(container, app)
    else createRoot(container).render(app)
    if (document.readyState === 'complete') prefetchRest()
    else window.addEventListener('load', prefetchRest, { once: true })
  })
