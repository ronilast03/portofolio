import { useState } from 'react'
import { cn } from '@/utils/cn'
import Skeleton from './Skeleton'

/**
 * Gambar dengan lazy loading dan skeleton selama dimuat (NFR-001).
 * Gunakan priority untuk gambar besar di atas layar (LCP).
 */
export default function Image({ src, alt, className, imgClassName, priority = false, ...props }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn('relative overflow-hidden bg-surface', className)}>
      {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        onLoad={() => setLoaded(true)}
        ref={(el) => {
          if (el?.complete) setLoaded(true)
        }}
        className={cn('size-full object-cover transition-opacity duration-300', imgClassName)}
        {...props}
      />
    </div>
  )
}
