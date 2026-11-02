import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

function readTheme() {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Tema dark/light (FR-033/034).
 * Nilai awal sudah diterapkan oleh script kecil di index.html sebelum React berjalan.
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
    return () => media.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = useCallback(() => {
    const next = readTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* storage tidak tersedia */
    }
    setTheme(next)
  }, [])

  return { theme, toggleTheme, mounted }
}
