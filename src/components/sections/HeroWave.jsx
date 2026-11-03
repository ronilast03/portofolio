import { useEffect, useRef } from 'react'

// Karakter kode & istilah ITSM yang membentuk "gelombang" di belakang hero.
const GLYPHS = '{}<>/;=()[]#$*+01'.split('')
const WORDS = ['INC', 'REQ', 'CHG', 'KB', 'SLA', 'API', 'JSX', 'PHP']

const ROWS = 7
const GAP_X = 30 // jarak antar karakter (px)

/**
 * Latar hero: baris-baris karakter yang bergerak seperti gelombang suara.
 * - Digambar di <canvas> (ringan, tanpa ratusan elemen DOM).
 * - Karakter di dekat kursor terdorong menjauh dan berwarna aksen.
 * - Berhenti saat tidak terlihat / tab tidak aktif; statis untuk "kurangi gerakan".
 * Warna diambil dari variabel CSS sehingga ikut berubah saat tema diganti.
 */
export default function HeroWave() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: -9999, y: -9999, active: false }
    let width = 0
    let height = 0
    let cells = []
    let colors = { muted: '#666', accent: '#2246d6' }
    let frame = 0
    let visible = true
    let start = performance.now()

    const readColors = () => {
      const css = getComputedStyle(document.documentElement)
      colors = {
        muted: css.getPropertyValue('--muted').trim() || colors.muted,
        accent: css.getPropertyValue('--accent').trim() || colors.accent,
      }
    }

    const pick = () => (Math.random() < 0.07 ? WORDS[(Math.random() * WORDS.length) | 0] : GLYPHS[(Math.random() * GLYPHS.length) | 0])

    const layout = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = Math.ceil(width / GAP_X) + 2
      cells = []
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < cols; c++) {
          cells.push({ r, c, ch: pick(), dx: 0, dy: 0 })
        }
      }
    }

    const draw = (now) => {
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, width, height)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const rowGap = height / (ROWS + 1)
      const amp = Math.min(46, rowGap * 0.55)
      const mobile = width < 640
      ctx.font = `${mobile ? 11 : 13}px "JetBrains Mono Variable", ui-monospace, monospace`

      for (const cell of cells) {
        const baseX = cell.c * GAP_X - GAP_X / 2
        // Gelombang: tiap baris punya fase sendiri, tiap kolom bergeser sedikit -> pola mengalir
        const wave = Math.sin(t * 0.9 + cell.c * 0.22 + cell.r * 0.65) + 0.45 * Math.sin(t * 0.45 - cell.c * 0.09)
        const baseY = rowGap * (cell.r + 1) + wave * amp * 0.6

        // Dorongan dari kursor (pegas sederhana)
        let tx = 0
        let ty = 0
        let near = 0
        if (pointer.active) {
          const ddx = baseX - pointer.x
          const ddy = baseY - pointer.y
          const dist = Math.hypot(ddx, ddy)
          const radius = 120
          if (dist < radius) {
            near = 1 - dist / radius
            const force = near * 26
            tx = (ddx / (dist || 1)) * force
            ty = (ddy / (dist || 1)) * force
          }
        }
        cell.dx += (tx - cell.dx) * 0.12
        cell.dy += (ty - cell.dy) * 0.12

        // Karakter sesekali berganti, seperti sinyal
        if (!reduce && Math.random() < 0.0015) cell.ch = pick()

        // Kecerahan mengikuti puncak gelombang
        const crest = (wave + 1.45) / 2.9
        ctx.globalAlpha = near > 0.05 ? 0.55 + near * 0.45 : 0.1 + crest * 0.32
        ctx.fillStyle = near > 0.05 ? colors.accent : colors.muted
        ctx.fillText(cell.ch, baseX + cell.dx, baseY + cell.dy)
      }
      ctx.globalAlpha = 1
    }

    const loop = (now) => {
      frame = 0
      if (!visible || document.hidden) return
      draw(now)
      frame = requestAnimationFrame(loop)
    }
    const play = () => {
      if (reduce) {
        draw(start + 2000)
        return
      }
      if (!frame) frame = requestAnimationFrame(loop)
    }

    readColors()
    layout()
    play()

    const resize = new ResizeObserver(() => {
      layout()
      if (reduce) draw(start + 2000)
    })
    resize.observe(canvas)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) play()
    })
    io.observe(canvas)

    // Ganti tema -> ambil warna baru
    const themeObserver = new MutationObserver(() => {
      readColors()
      if (reduce) draw(start + 2000)
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const onVisibility = () => !document.hidden && play()
    document.addEventListener('visibilitychange', onVisibility)

    // Kursor dibaca dari section induk supaya tombol & teks hero tetap bisa diklik.
    const host = canvas.parentElement
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      const rect = canvas.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = true
    }
    const onLeave = () => {
      pointer.active = false
    }
    host?.addEventListener('pointermove', onMove, { passive: true })
    host?.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      io.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      host?.removeEventListener('pointermove', onMove)
      host?.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="hero-wave pointer-events-none absolute inset-0 size-full"
    />
  )
}
