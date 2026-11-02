import { useEffect, useRef, useState } from 'react'
import { m, useInView, useReducedMotion } from 'motion/react'

/**
 * Memunculkan konten dengan fade + geser ke atas saat di-scroll ke layar.
 *
 * - Konten yang sudah terlihat saat halaman dibuka langsung tampil (tanpa animasi),
 *   jadi HTML hasil prerender tetap utuh dan tidak ada kedipan.
 * - Hanya konten di bawah layar yang disembunyikan dulu, lalu dianimasikan saat terlihat.
 * - Mati otomatis jika pengguna memilih "kurangi gerakan" di pengaturan perangkat.
 *
 * Contoh: <Reveal delay={0.1}><Card /></Reveal>
 */
export default function Reveal({ children, as = 'div', delay = 0, y = 24, className, ...props }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const [armed, setArmed] = useState(false)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  useEffect(() => {
    if (reduce || !ref.current) return
    const { top } = ref.current.getBoundingClientRect()
    if (top > window.innerHeight * 0.92) setArmed(true)
  }, [reduce])

  const hidden = armed && !inView
  const Component = m[as] ?? m.div

  return (
    <Component
      ref={ref}
      className={className}
      initial={false}
      animate={hidden ? { opacity: 0, y } : { opacity: 1, y: 0 }}
      transition={hidden ? { duration: 0 } : { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </Component>
  )
}
