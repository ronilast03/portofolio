import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Seo from '@/components/common/Seo'
import Icon from '@/components/common/Icon'
import Breadcrumb, { breadcrumbJsonLd } from '@/components/common/Breadcrumb'
import PageTransition from '@/components/common/PageTransition'
import { cmdb, unlinkedCertificates } from '@/utils/cmdb'
import { formatMonth } from '@/utils/date'

const crumbs = [{ label: 'Home', to: '/' }, { label: 'About', to: '/about' }, { label: 'Peta keahlian' }]
const TYPE_LABEL = { project: 'Proyek', tech: 'Teknologi', cert: 'Sertifikat' }
const TABS = [
  { type: 'tech', list: cmdb.techs },
  { type: 'project', list: cmdb.projects },
  { type: 'cert', list: cmdb.certs },
]
const label = 'font-mono text-[11px] tracking-[0.08em] text-muted uppercase'

/** Keadaan sebuah CI terhadap CI yang sedang aktif. */
function stateOf(key, active, related) {
  if (!active) return 'idle'
  if (key === active) return 'selected'
  return related.has(key) ? 'related' : 'dimmed'
}

// ---------- Rekaman CI (panel kanan / bawah) ----------
function Chip({ children, onClick, pressed }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className="cursor-pointer rounded-full border border-line px-2.5 py-0.5 text-[13px] transition hover:border-fg"
    >
      {children}
    </button>
  )
}

function Overview({ onSelect }) {
  const top = [...cmdb.techs].sort((a, b) => cmdb.usage(b) - cmdb.usage(a)).slice(0, 4)
  return (
    <>
      <p className="flex justify-between border-b border-line px-4.5 py-3 font-mono text-[11.5px] tracking-[0.08em] text-muted uppercase">
        <span>CMDB</span>
        <span>Ringkasan</span>
      </p>
      <div className="px-4.5 py-4.5">
        <p className="text-[15px] text-muted">Pilih CI di peta untuk melihat detail dan relasinya.</p>
        <dl className="mt-4 grid grid-cols-3 gap-3">
          {TABS.map((t) => (
            <div key={t.type}>
              <dt className="font-mono text-[11px] text-muted">{TYPE_LABEL[t.type]}</dt>
              <dd className="display-serif text-[34px] leading-none">{t.list.length}</dd>
            </div>
          ))}
        </dl>
        <h2 className={`mt-5 ${label}`}>Paling sering dipakai</h2>
        <ul className="mt-2 space-y-1.5">
          {top.map((t) => (
            <li key={t.key}>
              <button
                type="button"
                onClick={() => onSelect(t.key)}
                className="flex w-full cursor-pointer items-center justify-between rounded-[10px] border border-line px-3 py-2 text-left text-[14px] font-medium transition hover:border-fg"
              >
                {t.name}
                <span className="font-mono text-[12px] text-muted">{cmdb.usage(t)} proyek</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

function ProjectLink({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="block rounded-[10px] border border-line px-3 py-2 no-underline transition hover:border-fg">
      <span className="block font-mono text-[11px] text-muted">
        {project.id} · {project.year}
      </span>
      <span className="text-[14px] font-semibold text-fg">{project.name}</span>
    </Link>
  )
}

function CiRecord({ ci, onSelect }) {
  if (!ci) return <Overview onSelect={onSelect} />
  const linked = cmdb.neighbors(ci.key)
  const projects = linked.filter((n) => n.type === 'project')
  const techs = linked.filter((n) => n.type === 'tech')
  const certs = linked.filter((n) => n.type === 'cert')
  const services = cmdb.servicesFor(ci)

  const fields =
    ci.type === 'tech'
      ? [
          ['Kelas', ci.className],
          ci.level && ['Level', ci.level],
          ['Status', <span key="s" className={ci.status === 'Aktif dipakai' ? 'text-ok' : ''}>{ci.status}</span>],
          ci.first && ci.first !== ci.last && ['Pertama', `${ci.first.year} · ${ci.first.name}`],
          ci.last && ['Terakhir', `${ci.last.year} · ${ci.last.name}`],
        ]
      : ci.type === 'project'
        ? [
            ['Kategori', ci.category],
            ['Tahun', ci.year],
            ['Status', <span key="s" className="text-ok">{ci.status}</span>],
          ]
        : [
            ['Penerbit', ci.issuer],
            ci.date && ['Terbit', formatMonth(ci.date)],
          ]

  return (
    <>
      <p className="flex justify-between gap-3 border-b border-line px-4.5 py-3 font-mono text-[11.5px] tracking-[0.08em] text-muted uppercase">
        <span>{ci.id}</span>
        <span>{TYPE_LABEL[ci.type]}</span>
      </p>
      <div className="px-4.5 pt-4.5 pb-5">
        <h2 className={`display-serif leading-[1.02] ${ci.name.length > 24 ? 'text-[30px]' : 'text-[42px]'}`}>{ci.name}</h2>
        <dl className="mt-3.5 grid grid-cols-[auto_1fr] gap-x-3.5 gap-y-1.5 text-[14px]">
          {fields.filter(Boolean).map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="pt-0.5 font-mono text-[11.5px] text-muted">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>

        {projects.length > 0 && (
          <>
            <h3 className={`mt-5 ${label}`}>Dipakai di · {projects.length}</h3>
            <ul className="mt-2 space-y-2">
              {projects.map((p) => (
                <li key={p.key}>
                  <ProjectLink project={p} />
                </li>
              ))}
            </ul>
          </>
        )}

        {techs.length > 0 && (
          <>
            <h3 className={`mt-5 ${label}`}>{ci.type === 'cert' ? 'Membuktikan' : `Teknologi · ${techs.length}`}</h3>
            <p className="mt-2 flex flex-wrap gap-1.5">
              {techs.map((t) => (
                <Chip key={t.key} onClick={() => onSelect(t.key)}>
                  {t.name}
                </Chip>
              ))}
            </p>
          </>
        )}

        {ci.type === 'tech' && cmdb.together(ci).length > 0 && (
          <>
            <h3 className={`mt-5 ${label}`}>Sering bersama</h3>
            <p className="mt-2 flex flex-wrap gap-1.5">
              {cmdb.together(ci).map(([name, n]) => (
                <Chip key={name} onClick={() => onSelect(`t:${name}`)}>
                  {name} <span className="text-muted">· {n}</span>
                </Chip>
              ))}
            </p>
          </>
        )}

        {certs.length > 0 && (
          <>
            <h3 className={`mt-5 ${label}`}>Dibuktikan oleh</h3>
            <ul className="mt-2 space-y-1.5">
              {certs.map((c) => (
                <li key={c.key}>
                  <button type="button" onClick={() => onSelect(c.key)} className="cursor-pointer text-left text-[14px] font-medium hover:underline">
                    {c.name} <span className="text-muted">· {c.issuer}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {services.length > 0 && (
          <>
            <h3 className={`mt-5 ${label}`}>Layanan terkait</h3>
            <ul className="mt-2 space-y-1">
              {services.map((s) => (
                <li key={s.id}>
                  <Link to="/layanan" className="text-[14px]">
                    <span className="font-mono text-[12.5px]">{s.id}</span> {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {ci.type === 'project' && (
          <Link to={`/projects/${ci.slug}`} className="link-accent mt-5">
            Buka studi kasus <Icon name="arrowRight" />
          </Link>
        )}
        {ci.type === 'cert' && ci.url && (
          <a href={ci.url} target="_blank" rel="noopener noreferrer" className="link-accent mt-5">
            Verifikasi sertifikat <Icon name="external" />
          </a>
        )}
      </div>
    </>
  )
}

// ---------- Peta relasi (layar lebar) ----------
const NODE = {
  idle: 'border-line hover:border-fg',
  selected: 'border-fg ring-4 ring-accent/20',
  related: 'border-fg shadow-[0_6px_16px_rgba(0,0,0,0.08)]',
  dimmed: 'border-line opacity-40',
}

function RelationMap({ active, related, onSelect, onHover }) {
  const boxRef = useRef(null)
  const nodes = useRef(new Map())
  const [paths, setPaths] = useState({ w: 0, h: 0, list: [] })
  const setNode = (key) => (el) => (el ? nodes.current.set(key, el) : nodes.current.delete(key))

  // Ukur posisi setiap CI lalu gambar garis relasinya (diulang saat ukuran berubah)
  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    const measure = () => {
      const b = box.getBoundingClientRect()
      if (!b.width) return
      const rect = (key) => {
        const r = nodes.current.get(key)?.getBoundingClientRect()
        return r && { l: r.left - b.left, r: r.right - b.left, y: r.top - b.top + r.height / 2 }
      }
      const list = cmdb.edges
        .map((e) => {
          const a = rect(e.from)
          const t = rect(e.to)
          if (!a || !t) return null
          const [x1, y1, x2, y2] = e.kind === 'uses' ? [a.r, a.y, t.l, t.y] : [t.r, t.y, a.l, a.y]
          const dx = (x2 - x1) / 2
          return { ...e, d: `M${x1} ${y1} C${x1 + dx} ${y1} ${x2 - dx} ${y2} ${x2} ${y2}` }
        })
        .filter(Boolean)
      setPaths({ w: b.width, h: b.height, list })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    document.fonts?.ready.then(measure)
    return () => ro.disconnect()
  }, [])

  const nodeProps = (ci) => ({
    ref: setNode(ci.key),
    type: 'button',
    'aria-pressed': active === ci.key,
    onClick: () => onSelect(active === ci.key ? null : ci.key),
    onMouseEnter: () => onHover(ci.key),
    onMouseLeave: () => onHover(null),
  })

  return (
    <div
      ref={boxRef}
      onClick={(e) => !e.target.closest('button') && onSelect(null)}
      className="relative rounded-2xl border border-line bg-surface/40 px-6 pt-4.5 pb-10"
    >
      <svg aria-hidden="true" width={paths.w} height={paths.h} className="pointer-events-none absolute inset-0" fill="none">
        {paths.list.map((p) => {
          const on = active && (p.from === active || p.to === active)
          return (
            <path
              key={p.from + p.to}
              d={p.d}
              strokeDasharray={p.kind === 'proves' ? '5 4' : undefined}
              strokeWidth={on ? 2 : 1.25}
              className={`transition-[stroke,opacity] duration-200 ${on ? 'stroke-fg' : active ? 'stroke-muted/15' : 'stroke-muted/35'}`}
            />
          )
        })}
      </svg>

      <div className="relative grid grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)_minmax(0,0.85fr)] gap-x-14">
        {/* Proyek */}
        <div>
          <h2 className={`mb-3.5 ${label}`}>Proyek</h2>
          <ul className="space-y-4">
            {cmdb.projects.map((p) => (
              <li key={p.key}>
                <button
                  {...nodeProps(p)}
                  className={`w-full cursor-pointer rounded-xl border bg-bg px-3.5 py-2.5 text-left transition duration-200 ${NODE[stateOf(p.key, active, related)]}`}
                >
                  <span className="block font-mono text-[11px] text-muted">
                    {p.id} · {p.year}
                  </span>
                  <span className="block text-[14px] leading-snug font-semibold">{p.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Teknologi */}
        <div>
          <h2 className={`mb-3.5 ${label}`}>Teknologi</h2>
          {cmdb.groups.map((g) => {
            const items = cmdb.techs.filter((t) => t.group === g)
            if (!items.length) return null
            return (
              <div key={g} className="mb-4">
                <h3 className="mb-1.5 font-mono text-[10.5px] text-muted uppercase">{g}</h3>
                <ul className="space-y-2">
                  {items.map((t) => {
                    const st = stateOf(t.key, active, related)
                    return (
                      <li key={t.key}>
                        <button
                          {...nodeProps(t)}
                          className={`flex h-9 w-full cursor-pointer items-center justify-between rounded-[9px] border px-3 text-[14px] font-medium transition duration-200 ${
                            st === 'selected' ? 'border-fg bg-fg text-bg ring-4 ring-accent/20' : `bg-bg ${NODE[st]}`
                          }`}
                        >
                          {t.name}
                          <span className={`font-mono text-[11px] ${st === 'selected' ? 'text-bg/70' : 'text-muted'}`}>
                            {cmdb.usage(t)}
                            <span className="sr-only"> proyek</span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Sertifikat */}
        <div>
          <h2 className={`mb-3.5 ${label}`}>Sertifikat</h2>
          <ul className="space-y-4">
            {cmdb.certs.map((c) => (
              <li key={c.key}>
                <button
                  {...nodeProps(c)}
                  className={`w-full cursor-pointer rounded-xl border border-dashed bg-bg px-3 py-2.5 text-left transition duration-200 ${NODE[stateOf(c.key, active, related)]}`}
                >
                  <span className="block font-mono text-[10.5px] text-muted">{c.issuer}</span>
                  <span className="block text-[13px] leading-snug font-semibold">{c.name}</span>
                </button>
              </li>
            ))}
          </ul>
          {unlinkedCertificates > 0 && (
            <p className="mt-4 text-[12.5px] text-muted">
              {unlinkedCertificates} sertifikat lain belum terhubung ke teknologi di peta ini.{' '}
              <Link to="/about#sertifikat">Lihat semua</Link>
            </p>
          )}
        </div>
      </div>
      <p className="absolute bottom-3.5 left-6 font-mono text-[11px] text-muted">Esc atau klik area kosong untuk melepas pilihan</p>
    </div>
  )
}

export default function CmdbPage() {
  const [selected, setSelected] = useState(null)
  const [hover, setHover] = useState(null)
  const [tab, setTab] = useState('tech')
  const active = hover ?? selected
  const related = new Set(active ? cmdb.neighbors(active).map((n) => n.key) : [])

  const select = useCallback((key) => {
    setSelected(key)
    const ci = key && cmdb.byKey.get(key)
    if (ci) setTab(ci.type)
  }, [])

  const current = TABS.find((t) => t.type === tab)

  return (
    <PageTransition>
      <Seo
        title="Peta keahlian"
        description="Peta CMDB keahlian Roni Lesmana: relasi antara proyek, teknologi, dan sertifikat."
        path="/cmdb"
        jsonLd={[breadcrumbJsonLd(crumbs)]}
      />
      <div className="container-page pb-20" onKeyDown={(e) => e.key === 'Escape' && selected && select(null)}>
        <header className="flex flex-wrap items-end justify-between gap-6 pt-12 lg:pt-[72px]">
          <div className="min-w-0 flex-[1_1_520px]">
            <Breadcrumb items={crumbs} />
            <p className="eyebrow">Peta CMDB</p>
            <h1 className="display-serif mt-1.5 text-[clamp(48px,6.6vw,76px)] leading-none">Peta keahlian</h1>
            <p className="mt-3 max-w-[60ch] text-[17px] text-muted">
              Setiap proyek, teknologi, dan sertifikat dicatat sebagai configuration item (CI). Pilih salah satu untuk melihat
              relasinya.
            </p>
          </div>
          <dl className="flex gap-6">
            <div>
              <dt className="font-mono text-[11px] text-muted">CI</dt>
              <dd className="display-serif text-[36px] leading-none">{cmdb.projects.length + cmdb.techs.length + cmdb.certs.length}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] text-muted">RELASI</dt>
              <dd className="display-serif text-[36px] leading-none">{cmdb.edges.length}</dd>
            </div>
          </dl>
        </header>

        {/* Legenda (layar lebar) */}
        <p className="mt-7 hidden items-center justify-end gap-5 font-mono text-[11.5px] text-muted lg:flex">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="w-5.5 border-t-2 border-muted/60" />
            dipakai di
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="w-5.5 border-t-2 border-dashed border-muted/60" />
            dibuktikan oleh
          </span>
        </p>

        <div className="mt-6 grid gap-5 lg:mt-3 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          {/* Layar lebar: peta */}
          <div className="hidden min-w-0 lg:block">
            <RelationMap active={active} related={related} onSelect={select} onHover={setHover} />
          </div>

          {/* HP & tablet: pilih kelas, lalu CI */}
          <div className="min-w-0 lg:hidden">
            <div role="group" aria-label="Kelas CI" className="grid grid-cols-3 rounded-xl bg-surface p-1">
              {TABS.map((t) => (
                <button
                  key={t.type}
                  type="button"
                  aria-pressed={tab === t.type}
                  onClick={() => setTab(t.type)}
                  className={`h-10 cursor-pointer rounded-[9px] text-[14px] font-medium transition ${
                    tab === t.type ? 'bg-bg font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.12)]' : 'text-muted'
                  }`}
                >
                  {TYPE_LABEL[t.type]}
                </button>
              ))}
            </div>
            <ul aria-label={`Daftar ${TYPE_LABEL[tab].toLowerCase()}`} className="-mx-4 mt-3.5 flex gap-2 overflow-x-auto px-4 pb-1">
              {current.list.map((ci) => {
                const on = selected === ci.key
                return (
                  <li key={ci.key} className="shrink-0">
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => select(on ? null : ci.key)}
                      className={`h-10 max-w-[240px] cursor-pointer truncate rounded-full border px-3.5 text-[14px] font-medium transition ${
                        on ? 'border-fg bg-fg text-bg' : 'border-line hover:border-fg'
                      }`}
                    >
                      {ci.name}
                      {ci.type === 'tech' && <span className={`ml-1.5 text-[12px] ${on ? 'text-bg/70' : 'text-muted'}`}>{cmdb.usage(ci)}</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Rekaman CI */}
          <aside aria-label="Detail CI" aria-live="polite" className="overflow-hidden rounded-2xl border border-line lg:sticky lg:top-22">
            <CiRecord ci={selected ? cmdb.byKey.get(selected) : null} onSelect={select} />
          </aside>
        </div>
      </div>
    </PageTransition>
  )
}
