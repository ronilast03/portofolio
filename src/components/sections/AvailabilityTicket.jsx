import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { profile } from '@/data/profile'
import Icon from '@/components/common/Icon'
import { useHydrated } from '@/hooks/useHydrated'
import TicketDialog from './TicketDialog'

const FIRST_NUMBER = 42 // nomor antrean awal (A-042), senada dengan REQ-xxxx-0042
const pad = (n) => String(n).padStart(3, '0')

/** "04/11/2026 08:40" (waktu perangkat pengunjung) */
function stamp(date) {
  const two = (n) => String(n).padStart(2, '0')
  return `${two(date.getDate())}/${two(date.getMonth() + 1)}/${date.getFullYear()} ${two(date.getHours())}:${two(date.getMinutes())}`
}

/**
 * Mesin antrean service desk + struk yang tercetak (kartu ketersediaan di hero).
 * - Saat halaman dibuka, struk "tercetak" turun dari celah mesin.
 * - Tombol "Ambil nomor antrean" mencetak nomor berikutnya, lalu membuka form tiket.
 * - Tanpa JavaScript, tombol tetap membuka halaman Contact.
 */
export default function AvailabilityTicket() {
  const year = new Date().getFullYear()
  const hydrated = useHydrated()
  const [queue, setQueue] = useState(FIRST_NUMBER)
  const [printKey, setPrintKey] = useState(0)
  const [open, setOpen] = useState(false)
  const timer = useRef(0)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => () => clearTimeout(timer.current), [])

  const takeNumber = (e) => {
    e.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setQueue((n) => n + 1)
    setPrintKey((k) => k + 1)
    clearTimeout(timer.current)
    // Tunggu struk baru selesai tercetak, baru buka form
    timer.current = setTimeout(() => setOpen(true), reduce ? 0 : 1100)
  }

  const online = profile.available

  return (
    <div className="queue mx-auto w-[min(100%,360px)]">
      {/* Mesin antrean */}
      <div className="queue-machine relative z-10 rounded-t-[18px] rounded-b-[10px] px-5 pt-4 pb-6.5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10.5px] tracking-[0.14em] text-[#a0a0a0] uppercase">Service desk · antrean</span>
          <span className={`flex items-center gap-1.5 font-mono text-[10.5px] ${online ? 'text-[#5cc98a]' : 'text-[#e5b45c]'}`}>
            <span className={`queue-led size-1.75 rounded-full ${online ? 'bg-[#5cc98a]' : 'bg-[#e5b45c]'}`} aria-hidden="true" />
            {online ? 'ONLINE' : 'ISTIRAHAT'}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Link
            to="/contact"
            onClick={takeNumber}
            aria-haspopup="dialog"
            className="group flex h-11 flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#dadada] text-[14.5px] font-semibold text-[#111111] no-underline transition hover:bg-white active:translate-y-px"
          >
            Ambil nomor antrean <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-[10px] border border-[#333333] font-mono text-[11px] text-[#8a8a8a]"
          >
            A
          </span>
        </div>
        {/* Celah printer */}
        <span aria-hidden="true" className="absolute inset-x-7.5 bottom-2 h-1.5 rounded-full bg-[#050505]" />
      </div>

      {/* Struk keluar dari celah: terpotong di bagian atas agar tampak keluar dari mesin */}
      <div className="queue-window -mt-2.5 overflow-hidden px-5 pb-4">
        <article key={printKey} aria-label={`Struk antrean A-${pad(queue)}`} className="queue-receipt relative mx-auto">
          <p className="text-center font-bold tracking-[0.1em]">{profile.name.toUpperCase()}</p>
          <p className="text-center text-[11px] text-[#666666]">{profile.role.toUpperCase()}</p>
          <p aria-hidden="true" className="queue-rule" />
          <p className="text-center text-[11px] tracking-[0.14em] text-[#666666]">NOMOR ANTREAN</p>
          <p className="queue-number text-center">A-{pad(queue)}</p>
          <p className="text-center text-[11px] text-[#1c7c47]">● Antrean di depan kamu: 0</p>
          <p aria-hidden="true" className="queue-rule" />
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
            <dt className="text-[#666666]">LAYANAN</dt>
            <dd>{profile.focusAreas.join(' · ')}</dd>
            <dt className="text-[#666666]">LOKASI</dt>
            <dd>
              {profile.location}
              {profile.remote && ' · remote'}
            </dd>
            <dt className="text-[#666666]">ESTIMASI</dt>
            <dd>{profile.responseTime}</dd>
            <dt className="text-[#666666]">TIKET</dt>
            <dd>
              REQ-{year}-{String(queue).padStart(4, '0')}
            </dd>
          </dl>
          <p aria-hidden="true" className="queue-rule" />
          <div aria-hidden="true" className="queue-barcode" />
          <p className="queue-footer mt-2.5 text-center text-[11px] text-[#666666]">
            {hydrated ? stamp(new Date()) : ' '}
            <br />
            Terima kasih sudah menunggu.
          </p>
        </article>
      </div>

      <TicketDialog open={open} onClose={close} />
    </div>
  )
}
