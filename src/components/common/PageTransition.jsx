import { useEffect } from 'react'
import { m, useReducedMotion } from 'motion/react'

// Halaman pertama (hasil prerender) langsung tampil tanpa animasi supaya konten
// terlihat utuh sejak awal. Animasi hanya untuk perpindahan halaman berikutnya (FR-038).
let appMounted = false

export default function PageTransition({ children }) {
  const reduce = useReducedMotion()
  const animate = appMounted && !reduce

  useEffect(() => {
    appMounted = true
  }, [])

  return (
    <m.div
      initial={animate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  )
}
