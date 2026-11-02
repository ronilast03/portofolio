import { Link } from 'react-router'
import { navigation } from '@/data/site'
import { profile, socials } from '@/data/profile'
import { Logo } from './Navbar'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-6 border-t border-line">
      <div className="container-page grid gap-7 py-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-[36ch] text-[14.5px] text-muted">
            Web developer dan pembelajar IT Service Management. Menulis catatan belajar di blog ini.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-mono text-[13px] font-medium tracking-[0.06em] text-muted uppercase">Halaman</h2>
          <ul className="grid gap-2 text-[14.5px]">
            {navigation.slice(1).map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="no-underline hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-mono text-[13px] font-medium tracking-[0.06em] text-muted uppercase">Sosial</h2>
          <ul className="grid gap-2 text-[14.5px]">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-accent">
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
          <Link to="/privacy-policy" className="text-muted">
            Kebijakan Privasi
          </Link>
        </div>
      </div>
    </footer>
  )
}
