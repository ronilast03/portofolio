import { useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { m } from 'motion/react'
import Icon from '@/components/common/Icon'
import { profile } from '@/data/profile'
import { createTicketId, sendContactMessage } from '@/services/contactService'
import { CONTACT_LIMITS, validateContact } from '@/utils/validation'

// Kategori tiket. Ubah sesuai kebutuhan.
export const TICKET_CATEGORIES = ['Website', 'Aplikasi web', 'ITSM / Service desk', 'Lowongan kerja', 'Lainnya']

const EMPTY = { category: '', name: '', email: '', subject: '', message: '', website: '' }

const pad = (n) => String(n).padStart(2, '0')
const clock = (d) => `${pad(d.getHours())}.${pad(d.getMinutes())}`

function Field({ id, label, error, children, hint }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      <div className="flex justify-between gap-3 text-[13px]">
        <span id={`${id}-error`} className="text-err">
          {error}
        </span>
        {hint && <span className="text-muted">{hint}</span>}
      </div>
    </div>
  )
}

/** Tampilan setelah tiket terkirim: nomor tiket + status penanganan. */
function TicketReceipt({ ticket, onNew, onClose }) {
  const steps = [
    { label: 'Tiket dibuat', note: `Hari ini, ${clock(ticket.createdAt)}`, done: true },
    { label: 'Ditinjau', note: `Target respons ${profile.responseTime}`, done: false },
    { label: 'Dibalas', note: `Lewat email ke ${ticket.email}`, done: false },
  ]

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-6"
      role="status"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Nomor tiket</p>
          <p className="mt-1 font-mono text-[clamp(22px,4vw,30px)] font-medium tracking-tight">{ticket.id}</p>
        </div>
        <span className="rounded-full border border-ok px-2.5 py-0.5 font-mono text-[11px] tracking-[0.06em] text-ok uppercase">
          Open
        </span>
      </div>

      <p className="text-[15px]">
        Terima kasih, <strong>{ticket.name.split(/\s+/)[0]}</strong>. Tiket kamu sudah saya terima. Simpan nomor di atas
        kalau ingin menanyakan perkembangannya.
      </p>

      <ol className="grid gap-0 border-l border-line">
        {steps.map((s, i) => (
          <m.li
            key={s.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.35 }}
            className="relative pb-4 pl-6 last:pb-0"
          >
            <span
              aria-hidden="true"
              className={`absolute top-1 -left-[7px] grid size-[13px] place-items-center rounded-full border-2 ${
                s.done ? 'border-ok bg-ok' : 'border-line bg-bg'
              }`}
            />
            <p className={`text-sm font-semibold ${s.done ? '' : 'text-muted'}`}>
              {s.label}
              {s.done && <span className="sr-only"> (selesai)</span>}
            </p>
            <p className="text-[13px] text-muted">{s.note}</p>
          </m.li>
        ))}
      </ol>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-[10px] border border-dashed border-line p-4 text-sm">
        <dt className="font-mono text-xs text-muted">Kategori</dt>
        <dd className="font-medium">{ticket.category}</dd>
        <dt className="font-mono text-xs text-muted">Ringkasan</dt>
        <dd className="font-medium break-words">{ticket.subject}</dd>
      </dl>

      <div className="flex flex-wrap gap-2.5">
        {onClose && (
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Selesai
          </button>
        )}
        <button type="button" className="btn btn-ghost" onClick={onNew}>
          Buat tiket lain
        </button>
      </div>
    </m.div>
  )
}

/**
 * Form permintaan bergaya tiket service desk (FR-028 s/d FR-032).
 * Dipakai di halaman Contact dan di dialog "Buat permintaan" pada hero.
 */
export default function ContactForm({ onClose, bordered = true, initial }) {
  const uid = useId()
  // initial: isi awal, misalnya dari katalog layanan ({ category, subject })
  const [values, setValues] = useState(() => ({ ...EMPTY, ...initial }))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const [ticket, setTicket] = useState(null)
  const formRef = useRef(null)

  const ids = {
    category: `${uid}-category`,
    name: `${uid}-name`,
    email: `${uid}-email`,
    subject: `${uid}-subject`,
    message: `${uid}-message`,
    website: `${uid}-website`,
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const validate = (v) => {
    const errs = validateContact(v)
    // Samakan istilah pesan error dengan label form ini.
    if (errs.subject) errs.subject = errs.subject.replace('Subjek', 'Ringkasan')
    if (errs.message) errs.message = errs.message.replace('Pesan', 'Detail permintaan')
    if (!v.category) errs.category = 'Pilih salah satu kategori.'
    return errs
  }

  const focusFirstError = (errs) => {
    const first = ['category', 'name', 'email', 'subject', 'message'].find((k) => errs[k])
    if (first === 'category') formRef.current?.querySelector('input[name="category"]')?.focus()
    else if (first) document.getElementById(ids[first])?.focus()
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status.type === 'loading') return

    const clientErrors = validate(values)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length) {
      setStatus({ type: 'idle', message: '' })
      focusFirstError(clientErrors)
      return
    }

    const id = createTicketId()
    setStatus({ type: 'loading', message: '' })
    try {
      await sendContactMessage({ ...values, ticketId: id })
      setTicket({ id, createdAt: new Date(), ...values })
      setValues(EMPTY)
      setErrors({})
      setStatus({ type: 'idle', message: '' })
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const serverErrors = Object.fromEntries(Object.entries(error.errors).map(([k, v]) => [k, v[0]]))
        setErrors(serverErrors)
        focusFirstError(serverErrors)
      }
      setStatus({ type: error.status === 429 ? 'warn' : 'error', message: error.message })
    }
  }

  const inputProps = (name) => ({
    id: ids[name],
    name,
    value: values[name],
    onChange,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': `${ids[name]}-error`,
    className: `input ${errors[name] ? 'border-err' : ''}`,
  })

  const notice = {
    error: { cls: 'border-err bg-err/10', text: 'text-err', icon: 'alert', title: 'Tiket gagal dikirim.' },
    warn: { cls: 'border-warn bg-warn/10', text: 'text-warn', icon: 'alert', title: 'Tunggu sebentar.' },
  }[status.type]

  const wrap = bordered ? 'rounded-[14px] border border-line p-6 md:p-8' : ''

  if (ticket) {
    return (
      <div className={wrap}>
        <TicketReceipt ticket={ticket} onNew={() => setTicket(null)} onClose={onClose} />
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={`relative grid min-w-0 gap-[18px] ${wrap}`}>
      <div className="flex items-center justify-between gap-3 border-b border-dashed border-line pb-4">
        <span className="font-mono text-[13px] font-medium">Tiket baru</span>
        <span className="rounded-full border border-warn px-2 py-0.5 font-mono text-[11px] tracking-[0.06em] text-warn uppercase">
          Draft
        </span>
      </div>

      {notice && (
        <div aria-live="polite" className={`flex items-start gap-2.5 rounded-[10px] border px-[15px] py-[13px] text-[14.5px] ${notice.cls}`}>
          <Icon name={notice.icon} className={`mt-0.5 size-4 shrink-0 ${notice.text}`} />
          <p>
            <strong className={notice.text}>{notice.title}</strong> {status.message}
          </p>
        </div>
      )}

      <fieldset className="min-w-0" aria-describedby={`${ids.category}-error`}>
        <legend className="mb-2 text-sm font-semibold">Kategori</legend>
        <div className="flex flex-wrap gap-2">
          {TICKET_CATEGORIES.map((c) => {
            const checked = values.category === c
            return (
              <label
                key={c}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                  checked ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:border-fg hover:text-fg'
                }`}
              >
                <input type="radio" name="category" value={c} checked={checked} onChange={onChange} className="sr-only" />
                {c}
              </label>
            )
          })}
        </div>
        <p id={`${ids.category}-error`} className="mt-1.5 text-[13px] text-err">
          {errors.category}
        </p>
      </fieldset>

      <div className="grid gap-[18px] md:grid-cols-2">
        <Field id={ids.name} label="Nama" error={errors.name}>
          <input {...inputProps('name')} maxLength={CONTACT_LIMITS.name} autoComplete="name" />
        </Field>
        <Field id={ids.email} label="Email" error={errors.email}>
          <input {...inputProps('email')} type="email" maxLength={CONTACT_LIMITS.email} autoComplete="email" />
        </Field>
      </div>

      <Field id={ids.subject} label="Ringkasan" error={errors.subject}>
        <input {...inputProps('subject')} maxLength={CONTACT_LIMITS.subject} placeholder="Contoh: Pembuatan website company profile" />
      </Field>

      <Field id={ids.message} label="Detail permintaan" error={errors.message} hint={`${values.message.length} / ${CONTACT_LIMITS.messageMax}`}>
        <textarea
          {...inputProps('message')}
          rows={5}
          maxLength={CONTACT_LIMITS.messageMax}
          placeholder="Ceritakan kebutuhan, target waktu, atau pertanyaan kamu."
          className={`${inputProps('message').className} min-h-[130px] resize-y`}
        />
      </Field>

      {/* Honeypot (SEC-005): disembunyikan dari pengguna, biasanya diisi bot. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={ids.website}>Website</label>
        <input id={ids.website} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3.5 text-[13px] text-muted">
        <span>
          Data hanya dipakai untuk membalas tiket.{' '}
          <Link to="/privacy-policy" className="text-accent underline underline-offset-2" onClick={onClose}>
            Kebijakan privasi
          </Link>
        </span>
        <button type="submit" className="btn btn-primary" disabled={status.type === 'loading'}>
          {status.type === 'loading' ? (
            <>
              <span className="size-[15px] animate-spin rounded-full border-2 border-current border-r-transparent" />
              Mengirim tiket…
            </>
          ) : (
            <>
              Kirim tiket <Icon name="arrowRight" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
