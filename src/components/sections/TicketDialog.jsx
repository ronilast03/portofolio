import { useEffect, useRef, useState } from 'react'
import Icon from '@/components/common/Icon'
import ContactForm from './ContactForm'

/**
 * Dialog "Buat permintaan" (memakai elemen <dialog> bawaan browser:
 * fokus terkunci di dalam dialog, tombol Esc menutup, dan aman untuk pembaca layar).
 */
export default function TicketDialog({ open, onClose, initial }) {
  const ref = useRef(null)
  const [session, setSession] = useState(0)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      setSession((s) => s + 1) // form selalu kosong setiap kali dibuka
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const handleClose = () => {
      document.documentElement.style.overflow = ''
      onClose()
    }
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onClose])

  return (
    <dialog
      ref={ref}
      aria-labelledby="ticket-dialog-title"
      onClick={(e) => e.target === ref.current && ref.current.close()}
      className="ticket-dialog m-auto max-h-[calc(100dvh-32px)] w-[min(640px,calc(100vw-32px))] overflow-y-auto rounded-2xl border border-line bg-bg p-0 text-fg shadow-2xl backdrop:bg-black/55 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 md:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Service desk</p>
            <h2 id="ticket-dialog-title" className="mt-1 text-[22px] font-bold tracking-tight">
              Buat permintaan
            </h2>
          </div>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Tutup"
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-line hover:bg-surface"
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>
        {open && <ContactForm key={session} bordered={false} initial={initial} onClose={() => ref.current?.close()} />}
      </div>
    </dialog>
  )
}
