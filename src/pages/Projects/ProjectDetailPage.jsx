import { Link, useParams } from 'react-router'
import Seo from '@/components/common/Seo'
import Icon from '@/components/common/Icon'
import Image from '@/components/common/Image'
import TransitionLink from '@/components/common/TransitionLink'
import { projectImageTransition } from '@/utils/viewTransition'
import Reveal from '@/components/common/Reveal'
import Breadcrumb, { breadcrumbJsonLd } from '@/components/common/Breadcrumb'
import PageTransition from '@/components/common/PageTransition'
import ChangeStages from '@/components/sections/ChangeStages'
import { adjacentProjects, getProjectBySlug } from '@/data/projects'
import { profile } from '@/data/profile'
import { site } from '@/data/site'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'

// Warna tingkat risiko
const LEVEL = {
  Tinggi: { text: 'text-err', dot: 'bg-err' },
  Sedang: { text: 'text-warn', dot: 'bg-warn' },
  Rendah: { text: 'text-ok', dot: 'bg-ok' },
}

function Level({ value, prefix = '' }) {
  const tone = LEVEL[value] ?? { text: 'text-muted', dot: 'bg-muted' }
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[12px] whitespace-nowrap ${tone.text}`}>
      <span aria-hidden="true" className={`size-1.75 rounded-full ${tone.dot}`} />
      {prefix}
      {value}
    </span>
  )
}

/** "Sipakarla - Sistem ..." -> ["Sipakarla", "Sistem ..."] */
const splitTitle = (title) => {
  const i = title.indexOf(' - ')
  return i > 0 ? [title.slice(0, i), title.slice(i + 3)] : [title, null]
}

/** Satu bagian bernomor dari dokumen change. */
function CaseSection({ id, number, title, kicker, children }) {
  return (
    <section aria-labelledby={id} className="sm:grid sm:grid-cols-[44px_minmax(0,1fr)] sm:gap-x-2">
      <span className="font-mono text-[13px] text-accent sm:pt-1" aria-hidden="true">
        {number}
      </span>
      <div className="min-w-0">
        <h2 id={id} className="font-display text-[22px] font-bold">
          {title}
        </h2>
        {kicker && <p className="mt-0.5 font-mono text-[11.5px] tracking-[0.06em] text-muted uppercase">{kicker}</p>}
        <div className="mt-3">{children}</div>
      </div>
    </section>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 size-4 text-ok" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7" />
    </svg>
  )
}
function DashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 size-4 text-muted" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M6 12h12" />
    </svg>
  )
}

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  if (!project) return <NotFoundPage />

  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Projects', to: '/projects' }, { label: project.title }]
  const [name, subtitle] = splitTitle(project.title)
  const status = project.status ?? 'Implemented'
  const implemented = status === 'Implemented'
  const { prev, next } = adjacentProjects(project.slug)

  // Bagian dokumen; yang datanya kosong disembunyikan, nomor tetap berurutan.
  const sections = [
    project.problem && {
      id: 'latar-belakang',
      title: 'Latar belakang',
      kicker: 'Alasan perubahan',
      body: <p className="max-w-[65ch]">{project.problem}</p>,
    },
    project.solution && {
      id: 'perubahan',
      title: 'Perubahan yang diusulkan',
      kicker: 'Solusi',
      body: <p className="max-w-[65ch]">{project.solution}</p>,
    },
    project.features?.length > 0 && {
      id: 'ruang-lingkup',
      title: 'Ruang lingkup',
      body: (
        <div className={`grid gap-4 ${project.outOfScope?.length ? 'md:grid-cols-2' : ''}`}>
          <div className="rounded-xl border border-line px-5 py-4.5">
            <h3 className="mb-2.5 font-mono text-[11.5px] font-normal tracking-[0.08em] text-ok uppercase">Termasuk</h3>
            <ul className="space-y-2 text-[15px]">
              {project.features.map((f) => (
                <li key={f} className="grid grid-cols-[18px_1fr] gap-2">
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {project.outOfScope?.length > 0 && (
            <div className="rounded-xl border border-line bg-surface px-5 py-4.5">
              <h3 className="mb-2.5 font-mono text-[11.5px] font-normal tracking-[0.08em] text-muted uppercase">Tidak termasuk</h3>
              <ul className="space-y-2 text-[15px] text-muted">
                {project.outOfScope.map((f) => (
                  <li key={f} className="grid grid-cols-[18px_1fr] gap-2">
                    <DashIcon />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    project.risks?.length > 0 && {
      id: 'risiko',
      title: 'Penilaian risiko',
      body: (
        <>
          {/* Layar lebar: tabel */}
          <div className="hidden overflow-x-auto rounded-xl border border-line sm:block">
            <table className="w-full border-collapse text-left text-[14.5px]">
              <thead className="bg-surface font-mono text-[11.5px] tracking-[0.06em] text-muted uppercase">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-normal">Risiko</th>
                  <th scope="col" className="px-3 py-2.5 font-normal">Tingkat</th>
                  <th scope="col" className="px-4 py-2.5 font-normal">Mitigasi</th>
                </tr>
              </thead>
              <tbody>
                {project.risks.map((r) => (
                  <tr key={r.risk} className="border-t border-line align-top">
                    <td className="px-4 py-3 font-medium">{r.risk}</td>
                    <td className="px-3 py-3">
                      <Level value={r.level} />
                    </td>
                    <td className="px-4 py-3 text-muted">{r.mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* HP: kartu */}
          <ul className="space-y-2.5 sm:hidden">
            {project.risks.map((r) => (
              <li key={r.risk} className="rounded-xl border border-line px-3.5 py-3">
                <p className="flex items-start justify-between gap-3">
                  <span className="font-semibold">{r.risk}</span>
                  <Level value={r.level} />
                </p>
                <p className="mt-1 text-[14.5px] text-muted">{r.mitigation}</p>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    project.plan?.length > 0 && {
      id: 'implementasi',
      title: 'Rencana implementasi',
      body: (
        <ol className="ml-1.5 border-l-[1.5px] border-line">
          {project.plan.map((p, i) => {
            const last = i === project.plan.length - 1
            return (
              <li key={p.step} className={`relative pl-5.5 ${last ? '' : 'pb-4'}`}>
                <span
                  aria-hidden="true"
                  className={`absolute top-1.5 -left-[7px] size-3 rounded-full border-2 ${last && implemented ? 'border-ok bg-ok' : 'border-fg bg-bg'}`}
                />
                <strong className="font-semibold">{p.step}</strong>
                {p.detail && <span className="text-muted"> · {p.detail}</span>}
              </li>
            )
          })}
        </ol>
      ),
    },
    project.rollback && {
      id: 'rollback',
      title: 'Rencana rollback',
      body: <p className="max-w-[65ch]">{project.rollback}</p>,
    },
    (project.review?.worked || project.review?.learned) && {
      id: 'review',
      title: 'Review pasca-implementasi',
      body: (
        <div className="grid gap-4 sm:grid-cols-2">
          {project.review.worked && (
            <div className="border-t-2 border-ok pt-3">
              <h3 className="font-mono text-[11.5px] font-normal tracking-[0.08em] text-ok uppercase">Yang berhasil</h3>
              <p className="mt-2 text-[15px]">{project.review.worked}</p>
            </div>
          )}
          {project.review.learned && (
            <div className="border-t-2 border-fg pt-3">
              <h3 className="font-mono text-[11.5px] font-normal tracking-[0.08em] text-muted uppercase">Yang dipelajari</h3>
              <p className="mt-2 text-[15px]">{project.review.learned}</p>
            </div>
          )}
        </div>
      ),
    },
    project.gallery?.length > 0 && {
      id: 'lampiran',
      title: 'Lampiran',
      body: (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {project.gallery.map((g, i) => (
            <Reveal as="figure" key={g.src + g.caption} delay={(i % 3) * 0.08} className="group">
              <Image
                src={g.src}
                alt={g.caption}
                sizes="(min-width: 1024px) 250px, 50vw"
                className="aspect-16/10 rounded-[10px] border border-line"
                imgClassName="group-hover:scale-103"
              />
              <figcaption className="mt-2 text-[13.5px]">
                <span className="block font-mono text-[11px] text-muted">LAMPIRAN-{String(i + 1).padStart(2, '0')}</span>
                {g.caption}
              </figcaption>
            </Reveal>
          ))}
        </div>
      ),
    },
  ].filter(Boolean)

  const form = [
    project.changeType && ['Tipe', project.changeType],
    ['Kategori', project.category],
    project.risk && ['Risiko', <Level key="risk" value={project.risk} />],
    ['Pelaksana', profile.name],
    ['Tahun', project.year],
    ['Status', <span key="status" className={implemented ? 'text-ok' : 'text-warn'}>{status}</span>],
  ].filter(Boolean)

  return (
    <PageTransition>
      <Seo
        title={project.title}
        description={project.summary}
        path={`/projects/${project.slug}`}
        image={project.thumbnail?.endsWith('.svg') ? undefined : project.thumbnail}
        jsonLd={[
          breadcrumbJsonLd(crumbs),
          {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: project.summary,
            url: `${site.url}/projects/${project.slug}`,
            dateCreated: project.year,
            keywords: project.stack.join(', '),
            author: { '@type': 'Person', name: site.name },
          },
        ]}
      />
      <div className="container-page">
        {/* Kepala dokumen change */}
        <header className="pt-12 lg:pt-[72px]">
          <Breadcrumb items={crumbs} />
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-[12.5px]">
            {project.changeId && <span className="tracking-[0.08em] text-muted">{project.changeId}</span>}
            {project.changeType && <span className="rounded-full border border-line px-2.5 py-0.5">{project.changeType} change</span>}
            <span className="rounded-full border border-line px-2.5 py-0.5">
              {project.category} · {project.year}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 ${implemented ? 'bg-ok/10 text-ok' : 'bg-warn/10 text-warn'}`}>
              <span aria-hidden="true" className={`size-1.75 rounded-full ${implemented ? 'bg-ok' : 'bg-warn'}`} />
              {status}
            </span>
          </div>
          <h1 className="display-serif mt-3.5 text-[clamp(48px,7vw,80px)] leading-[0.98]">
            {name}
            {subtitle && <span className="sr-only"> - {subtitle}</span>}
          </h1>
          {subtitle && (
            <p aria-hidden="true" className="mt-2.5 font-display text-[clamp(18px,2vw,21px)] font-semibold">
              {subtitle}
            </p>
          )}
          <p className="mt-3 max-w-[62ch] text-[17px] text-muted">{project.summary}</p>
        </header>

        <ChangeStages project={project} />

        <Image
          src={project.thumbnail}
          alt={`Tampilan utama ${project.title}`}
          priority
          sizes="(min-width: 1200px) 1140px, 100vw"
          className="mt-7 aspect-16/10 rounded-[14px] border border-line md:aspect-16/8"
          wrapperStyle={{ viewTransitionName: projectImageTransition(project.slug) }}
        />

        <div className="grid gap-10 pt-8 pb-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 lg:pt-12">
          {/* Formulir change: di HP tampil sebelum isi, di layar lebar di kolom kanan */}
          <aside
            aria-label="Formulir change"
            className="self-start overflow-hidden rounded-[14px] border border-line lg:sticky lg:top-22 lg:col-start-2 lg:row-start-1"
          >
            <p className="flex justify-between gap-3 border-b border-line px-4.5 py-3 font-mono text-[11.5px] tracking-[0.1em] text-muted uppercase">
              <span>Formulir change</span>
              {project.changeId && <span>{project.changeId}</span>}
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 px-4.5 py-4 text-[14.5px]">
              {form.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="pt-0.5 font-mono text-[11.5px] text-muted">{label}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="px-4.5 pb-4">
              <p className="mb-2 font-mono text-[11.5px] text-muted">Tech stack</p>
              <ul className="flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <li key={s} className="tag">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-2.5 border-t border-dashed border-line bg-surface px-4.5 py-4">
              {project.github && (
                <a className="btn btn-ghost bg-bg" href={project.github} target="_blank" rel="noopener noreferrer">
                  Lihat di GitHub <Icon name="external" />
                </a>
              )}
              {project.demo ? (
                <a className="btn btn-ghost bg-bg" href={project.demo} target="_blank" rel="noopener noreferrer">
                  Live demo <Icon name="external" />
                </a>
              ) : (
                <p className="text-[13.5px] text-muted">Live demo belum tersedia.</p>
              )}
              <Link to="/contact" className="btn btn-primary">
                Ajukan proyek serupa <Icon name="arrowRight" />
              </Link>
            </div>
          </aside>

          <article className="min-w-0 space-y-11 lg:col-start-1 lg:row-start-1">
            {sections.map((s, i) => (
              <CaseSection key={s.id} id={s.id} number={String(i + 1).padStart(2, '0')} title={s.title} kicker={s.kicker}>
                {s.body}
              </CaseSection>
            ))}
          </article>
        </div>

        {/* Navigasi antarproyek, urut nomor change */}
        <nav aria-label="Proyek lain" className="mt-6 grid gap-4 border-t border-line pt-7 sm:grid-cols-2">
          {prev ? (
            <TransitionLink to={`/projects/${prev.slug}`} className="group rounded-xl border border-line px-4.5 py-4 no-underline transition hover:border-fg">
              <span className="block font-mono text-[11.5px] text-muted">← {prev.changeId ?? 'Sebelumnya'}</span>
              <span className="mt-1 block font-semibold text-fg">{prev.title}</span>
            </TransitionLink>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <TransitionLink
              to={`/projects/${next.slug}`}
              className="group rounded-xl border border-line px-4.5 py-4 no-underline transition hover:border-fg sm:text-right"
            >
              <span className="block font-mono text-[11.5px] text-muted">{next.changeId ?? 'Berikutnya'} →</span>
              <span className="mt-1 block font-semibold text-fg">{next.title}</span>
            </TransitionLink>
          )}
        </nav>

        <div className="pt-8 pb-16">
          <TransitionLink to="/projects" className="link-accent">
            <Icon name="arrowLeft" /> Kembali ke semua proyek
          </TransitionLink>
        </div>
      </div>
    </PageTransition>
  )
}
