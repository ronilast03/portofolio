import { Link, useParams } from 'react-router'
import Seo from '@/components/common/Seo'
import Icon from '@/components/common/Icon'
import Breadcrumb, { breadcrumbJsonLd } from '@/components/common/Breadcrumb'
import PageTransition from '@/components/common/PageTransition'
import ReadingProgress from '@/components/common/ReadingProgress'
import Reveal from '@/components/common/Reveal'
import ArticleCard, { ArticleCover } from '@/components/sections/ArticleCard'
import ArticleBody from '@/components/sections/ArticleBody'
import ShareButtons from '@/components/sections/ShareButtons'
import { site } from '@/data/site'
import { getPostBySlug, relatedPosts } from '@/utils/blog'
import { formatDate } from '@/utils/date'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)
  if (!post) return <NotFoundPage />

  const url = `${site.url}/blog/${post.slug}`
  const headings = post.headings
  const related = relatedPosts(post, 2)
  const crumbs = [{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: post.title }]

  return (
    <PageTransition>
      <Seo
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        image={post.cover || undefined}
        type="article"
        jsonLd={[
          breadcrumbJsonLd(crumbs),
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.updatedAt || post.date,
            author: { '@type': 'Person', name: post.author },
            mainEntityOfPage: url,
            keywords: post.tags.join(', '),
            inLanguage: 'id',
            ...(post.cover ? { image: `${site.url}${post.cover}` } : {}),
          },
        ]}
      />
      <ReadingProgress />

      <div className="container-page">
        <header className="max-w-190 pt-12 pb-7">
          <Breadcrumb items={crumbs} />
          <p className="eyebrow text-accent!">{post.category}</p>
          <h1 className="mt-2 text-[clamp(30px,4.6vw,46px)] font-extrabold tracking-tight">{post.title}</h1>
          <p className="mt-3.5 text-lg text-muted">{post.description}</p>
          <div className="mt-5 flex flex-wrap gap-x-3.5 gap-y-1 font-mono text-[12.5px] text-muted">
            <span>{post.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.updatedAt && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Diperbarui <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                </span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} mnt baca</span>
          </div>
        </header>

        <ArticleCover post={post} large priority />

        <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
          <article className="min-w-0">
            <ArticleBody html={post.html} />
            <ul className="mt-8 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <li key={t}>
                  <Link
                    to={`/blog?tag=${encodeURIComponent(t)}`}
                    className="rounded-md border border-line px-2.5 py-0.5 font-mono text-xs text-muted no-underline hover:text-fg"
                  >
                    #{t}
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          <aside className="self-start text-sm lg:sticky lg:top-22">
            {headings.length > 0 && (
              <nav aria-label="Daftar isi" className="mb-6">
                <p className="eyebrow">Daftar isi</p>
                <ol className="mt-2 border-l border-line">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="-ml-px block border-l-2 border-transparent py-1.5 pl-3.5 text-muted no-underline hover:border-accent hover:text-fg"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <p className="eyebrow mb-2.5">Bagikan</p>
            <ShareButtons url={url} title={post.title} />
          </aside>
        </div>

        {related.length > 0 && (
          <>
            <hr className="border-line" />
            <section aria-labelledby="related-title" className="pt-10 pb-16">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <h2 id="related-title" className="text-[clamp(24px,3vw,32px)] font-bold tracking-[-0.02em]">
                  Artikel terkait
                </h2>
                <Link to="/blog" className="link-accent">
                  <Icon name="arrowLeft" /> Kembali ke blog
                </Link>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {related.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.1} className="h-full">
                    <ArticleCard post={p} />
                  </Reveal>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </PageTransition>
  )
}
