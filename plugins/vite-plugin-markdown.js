// Vite plugin: mengubah file Markdown blog menjadi modul JS berisi metadata + HTML saat build.
// Hasilnya, browser tidak perlu mengunduh parser Markdown & syntax highlighter (NFR-001),
// dan HTML artikel sudah ada di hasil prerender (PRD §10.2).
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { parse as parseYaml } from 'yaml'

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

/** Kumpulkan H2, bungkus tabel, dan tandai link eksternal. */
function rehypeArticle(headings) {
  return () => (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'h2' && node.properties?.id) {
        headings.push({ id: node.properties.id, text: toString(node) })
      }
      if (node.tagName === 'a' && /^https?:\/\//.test(String(node.properties?.href))) {
        node.properties.target = '_blank'
        node.properties.rel = ['noopener', 'noreferrer']
      }
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy'
        node.properties.decoding = 'async'
      }
      if (node.tagName === 'table' && parent && parent.properties?.className?.[0] !== 'table-wrap') {
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-wrap'] },
          children: [node],
        }
      }
    })
  }
}

const toIsoDate = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v ? String(v).slice(0, 10) : null)

function countWords(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`|\-[\]()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}

export default function markdownPlugin() {
  return {
    name: 'portfolio-markdown',
    async transform(code, id) {
      if (!id.endsWith('.md')) return null

      const match = FRONTMATTER.exec(code)
      if (!match) this.error(`Frontmatter tidak ditemukan di ${id}`)

      const data = parseYaml(match[1]) || {}
      const body = match[2].trim()
      const fileSlug = id.split('/').pop().replace(/\.md$/, '')
      const headings = []

      const file = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeHighlight, { detect: false })
        .use(rehypeArticle(headings))
        .use(rehypeStringify)
        .process(body)

      const post = {
        title: data.title || fileSlug,
        slug: data.slug || fileSlug,
        description: data.description || '',
        date: toIsoDate(data.date),
        updatedAt: toIsoDate(data.updatedAt),
        cover: data.cover || null,
        category: data.category || 'Umum',
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        published: data.published !== false,
        author: data.author || 'Roni Lesmana',
        readingTime: Math.max(1, Math.round(countWords(body) / 200)),
        headings,
        html: String(file),
      }

      return { code: `export default ${JSON.stringify(post)}`, map: null }
    },
  }
}
