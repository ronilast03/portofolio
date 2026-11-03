import Image from '@/components/common/Image'
import Icon from '@/components/common/Icon'
import { formatMonth } from '@/utils/date'

/** Kartu sertifikat: gambar, nama, penerbit, tanggal, ID kredensial, dan link verifikasi. */
export default function CertificateCard({ cert, headingAs: Heading = 'h3', compact = false }) {
  return (
    <article className="spotlight group flex h-full flex-col overflow-hidden rounded-[12px] border border-line bg-bg">
      <a
        href={cert.image}
        target="_blank"
        rel="noopener noreferrer"
        className="block border-b border-line bg-surface p-3"
        aria-label={`Lihat sertifikat ${cert.title} ukuran penuh`}
      >
        <Image
          src={cert.image}
          alt={`Sertifikat ${cert.title} dari ${cert.issuer}`}
          className="aspect-[3/2] rounded-md bg-transparent"
          imgClassName="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          sizes={compact ? '(min-width: 1024px) 330px, (min-width: 768px) 33vw, 100vw' : '(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw'}
          width="1600"
          height="1084"
        />
      </a>
      <div className="flex flex-1 flex-col gap-1.5 p-4.5">
        <p className="eyebrow">
          {cert.issuer} · {formatMonth(cert.date)}
        </p>
        <Heading className="text-[16.5px] leading-snug font-bold">{cert.title}</Heading>
        {!compact && cert.credentialId && (
          <p className="truncate font-mono text-[11.5px] text-muted" title={cert.credentialId}>
            ID: {cert.credentialId}
          </p>
        )}
        {cert.url && (
          <a
            href={cert.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-accent mt-auto pt-2 text-[13.5px]"
          >
            Verifikasi <Icon name="external" className="size-3.5" />
            <span className="sr-only"> sertifikat {cert.title} (tab baru)</span>
          </a>
        )}
      </div>
    </article>
  )
}
