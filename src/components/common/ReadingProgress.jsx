import { m, useScroll, useSpring } from 'motion/react'

/** Garis tipis di atas layar yang memanjang sesuai progres membaca artikel. */
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-accent"
    />
  )
}
