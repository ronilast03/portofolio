import { useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import Icon from '@/components/common/Icon'
import { sendContactMessage } from '@/services/contactService'
import { CONTACT_LIMITS, validateContact } from '@/utils/validation'

const EMPTY = { name: '', email: '', subject: '', message: '', website: '' }

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

/** Contact form (FR-028 s/d FR-032). */
export default function ContactForm() {
  const uid = useId()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState({ type: 'idle', message: '' })
  const formRef = useRef(null)

  const ids = {
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

  const focusFirstError = (errs) => {
    const first = ['name', 'email', 'subject', 'message'].find((k) => errs[k])
    if (first) document.getElementById(ids[first])?.focus()
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status.type === 'loading') return

    const clientErrors = validateContact(values)
    setErrors(clientErrors)
    if (Object.keys(clientErrors).length) {
      setStatus({ type: 'idle', message: '' })
      focusFirstError(clientErrors)
      return
    }

    setStatus({ type: 'loading', message: '' })
    try {
      const res = await sendContactMessage(values)
      const firstName = values.name.trim().split(/\s+/)[0]
      setStatus({
        type: 'success',
        message: `${res.message || 'Pesan berhasil dikirim.'} Terima kasih, ${firstName}. Saya akan membalas ke ${values.email.trim()}.`,
      })
      setValues(EMPTY)
      setErrors({})
    } catch (error) {
      if (error.status === 422 && error.errors) {
        const serverErrors = Object.fromEntries(Object.entries(error.errors).map(([k, v]) => [k, v[0]]))
        setErrors(serverErrors)
        focusFirstError(serverErrors)
      }
      setStatus({ type: error.status === 429 ? 'warn' : 'error', message: error.message })
    } finally {
      formRef.current?.querySelector('[data-status]')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
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
    success: { cls: 'border-ok text-ok bg-ok/10', icon: 'check', title: 'Pesan terkirim.' },
    error: { cls: 'border-err text-err bg-err/10', icon: 'alert', title: 'Pesan gagal dikirim.' },
    warn: { cls: 'border-warn text-warn bg-warn/10', icon: 'alert', title: 'Tunggu sebentar.' },
  }[status.type]

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="grid min-w-0 gap-[18px] rounded-[14px] border border-line p-6 md:p-8"
    >
      <div data-status aria-live="polite">
        {notice && (
          <div className={`flex items-start gap-2.5 rounded-[10px] border px-[15px] py-[13px] text-[14.5px] ${notice.cls}`}>
            <Icon name={notice.icon} className="mt-0.5 size-4 shrink-0" />
            <p className="text-fg">
              <strong className={notice.cls.split(' ')[1]}>{notice.title}</strong> {status.message}
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-[18px] md:grid-cols-2">
        <Field id={ids.name} label="Nama" error={errors.name}>
          <input {...inputProps('name')} maxLength={CONTACT_LIMITS.name} autoComplete="name" />
        </Field>
        <Field id={ids.email} label="Email" error={errors.email}>
          <input {...inputProps('email')} type="email" maxLength={CONTACT_LIMITS.email} autoComplete="email" />
        </Field>
      </div>

      <Field id={ids.subject} label="Subjek" error={errors.subject}>
        <input {...inputProps('subject')} maxLength={CONTACT_LIMITS.subject} />
      </Field>

      <Field
        id={ids.message}
        label="Pesan"
        error={errors.message}
        hint={`${values.message.length} / ${CONTACT_LIMITS.messageMax}`}
      >
        <textarea {...inputProps('message')} rows={6} maxLength={CONTACT_LIMITS.messageMax} className={`${inputProps('message').className} min-h-[150px] resize-y`} />
      </Field>

      {/* Honeypot (SEC-005): disembunyikan dari pengguna, biasanya diisi bot. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={ids.website}>Website</label>
        <input id={ids.website} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3.5 text-[13px] text-muted">
        <span>
          Data hanya dipakai untuk membalas pesan.{' '}
          <Link to="/privacy-policy" className="text-accent">
            Kebijakan privasi
          </Link>
        </span>
        <button type="submit" className="btn btn-primary" disabled={status.type === 'loading'}>
          {status.type === 'loading' ? (
            <>
              <span className="size-[15px] animate-spin rounded-full border-2 border-current border-r-transparent" />
              Mengirim…
            </>
          ) : (
            <>
              Kirim pesan <Icon name="arrowRight" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
