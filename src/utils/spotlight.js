/**
 * Efek spotlight: cahaya lembut mengikuti kursor di elemen ber-class "spotlight".
 * Cukup satu listener untuk seluruh halaman; posisi kursor dikirim ke CSS lewat --mx dan --my
 * (tampilannya diatur di index.css). Hanya aktif di perangkat dengan mouse/trackpad.
 */
export function initSpotlight() {
  if (typeof window === 'undefined') return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  let frame = 0
  let lastEvent = null

  const update = () => {
    frame = 0
    const e = lastEvent
    const el = e?.target instanceof Element ? e.target.closest('.spotlight') : null
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  document.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      lastEvent = e
      if (!frame) frame = requestAnimationFrame(update)
    },
    { passive: true },
  )
}
