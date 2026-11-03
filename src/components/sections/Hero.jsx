import { Link } from 'react-router'
import { profile } from '@/data/profile'
import Icon from '@/components/common/Icon'
import CvButton from '@/components/common/CvButton'
import AvailabilityTicket from './AvailabilityTicket'
import { latestChange } from '@/data/changelog'

// Jeda animasi pembuka hero (ms). Lihat .hero-rise & .hero-word di index.css.
const delay = (ms) => ({ '--d': `${ms}ms` })

export default function Hero() {
  // "Web Developer & IT Service Management Enthusiast" -> tanda & diberi warna aksen
  const [first, ...rest] = profile.role.split('&')
  const words = profile.name.split(' ')

  return (
    <section
      aria-labelledby="hero-title"
      className="grid items-center gap-10 pt-14 pb-12 lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:pt-22 lg:pb-18"
    >
      <div className="min-w-0">
        {profile.availability && (
          <p className="hero-rise mb-5 inline-flex items-center gap-2 text-[13px] text-muted">
            <span className={`size-2 rounded-full ${profile.available ? 'bg-ok ring-4 ring-ok/20' : 'bg-muted'}`} />
            {profile.availability}
          </p>
        )}
        <h1
          id="hero-title"
          aria-label={profile.name}
          className="display-serif text-[clamp(60px,10.5vw,124px)] leading-[0.95]"
        >
          {/* Kata terakhir nama dibuat miring, gaya editorial */}
          {words.map((word, i) => (
            <span key={word + i} aria-hidden="true">
              <span className="hero-word-mask">
                <span
                  className={`hero-word ${i === words.length - 1 && words.length > 1 ? 'serif-em' : ''}`}
                  style={delay(80 + i * 110)}
                >
                  {word}
                </span>
              </span>
              {i < words.length - 1 && ' '}
            </span>
          ))}
        </h1>
        <p className="hero-rise mt-4 font-display text-[clamp(18px,2.2vw,22px)] font-semibold" style={delay(320)}>
          {rest.length ? (
            <>
              {first.trim()} <span className="text-accent">&amp;</span> {rest.join('&').trim()}
            </>
          ) : (
            profile.role
          )}
        </p>
        <p className="hero-rise mt-4 max-w-[52ch] text-[17px] text-muted" style={delay(420)}>
          {profile.intro}
        </p>
        <div className="hero-rise mt-7 flex flex-wrap gap-2.5" style={delay(520)}>
          <Link to="/projects" className="btn btn-primary">
            Lihat proyek <Icon name="arrowRight" />
          </Link>
          <Link to="/contact" className="btn btn-ghost">
            Hubungi saya
          </Link>
          <CvButton />
        </div>
      </div>
      <div className="hero-rise min-w-0" style={delay(450)}>
        {/* Perubahan terbaru dari src/data/changelog.js: berganti otomatis saat ada CHG baru. */}
        {latestChange && (
          <Link
            to={`/changelog#${latestChange.id}`}
            className="group mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-bg/80 py-1 pr-3 pl-1 text-[12.5px] text-muted no-underline backdrop-blur-sm transition hover:border-fg hover:text-fg"
          >
            <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10.5px] font-semibold tracking-[0.04em] text-accent-fg uppercase">
              Baru
            </span>
            <span className="shrink-0 font-mono text-[11.5px] whitespace-nowrap">{latestChange.id}</span>
            <span className="min-w-0 truncate">{latestChange.title}</span>
            <Icon name="arrowRight" className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
        <AvailabilityTicket />
      </div>
    </section>
  )
}
