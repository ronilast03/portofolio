/**
 * Semua artikel di src/content/blog/*.md (PRD §3.3).
 * Markdown sudah diubah menjadi { metadata, html, headings } saat build oleh
 * plugins/vite-plugin-markdown.js, jadi tidak ada parser Markdown di browser.
 *
 * File yang diawali "_" (misalnya template) dan artikel dengan published: false diabaikan.
 */
const modules = import.meta.glob('../content/blog/*.md', { eager: true, import: 'default' })

export const posts = Object.entries(modules)
  .filter(([path]) => !path.split('/').pop().startsWith('_'))
  .map(([, post]) => post)
  .filter((post) => post.published)
  .sort((a, b) => String(b.date).localeCompare(String(a.date)))

export const getPostBySlug = (slug) => posts.find((p) => p.slug === slug)
export const latestPosts = (limit = 3) => posts.slice(0, limit)
export const postCategories = () => [...new Set(posts.map((p) => p.category))]
export const postTags = () => [...new Set(posts.flatMap((p) => p.tags))].sort()

export function filterPosts({ query = '', category = '', tag = '' } = {}) {
  const q = query.trim().toLowerCase()
  return posts.filter(
    (p) =>
      (!category || p.category === category) &&
      (!tag || p.tags.includes(tag)) &&
      (!q || `${p.title} ${p.description} ${p.tags.join(' ')}`.toLowerCase().includes(q)),
  )
}

/** Artikel terkait: skor dari tag yang sama + kategori yang sama (FR-024). */
export function relatedPosts(post, limit = 2) {
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => post.tags.includes(t)).length + (p.category === post.category ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || String(b.post.date).localeCompare(String(a.post.date)))
    .slice(0, limit)
    .map((x) => x.post)
}
