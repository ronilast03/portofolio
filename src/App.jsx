import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import AppRoutes from '@/routes/AppRoutes'

export default function App() {
  // LazyMotion + domAnimation: hanya memuat fitur animasi yang dipakai (bundle lebih kecil).
  // reducedMotion="user": animasi dimatikan jika pengguna memilih "kurangi gerakan" di OS.
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <AppRoutes />
      </MotionConfig>
    </LazyMotion>
  )
}
