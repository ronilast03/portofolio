import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'
import CommandPalette from '@/components/common/CommandPalette'

export default function Layout() {
  const { pathname, hash } = useLocation()
  const mainRef = useRef(null)
  const firstRender = useRef(true)

  // Scroll ke atas dan pindahkan fokus ke konten saat pindah halaman (aksesibilitas).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (hash) {
      // Link seperti /about#sertifikat: gulir ke bagian yang dituju setelah halaman dirender.
      requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView())
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname, hash])

  return (
    <>
      <a
        href="#konten"
        className="absolute -top-16 left-4 z-[100] rounded-lg bg-accent px-3.5 py-2.5 text-sm font-semibold text-accent-fg focus:top-3"
      >
        Lewati ke konten utama
      </a>
      <Navbar />
      <main id="konten" ref={mainRef} tabIndex={-1} className="min-h-[60vh] outline-none">
        {/* Ditampilkan sebentar hanya jika file halaman belum selesai diunduh. */}
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CommandPalette />
    </>
  )
}
