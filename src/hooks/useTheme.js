import { useCallback, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

const STORAGE_KEY = 'theme'
let switching = false // cegah klik beruntun saat animasi masih berjalan

// Warna latar tiap tema, samakan dengan --bg di index.css.
const THEME_BG = { light: '#ffffff', dark: '#111111' }

function readTheme() {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/** Titik pusat animasi: posisi klik, atau tengah tombol jika memakai keyboard. */
function originOf(event) {
  const target = event?.currentTarget
  if (event && event.clientX > 0 && event.clientY > 0) return { x: event.clientX, y: event.clientY }
  if (target?.getBoundingClientRect) {
    const r = target.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }
  return { x: window.innerWidth / 2, y: 0 }
}

/**
 * Tema dark/light (FR-033/034).
 * Nilai awal sudah diterapkan oleh script kecil di index.html sebelum React berjalan.
 * Saat diganti, lingkaran membuka (ke gelap) atau menutup (ke terang) dari posisi tombol.
 * Pengguna dengan "kurangi gerakan" langsung berganti tanpa animasi.
 */
export function useTheme() {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTheme(readTheme())
    setMounted(true)

    // Ikuti perubahan tema sistem selama pengguna belum memilih sendiri.
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e) => {
      let saved = null
      try {
        saved = localStorage.getItem(STORAGE_KEY)
      } catch {
        /* storage tidak tersedia */
      }
      if (saved) return
      document.documentElement.classList.toggle('dark', e.matches)
      setTheme(e.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', onChange)

    // Tema juga bisa diganti dari tempat lain (command palette, terminal):
    // semua tombol tema ikut menyesuaikan ikonnya.
    const observer = new MutationObserver(() => setTheme(readTheme()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => {
      media.removeEventListener('change', onChange)
      observer.disconnect()
    }
  }, [])

  const toggleTheme = useCallback((event) => {
    if (switching) return
    const root = document.documentElement
    const next = readTheme() === 'dark' ? 'light' : 'dark'

    const apply = () => {
      root.classList.toggle('dark', next === 'dark')
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* storage tidak tersedia */
      }
      setTheme(next)
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !root.animate) {
      apply()
      return
    }

    // Animasi hanya memakai transform & opacity (dikerjakan GPU) supaya tetap mulus di laptop biasa.
    // Ke gelap  = lingkaran gelap MEMBUKA dari tombol, lalu konten gelap muncul.
    // Ke terang = lingkaran gelap MENUTUP kembali ke tombol, memperlihatkan tema terang di baliknya.
    switching = true
    // Matikan transisi warna tiap elemen selama pergantian (mencegah ratusan transisi berjalan bersamaan).
    root.classList.add('theme-switching')
    const closing = next === 'light'
    const { x, y } = originOf(event)
    const radius = Math.ceil(Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)))

    const circle = document.createElement('div')
    circle.setAttribute('aria-hidden', 'true')
    circle.className = 'theme-wipe'
    Object.assign(circle.style, {
      left: `${x - radius}px`,
      top: `${y - radius}px`,
      width: `${radius * 2}px`,
      height: `${radius * 2}px`,
      background: THEME_BG.dark,
      transform: closing ? 'scale(1)' : 'scale(0)',
      opacity: closing ? '0' : '1',
    })
    document.body.appendChild(circle)

    const done = () => {
      circle.remove()
      root.classList.remove('theme-switching')
      switching = false
    }

    if (!closing) {
      // Membuka: lingkaran membesar, tema diganti di baliknya, lalu lingkaran memudar.
      const grow = circle.animate(
        [{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
        { duration: 520, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' },
      )
      grow.finished
        .then(() => {
          flushSync(apply)
          return circle.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-out', fill: 'forwards' })
            .finished
        })
        .finally(done)
    } else {
      // Menutup: lingkaran gelap muncul menutupi layar, tema diganti di baliknya, lalu lingkaran mengecil ke tombol.
      const cover = circle.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: 'ease-in', fill: 'forwards' })
      cover.finished
        .then(() => {
          flushSync(apply)
          return circle.animate(
            [{ transform: 'scale(1)' }, { transform: 'scale(0)' }],
            { duration: 520, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' },
          ).finished
        })
        .finally(done)
    }
  }, [])

  return { theme, toggleTheme, mounted }
}
