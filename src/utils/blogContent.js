/**
 * Isi lengkap artikel (HTML + daftar isi). Hanya diimpor oleh halaman detail blog,
 * jadi HTML semua artikel tidak ikut terunduh di halaman lain.
 */
const modules = import.meta.glob('../content/blog/*.md', { eager: true, import: 'default' })

const bySlug = Object.fromEntries(Object.values(modules).map((post) => [post.slug, post]))

export const getPostContent = (slug) => bySlug[slug]
