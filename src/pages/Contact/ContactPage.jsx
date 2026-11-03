import { useState } from 'react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/common/PageHeader'
import PageTransition from '@/components/common/PageTransition'
import { breadcrumbJsonLd } from '@/components/common/Breadcrumb'
import ContactForm from '@/components/sections/ContactForm'
import { Link } from 'react-router'
import Icon from '@/components/common/Icon'
import { profile, socials } from '@/data/profile'

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Contact' }]
const smallBtn = 'cursor-pointer rounded-[7px] border border-line px-2.5 py-1 text-[12.5px] font-medium no-underline hover:border-fg'

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }
  return (
    <button type="button" onClick={copy} className={smallBtn} aria-live="polite">
      {copied ? 'Tersalin' : 'Salin'}
    </button>
  )
}

export default function ContactPage() {
  return (
    <PageTransition>
      <Seo
        title="Kontak"
        description={`Hubungi ${profile.name} untuk tawaran kerja, kolaborasi proyek, atau pertanyaan seputar artikel.`}
        path="/contact"
        jsonLd={breadcrumbJsonLd(crumbs)}
      />
      <div className="container-page">
        <PageHeader
          title="Hubungi *saya*"
          description="Untuk tawaran kerja, kolaborasi proyek, atau sekadar bertanya soal artikel. Pesan dibalas dalam satu hari kerja."
          breadcrumb={crumbs}
        />

        <div className="grid gap-10 pb-18 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <ul className="self-start border-t border-line">
            <li className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-4">
              <div>
                <p className="eyebrow text-[11.5px]!">Email</p>
                <a href={`mailto:${profile.email}`} className="font-medium break-all no-underline hover:text-accent">
                  {profile.email}
                </a>
              </div>
              <CopyEmail />
            </li>
            {socials.map((s) => (
              <li key={s.label} className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-4">
                <div>
                  <p className="eyebrow text-[11.5px]!">{s.label}</p>
                  <p className="font-medium break-all">{s.handle}</p>
                </div>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className={smallBtn}>
                  Buka
                </a>
              </li>
            ))}
            <li className="border-b border-line py-4">
              <p className="eyebrow text-[11.5px]!">Lokasi</p>
              <p className="font-medium">
                {profile.location}
                {profile.remote && ' · bisa remote'}
              </p>
            </li>
            <li className="py-4">
              <Link
                to="/kartu"
                className="spotlight group flex items-center gap-3.5 rounded-[12px] border border-line p-3.5 no-underline hover:border-fg"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-fg text-bg">
                  <Icon name="qr" className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">Kartu nama digital</span>
                  <span className="block text-[13px] text-muted">Simpan kontak ke HP atau pindai QR code</span>
                </span>
                <Icon name="arrowRight" className="size-4 text-muted transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          </ul>

          <ContactForm />
        </div>
      </div>
    </PageTransition>
  )
}
