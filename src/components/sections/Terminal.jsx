import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { profile, socials, experience } from '@/data/profile'
import { skillGroups } from '@/data/skills'
import { projects } from '@/data/projects'
import { certificates } from '@/data/certificates'
import { changes } from '@/data/changelog'
import { site } from '@/data/site'
import { latestPosts } from '@/utils/blog'
import { formatMonth } from '@/utils/date'
import { openCommandPalette } from '@/utils/commandPalette'

const PROMPT = 'tamu@ronilesmana:~$'

// Halaman yang bisa dituju dengan "cd <nama>"
const PAGES = {
  home: '/',
  about: '/about',
  projects: '/projects',
  blog: '/blog',
  contact: '/contact',
  sertifikat: '/about#sertifikat',
  lab: '/#lab',
  changelog: '/changelog',
  kartu: '/kartu',
}

const COMMANDS = {
  help: 'daftar perintah',
  whoami: 'siapa saya',
  about: 'ringkasan singkat',
  skills: 'keahlian dan levelnya',
  projects: 'daftar proyek (open <nomor> untuk membuka)',
  experience: 'pengalaman kerja',
  certs: 'sertifikat',
  blog: 'artikel terbaru',
  changelog: 'perubahan terbaru di website ini',
  contact: 'cara menghubungi saya',
  cv: 'unduh CV',
  card: 'kartu nama digital + QR code',
  ls: 'daftar halaman',
  cd: 'pindah halaman, contoh: cd blog',
  theme: 'ganti tema terang/gelap',
  search: 'buka command palette (Ctrl+K)',
  date: 'tanggal hari ini',
  echo: 'cetak teks',
  history: 'riwayat perintah',
  clear: 'bersihkan layar',
}

const A = ({ to, href, children }) =>
  to ? (
    <Link to={to} className="term-link">
      {children}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className="term-link">
      {children}
    </a>
  )

const Dim = ({ children }) => <span className="text-[#8a8a8a]">{children}</span>
const Acc = ({ children }) => <span className="text-[#8fa6ff]">{children}</span>

let lineId = 0
const line = (content, kind = 'out') => ({ id: ++lineId, content, kind })

const welcome = () => [
  line(
    <>
      Selamat datang di terminal <Acc>{profile.name}</Acc>.
    </>,
  ),
  line(
    <>
      Ketik <Acc>help</Acc> untuk melihat perintah. Tekan <Acc>Tab</Acc> untuk melengkapi, <Acc>↑ ↓</Acc> untuk riwayat.
    </>,
  ),
]

/** Terminal mini di halaman About: pengunjung bisa "menjelajah" profil lewat perintah. */
export default function Terminal() {
  const navigate = useNavigate()
  const [lines, setLines] = useState(welcome)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [cursor, setCursor] = useState(-1) // posisi saat menelusuri riwayat
  const inputRef = useRef(null)
  const outRef = useRef(null)

  // Gulir output ke bawah setiap ada baris baru (tanpa menggulir halaman).
  useEffect(() => {
    const el = outRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const print = (...newLines) => setLines((prev) => [...prev, ...newLines].slice(-300))

  const execute = (raw) => {
    const text = raw.trim()
    const echoLine = line(text, 'cmd')
    if (!text) return print(echoLine)
    const [cmd, ...args] = text.split(/\s+/)
    const name = cmd.toLowerCase()
    const arg = args.join(' ')
    const out = []

    switch (name) {
      case 'help':
        out.push(
          ...Object.entries(COMMANDS).map(([c, d]) =>
            line(
              <>
                <Acc>{c.padEnd(11, ' ')}</Acc>
                <Dim>{d}</Dim>
              </>,
            ),
          ),
        )
        break
      case 'whoami':
        out.push(line(`${profile.name} — ${profile.role}`))
        out.push(line(<Dim>{`${profile.location}${profile.remote ? ' · bisa remote' : ''} · ${profile.availability}`}</Dim>))
        break
      case 'about':
        out.push(line(profile.summary))
        break
      case 'skills':
        skillGroups.forEach((g) => {
          out.push(line(<Acc>{`# ${g.group}`}</Acc>))
          g.items.forEach((s) => {
            const lvl = { dasar: 1, menengah: 2, mahir: 3 }[s.level] || 1
            out.push(
              line(
                <>
                  {'  '}
                  {s.name.padEnd(22, ' ')}
                  <span className="text-[#5cc08a]">{'■'.repeat(lvl)}</span>
                  <Dim>{'□'.repeat(3 - lvl)} {s.level}</Dim>
                </>,
              ),
            )
          })
        })
        break
      case 'projects':
        projects.forEach((p, i) =>
          out.push(
            line(
              <>
                <Dim>[{i + 1}]</Dim> <A to={`/projects/${p.slug}`}>{p.title}</A> <Dim>· {p.category} · {p.year}</Dim>
              </>,
            ),
          ),
        )
        out.push(line(<Dim>Ketik open &lt;nomor&gt; untuk membuka proyek.</Dim>))
        break
      case 'open': {
        const p = projects[Number(arg) - 1]
        if (p) {
          out.push(line(<Dim>Membuka {p.title}…</Dim>))
          setTimeout(() => navigate(`/projects/${p.slug}`), 350)
        } else out.push(line(`open: nomor proyek tidak ada. Pilih 1–${projects.length}.`, 'err'))
        break
      }
      case 'experience':
        experience.forEach((e) => {
          out.push(
            line(
              <>
                <Acc>{e.period}</Acc> {e.title}
              </>,
            ),
          )
          out.push(line(<Dim>{`  ${e.organization}`}</Dim>))
        })
        break
      case 'certs':
        certificates.forEach((c) =>
          out.push(
            line(
              <>
                <span className="text-[#5cc08a]">✔</span> {c.url ? <A href={c.url}>{c.title}</A> : c.title}{' '}
                <Dim>· {c.issuer} · {formatMonth(c.date)}</Dim>
              </>,
            ),
          ),
        )
        break
      case 'blog':
        latestPosts(5).forEach((p) =>
          out.push(
            line(
              <>
                <Dim>-</Dim> <A to={`/blog/${p.slug}`}>{p.title}</A>
              </>,
            ),
          ),
        )
        break
      case 'changelog':
        changes.slice(0, 5).forEach((c) =>
          out.push(
            line(
              <>
                <Acc>{c.id}</Acc> {c.title} <Dim>· {c.category} · {c.status}</Dim>
              </>,
            ),
          ),
        )
        out.push(
          line(
            <>
              <Dim>Selengkapnya:</Dim> <A to="/changelog">/changelog</A>
            </>,
          ),
        )
        break
      case 'contact':
        out.push(
          line(
            <>
              email{' '.repeat(4)}<A href={`mailto:${profile.email}`}>{profile.email}</A>
            </>,
          ),
        )
        socials.forEach((s) =>
          out.push(
            line(
              <>
                {s.label.toLowerCase().padEnd(9, ' ')}
                <A href={s.url}>{s.handle}</A>
              </>,
            ),
          ),
        )
        out.push(
          line(
            <>
              form{' '.repeat(5)}<A to="/contact">/contact</A> <Dim>· respons {profile.responseTime}</Dim>
            </>,
          ),
        )
        break
      case 'card':
        out.push(line(<Acc>{`┌${'─'.repeat(34)}┐`}</Acc>))
        out.push(line(<Acc>{`│ ${profile.name.padEnd(33, '\u00a0')}│`}</Acc>))
        out.push(line(<Acc>{`│ ${profile.role.slice(0, 33).padEnd(33, '\u00a0')}│`}</Acc>))
        out.push(line(<Acc>{`│ ${profile.email.slice(0, 33).padEnd(33, '\u00a0')}│`}</Acc>))
        out.push(line(<Acc>{`└${'─'.repeat(34)}┘`}</Acc>))
        out.push(
          line(
            <>
              <Dim>Simpan kontak & QR code:</Dim> <A to="/kartu">/kartu</A>
            </>,
          ),
        )
        break
      case 'cv':
        out.push(
          line(
            <>
              <A href={site.cvPath}>Unduh CV (PDF)</A>
            </>,
          ),
        )
        break
      case 'ls':
        out.push(line(<Acc>{Object.keys(PAGES).join('   ')}</Acc>))
        break
      case 'cd': {
        const target = PAGES[arg.toLowerCase().replace(/^\/|\/$/g, '')] ?? (arg === '~' || arg === '' ? '/' : null)
        if (target) {
          out.push(line(<Dim>Pindah ke {target}…</Dim>))
          setTimeout(() => navigate(target), 350)
        } else out.push(line(`cd: ${arg}: halaman tidak ditemukan. Coba ls.`, 'err'))
        break
      }
      case 'theme': {
        const isDark = document.documentElement.classList.contains('dark')
        const want = arg.toLowerCase()
        if ((want === 'dark' && isDark) || (want === 'light' && !isDark)) {
          out.push(line(<Dim>Tema sudah {want}.</Dim>))
        } else {
          document.querySelector('[data-theme-toggle]')?.click()
          out.push(line(<Dim>Tema diganti ke {isDark ? 'light' : 'dark'}.</Dim>))
        }
        break
      }
      case 'search':
        openCommandPalette()
        break
      case 'date':
        out.push(
          line(
            new Date().toLocaleString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          ),
        )
        break
      case 'echo':
        out.push(line(arg))
        break
      case 'history':
        history.forEach((h, i) => out.push(line(<Dim>{`${String(i + 1).padStart(3, ' ')}  ${h}`}</Dim>)))
        break
      case 'clear':
        setLines([])
        setHistory((h) => [...h, text])
        return
      case 'sudo':
        out.push(line('Akses ditolak: kamu tidak terdaftar di sudoers.', 'err'))
        out.push(line(<Dim>Insiden INC-0001 sudah dicatat dan diteruskan ke service desk. 😉</Dim>))
        break
      case 'exit':
        out.push(line(<Dim>Tidak ada jalan keluar dari portofolio ini. Coba cd home. 🙂</Dim>))
        break
      default:
        out.push(line(`${cmd}: perintah tidak dikenal. Ketik help.`, 'err'))
    }

    setHistory((h) => [...h, text])
    print(echoLine, ...out)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      execute(input)
      setInput('')
      setCursor(-1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const next = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1)
      setCursor(next)
      setInput(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (cursor === -1) return
      const next = cursor + 1
      if (next >= history.length) {
        setCursor(-1)
        setInput('')
      } else {
        setCursor(next)
        setInput(history[next])
      }
    } else if (e.key === 'Tab') {
      // Lengkapi nama perintah atau nama halaman (untuk cd)
      const [cmd, ...rest] = input.split(' ')
      if (!input) return
      e.preventDefault()
      if (rest.length === 0) {
        const match = [...Object.keys(COMMANDS), 'open'].filter((c) => c.startsWith(cmd.toLowerCase()))
        if (match.length === 1) setInput(`${match[0]} `)
        else if (match.length > 1) print(line(input, 'cmd'), line(<Dim>{match.join('   ')}</Dim>))
      } else if (cmd === 'cd') {
        const partial = rest.join(' ').toLowerCase()
        const match = Object.keys(PAGES).filter((p) => p.startsWith(partial))
        if (match.length === 1) setInput(`cd ${match[0]}`)
        else if (match.length > 1) print(line(input, 'cmd'), line(<Dim>{match.join('   ')}</Dim>))
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div
      className="terminal overflow-hidden rounded-[14px] border border-[#2e2e2e] transition-colors focus-within:border-[#8fa6ff] bg-[#111111] font-mono text-[13px] leading-[1.7] text-[#dadada] shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
      onClick={() => {
        // Klik di area terminal memfokuskan input (kecuali sedang memilih teks atau klik link)
        if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true })
      }}
    >
      <div className="flex items-center gap-2 border-b border-[#2a2a2a] px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="size-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="ml-3 text-[12px] text-[#8a8a8a]">ronilesmana — zsh</span>
      </div>
      <div ref={outRef} role="log" aria-live="polite" aria-label="Output terminal" className="h-[340px] overflow-y-auto px-4 pt-3 pb-1">
        {lines.map((l) => (
          <div
            key={l.id}
            className={`break-words whitespace-pre-wrap ${l.kind === 'err' ? 'text-[#ff8a80]' : ''}`}
          >
            {l.kind === 'cmd' ? (
              <>
                <span className="text-[#5cc08a]">{PROMPT}</span> {l.content}
              </>
            ) : (
              l.content
            )}
          </div>
        ))}
        <div className="flex items-center gap-2 pb-3">
          <label htmlFor="terminal-input" className="shrink-0 text-[#5cc08a]">
            {PROMPT}
            <span className="sr-only"> ketik perintah</span>
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            enterKeyHint="send"
            placeholder="help"
            className="min-w-0 flex-1 bg-transparent text-[16px] text-[#f0f0f0] caret-[#8fa6ff] outline-none placeholder:text-[#5a5a5a] md:text-[13px]"
          />
        </div>
      </div>
    </div>
  )
}
