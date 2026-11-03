import { useMemo, useState } from 'react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/common/PageHeader'
import PageTransition from '@/components/common/PageTransition'
import Reveal from '@/components/common/Reveal'
import { breadcrumbJsonLd } from '@/components/common/Breadcrumb'
import { changes } from '@/data/changelog'
import { formatDate } from '@/utils/date'

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Changelog' }]
const ALL = 'Semua'

const RISK_CLASS = { Rendah: 'text-ok', Sedang: 'text-warn', Tinggi: 'text-err' }
const STATUS_CLASS = {
  Implemented: 'border-ok text-ok',
  'In progress': 'border-warn text-warn',
  Scheduled: 'border-line text-muted',
}

function ChangeCard({ change }) {
  return (
    <article id={change.id} className="spotlight scroll-mt-24 rounded-[12px] border border-line bg-bg">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-line px-5 py-3">
        <span className="font-mono text-[13px] font-medium">{change.id}</span>
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-muted">{change.type}</span>
          <span
            className={`rounded-full border px-2 py-0.5 font-mono text-[11px] tracking-[0.04em] uppercase ${
              STATUS_CLASS[change.status] || STATUS_CLASS.Scheduled
            }`}
          >
            {change.status}
          </span>
        </span>
      </header>
      <div className="px-5 pt-4 pb-5">
        <h3 className="text-[18px] leading-snug font-bold">{change.title}</h3>
        <p className="mt-1.5 text-[15px] text-muted">{change.summary}</p>
        {change.items?.length > 0 && (
          <ul className="mt-3 space-y-1 text-[14.5px]">
            {change.items.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden="true" className="text-accent">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-3 font-mono text-[12px]">
          <div className="flex gap-1.5">
            <dt className="text-muted">Kategori</dt>
            <dd>{change.category}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-muted">Risiko</dt>
            <dd className={RISK_CLASS[change.risk] || ''}>{change.risk}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

/** Changelog website, ditulis seperti change request di ITSM. Data: src/data/changelog.js */
export default function ChangelogPage() {
  const [category, setCategory] = useState(ALL)

  const categories = useMemo(() => [ALL, ...new Set(changes.map((c) => c.category))], [])
  const list = category === ALL ? changes : changes.filter((c) => c.category === category)

  // Kelompokkan per tanggal (data sudah urut dari yang terbaru)
  const groups = useMemo(() => {
    const map = new Map()
    list.forEach((c) => map.set(c.date, [...(map.get(c.date) || []), c]))
    return [...map.entries()]
  }, [list])

  const implemented = changes.filter((c) => c.status === 'Implemented').length

  return (
    <PageTransition>
      <Seo
        title="Changelog"
        description="Riwayat perkembangan website Roni Lesmana, ditulis seperti change request di IT Service Management."
        path="/changelog"
        jsonLd={breadcrumbJsonLd(crumbs)}
      />
      <div className="container-page pb-18">
        <PageHeader
          title="Catatan perubahan"
          description="Setiap perubahan di website ini dicatat seperti change request di ITSM: apa yang diubah, jenisnya, risikonya, dan statusnya."
          breadcrumb={crumbs}
        />

        <div className="mb-8 grid grid-cols-2 gap-4 border-y border-line py-4 font-mono text-[12.5px] text-muted sm:grid-cols-3">
          <p>
            <span className="block text-[11px] tracking-[0.08em] uppercase">Total perubahan</span>
            <span className="text-[22px] text-fg">{changes.length}</span>
          </p>
          <p>
            <span className="block text-[11px] tracking-[0.08em] uppercase">Implemented</span>
            <span className="text-[22px] text-ok">{implemented}</span>
          </p>
          <p className="col-span-2 sm:col-span-1">
            <span className="block text-[11px] tracking-[0.08em] uppercase">Terakhir diperbarui</span>
            <span className="text-[22px] text-fg">{formatDate(changes[0]?.date)}</span>
          </p>
        </div>

        <div role="group" aria-label="Filter kategori perubahan" className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => {
            const count = c === ALL ? changes.length : changes.filter((x) => x.category === c).length
            const pressed = c === category
            return (
              <button
                key={c}
                type="button"
                aria-pressed={pressed}
                onClick={() => setCategory(c)}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium ${
                  pressed ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:border-fg hover:text-fg'
                }`}
              >
                {c}
                <span className="ml-1.5 font-mono text-[11px] opacity-70">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="grid gap-12">
          {groups.map(([date, items]) => (
            <section key={date} aria-labelledby={`date-${date}`} className="grid gap-4 lg:grid-cols-[200px_1fr] lg:gap-10">
              <h2 id={`date-${date}`} className="lg:sticky lg:top-24 lg:self-start">
                <span className="display-serif block text-[34px]">{formatDate(date)}</span>
                <span className="font-mono text-[12px] text-muted">{items.length} perubahan</span>
              </h2>
              <ol className="grid gap-4">
                {items.map((c, i) => (
                  <Reveal as="li" key={c.id} delay={Math.min(i, 3) * 0.06}>
                    <ChangeCard change={c} />
                  </Reveal>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
