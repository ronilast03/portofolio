import { Link } from 'react-router'
import { navigation } from '@/data/site'
import { profile, socials } from '@/data/profile'
import { Logo } from './Navbar'
import { latestChange } from '@/data/changelog'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-6 border-t border-line">
      <div className="container-page grid gap-7 py-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-[36ch] text-[14.5px] text-muted">
            Web developer dan pembelajar IT Service Management.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-mono text-[13px] font-medium tracking-[0.06em] text-muted uppercase">Halaman</h2>
          <ul className="grid gap-0.5 text-[14.5px]">
            {navigation.slice(1).map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="inline-block py-1 no-underline hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-mono text-[13px] font-medium tracking-[0.06em] text-muted uppercase">Sosial</h2>
          <ul className="grid gap-0.5 text-[14.5px]">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-block py-1 no-underline hover:text-accent">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-wrap justify-between gap-3 py-[18px] text-[13px] text-muted">
          <span>
            © {year} {profile.name}. Hak cipta dilindungi.
          </span>
          <span className="flex flex-wrap gap-x-5 gap-y-1">
            {latestChange && (
              <Link to="/changelog" className="inline-block py-0.5 font-mono text-[12px] text-muted">
                Changelog · {latestChange.id}
              </Link>
            )}
            <Link to="/privacy-policy" className="inline-block py-0.5 text-muted">
              Kebijakan Privasi
            </Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
