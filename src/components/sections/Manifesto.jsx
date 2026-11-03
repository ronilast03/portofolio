import { Fragment, useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { profile } from '@/data/profile'

/** Pecah kalimat menjadi kata; kata di dalam *...* ditandai miring (aksen). */
function tokenize(text) {
  const words = []
  text.split(/(\*[^*]+\*)/g).forEach((part) => {
    const italic = part.startsWith('*') && part.endsWith('*') && part.length > 2
    const clean = italic ? part.slice(1, -1) : part
    clean
      .split(/\s+/)
      .filter(Boolean)
      .forEach((w) => {
        // Tanda baca di awal (",", ".") ditempel ke kata sebelumnya agar tidak ada spasi di depannya.
        const lead = w.match(/^[,.;:!?]+/)
        if (lead && words.length) {
          words[words.length - 1].tail = (words[words.length - 1].tail || '') + lead[0]
          w = w.slice(lead[0].length)
        }
        if (w) words.push({ text: w, italic })
      })
  })
  return words
}

function Word({ word, index, total, progress, still }) {
  // Setiap kata "menyala" bergiliran sesuai posisi scroll.
  const start = index / total
  const p = useTransform(progress, [start, Math.min(1, start + 1.5 / total)], [0, 1])
  return (
    <m.span
      className={`manifesto-word ${word.italic ? 'serif-em manifesto-accent' : ''}`}
      style={{ '--p': still ? 1 : p }}
    >
      {word.text}
      {word.tail && <span className="not-italic">{word.tail}</span>}
    </m.span>
  )
}

/**
 * Section manifesto: satu kalimat prinsip kerja dengan huruf serif besar.
 * Kata-katanya berubah dari abu-abu ke warna penuh saat discroll.
 * Teks diambil dari profile.manifesto (pakai *kata* untuk huruf miring).
 */
export default function Manifesto() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })
  const text = profile.manifesto
  if (!text) return null
  const words = tokenize(text)

  return (
    <section ref={ref} aria-labelledby="manifesto-title" className="py-16 lg:py-24">
      <h2 id="manifesto-title" className="eyebrow mb-6">
        Prinsip kerja
      </h2>
      <p className="display-serif max-w-[18ch] text-[clamp(40px,6.6vw,84px)] leading-[1.04]">
        {words.map((w, i) => (
          <Fragment key={i}>
            <Word word={w} index={i} total={words.length} progress={scrollYProgress} still={reduce} />{' '}
          </Fragment>
        ))}
      </p>
      <p className="mt-8 font-mono text-[12.5px] tracking-[0.06em] text-muted uppercase">
        — {profile.name} · {profile.focusAreas?.join(' · ')}
      </p>
    </section>
  )
}
