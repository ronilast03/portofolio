import { Link } from 'react-router'
import { site } from '@/data/site'

/**
 * items: [{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: 'Judul' }]
 * Item terakhir tanpa "to" dianggap halaman aktif.
 */
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-[18px]">
      <ol className="flex flex-wrap gap-2 text-[13px] text-muted">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-line" aria-hidden="true">/</span>}
            {item.to ? (
              <Link to={item.to} className="no-underline hover:text-fg hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="line-clamp-1">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Schema.org BreadcrumbList untuk SEO. */
export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.to ? { item: `${site.url}${item.to}` } : {}),
    })),
  }
}
