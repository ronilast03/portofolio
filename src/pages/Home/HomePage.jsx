import { Link } from 'react-router'
import Seo from '@/components/common/Seo'
import Icon from '@/components/common/Icon'
import PageTransition from '@/components/common/PageTransition'
import Reveal from '@/components/common/Reveal'
import Hero from '@/components/sections/Hero'
import SectionHeading from '@/components/sections/SectionHeading'
import ProjectCard from '@/components/sections/ProjectCard'
import { ArticleRow } from '@/components/sections/ArticleCard'
import ContactCta from '@/components/sections/ContactCta'
import ShowreelSection from '@/components/sections/ShowreelSection'
import { profile, socials } from '@/data/profile'
import { site } from '@/data/site'
import { featuredProjects } from '@/data/projects'
import { latestPosts } from '@/utils/blog'

export default function HomePage() {
  const projects = featuredProjects(3)
  const posts = latestPosts(3)

  return (
    <PageTransition>
      <Seo
        path="/"
        jsonLd={[
          { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url, inLanguage: 'id' },
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: profile.name,
            jobTitle: profile.role,
            url: site.url,
            sameAs: socials.map((s) => s.url),
          },
        ]}
      />

      <div className="container-page">
        <Hero />
      </div>

      <hr className="border-line" />

      <div className="container-page">
        <section aria-labelledby="intro-title" className="py-14 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <Reveal>
              <h2 id="intro-title" className="eyebrow font-mono">
                Tentang saya
              </h2>
              <p className="mt-3.5 font-display text-[clamp(19px,2.2vw,23px)] leading-[1.55] font-medium tracking-[-0.01em]">
                {profile.summary}
              </p>
              <Link to="/about" className="link-accent mt-5">
                Selengkapnya tentang saya <Icon name="arrowRight" />
              </Link>
            </Reveal>
            <Reveal as="dl" delay={0.15} className="border-t border-line">
              {profile.facts.map((f) => (
                <div key={f.label} className="flex justify-between gap-4 border-b border-line py-3.25 text-[14.5px]">
                  <dt className="text-muted">{f.label}</dt>
                  <dd className={`text-right font-medium ${f.mono ? 'font-mono text-[13.5px]' : ''}`}>{f.value}</dd>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <ShowreelSection />

        <section aria-labelledby="featured-title" className="pb-14 lg:pb-20">
          <Reveal>
            <SectionHeading
              id="featured-title"
              title="Proyek pilihan"
              description="Beberapa hal yang pernah saya bangun, dari aplikasi kasir sampai alat bantu service desk."
              linkTo="/projects"
              linkLabel="Semua proyek"
            />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.1} className="h-full">
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </section>

        <section aria-labelledby="latest-title" className="pb-14 lg:pb-20">
          <Reveal>
            <SectionHeading
              id="latest-title"
              title="Artikel terbaru"
              description="Tutorial dan catatan belajar seputar web development dan ITSM."
              linkTo="/blog"
              linkLabel="Semua artikel"
            />
          </Reveal>
          <ul className="border-t border-line">
            {posts.map((post, i) => (
              <ArticleRow key={post.slug} post={post} index={i} />
            ))}
          </ul>
        </section>

        <Reveal>
          <ContactCta />
        </Reveal>
      </div>
    </PageTransition>
  )
}
