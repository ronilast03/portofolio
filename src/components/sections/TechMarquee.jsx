import { useState } from 'react'
import Icon from '@/components/common/Icon'
import { techStack } from '@/data/skills'

function Row({ items, hidden = false }) {
  return (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {items.map((name, i) => (
        <li key={name} className="flex shrink-0 items-center">
          <span className={`display-serif text-[clamp(30px,4.4vw,54px)] ${i % 2 ? 'text-muted' : ''}`}>{name}</span>
          <span aria-hidden="true" className="mx-[clamp(16px,2.4vw,32px)] font-mono text-[clamp(18px,2.2vw,28px)] text-accent">
            /
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Pita tech stack yang bergerak pelan (gaya editorial).
 * - Isi diambil dari src/data/skills.js (techStack).
 * - Berhenti saat disentuh kursor/fokus, dan ada tombol jeda (WCAG 2.2.2).
 * - Untuk "kurangi gerakan", pita diam dan bisa digeser manual.
 */
export default function TechMarquee() {
  const [paused, setPaused] = useState(false)
  if (!techStack.length) return null

  return (
    <section aria-label="Tech stack" className={`marquee relative border-y border-line ${paused ? 'is-paused' : ''}`}>
      <div className="marquee-viewport">
        <div className="marquee-track py-5 md:py-7">
          <Row items={techStack} />
          <Row items={techStack} hidden />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label="Jeda pita tech stack"
        className="marquee-toggle absolute top-1/2 right-3 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-line bg-bg text-muted hover:text-fg"
      >
        <Icon name={paused ? 'play' : 'pause'} className="size-3.5" />
      </button>
    </section>
  )
}
