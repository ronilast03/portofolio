import { useState } from 'react'
import { cn } from '@/utils/cn'
import variants from 'virtual:image-variants'
import Skeleton from './Skeleton'

/**
 * Gambar dengan lazy loading dan skeleton selama dimuat (NFR-001).
 * Gunakan priority untuk gambar besar di atas layar (LCP).
 * Jika ada versi kecil (nama-file-800.webp), browser memilih ukuran yang pas lewat srcset + sizes.
 */
export default function Image({ src, alt, className, imgClassName, wrapperStyle, priority = false, sizes, ...props }) {
  const [loaded, setLoaded] = useState(false)
  const srcSet = variants.has(src) ? `${src.replace(/\.(webp|jpe?g|png)$/, '-800.webp')} 800w, ${src} 1600w` : undefined

  return (
    <div className={cn('relative overflow-hidden bg-surface', className)} style={wrapperStyle}>
      {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <img
        src={src}
        srcSet={srcSet}
        sizes={srcSet ? sizes || '100vw' : undefined}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        onLoad={() => setLoaded(true)}
        ref={(el) => {
          if (el?.complete) setLoaded(true)
        }}
        className={cn('size-full object-cover transition duration-500 ease-out', imgClassName)}
        {...props}
      />
    </div>
  )
}
