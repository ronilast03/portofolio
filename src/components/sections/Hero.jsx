import { Link } from 'react-router'
import { profile } from '@/data/profile'
import Icon from '@/components/common/Icon'
import CvButton from '@/components/common/CvButton'
import AvailabilityTicket from './AvailabilityTicket'

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
      <div>
        {profile.availability && (
          <p className="hero-rise mb-5 inline-flex items-center gap-2 text-[13px] text-muted">
            <span className={`size-2 rounded-full ${profile.available ? 'bg-ok ring-4 ring-ok/20' : 'bg-muted'}`} />
            {profile.availability}
          </p>
        )}
        <h1
          id="hero-title"
          aria-label={profile.name}
          className="text-[clamp(42px,7vw,76px)] leading-[1.02] font-extrabold tracking-[-0.035em]"
        >
          {words.map((word, i) => (
            <span key={word + i} aria-hidden="true">
              <span className="hero-word-mask">
                <span className="hero-word" style={delay(80 + i * 110)}>
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
        <AvailabilityTicket />
      </div>
    </section>
  )
}
