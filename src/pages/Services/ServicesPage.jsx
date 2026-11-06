import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Seo from '@/components/common/Seo'
import Icon from '@/components/common/Icon'
import Breadcrumb, { breadcrumbJsonLd } from '@/components/common/Breadcrumb'
import PageTransition from '@/components/common/PageTransition'
import TicketDialog from '@/components/sections/TicketDialog'
import { services, serviceFlow, ticketPrefill } from '@/data/services'
import { getProjectBySlug } from '@/data/projects'
import { profile } from '@/data/profile'
import { normalize } from '@/utils/commandPalette'

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Layanan' }]
const ALL = 'Semua'
const FILTERS = [ALL, ...new Set(services.map((s) => s.filter))]
const requestHref = (service) => `/contact?layanan=${service.slug}`

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-[3px] size-4 text-ok" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7" />
    </svg>
  )
}

/** Tautan bukti pengerjaan (nomor change proyek). */
function ProofLinks({ service, className = '' }) {
  const items = service.proof.map(getProjectBySlug).filter(Boolean)
  if (!items.length) return null
  return (
    <span className={`flex flex-wrap gap-x-2 gap-y-0.5 ${className}`}>
      {items.map((p) => (
        <Link key={p.slug} to={`/projects/${p.slug}`} className="font-mono text-[13px] text-accent">
          {p.changeId ?? p.title}
        </Link>
      ))}
    </span>
  )
}

/** Panel detail layanan yang muncul dari kanan (elemen <dialog> bawaan browser). */
function ServiceDrawer({ service, onClose, onRequest }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (service && !dialog.open) {
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!service && dialog.open) dialog.close()
  }, [service])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const handleClose = () => {
      // Jangan buka kunci scroll jika form tiket langsung dibuka setelah panel ini ditutup
      if (!document.querySelector('dialog[open]')) document.documentElement.style.overflow = ''
      onClose()
    }
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  const proof = service?.proof.map(getProjectBySlug).filter(Boolean) ?? []
  const prefill = ticketPrefill(service)

  return (
    <dialog
      ref={ref}
      aria-labelledby="service-drawer-title"
      onClick={(e) => e.target === ref.current && ref.current.close()}
      className="service-drawer m-0 ml-auto h-dvh max-h-dvh w-[min(540px,100vw)] max-w-none border-l border-line bg-bg p-0 text-fg shadow-2xl backdrop:bg-black/45 backdrop:backdrop-blur-[2px]"
    >
      {service && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-3.5">
            <span className="font-mono text-[12px] tracking-[0.1em] text-muted uppercase">
              {service.id} · {service.filter}
            </span>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Tutup"
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-line hover:bg-surface"
            >
              <Icon name="close" className="size-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pt-6 pb-8">
            <span className="grid size-12 place-items-center rounded-xl bg-surface">
              <Icon name={service.icon} className="size-6" />
            </span>
            <h2 id="service-drawer-title" className="display-serif mt-3.5 text-[44px] leading-[1.02]">
              {service.name}
            </h2>
            <p className="mt-2 text-muted">
              {service.summary} {service.description}
            </p>

            <dl className="mt-5 grid grid-cols-3 gap-3 rounded-xl border border-line px-4 py-3.5 text-[14px]">
              <div>
                <dt className="font-mono text-[11px] text-muted">ESTIMASI</dt>
                <dd className="mt-0.5 font-medium">{service.estimate}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] text-muted">RESPONS</dt>
                <dd className="mt-0.5 font-medium">{profile.responseTime}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] text-muted">TIPE</dt>
                <dd className="mt-0.5 font-medium">{service.changeType} change</dd>
              </div>
            </dl>

            <h3 className="mt-6 font-mono text-[11.5px] font-medium tracking-[0.08em] text-ok uppercase">Yang kamu dapat</h3>
            <ul className="mt-2.5 grid gap-x-4 gap-y-2 text-[14.5px] sm:grid-cols-2">
              {service.includes.map((item) => (
                <li key={item} className="grid grid-cols-[18px_1fr] gap-2">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>

            {service.prepare?.length > 0 && (
              <>
                <h3 className="mt-6 font-mono text-[11.5px] font-medium tracking-[0.08em] text-muted uppercase">Yang perlu kamu siapkan</h3>
                <ul className="mt-2.5 list-disc space-y-1 pl-5 text-[14.5px] text-muted">
                  {service.prepare.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {service.tools?.length > 0 && (
              <>
                <h3 className="mt-6 font-mono text-[11.5px] font-medium tracking-[0.08em] text-muted uppercase">Tools</h3>
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {service.tools.map((t) => (
                    <li key={t} className="tag">
                      {t}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {proof.length > 0 && (
              <>
                <h3 className="mt-6 font-mono text-[11.5px] font-medium tracking-[0.08em] text-muted uppercase">Bukti pengerjaan</h3>
                <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                  {proof.map((p) => (
                    <Link
                      key={p.slug}
                      to={`/projects/${p.slug}`}
                      className="rounded-xl border border-line px-3.5 py-3 no-underline transition hover:border-fg"
                    >
                      <span className="block font-mono text-[11px] text-muted">{p.changeId}</span>
                      <span className="mt-0.5 block text-[14.5px] leading-snug font-semibold text-fg">{p.title}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="border-t border-dashed border-line bg-surface px-6 pt-4 pb-5">
            <p className="font-mono text-[11.5px] text-muted">Form tiket akan terisi otomatis:</p>
            <p className="mt-1.5 flex flex-wrap gap-1.5 text-[13px]">
              <span className="rounded-full bg-fg px-2.5 py-px text-bg">{prefill.category}</span>
              <span className="rounded-full border border-line bg-bg px-2.5 py-px font-mono text-[12px]">{prefill.subject}</span>
            </p>
            <Link
              to={requestHref(service)}
              onClick={(e) => {
                e.preventDefault()
                onRequest(service)
              }}
              aria-haspopup="dialog"
              className="btn btn-primary mt-3 h-12 w-full"
            >
              Ajukan permintaan <Icon name="arrowRight" />
            </Link>
          </div>
        </div>
      )}
    </dialog>
  )
}

export default function ServicesPage() {
  const [filter, setFilter] = useState(ALL)
  const [query, setQuery] = useState('')
  const [detail, setDetail] = useState(null)
  const [ticket, setTicket] = useState({ open: false, initial: undefined })
  const closeDetail = useCallback(() => setDetail(null), [])
  const closeTicket = useCallback(() => setTicket((t) => ({ ...t, open: false })), [])

  const q = normalize(query.trim())
  const list = services.filter(
    (s) =>
      (filter === ALL || s.filter === filter) &&
      (!q || normalize(`${s.id} ${s.name} ${s.summary} ${s.includes.join(' ')}`).includes(q)),
  )

  /** Buka form tiket; dari panel detail, panel ditutup dulu. */
  const request = (service) => {
    setDetail(null)
    setTicket({ open: true, initial: ticketPrefill(service) })
  }

  return (
    <PageTransition>
      <Seo
        title="Layanan"
        description="Katalog layanan Roni Lesmana: website company profile, aplikasi web kustom, aplikasi kasir UMKM, dan setup service desk sederhana."
        path="/layanan"
        jsonLd={[breadcrumbJsonLd(crumbs)]}
      />
      <div className="container-page pb-20">
        {/* Kepala */}
        <header className="flex flex-wrap items-end justify-between gap-8 pt-12 lg:pt-[72px]">
          <div className="min-w-0 flex-[1_1_520px]">
            <Breadcrumb items={crumbs} />
            <p className="eyebrow">Katalog layanan</p>
            <h1 className="display-serif mt-1.5 text-[clamp(52px,7vw,80px)] leading-none">Layanan</h1>
            <p className="mt-3 max-w-[56ch] text-[17px] text-muted">
              Pilih layanan yang kamu butuhkan, ajukan permintaan, dan prosesnya berjalan seperti tiket service desk: jelas
              tahapannya, jelas target responsnya.
            </p>
          </div>
          <dl className="grid shrink-0 grid-cols-[auto_auto] gap-x-5 gap-y-1.5 rounded-[14px] border border-line px-4.5 py-3.5 text-[14px]">
            <dt className="pt-0.5 font-mono text-[11.5px] text-muted">Status</dt>
            <dd className={`flex items-center gap-1.5 font-medium ${profile.available ? 'text-ok' : 'text-warn'}`}>
              <span aria-hidden="true" className={`size-1.75 rounded-full ${profile.available ? 'bg-ok' : 'bg-warn'}`} />
              {profile.available ? 'Menerima permintaan' : 'Antrean sedang penuh'}
            </dd>
            <dt className="pt-0.5 font-mono text-[11.5px] text-muted">Respons</dt>
            <dd className="font-medium">{profile.responseTime}</dd>
            <dt className="pt-0.5 font-mono text-[11.5px] text-muted">Lokasi</dt>
            <dd className="font-medium">
              {profile.location}
              {profile.remote && ' · remote'}
            </dd>
          </dl>
        </header>

        {/* Filter + cari */}
        <div className="mt-9 flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label="Filter kategori" className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {FILTERS.map((f) => {
              const count = f === ALL ? services.length : services.filter((s) => s.filter === f).length
              const active = filter === f
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f)}
                  className={`h-9 shrink-0 cursor-pointer rounded-full border px-3.5 text-[14px] font-medium transition ${
                    active ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:border-fg hover:text-fg'
                  }`}
                >
                  {f} <span className="text-[12px] opacity-70">{count}</span>
                </button>
              )
            })}
          </div>
          <label className="flex h-10 w-full items-center gap-2 rounded-[10px] border border-line px-3 text-muted focus-within:border-fg sm:w-[280px]">
            <Icon name="search" className="size-4 shrink-0" />
            <span className="sr-only">Cari layanan</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari layanan…"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-fg outline-none"
            />
          </label>
        </div>

        {/* Kartu layanan */}
        <p className="sr-only" aria-live="polite">
          {list.length} layanan ditampilkan
        </p>
        {list.length ? (
          <ul className="mt-5 grid gap-5 md:grid-cols-2">
            {list.map((s) => (
              <li key={s.id}>
                <article aria-labelledby={`${s.slug}-title`} className="flex h-full flex-col rounded-2xl border border-line">
                  <div className="flex items-center justify-between gap-3 px-5.5 pt-5.5">
                    <span className="grid size-11 place-items-center rounded-xl bg-surface">
                      <Icon name={s.icon} className="size-5.5" />
                    </span>
                    <span className="font-mono text-[12px] text-muted">
                      {s.id} · {s.filter}
                    </span>
                  </div>
                  <div className="flex-1 px-5.5 pt-4">
                    <h2 id={`${s.slug}-title`} className="font-display text-[21px] font-bold">
                      {s.name}
                    </h2>
                    <p className="mt-1.5 text-[15px] text-muted">{s.summary}</p>
                    <ul className="mt-3.5 space-y-1.5 text-[14.5px]">
                      {s.includes.slice(0, 3).map((item) => (
                        <li key={item} className="grid grid-cols-[18px_1fr] gap-2">
                          <Check />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <dl className="mx-5.5 mt-4.5 grid grid-cols-2 gap-3 border-t border-line pt-3.5 text-[14px]">
                    <div>
                      <dt className="font-mono text-[11px] text-muted">ESTIMASI</dt>
                      <dd className="mt-0.5 font-medium">{s.estimate}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[11px] text-muted">{s.proof.length ? 'BUKTI' : 'TOOLS'}</dt>
                      <dd className="mt-0.5 font-medium">{s.proof.length ? <ProofLinks service={s} /> : s.tools?.join(', ')}</dd>
                    </div>
                  </dl>
                  <div className="mt-4.5 flex items-center justify-between gap-3 rounded-b-2xl border-t border-dashed border-line bg-surface px-5.5 py-3.5">
                    <button
                      type="button"
                      onClick={() => setDetail(s)}
                      aria-haspopup="dialog"
                      className="cursor-pointer py-2.5 text-[14px] font-semibold hover:underline hover:underline-offset-4"
                    >
                      Lihat detail<span className="sr-only"> {s.name}</span>
                    </button>
                    <Link
                      to={requestHref(s)}
                      onClick={(e) => {
                        e.preventDefault()
                        request(s)
                      }}
                      aria-haspopup="dialog"
                      className="btn btn-primary h-10 px-4 text-[14px]"
                    >
                      Ajukan<span className="sr-only"> {s.name}</span> <Icon name="arrowRight" />
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 rounded-2xl border border-dashed border-line px-6 py-10 text-center text-muted">
            Tidak ada layanan yang cocok dengan “{query}”.{' '}
            <button type="button" onClick={() => request(null)} className="cursor-pointer font-semibold text-fg underline underline-offset-4">
              Buat permintaan umum
            </button>
          </p>
        )}

        {/* Alur layanan */}
        <section aria-labelledby="alur-title" className="mt-16">
          <p className="eyebrow">Alur layanan</p>
          <h2 id="alur-title" className="display-serif mt-1.5 text-[clamp(34px,4.4vw,44px)] leading-[1.05]">
            Dari permintaan sampai serah terima
          </h2>
          <ol className="mt-6 grid overflow-hidden rounded-[14px] border border-line md:grid-cols-5">
            {serviceFlow.map((step, i) => {
              const last = i === serviceFlow.length - 1
              return (
                <li
                  key={step.code}
                  className={`px-4.5 pt-4.5 pb-5 ${last ? 'bg-ok/8' : 'border-b border-line md:border-r md:border-b-0'}`}
                >
                  <span className={`font-mono text-[12px] ${last ? 'text-ok' : 'text-accent'}`}>
                    {String(i + 1).padStart(2, '0')} · {step.code}
                  </span>
                  <p className="mt-1.5 font-semibold">{step.title}</p>
                  <p className="mt-1 text-[14px] text-muted">{step.text}</p>
                </li>
              )
            })}
          </ol>
        </section>

        {/* Permintaan lain */}
        <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line px-7 py-6">
          <div>
            <h2 className="font-display text-[20px] font-bold">Kebutuhanmu tidak ada di daftar?</h2>
            <p className="mt-1 text-muted">Ajukan permintaan umum, nanti kita cari solusi yang paling pas.</p>
          </div>
          <Link
            to="/contact"
            onClick={(e) => {
              e.preventDefault()
              request(null)
            }}
            aria-haspopup="dialog"
            className="btn btn-ghost"
          >
            Buat permintaan umum <Icon name="arrowRight" />
          </Link>
        </section>
      </div>

      <ServiceDrawer service={detail} onClose={closeDetail} onRequest={request} />
      <TicketDialog open={ticket.open} onClose={closeTicket} initial={ticket.initial} />
    </PageTransition>
  )
}
