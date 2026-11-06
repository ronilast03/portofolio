import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Icon from '@/components/common/Icon'
import { navigation, site } from '@/data/site'
import { profile, socials } from '@/data/profile'
import { projects } from '@/data/projects'
import { posts } from '@/utils/blog'
import { formatDate } from '@/utils/date'
import { OPEN_PALETTE_EVENT, normalize } from '@/utils/commandPalette'
import { useTheme } from '@/hooks/useTheme'

const GROUP_LIMIT_EMPTY = 4 // saat kolom pencarian masih kosong, tiap grup dibatasi

/**
 * Command palette (Ctrl+K / ⌘K / "/"): cari halaman, proyek, artikel, dan jalankan aksi cepat.
 * Memakai <dialog> bawaan browser (fokus terkunci, Esc menutup) dan pola ARIA combobox + listbox.
 */
// Kata kunci tambahan untuk menu utama (supaya mudah dicari)
const NAV_KEYWORDS = { '/layanan': 'layanan jasa service catalog katalog website aplikasi kasir umkm service desk pesan' }

export default function CommandPalette() {
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const listId = useId()

  // ---------- Daftar perintah ----------
  const groups = useMemo(() => {
    const pages = [
      ...navigation.map((n) => ({ label: n.label, hint: n.to, to: n.to, keywords: NAV_KEYWORDS[n.to] ?? '' })),
      { label: 'Sertifikat', hint: '/about#sertifikat', to: '/about#sertifikat', keywords: 'sertifikat cisco dicoding udemy' },
      { label: 'Lab interaktif', hint: '/#lab', to: '/#lab', keywords: 'lab triase tiket itsm prioritas' },
      { label: 'Terminal', hint: '/#terminal', to: '/#terminal', keywords: 'terminal command cli' },
      { label: 'Kartu nama digital', hint: '/kartu', to: '/kartu', keywords: 'kartu nama qr code vcard kontak simpan card' },
      { label: 'Changelog', hint: '/changelog', to: '/changelog', keywords: 'changelog perubahan riwayat versi chg' },
      { label: 'Peta keahlian (CMDB)', hint: '/cmdb', to: '/cmdb', keywords: 'cmdb peta keahlian skill teknologi relasi ci configuration item' },
      { label: 'Kebijakan privasi', hint: '/privacy-policy', to: '/privacy-policy', keywords: 'privacy' },
    ].map((p) => ({ ...p, id: `page-${p.to}`, icon: 'page', group: 'Halaman' }))

    const actions = [
      {
        id: 'act-theme',
        label: theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap',
        keywords: 'tema theme dark light gelap terang',
        icon: theme === 'dark' ? 'sun' : 'moon',
        run: () => toggleTheme(),
      },
      {
        id: 'act-email',
        label: copied ? 'Email tersalin' : 'Salin alamat email',
        hint: profile.email,
        keywords: 'email kontak copy salin',
        icon: copied ? 'check' : 'copy',
        keepOpen: true,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email)
            setCopied(true)
            setTimeout(() => {
              setCopied(false)
              dialogRef.current?.close()
            }, 900)
          } catch {
            window.location.href = `mailto:${profile.email}`
          }
        },
      },
      { id: 'act-ticket', label: 'Buat permintaan / kirim pesan', keywords: 'kontak tiket hubungi', icon: 'arrowRight', to: '/contact' },
      { id: 'act-cv', label: 'Unduh CV', keywords: 'cv resume', icon: 'download', href: site.cvPath, download: true },
      ...socials.map((s) => ({
        id: `social-${s.label}`,
        label: `Buka ${s.label}`,
        hint: s.handle,
        keywords: 'sosial media',
        icon: 'external',
        href: s.url,
      })),
    ].map((a) => ({ ...a, group: 'Aksi' }))

    const projectItems = projects.map((p) => ({
      id: `project-${p.slug}`,
      label: p.title,
      hint: `${p.category} · ${p.year}`,
      keywords: `${p.summary} ${(p.stack || []).join(' ')}`,
      icon: 'folder',
      to: `/projects/${p.slug}`,
      group: 'Proyek',
    }))

    const postItems = posts.map((p) => ({
      id: `post-${p.slug}`,
      label: p.title,
      hint: formatDate(p.date),
      keywords: `${p.description} ${(p.tags || []).join(' ')} ${p.category}`,
      icon: 'article',
      to: `/blog/${p.slug}`,
      group: 'Artikel',
    }))

    return [
      { name: 'Halaman', items: pages },
      { name: 'Aksi', items: actions },
      { name: 'Proyek', items: projectItems },
      { name: 'Artikel', items: postItems },
    ]
  }, [theme, toggleTheme, copied])

  // ---------- Pencarian ----------
  const results = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean)
    return groups
      .map((g) => {
        let items = g.items
        if (words.length) {
          items = items
            .map((it) => {
              const label = normalize(it.label)
              const haystack = `${label} ${normalize(it.hint)} ${normalize(it.keywords)}`
              if (!words.every((w) => haystack.includes(w))) return null
              // Cocok di awal judul -> lebih atas
              const score = label.startsWith(words[0]) ? 0 : label.includes(words[0]) ? 1 : 2
              return { it, score }
            })
            .filter(Boolean)
            .sort((a, b) => a.score - b.score)
            .map((x) => x.it)
        } else {
          items = items.slice(0, GROUP_LIMIT_EMPTY)
        }
        return { ...g, items }
      })
      .filter((g) => g.items.length)
  }, [groups, query])

  const flat = useMemo(() => results.flatMap((g) => g.items), [results])

  // ---------- Buka / tutup ----------
  useEffect(() => {
    const show = () => setOpen(true)
    const onKey = (e) => {
      const typing = /^(input|textarea|select)$/i.test(e.target?.tagName) || e.target?.isContentEditable
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setOpen((v) => !v)
      } else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener(OPEN_PALETTE_EVENT, show)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener(OPEN_PALETTE_EVENT, show)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setQuery('')
      setActive(0)
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
      requestAnimationFrame(() => inputRef.current?.focus())
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const onClose = () => {
      document.documentElement.style.overflow = ''
      setOpen(false)
    }
    dialog.addEventListener('close', onClose)
    return () => dialog.removeEventListener('close', onClose)
  }, [])

  // Pilihan aktif kembali ke atas saat kata kunci berubah, dan selalu terlihat di daftar.
  useEffect(() => setActive(0), [query])
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  // ---------- Jalankan ----------
  const run = useCallback(
    (item) => {
      if (!item) return
      if (!item.keepOpen) dialogRef.current?.close()
      if (item.run) item.run()
      else if (item.to) navigate(item.to)
      else if (item.href) {
        if (item.download) {
          const a = document.createElement('a')
          a.href = item.href
          a.download = ''
          a.click()
        } else window.open(item.href, '_blank', 'noopener')
      }
    },
    [navigate],
  )

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(Math.max(0, flat.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(flat[active])
    }
  }

  let index = -1
  const activeId = flat[active] ? `${listId}-${flat[active].id}` : undefined

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
      className="palette-dialog mx-auto mt-[12vh] mb-auto w-[min(620px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-line bg-bg p-0 text-fg shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div onKeyDown={onKeyDown}>
          <div className="flex items-center gap-3 border-b border-line px-4">
            <Icon name="search" className="size-4.5 shrink-0 text-muted" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={activeId}
              aria-autocomplete="list"
              aria-label="Cari halaman, proyek, artikel, atau aksi"
              placeholder="Cari atau ketik perintah…"
              autoComplete="off"
              spellCheck="false"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 min-w-0 flex-1 bg-transparent text-[16px] text-fg outline-none placeholder:text-muted"
            />
            <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted sm:block">esc</kbd>
          </div>

          <div ref={listRef} id={listId} role="listbox" aria-label="Hasil" className="max-h-[min(60vh,440px)] overflow-y-auto p-2">
            {results.length === 0 && (
              <p className="px-3 py-10 text-center text-[14px] text-muted">
                Tidak ada hasil untuk “{query}”.
              </p>
            )}
            {results.map((g) => (
              <div key={g.name} role="group" aria-label={g.name} className="mb-1.5 last:mb-0">
                <p className="px-3 pt-2 pb-1.5 font-mono text-[11px] tracking-[0.08em] text-muted uppercase" aria-hidden="true">
                  {g.name}
                </p>
                {g.items.map((item) => {
                  index += 1
                  const i = index
                  const selected = i === active
                  return (
                    <div
                      key={item.id}
                      id={`${listId}-${item.id}`}
                      role="option"
                      aria-selected={selected}
                      data-index={i}
                      onMouseMove={() => !selected && setActive(i)}
                      onClick={() => run(item)}
                      className={`flex cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2.5 ${selected ? 'bg-surface' : ''}`}
                    >
                      <Icon name={item.icon} className={`size-4 shrink-0 ${selected ? 'text-accent' : 'text-muted'}`} />
                      <span className="min-w-0 flex-1 truncate text-[14.5px] font-medium">{item.label}</span>
                      {item.hint && (
                        <span className="hidden max-w-[45%] truncate font-mono text-[11.5px] text-muted sm:block">{item.hint}</span>
                      )}
                      <span aria-hidden="true" className={`font-mono text-[12px] text-muted ${selected ? '' : 'invisible'}`}>
                        ↵
                      </span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[11px] text-muted">
            <span>↑↓ pilih</span>
            <span>↵ buka</span>
            <span className="hidden sm:inline">esc tutup</span>
            <span className="ml-auto">{flat.length} hasil</span>
          </div>
        </div>
      )}
    </dialog>
  )
}
