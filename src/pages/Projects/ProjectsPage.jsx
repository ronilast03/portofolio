import { useSearchParams } from 'react-router'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/common/PageHeader'
import PageTransition from '@/components/common/PageTransition'
import EmptyState from '@/components/common/EmptyState'
import Reveal from '@/components/common/Reveal'
import { breadcrumbJsonLd } from '@/components/common/Breadcrumb'
import ProjectCard from '@/components/sections/ProjectCard'
import { projectCategories, projects } from '@/data/projects'
import { useHydrated } from '@/hooks/useHydrated'

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Projects' }]
const ALL = 'Semua'

export default function ProjectsPage() {
  const hydrated = useHydrated()
  const [params, setParams] = useSearchParams()
  const active = (hydrated && params.get('kategori')) || ALL
  const categories = [ALL, ...projectCategories()]
  const list = active === ALL ? projects : projects.filter((p) => p.category === active)

  const select = (cat) => {
    const next = new URLSearchParams(params)
    if (cat === ALL) next.delete('kategori')
    else next.set('kategori', cat)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <PageTransition>
      <Seo
        title="Proyek"
        description="Aplikasi web, alat bantu ITSM, dan website yang pernah dikerjakan Roni Lesmana."
        path="/projects"
        jsonLd={breadcrumbJsonLd(crumbs)}
      />
      <div className="container-page pb-18">
        <PageHeader title="Semua *proyek*" description="Aplikasi web, alat bantu ITSM, dan website yang pernah saya kerjakan." breadcrumb={crumbs} />

        <div role="group" aria-label="Filter kategori proyek" className="mb-7 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const count = cat === ALL ? projects.length : projects.filter((p) => p.category === cat).length
            const pressed = cat === active
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={pressed}
                onClick={() => select(cat)}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium ${
                  pressed ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:border-fg hover:text-fg'
                }`}
              >
                {cat}
                <span className="ml-1.5 font-mono text-[11px] opacity-70">{count}</span>
              </button>
            )
          })}
        </div>

        {list.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.1} className="h-full">
                <ProjectCard project={p} headingAs="h2" priority={i === 0} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada proyek">Belum ada proyek di kategori ini.</EmptyState>
        )}
      </div>
    </PageTransition>
  )
}
