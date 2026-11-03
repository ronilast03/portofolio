import { createElement, lazy } from 'react'

/**
 * Halaman yang dimuat terpisah (code splitting), tapi tetap bisa dirender sinkron:
 * - Saat prerender, semua halaman dimuat dulu (preloadAll) sehingga HTML tetap lengkap untuk SEO.
 * - Di browser, halaman yang sedang dibuka dimuat sebelum hydrate, jadi tidak ada kedipan.
 * - Halaman lain diunduh belakangan (prefetch saat browser senggang) atau saat diklik.
 */
export function lazyPage(factory) {
  let Component = null
  let promise = null
  const load = () =>
    (promise ??= factory().then((mod) => {
      Component = mod.default
      return mod
    }))
  const Lazy = lazy(load)

  function Page(props) {
    return Component ? createElement(Component, props) : createElement(Lazy, props)
  }
  Page.preload = load
  return Page
}
