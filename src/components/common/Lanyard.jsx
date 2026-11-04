import { useEffect, useRef } from 'react'

const MAX = 32 // batas ayunan saat ditarik (derajat)
const STIFFNESS = 38 // kekuatan pegas
const DAMPING = 3.2 // redaman (semakin besar, semakin cepat berhenti)

/**
 * Tali + klip logam + benda yang tergantung (kartu ID, dsb.).
 * - Berayun pelan saat pertama tampil, lalu diam di sudut `rest`.
 * - Bisa ditarik ke kiri/kanan dengan mouse atau jari, lalu memantul kembali seperti pegas.
 * - Untuk pengguna "kurangi gerakan": diam, tanpa ayunan.
 *
 * Pakai: <Lanyard strap="RONI LESMANA · ITSM" short><KartuKamu /></Lanyard>
 */
export default function Lanyard({ children, strap = '', rest = -3, short = false, className = '' }) {
  const swingRef = useRef(null)
  const physics = useRef({ angle: rest, velocity: 0, frame: 0, last: 0, dragging: false })

  useEffect(() => {
    const el = swingRef.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const p = physics.current
    const apply = () => {
      el.style.transform = `rotate(${p.angle.toFixed(2)}deg)`
    }

    const step = (now) => {
      const dt = Math.min(0.032, (now - p.last) / 1000 || 0.016)
      p.last = now
      if (!p.dragging) {
        const accel = -STIFFNESS * (p.angle - rest) - DAMPING * p.velocity
        p.velocity += accel * dt
        p.angle += p.velocity * dt
      }
      apply()
      if (!p.dragging && Math.abs(p.angle - rest) < 0.03 && Math.abs(p.velocity) < 0.03) {
        p.angle = rest
        apply()
        p.frame = 0
        return
      }
      p.frame = requestAnimationFrame(step)
    }
    const run = () => {
      if (p.frame) return
      p.last = performance.now()
      p.frame = requestAnimationFrame(step)
    }

    if (reduce) {
      apply()
      return
    }

    // Ayunan pembuka, dimulai saat lanyard terlihat di layar
    let started = false
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return
      started = true
      p.angle = rest + 9
      p.velocity = 0
      setTimeout(run, 300)
    })
    io.observe(el)

    // ---------- Tarik dengan pointer ----------
    let start = null
    const pivot = () => {
      const box = el.parentElement.getBoundingClientRect() // pangkal tali = tengah atas wadah
      return { x: box.left + box.width / 2, y: box.top }
    }
    const angleTo = (e, o) => (Math.atan2(e.clientX - o.x, e.clientY - o.y) * -180) / Math.PI

    const onDown = (e) => {
      if (e.button !== 0) return
      const o = pivot()
      start = { x: e.clientX, y: e.clientY, o, offset: p.angle - angleTo(e, o), moved: false, id: e.pointerId, history: [] }
    }
    const onMove = (e) => {
      if (!start || e.pointerId !== start.id) return
      if (!start.moved) {
        if (Math.hypot(e.clientX - start.x, e.clientY - start.y) < 5) return
        start.moved = true
        p.dragging = true
        el.setPointerCapture?.(e.pointerId)
        el.classList.add('is-dragging')
        run()
      }
      const target = Math.max(rest - MAX, Math.min(rest + MAX, angleTo(e, start.o) + start.offset))
      start.history.push({ t: performance.now(), a: target })
      if (start.history.length > 5) start.history.shift()
      p.angle = target
    }
    const onUp = (e) => {
      if (!start || e.pointerId !== start.id) return
      if (start.moved) {
        const h = start.history
        if (h.length > 1) {
          const dt = (h[h.length - 1].t - h[0].t) / 1000
          if (dt > 0) p.velocity = Math.max(-260, Math.min(260, (h[h.length - 1].a - h[0].a) / dt))
        }
        p.dragging = false
        el.classList.remove('is-dragging')
        // Menarik tidak dihitung sebagai klik pada tombol/link di dalam kartu
        const block = (ev) => {
          ev.preventDefault()
          ev.stopPropagation()
        }
        el.addEventListener('click', block, { capture: true, once: true })
        setTimeout(() => el.removeEventListener('click', block, { capture: true }), 0)
        run()
      }
      start = null
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      io.disconnect()
      cancelAnimationFrame(p.frame)
      p.frame = 0
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [rest])

  return (
    <div className={`lanyard relative ${className}`}>
      <div ref={swingRef} className="lanyard-swing mx-auto" style={{ transform: `rotate(${rest}deg)` }}>
        <div aria-hidden="true" className={`lanyard-strap mx-auto ${short ? 'lanyard-strap--short' : ''}`}>
          <span>{`${strap} · `.repeat(4)}</span>
        </div>
        <div aria-hidden="true" className="lanyard-clip mx-auto" />
        <div aria-hidden="true" className="lanyard-ring mx-auto" />
        <div className="-mt-3 flex justify-center">{children}</div>
      </div>
    </div>
  )
}
