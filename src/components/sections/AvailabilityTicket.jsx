import { Link } from 'react-router'
import { profile } from '@/data/profile'
import Icon from '@/components/common/Icon'

/** Kartu ketersediaan bergaya tiket service desk (sentuhan ITSM). */
export default function AvailabilityTicket() {
  const ticketId = `REQ-${new Date().getFullYear()}-0042`

  return (
    <aside aria-label="Ringkasan ketersediaan" className="min-w-0 overflow-hidden rounded-[14px] border border-line bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-dashed border-line px-4.5 py-3.5">
        <span className="font-mono text-[13px] font-medium">{ticketId}</span>
        <span
          className={`rounded-full border px-2 py-0.5 font-mono text-[11px] tracking-[0.06em] uppercase ${
            profile.available ? 'border-ok text-ok' : 'border-muted text-muted'
          }`}
        >
          {profile.available ? 'Open' : 'On hold'}
        </span>
      </div>
      <h2 className="px-4.5 pt-4 pb-1 text-[17px] font-bold">Permintaan kolaborasi</h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 px-4.5 pt-2 pb-1 text-sm">
        <dt className="pt-0.5 font-mono text-xs text-muted">Ditugaskan</dt>
        <dd className="font-medium">{profile.name}</dd>
        <dt className="pt-0.5 font-mono text-xs text-muted">Kategori</dt>
        <dd className="font-medium">{profile.focusAreas.join(' · ')}</dd>
        <dt className="pt-0.5 font-mono text-xs text-muted">Lokasi</dt>
        <dd className="font-medium">
          {profile.location}
          {profile.remote && ' · remote'}
        </dd>
        <dt className="pt-0.5 font-mono text-xs text-muted">Respons</dt>
        <dd className="font-medium">{profile.responseTime}</dd>
      </dl>
      <div className="px-4.5 pt-3.5 pb-4.5">
        <Link to="/contact" className="btn btn-ghost w-full">
          Buat permintaan <Icon name="arrowRight" />
        </Link>
      </div>
    </aside>
  )
}
