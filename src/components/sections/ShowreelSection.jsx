import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import Icon from '@/components/common/Icon'
import Reveal from '@/components/common/Reveal'
import SectionHeading from './SectionHeading'
import { profile } from '@/data/profile'
import { projects } from '@/data/projects'

// Remotion baru diunduh saat bagian ini hampir terlihat di layar.
const ShowreelPlayer = lazy(() => import('@/remotion/ShowreelPlayer'))

const MAX_PROJECTS = 5
const reelProjects = projects.slice(0, MAX_PROJECTS).map(({ slug, title, category, stack, thumbnail }) => ({
  slug,
  title,
  category,
  stack,
  thumbnail,
}))

function Poster() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#111111] text-[#DADADA]">
      <div className="text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-[#8FA6FF]">SHOWREEL</p>
        <p className="mt-2 font-display text-[clamp(22px,4vw,40px)] font-extrabold tracking-tight">{profile.name}</p>
      </div>
    </div>
  )
}

/** Video showreel proyek (Remotion Player) di halaman Home. */
export default function ShowreelSection() {
  const boxRef = useRef(null)
  const playerRef = useRef(null)
  const pausedByUser = useRef(false)
  const reduce = useReducedMotion()
  const [load, setLoad] = useState(false)
  const [playing, setPlaying] = useState(false)

  // 1) Muat player saat bagian ini mendekati layar.
  // 2) Jeda otomatis saat discroll keluar layar (hemat baterai), lanjut lagi saat kembali.
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setLoad(true)
        const player = playerRef.current
        if (!player) return
        if (entry.isIntersecting && !pausedByUser.current && !reduce) player.play()
        if (!entry.isIntersecting) player.pause()
      },
      { rootMargin: '200px 0px', threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduce])

  // Sinkronkan status tombol dengan player.
  const attach = useCallback((player) => {
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    playerRef.current?.removeEventListener('play', onPlay)
    playerRef.current = player
    if (!player) return
    player.addEventListener('play', onPlay)
    player.addEventListener('pause', onPause)
  }, [])

  const toggle = () => {
    const player = playerRef.current
    if (!player) return
    if (player.isPlaying()) {
      pausedByUser.current = true
      player.pause()
    } else {
      pausedByUser.current = false
      player.play()
    }
  }

  if (reelProjects.length === 0) return null

  return (
    <section aria-labelledby="showreel-title" className="pb-14 lg:pb-20">
      <Reveal>
        <SectionHeading
          id="showreel-title"
          title="Sekilas karya"
          description="Cuplikan singkat proyek-proyek yang pernah saya kerjakan."
        />
      </Reveal>
      <Reveal delay={0.1}>
        <div
          ref={boxRef}
          role="region"
          aria-label={`Video showreel ${reelProjects.length} proyek ${profile.name}`}
          className="relative aspect-video w-full overflow-hidden rounded-[14px] border border-line bg-[#111111]"
        >
          <Poster />
          {load && (
            <Suspense fallback={null}>
              <div className="absolute inset-0">
                <ShowreelPlayer ref={attach} name={profile.name} role={profile.role} projects={reelProjects} autoPlay={!reduce} />
              </div>
            </Suspense>
          )}
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Jeda video' : 'Putar video'}
            className="absolute right-2 bottom-2 grid size-8 cursor-pointer md:right-3 md:bottom-3 md:size-10 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
          >
            <Icon name={playing ? 'pause' : 'play'} className="size-3.5 md:size-4" />
          </button>
        </div>
      </Reveal>
    </section>
  )
}
