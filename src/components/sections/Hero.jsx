import { Link } from 'react-router'
import { profile } from '@/data/profile'
import Icon from '@/components/common/Icon'
import CvButton from '@/components/common/CvButton'
import AvailabilityTicket from './AvailabilityTicket'

export default function Hero() {
  // "Web Developer & IT Service Management Enthusiast" -> tanda & diberi warna aksen
  const [first, ...rest] = profile.role.split('&')

  return (
    <section
      aria-labelledby="hero-title"
      className="grid items-center gap-10 pt-14 pb-12 lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:pt-22 lg:pb-18"
    >
      <div>
        {profile.availability && (
          <p className="mb-5 inline-flex items-center gap-2 text-[13px] text-muted">
            <span className={`size-2 rounded-full ${profile.available ? 'bg-ok ring-4 ring-ok/20' : 'bg-muted'}`} />
            {profile.availability}
          </p>
        )}
        <h1 id="hero-title" className="text-[clamp(42px,7vw,76px)] leading-[1.02] font-extrabold tracking-[-0.035em]">
          {profile.name}
        </h1>
        <p className="mt-4 font-display text-[clamp(18px,2.2vw,22px)] font-semibold">
          {rest.length ? (
            <>
              {first.trim()} <span className="text-accent">&amp;</span> {rest.join('&').trim()}
            </>
          ) : (
            profile.role
          )}
        </p>
        <p className="mt-4 max-w-[52ch] text-[17px] text-muted">{profile.intro}</p>
        <div className="mt-7 flex flex-wrap gap-2.5">
          <Link to="/projects" className="btn btn-primary">
            Lihat proyek <Icon name="arrowRight" />
          </Link>
          <Link to="/contact" className="btn btn-ghost">
            Hubungi saya
          </Link>
          <CvButton />
        </div>
      </div>
      <AvailabilityTicket />
    </section>
  )
}
