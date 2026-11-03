import { useState } from 'react'
import Icon from '@/components/common/Icon'
import Reveal from '@/components/common/Reveal'
import SectionHeading from './SectionHeading'

/*
 * Lab interaktif: pengunjung mencoba menjadi agent service desk.
 * 1) Tebak jenis tiket (incident / service request / change).
 * 2) Lihat prioritasnya di matriks dampak × urgensi (bisa diubah sendiri).
 * Semua contoh tiket fiktif. Tambah atau ubah tiket di array TICKETS.
 */

const TYPES = [
  { id: 'incident', label: 'Incident', hint: 'Sesuatu rusak' },
  { id: 'request', label: 'Service request', hint: 'Meminta sesuatu' },
  { id: 'change', label: 'Change', hint: 'Mengubah sesuatu' },
]

const LEVELS = [
  { id: 2, label: 'Tinggi' },
  { id: 1, label: 'Sedang' },
  { id: 0, label: 'Rendah' },
]

// impact/urgency: 2 = tinggi, 1 = sedang, 0 = rendah
const TICKETS = [
  {
    from: 'Staf administrasi',
    text: 'Aplikasi absensi tidak bisa dibuka oleh semua karyawan di lantai 3 sejak pagi.',
    type: 'incident',
    impact: 2,
    urgency: 2,
    why: 'Layanan yang biasanya berjalan tiba-tiba terganggu, dan banyak orang terdampak. Ini incident dengan prioritas tertinggi.',
  },
  {
    from: 'Karyawan baru',
    text: 'Mohon dibuatkan akun email dan akses ke folder bersama tim saya.',
    type: 'request',
    impact: 0,
    urgency: 1,
    why: 'Tidak ada yang rusak. Pengguna meminta layanan standar yang prosesnya sudah jelas, jadi ini service request.',
  },
  {
    from: 'Tim infrastruktur',
    text: 'Rencana upgrade server database hari Sabtu pukul 22.00.',
    type: 'change',
    impact: 2,
    urgency: 0,
    why: 'Perubahan pada sistem yang bisa memengaruhi layanan. Harus dinilai risikonya dan disetujui dulu, jadi ini change.',
  },
  {
    from: 'Sekretaris divisi',
    text: 'Printer di ruang rapat mengeluarkan kertas kosong, padahal rapat dimulai satu jam lagi.',
    type: 'incident',
    impact: 0,
    urgency: 2,
    why: 'Perangkat tidak berfungsi sebagaimana mestinya, jadi incident. Dampaknya kecil, tapi waktunya mendesak.',
  },
  {
    from: 'Desainer grafis',
    text: 'Boleh minta dipasangkan software desain di laptop saya minggu ini?',
    type: 'request',
    impact: 0,
    urgency: 0,
    why: 'Permintaan instalasi software standar tanpa gangguan layanan. Service request dengan prioritas rendah.',
  },
  {
    from: 'Tim keamanan TI',
    text: 'Pemasangan patch keamanan di semua laptop kantor untuk menutup celah yang baru ditemukan.',
    type: 'change',
    impact: 2,
    urgency: 1,
    why: 'Mengubah konfigurasi banyak perangkat sekaligus. Ini change yang perlu dijadwalkan dan disetujui.',
  },
]

// Matriks prioritas umum di ITSM: [dampak][urgensi] -> P1 (paling mendesak) ... P5
const MATRIX = {
  2: { 2: 1, 1: 2, 0: 3 },
  1: { 2: 2, 1: 3, 0: 4 },
  0: { 2: 3, 1: 4, 0: 5 },
}
const PRIORITY_LABEL = { 1: 'Kritis', 2: 'Tinggi', 3: 'Sedang', 4: 'Rendah', 5: 'Terjadwal' }

const levelName = (id) => LEVELS.find((l) => l.id === id)?.label.toLowerCase()

function Segmented({ label, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      <span className="w-16 shrink-0 font-mono text-[11.5px] tracking-[0.06em] text-muted uppercase">{label}</span>
      <div className="flex flex-1 rounded-lg border border-line p-0.5">
        {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={value === l.id}
              onClick={() => onChange(l.id)}
              className={`flex-1 cursor-pointer rounded-md px-2 py-1.5 text-[13px] font-medium transition ${
                value === l.id ? 'bg-fg text-bg' : 'text-muted hover:text-fg'
              }`}
            >
              {l.label}
            </button>
          ))}
      </div>
    </div>
  )
}

export default function TicketLab() {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState(null)
  const [score, setScore] = useState({ right: 0, total: 0 })
  const [impact, setImpact] = useState(1)
  const [urgency, setUrgency] = useState(1)

  const ticket = TICKETS[index]
  const answered = answer !== null
  const correct = answer === ticket.type
  const priority = MATRIX[impact][urgency]
  const ticketId = `${ticket.type === 'incident' ? 'INC' : ticket.type === 'request' ? 'REQ' : 'CHG'}-${String(101 + index).padStart(4, '0')}`

  const choose = (type) => {
    if (answered) return
    setAnswer(type)
    setScore((s) => ({ right: s.right + (type === ticket.type ? 1 : 0), total: s.total + 1 }))
    // Tampilkan prioritas yang disarankan untuk tiket ini di matriks.
    setImpact(ticket.impact)
    setUrgency(ticket.urgency)
  }

  const next = () => {
    setIndex((i) => (i + 1) % TICKETS.length)
    setAnswer(null)
  }

  return (
    <section id="lab" aria-labelledby="lab-title" className="pb-14 lg:pb-20">
      <Reveal>
        <SectionHeading
          id="lab-title"
          title="Lab *interaktif*"
          description="Coba jadi agent service desk: tentukan jenis tiket, lalu lihat prioritasnya di matriks dampak × urgensi."
        />
      </Reveal>

      <Reveal delay={0.1} className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        {/* 1. Tiket masuk */}
        <div className="spotlight flex flex-col rounded-[14px] border border-line bg-surface">
          <div className="flex items-center justify-between gap-3 border-b border-dashed border-line px-5 py-3.5">
            <span className="font-mono text-[13px] font-medium">{answered ? ticketId : 'TIKET-BARU'}</span>
            <span className="font-mono text-[12px] text-muted">
              {index + 1}/{TICKETS.length} · Benar {score.right}/{score.total}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-4 px-5 pt-4.5 pb-5">
            <div>
              <p className="font-mono text-[11.5px] tracking-[0.06em] text-muted uppercase">Dari: {ticket.from}</p>
              <p className="mt-2 text-[clamp(18px,2vw,21px)] leading-snug font-medium">“{ticket.text}”</p>
            </div>

            <div>
              <p id="lab-question" className="mb-2 text-[13.5px] text-muted">
                Termasuk jenis tiket apa?
              </p>
              <div role="group" aria-labelledby="lab-question" className="grid gap-2 sm:grid-cols-3">
                {TYPES.map((t) => {
                  const isAnswer = answered && t.id === ticket.type
                  const isWrongPick = answered && t.id === answer && !correct
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => choose(t.id)}
                      aria-pressed={answer === t.id}
                      disabled={answered && !isAnswer && !isWrongPick}
                      className={`cursor-pointer rounded-[10px] border px-3 py-2.5 text-left transition disabled:cursor-default disabled:opacity-45 ${
                        isAnswer
                          ? 'border-ok bg-ok/10'
                          : isWrongPick
                            ? 'border-err bg-err/10'
                            : 'border-line bg-bg hover:border-fg'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2 text-[14.5px] font-semibold">
                        {t.label}
                        {isAnswer && <Icon name="check" className="size-4 text-ok" />}
                        {isWrongPick && <Icon name="close" className="size-4 text-err" />}
                      </span>
                      <span className="mt-0.5 block font-mono text-[11.5px] text-muted">{t.hint}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div aria-live="polite" className="min-h-[1px]">
              {answered && (
                <div className="lab-feedback rounded-[10px] border border-line bg-bg p-3.5 text-[14px]">
                  <p className={`font-semibold ${correct ? 'text-ok' : 'text-err'}`}>
                    {correct ? 'Tepat!' : `Belum tepat. Jawabannya ${TYPES.find((t) => t.id === ticket.type).label}.`}
                  </p>
                  <p className="mt-1 text-muted">{ticket.why}</p>
                </div>
              )}
            </div>

            <div className="mt-auto flex justify-end">
              <button type="button" className="btn btn-ghost" onClick={next} disabled={!answered}>
                Tiket berikutnya <Icon name="arrowRight" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Matriks prioritas */}
        <div className="flex flex-col gap-4 rounded-[14px] border border-line p-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-mono text-[11.5px] tracking-[0.06em] text-muted uppercase">Matriks prioritas</p>
            <p className="font-mono text-[11.5px] text-muted">dampak × urgensi</p>
          </div>

          <div className="grid gap-2">
            <Segmented label="Dampak" value={impact} onChange={setImpact} />
            <Segmented label="Urgensi" value={urgency} onChange={setUrgency} />
          </div>

          {/* Grid 3×3: baris = dampak (tinggi di atas), kolom = urgensi (tinggi di kiri) */}
          <div aria-hidden="true" className="grid grid-cols-[auto_repeat(3,1fr)] gap-1.5 font-mono text-[12px]">
            <span />
            {LEVELS.map((u) => (
              <span key={u.id} className="pb-0.5 text-center text-[10.5px] text-muted uppercase">
                {u.label}
              </span>
            ))}
            {LEVELS.map((imp) => (
              <div key={imp.id} className="contents">
                <span className="flex items-center pr-1 text-[10.5px] text-muted uppercase">{imp.label}</span>
                {LEVELS.map((urg) => {
                  const p = MATRIX[imp.id][urg.id]
                  const active = imp.id === impact && urg.id === urgency
                  return (
                    <button
                      key={urg.id}
                      type="button"
                      tabIndex={-1}
                      onClick={() => {
                        setImpact(imp.id)
                        setUrgency(urg.id)
                      }}
                      className={`lab-cell cursor-pointer rounded-md border py-2.5 text-center font-semibold transition ${
                        active ? 'lab-cell-active border-fg' : 'border-line hover:border-muted'
                      }`}
                      data-p={p}
                    >
                      P{p}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
          <p className="-mt-1.5 text-right font-mono text-[10.5px] text-muted">baris: dampak · kolom: urgensi</p>

          <div className="mt-auto rounded-[10px] bg-surface p-4" aria-live="polite">
            <p className="text-[13px] text-muted">
              Dampak {levelName(impact)}, urgensi {levelName(urgency)}:
            </p>
            <p className="mt-1 flex items-baseline gap-2.5">
              <span className="font-display text-[40px] leading-none font-extrabold tracking-tight">P{priority}</span>
              <span className="font-semibold">{PRIORITY_LABEL[priority]}</span>
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
