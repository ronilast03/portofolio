import { Link, useLocation } from 'react-router'
import Seo from '@/components/common/Seo'
import Icon from '@/components/common/Icon'
import PageTransition from '@/components/common/PageTransition'
import { useHydrated } from '@/hooks/useHydrated'
import { openCommandPalette } from '@/utils/commandPalette'
import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import { posts } from '@/utils/blog'

// Jeda animasi tiap baris catatan aktivitas (memakai .hero-rise di index.css)
const delay = (ms) => ({ '--d': `${ms}ms` })

// ---------- "Mungkin maksudmu": cari alamat yang paling mirip ----------
const PAGES = [
  { path: '/', title: 'Beranda' },
  { path: '/about', title: 'Tentang saya' },
  { path: '/projects', title: 'Proyek' },
  { path: '/blog', title: 'Blog' },
  { path: '/contact', title: 'Kontak' },
  { path: '/changelog', title: 'Changelog' },
  { path: '/kartu', title: 'Kartu nama digital' },
  { path: '/privacy-policy', title: 'Kebijakan privasi' },
]
const POPULAR = ['/', '/projects', '/blog']

function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = temp
    }
  }
  return row[b.length]
}
const similarity = (a, b) => (a || b ? 1 - distance(a, b) / Math.max(a.length, b.length) : 1)
const lastPart = (path) => path.split('/').filter(Boolean).pop() || ''

/** Maksimal 3 halaman yang alamatnya mirip dengan alamat yang diminta. */
function suggest(pathname) {
  const asked = decodeURIComponent(pathname).toLowerCase().replace(/\/+$/, '') || '/'
  const askedEnd = lastPart(asked)
  const candidates = [
    ...PAGES,
    ...projects.map((p) => ({ path: `/projects/${p.slug}`, title: p.title })),
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, title: p.title })),
  ]
  return candidates
    .map((c) => {
      const end = lastPart(c.path)
      const contains = askedEnd.length >= 3 && end && (end.includes(askedEnd) || askedEnd.includes(end))
      // Bandingkan bagian akhir alamat saja, supaya awalan yang sama (/projects/...) tidak dianggap mirip
      const score = Math.max(similarity(askedEnd, end), contains ? 0.75 : 0)
      return { ...c, score }
    })
    .filter((c) => c.score >= 0.5 && c.path !== asked)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

/** "06/11/2026 16:05" (waktu perangkat pengunjung) */
function stamp(date) {
  const two = (n) => String(n).padStart(2, '0')
  return `${two(date.getDate())}/${two(date.getMonth() + 1)}/${date.getFullYear()} ${two(date.getHours())}:${two(date.getMinutes())}`
}

/**
 * Halaman 404 bergaya tiket insiden service desk:
 * detail tiket, catatan aktivitas, lalu "workaround" berupa halaman yang mirip dengan alamat yang diminta.
 */
export default function NotFoundPage() {
  const { pathname } = useLocation()
  const hydrated = useHydrated()
  // Saat prerender alamatnya belum diketahui (404.html dipakai untuk semua alamat), jadi tunggu sampai di browser.
  const path = hydrated ? pathname : null
  const matches = path ? suggest(path) : []
  const fallback = !matches.length
  const links = fallback ? PAGES.filter((p) => POPULAR.includes(p.path)) : matches

  const log = [
    {
      title: 'Tiket dibuat otomatis',
      text: (
        <>
          Permintaan <code className="font-mono text-[13px] break-all text-fg">GET {path ?? 'alamat ini'}</code> mengembalikan{' '}
          <span className="font-mono text-[13px] text-fg">404 Not Found</span>.
        </>
      ),
    },
    { title: 'Triase selesai', text: 'Prioritas P4: hanya halaman ini yang terdampak, layanan lain berjalan normal.' },
    { title: 'Investigasi', text: 'Penyebab paling mungkin: salah ketik di alamat, tautan lama, atau halamannya sudah dipindahkan.' },
    { title: 'Workaround tersedia', text: 'Gunakan salah satu halaman di bawah ini sambil tiket ditutup.', ok: true },
  ]

  const fields = [
    ['Pelapor', 'Kamu (pengunjung)'],
    ['Kategori', 'Navigasi · halaman'],
    ['Prioritas', 'P4 · dampak rendah'],
    ['Ditangani', profile.name],
    ['Dibuat', hydrated ? stamp(new Date()) : 'Baru saja'],
    ['SLA respons', 'Instan (otomatis)'],
  ]

  return (
    <PageTransition>
      <Seo title="Halaman tidak ditemukan" path={pathname} noindex />
      <div className="container-page">
        <section className="py-14 lg:py-20">
          <article aria-labelledby="incident-title" className="mx-auto max-w-[760px] overflow-hidden rounded-2xl border border-line bg-bg">
            {/* Kepala tiket */}
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 sm:px-7">
              <p className="font-mono text-[12px] tracking-[0.12em] text-muted uppercase">Insiden · INC-0404</p>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="rounded-full border border-line px-2.5 py-0.5 font-mono">P4</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5">
                  <span className="queue-led size-1.5 rounded-full bg-warn text-warn" aria-hidden="true" />
                  Terbuka
                </span>
              </div>
            </header>

            <div className="px-5 pt-8 pb-7 sm:px-7">
              <p className="font-mono text-sm text-accent">404 · Not Found</p>
              <h1 id="incident-title" className="display-serif mt-2 text-[clamp(42px,6.5vw,72px)] leading-[1]">
                Halaman tidak ditemukan.
              </h1>
              <p className="mt-4 max-w-[58ch] text-muted">
                Tiket ini dibuat otomatis karena alamat yang kamu buka tidak mengarah ke halaman mana pun. Tenang, ini insiden
                kecil dan sudah ada jalan keluarnya.
              </p>

              <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 sm:grid-cols-3">
                {fields.map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">{label}</dt>
                    <dd className="mt-1 text-[14.5px] font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Catatan aktivitas */}
            <div className="border-t border-line px-5 py-7 sm:px-7">
              <h2 className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">Catatan aktivitas</h2>
              <ol className="mt-5 space-y-5">
                {log.map((item, i) => (
                  <li key={item.title} className="hero-rise relative grid grid-cols-[auto_1fr] gap-x-4" style={delay(200 + i * 260)}>
                    <span
                      aria-hidden="true"
                      className={`mt-1.5 size-2.5 rounded-full ring-4 ${item.ok ? 'bg-ok ring-ok/20' : 'bg-muted ring-line'}`}
                    />
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-baseline gap-x-2.5">
                        <span className="font-mono text-[12px] text-muted">+{String(i).padStart(2, '0')} dtk</span>
                        <span className={`font-semibold ${item.ok ? 'text-ok' : ''}`}>{item.title}</span>
                      </p>
                      <p className="mt-0.5 text-[15px] text-muted">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Workaround: halaman yang mirip, atau halaman populer */}
              <div className="hero-rise mt-7" style={delay(200 + log.length * 260)}>
                <h2 className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
                  {fallback ? 'Halaman populer' : 'Mungkin maksudmu'}
                </h2>
                <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
                  {links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="group flex items-center justify-between gap-4 px-4 py-3 no-underline transition hover:bg-surface"
                      >
                        <span className="min-w-0">
                          <span className="block font-medium text-fg">{link.title}</span>
                          <span className="block truncate font-mono text-[12.5px] text-muted">{link.path}</span>
                        </span>
                        <Icon name="arrowRight" className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tindakan */}
            <footer className="flex flex-wrap gap-2.5 border-t border-line bg-surface px-5 py-5 sm:px-7">
              <Link to="/" className="btn btn-primary">
                Eskalasi ke beranda <Icon name="arrowRight" />
              </Link>
              <button type="button" onClick={openCommandPalette} className="btn btn-ghost">
                <Icon name="search" /> Cari halaman
                <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted sm:inline">Ctrl K</kbd>
              </button>
              <Link to="/contact" className="btn btn-ghost">
                Laporkan tautan rusak
              </Link>
            </footer>
          </article>
        </section>
      </div>
    </PageTransition>
  )
}
