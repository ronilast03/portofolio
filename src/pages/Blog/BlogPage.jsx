import { useSearchParams } from 'react-router'
import Seo from '@/components/common/Seo'
import Icon from '@/components/common/Icon'
import PageHeader from '@/components/common/PageHeader'
import PageTransition from '@/components/common/PageTransition'
import EmptyState from '@/components/common/EmptyState'
import Reveal from '@/components/common/Reveal'
import { breadcrumbJsonLd } from '@/components/common/Breadcrumb'
import ArticleCard from '@/components/sections/ArticleCard'
import { useHydrated } from '@/hooks/useHydrated'
import { filterPosts, postCategories, postTags } from '@/utils/blog'

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Blog' }]

export default function BlogPage() {
  const hydrated = useHydrated()
  const [params, setParams] = useSearchParams()

  // Filter dibaca dari URL (?q=&kategori=&tag=) agar hasil pencarian bisa dibagikan.
  const query = hydrated ? params.get('q') || '' : ''
  const category = hydrated ? params.get('kategori') || '' : ''
  const tag = hydrated ? params.get('tag') || '' : ''

  const list = filterPosts({ query, category, tag })
  const categories = postCategories()
  const tags = postTags()

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const chip = (pressed) =>
    `cursor-pointer rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium ${
      pressed ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:border-fg hover:text-fg'
    }`
  const tagChip = (pressed) =>
    `cursor-pointer rounded-md border px-2.5 py-0.5 font-mono text-xs ${
      pressed ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:text-fg'
    }`

  const summary = [
    `${list.length} artikel`,
    tag && `dengan tag #${tag}`,
    category && `di kategori ${category}`,
    query && `untuk "${query}"`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <PageTransition>
      <Seo
        title="Blog"
        description="Artikel, tutorial, dan catatan belajar seputar web development, IT Service Management, dan pengalaman magang."
        path="/blog"
        jsonLd={breadcrumbJsonLd(crumbs)}
      />
      <div className="container-page pb-18">
        <PageHeader
          title="Blog"
          description="Artikel, tutorial, dan catatan belajar seputar web development, ITSM, dan pengalaman magang."
          breadcrumb={crumbs}
        />

        <div className="grid gap-3.5" role="search">
          <div className="relative max-w-110">
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
            <label htmlFor="blog-search" className="sr-only">
              Cari artikel
            </label>
            <input
              id="blog-search"
              type="search"
              placeholder="Cari judul atau kata kunci…"
              autoComplete="off"
              value={query}
              onChange={(e) => update('q', e.target.value)}
              className="input h-11.5 pl-10"
            />
          </div>

          <div role="group" aria-label="Filter kategori artikel" className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={!category} className={chip(!category)} onClick={() => update('kategori', '')}>
              Semua
            </button>
            {categories.map((c) => (
              <button key={c} type="button" aria-pressed={category === c} className={chip(category === c)} onClick={() => update('kategori', c)}>
                {c}
              </button>
            ))}
          </div>

          <div role="group" aria-label="Filter tag" className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
            <span>Tag:</span>
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={tag === t}
                className={tagChip(tag === t)}
                onClick={() => update('tag', tag === t ? '' : t)}
              >
                #{t}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4.5 mb-4 text-[13.5px] text-muted" aria-live="polite">
          {summary}
        </p>

        {list.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {list.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 2) * 0.1} className="h-full">
                <ArticleCard post={post} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Artikel tidak ditemukan"
            action={
              <button type="button" className="btn btn-ghost" onClick={() => setParams({}, { replace: true })}>
                Hapus semua filter
              </button>
            }
          >
            Tidak ada artikel yang cocok. Coba kata kunci lain atau hapus filter.
          </EmptyState>
        )}
      </div>
    </PageTransition>
  )
}
