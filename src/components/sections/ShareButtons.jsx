import { useState } from 'react'
import Icon from '@/components/common/Icon'

/** Bagikan tautan artikel (FR-026). */
export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false)
  const encoded = encodeURIComponent(url)
  const text = encodeURIComponent(title)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Salin tautan ini:', url)
    }
  }

  const btn =
    'inline-flex cursor-pointer items-center gap-1.5 rounded-[7px] border border-line px-2.5 py-1.5 text-[12.5px] font-medium no-underline hover:border-fg'

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={copy} className={btn} aria-live="polite">
        <Icon name={copied ? 'check' : 'link'} className="size-3.5" />
        {copied ? 'Tersalin' : 'Salin tautan'}
      </button>
      <a className={btn} href={`https://wa.me/?text=${text}%20${encoded}`} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
      <a
        className={btn}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
      <a className={btn} href={`https://x.com/intent/post?url=${encoded}&text=${text}`} target="_blank" rel="noopener noreferrer">
        X
      </a>
    </div>
  )
}
