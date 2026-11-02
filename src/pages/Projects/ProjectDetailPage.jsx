import { Link, useParams } from 'react-router'
import Seo from '@/components/common/Seo'
import Icon from '@/components/common/Icon'
import Image from '@/components/common/Image'
import PageHeader from '@/components/common/PageHeader'
import PageTransition from '@/components/common/PageTransition'
import { breadcrumbJsonLd } from '@/components/common/Breadcrumb'
import { getProjectBySlug } from '@/data/projects'
import { site } from '@/data/site'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)
  if (!project) return <NotFoundPage />

  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Projects', to: '/projects' }, { label: project.title }]

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
        <PageHeader
          title={project.title}
          description={project.summary}
          breadcrumb={crumbs}
          eyebrow={`${project.category} · ${project.year}`}
          className="pb-7!"
        />

        <Image
          src={project.thumbnail}
          alt={`Tampilan utama ${project.title}`}
          priority
          className="aspect-16/8 rounded-[14px] border border-line"
        />

        <div className="grid gap-10 pt-10 pb-6 lg:grid-cols-[1fr_300px] lg:gap-16">
          <article className="min-w-0 space-y-8 [&_h2]:mb-2.5 [&_h2]:text-[21px] [&_h2]:font-bold [&_p]:max-w-[65ch]">
            <section>
              <h2>Masalah</h2>
              <p>{project.problem}</p>
            </section>
            <section>
              <h2>Solusi</h2>
              <p>{project.solution}</p>
            </section>
            <section>
              <h2>Fitur utama</h2>
              <ul className="max-w-[65ch] list-disc space-y-1.5 pl-5">
                {project.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>
            {project.gallery?.length > 0 && (
              <section>
                <h2>Galeri</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {project.gallery.map((g) => (
                    <figure key={g.src + g.caption}>
                      <Image src={g.src} alt={g.caption} className="aspect-16/10 rounded-[10px] border border-line" />
                      <figcaption className="mt-1.5 text-[13px] text-muted">{g.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}
          </article>

          <aside aria-label="Info proyek" className="flex flex-col gap-4 self-start rounded-[10px] border border-line p-4.5 lg:sticky lg:top-22">
            <div>
              <p className="eyebrow mb-1.5">Tech stack</p>
              <ul className="flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <li key={s} className="tag">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-1.5">Kategori</p>
              {project.category}
            </div>
            <div>
              <p className="eyebrow mb-1.5">Tahun</p>
              {project.year}
            </div>
            <div className="grid gap-2">
              {project.github && (
                <a className="btn btn-ghost" href={project.github} target="_blank" rel="noopener noreferrer">
                  Lihat di GitHub <Icon name="external" />
                </a>
              )}
              {project.demo ? (
                <a className="btn btn-primary" href={project.demo} target="_blank" rel="noopener noreferrer">
                  Live demo <Icon name="external" />
                </a>
              ) : (
                <span className="text-[13.5px] text-muted">Live demo belum tersedia.</span>
              )}
            </div>
          </aside>
        </div>

        <div className="pb-16">
          <Link to="/projects" className="link-accent">
            <Icon name="arrowLeft" /> Kembali ke semua proyek
          </Link>
        </div>
      </div>
    </PageTransition>
  )
}
