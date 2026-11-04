import Image from '@/components/common/Image'
import { profile } from '@/data/profile'

/** Kartu ID dengan foto profil (dipakai di halaman About, digantung dengan <Lanyard>). */
export default function ProfileBadge() {
  const words = profile.name.split(' ')
  return (
    <article
      aria-label={`Kartu identitas ${profile.name}`}
      className="spotlight relative w-60 overflow-hidden rounded-[18px] border border-line bg-bg shadow-[0_26px_50px_rgba(0,0,0,0.13),0_5px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_26px_50px_rgba(0,0,0,0.5)]"
    >
      {/* Lubang tali */}
      <div aria-hidden="true" className="mx-auto mt-3 h-2.25 w-14 rounded-md border border-line bg-surface shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]" />

      <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
        <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted uppercase">Kartu identitas</span>
        <span className="grid size-6 place-items-center rounded-md bg-fg font-display text-[10px] font-extrabold text-bg">
          {profile.initials}
        </span>
      </div>

      <div className="px-4">
        {profile.photo ? (
          <Image
            src={profile.photo}
            alt={`Foto ${profile.name}`}
            priority
            sizes="240px"
            className="aspect-4/5 rounded-[10px] border border-line"
          />
        ) : (
          <div
            role="img"
            aria-label={`Tempat foto profil ${profile.name}`}
            className="grid aspect-4/5 place-items-center rounded-[10px] border border-line bg-surface font-display text-[44px] font-extrabold text-muted"
          >
            {profile.initials}
          </div>
        )}
      </div>

      <div className="px-4 pt-3.5 justify-items-center">
        <p className="display-serif text-[30px] leading-none">
          {words.slice(0, -1).join(' ')} {words.length > 1 && <em className="serif-em">{words.at(-1)}</em>}
        </p>
        <p className="mt-1.5 text-[12.5px] font-medium">{profile.role}</p>
      </div>

      <div className="mt-3.5 flex flex-col gap-2 border-t border-dashed border-line bg-surface px-4 pt-3 pb-3.5">
        <div aria-hidden="true" className="lanyard-barcode h-6" />
        <p className="flex items-center gap-1.5 font-mono text-[10.5px] text-muted">
          <span className={`size-1.5 rounded-full ${profile.available ? 'bg-ok' : 'bg-muted'}`} aria-hidden="true" />
          {profile.availability}
        </p>
      </div>
    </article>
  )
}
