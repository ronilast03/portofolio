import { flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router'
import { clearViewTransition, markViewTransition } from '@/utils/viewTransition'
import { preloadRoute } from '@/routes/AppRoutes'

/**
 * Link yang berpindah halaman dengan View Transitions API: elemen yang memiliki
 * `view-transition-name` sama di halaman asal dan tujuan akan "terbang" dari satu posisi ke posisi lain
 * (dipakai untuk gambar proyek: kartu -> halaman detail).
 *
 * Browser yang belum mendukung, klik dengan Ctrl/Cmd (tab baru), atau mode "kurangi gerakan"
 * berpindah halaman seperti Link biasa.
 */
export default function TransitionLink({ to, onClick, ...props }) {
  const navigate = useNavigate()

  const handleClick = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (!document.startViewTransition) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    e.preventDefault()
    // Pastikan file halaman tujuan sudah terunduh, baru jalankan transisi (tanpa layar kosong).
    preloadRoute(typeof to === 'string' ? to : to?.pathname)
      .catch(() => {})
      .finally(() => {
        markViewTransition()
        const transition = document.startViewTransition(() => {
          flushSync(() => navigate(to))
          window.scrollTo({ top: 0, behavior: 'instant' })
        })
        transition.finished.finally(clearViewTransition)
      })
  }

  return <Link to={to} onClick={handleClick} {...props} />
}
