import { Link } from 'react-router'
import { formatDate } from '@/utils/date'
import Image from '@/components/common/Image'

/** Cover default jika artikel tidak punya gambar sampul. */
export function ArticleCover({ post, large = false, priority = false }) {
  if (post.cover) {
    return (
      <Image
        src={post.cover}
        alt=""
        priority={priority}
        className={large ? 'aspect-[16/6] rounded-[14px] border border-line' : 'aspect-[16/7] border-b border-line'}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-end overflow-hidden bg-surface ${
        large ? 'aspect-[16/6] rounded-[14px] border border-line p-6' : 'aspect-[16/7] border-b border-line px-[18px] py-4'
      }`}
    >
      <span
        className={`pointer-events-none absolute -bottom-1 right-3.5 font-display leading-[0.9] font-extrabold tracking-[-0.04em] text-line select-none ${
          large ? 'text-[clamp(56px,10vw,120px)]' : 'text-[clamp(40px,6vw,64px)]'
        }`}
      >
        {post.tags[0] || post.category}
      </span>
      <span className="relative font-mono text-[11.5px] tracking-[0.06em] text-accent uppercase">
        {large ? post.tags.map((t) => `#${t}`).join('  ') : post.category}
      </span>
    </div>
  )
}

export default function ArticleCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-[10px] border border-line no-underline transition hover:border-fg"
    >
      <ArticleCover post={post} />
      <div className="flex flex-1 flex-col gap-2 p-[18px]">
        <h3 className="text-[19px] font-bold transition-colors group-hover:text-accent">{post.title}</h3>
        <p className="text-[14.5px] text-muted">{post.description}</p>
        <div className="mt-auto flex flex-wrap gap-2.5 pt-2 font-mono text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime} mnt baca</span>
        </div>
      </div>
    </Link>
  )
}

export function ArticleRow({ post }) {
  return (
    <li>
      <Link
        to={`/blog/${post.slug}`}
        className="group grid gap-1.5 border-b border-line py-[22px] no-underline md:grid-cols-[150px_1fr_auto] md:items-baseline md:gap-6"
      >
        <time dateTime={post.date} className="font-mono text-[12.5px] text-muted">
          {formatDate(post.date)}
        </time>
        <div>
          <h3 className="text-[19px] font-bold transition-colors group-hover:text-accent">{post.title}</h3>
          <p className="mt-1 max-w-[62ch] text-[14.5px] text-muted">{post.description}</p>
        </div>
        <span className="font-mono text-xs whitespace-nowrap text-muted">{post.readingTime} mnt baca</span>
      </Link>
    </li>
  )
}
