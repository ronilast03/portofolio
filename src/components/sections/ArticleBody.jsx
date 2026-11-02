import { useNavigate } from 'react-router'

/**
 * Menampilkan HTML artikel hasil build. Kontennya berasal dari file Markdown milik sendiri
 * di repositori (bukan input pengunjung), jadi aman dirender sebagai HTML.
 * Klik pada link internal ("/...") diarahkan lewat router tanpa reload halaman.
 */
export default function ArticleBody({ html }) {
  const navigate = useNavigate()

  const onClick = (e) => {
    const a = e.target.closest('a')
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    const href = a.getAttribute('href') || ''
    if (href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault()
      navigate(href)
    }
  }

  return <div className="prose-article" onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
}
