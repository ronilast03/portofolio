import { useEffect, useMemo, useRef, useState } from 'react'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/common/PageHeader'
import PageTransition from '@/components/common/PageTransition'
import Icon from '@/components/common/Icon'
import { breadcrumbJsonLd } from '@/components/common/Breadcrumb'
import { profile, socials } from '@/data/profile'
import { site } from '@/data/site'
import { buildVCard, qrSvg, vcardFileName, vcardHref } from '@/utils/vcard'

const crumbs = [{ label: 'Home', to: '/' }, { label: 'Kartu nama' }]
const domain = site.url.replace(/^https?:\/\//, '')
const linkedin = socials.find((s) => /linkedin/i.test(s.label))

const MODES = {
  contact: { label: 'Kontak', caption: 'Pindai untuk menyimpan kontak saya', value: () => buildVCard({ compact: true }) },
  web: { label: 'Website', caption: 'Pindai untuk membuka portofolio saya', value: () => site.url },
}

const btn = 'btn btn-ghost h-10 px-3.5 text-[13.5px]'

/** Ubah SVG QR menjadi PNG 1024px lalu unduh. */
async function downloadPng(svg, fileName) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1024
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(img, 0, 0, 1024, 1024)
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = fileName
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function CardFront() {
  const [first, ...rest] = profile.role.split('&')
  const words = profile.name.split(' ')
  return (
    <div className="relative flex aspect-[1.6/1] flex-col justify-between overflow-hidden rounded-[18px] border border-[#2e2e2e] bg-[#111111] p-[clamp(18px,4.5vw,30px)] text-[#dadada] shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
      {/* Pola karakter kode samar, senada dengan hero */}
      <p aria-hidden="true" className="pointer-events-none absolute right-5 bottom-4 hidden text-right font-mono text-[11px] leading-[1.9] tracking-[0.45em] text-[#2a2a2a] select-none sm:block">
        {'{ } < / > ; = ( )'}
        <br />
        {'INC REQ CHG SLA'}
        <br />
        {'0 1 [ ] # $ * +'}
      </p>
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-lg bg-[#dadada] font-display text-[13px] font-extrabold text-[#111111]">
          {profile.initials}
        </span>
        <span className="font-mono text-[11px] tracking-[0.12em] text-[#8fa6ff] uppercase">{domain}</span>
      </div>
      <div>
        <p className="font-serif text-[clamp(30px,7.5vw,46px)] leading-none tracking-[-0.015em] text-[#f0f0f0]">
          {words.slice(0, -1).join(' ')} <em className="serif-em">{words.at(-1)}</em>
        </p>
        <p className="mt-1.5 text-[clamp(12.5px,3.2vw,15px)] font-medium">
          {rest.length ? (
            <>
              {first.trim()} <span className="text-[#8fa6ff]">&amp;</span> {rest.join('&').trim()}
            </>
          ) : (
            profile.role
          )}
        </p>
      </div>
      <ul className="grid gap-0.5 font-mono text-[clamp(10.5px,2.6vw,12px)] text-[#a0a0a0]">
        <li>{profile.email}</li>
        {linkedin && <li>{linkedin.handle}</li>}
        <li>
          {profile.location}
          {profile.remote && ' · remote'}
        </li>
      </ul>
    </div>
  )
}

function CardBack({ svg, caption, value }) {
  return (
    <div className="flex aspect-[1.6/1] items-center gap-[clamp(14px,4vw,26px)] rounded-[18px] border border-[#e5e5e5] bg-white p-[clamp(18px,4.5vw,30px)] text-[#222222] shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
      <div
        role="img"
        aria-label={`QR code: ${caption.toLowerCase()}`}
        className="aspect-square h-full shrink-0 [&_svg]:size-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className="min-w-0">
        <p className="font-mono text-[11px] tracking-[0.12em] text-[#2246d6] uppercase">Kartu nama digital</p>
        <p className="mt-2 font-serif text-[clamp(20px,5vw,30px)] leading-[1.05]">{caption}</p>
        <p className="mt-2 truncate font-mono text-[11.5px] text-[#666666]" title={value}>
          {value.startsWith('BEGIN:VCARD') ? `${profile.name} · ${profile.email}` : domain}
        </p>
      </div>
    </div>
  )
}

export default function CardPage() {
  const [mode, setMode] = useState('contact')
  const [canShare, setCanShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const [full, setFull] = useState(false)
  const dialogRef = useRef(null)

  const current = MODES[mode]
  const value = useMemo(() => current.value(), [current])
  const svg = useMemo(() => qrSvg(value), [value])
  const pageUrl = `${site.url}/kartu`

  useEffect(() => setCanShare(typeof navigator !== 'undefined' && !!navigator.share), [])

  // Mode layar penuh: QR besar untuk dipindai saat bertemu langsung.
  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (full && !d.open) d.showModal()
    if (!full && d.open) d.close()
  }, [full])

  const share = async () => {
    if (canShare) {
      try {
        await navigator.share({ title: `${profile.name} — kartu nama`, text: profile.role, url: pageUrl })
      } catch {
        /* dibatalkan pengguna */
      }
      return
    }
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard tidak tersedia */
    }
  }

  return (
    <PageTransition>
      <Seo
        title="Kartu nama digital"
        description={`Kartu nama digital ${profile.name}: simpan kontak ke HP atau pindai QR code.`}
        path="/kartu"
        jsonLd={breadcrumbJsonLd(crumbs)}
      />
      <div className="container-page pb-18">
        <PageHeader
          title="Kartu nama digital"
          description="Simpan kontak saya langsung ke HP, atau tunjukkan QR code ini saat bertemu langsung."
          breadcrumb={crumbs}
        />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div>
            <p className="eyebrow mb-3">Depan</p>
            <CardFront />
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="eyebrow">Belakang</p>
              <div role="group" aria-label="Isi QR code" className="flex rounded-lg border border-line p-0.5">
                {Object.entries(MODES).map(([key, m]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={mode === key}
                    onClick={() => setMode(key)}
                    className={`cursor-pointer rounded-md px-3 py-1 text-[12.5px] font-medium transition ${
                      mode === key ? 'bg-fg text-bg' : 'text-muted hover:text-fg'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <CardBack svg={svg} caption={current.caption} value={value} />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <a href={vcardHref()} download={vcardFileName()} className="btn btn-primary h-10 px-4 text-[13.5px]">
            <Icon name="download" /> Simpan kontak (.vcf)
          </a>
          <button type="button" className={btn} onClick={() => setFull(true)}>
            <Icon name="expand" /> Tampilkan QR layar penuh
          </button>
          <button type="button" className={btn} onClick={() => downloadPng(svg, `qr-${mode}-${vcardFileName().replace('.vcf', '')}.png`)}>
            <Icon name="download" /> Unduh QR (PNG)
          </button>
          <button type="button" className={btn} onClick={share} aria-live="polite">
            <Icon name={copied ? 'check' : canShare ? 'share' : 'link'} /> {copied ? 'Link tersalin' : canShare ? 'Bagikan' : 'Salin link'}
          </button>
        </div>

        <p className="mt-5 max-w-[62ch] text-[14px] text-muted">
          QR <strong className="font-semibold text-fg">Kontak</strong> langsung menyimpan nama, jabatan, email, dan website ke HP
          tanpa internet. QR <strong className="font-semibold text-fg">Website</strong> membuka portofolio ini. Keduanya bisa dicetak
          di CV, kartu fisik, atau slide presentasi.
        </p>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="QR code layar penuh"
        onClose={() => setFull(false)}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-white"
      >
        <div className="grid place-items-center gap-5 p-6 text-center text-[#111111]">
          <div className="size-[min(78vmin,560px)] [&_svg]:size-full" dangerouslySetInnerHTML={{ __html: svg }} />
          <div>
            <p className="font-serif text-[clamp(28px,6vw,44px)] leading-none">{profile.name}</p>
            <p className="mt-2 text-[15px] text-[#555555]">{current.caption}</p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="cursor-pointer rounded-full border border-[#cccccc] bg-white px-5 py-2 text-[14px] font-semibold text-[#111111]"
          >
            Tutup
          </button>
        </div>
      </dialog>
    </PageTransition>
  )
}
