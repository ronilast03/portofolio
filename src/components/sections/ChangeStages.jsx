// Tahapan change request (ITSM), dari pengajuan sampai review pasca-implementasi.
export const STAGES = [
  { label: 'Diajukan', note: 'RFC' },
  { label: 'Dinilai', note: 'Risiko & dampak' },
  { label: 'Disetujui', note: 'CAB' },
  { label: 'Dibangun', note: 'Build' },
  { label: 'Diuji', note: 'UAT' },
  { label: 'Implemented', note: 'Go-live' },
  { label: 'Direview', note: 'PIR' },
]
const GO_LIVE = 5

/** Jumlah tahap yang sudah selesai. "Implemented" = semua tahap selesai. */
export const stagesDone = (project) =>
  (project.status ?? 'Implemented') === 'Implemented' ? STAGES.length : Math.max(0, Math.min(STAGES.length, project.stage ?? 0))

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7" />
    </svg>
  )
}

/**
 * Garis tahapan di bawah judul studi kasus.
 * Layar lebar: tujuh tahap berjajar. HP: bar ringkas "Tahap x dari 7".
 */
export default function ChangeStages({ project }) {
  const done = stagesDone(project)
  const current = STAGES[Math.max(0, done - 1)]

  return (
    <div className="mt-8">
      {/* Layar lebar */}
      <ol aria-label="Tahapan change" className="hidden grid-cols-7 rounded-[14px] border border-line px-5 py-4.5 md:grid">
        {STAGES.map((stage, i) => {
          const isDone = i < done
          const goLive = i === GO_LIVE && isDone
          return (
            <li key={stage.label} aria-current={i === done - 1 ? 'step' : undefined} className="flex min-w-0 flex-col gap-1.5">
              <span className="flex items-center">
                <span
                  className={`grid size-5.5 shrink-0 place-items-center rounded-full ${
                    goLive ? 'bg-ok text-bg' : isDone ? 'bg-fg text-bg' : 'border-2 border-line bg-bg'
                  }`}
                >
                  {isDone && <Check />}
                </span>
                {i < STAGES.length - 1 && <span aria-hidden="true" className={`h-[1.5px] flex-1 ${i < done - 1 ? 'bg-fg' : 'bg-line'}`} />}
              </span>
              <span className={`text-[14px] font-semibold ${goLive ? 'text-ok' : isDone ? '' : 'text-muted'}`}>
                {stage.label}
                <span className="sr-only">{isDone ? ' (selesai)' : ' (belum)'}</span>
              </span>
              <span className="truncate font-mono text-[11px] text-muted">{stage.note}</span>
            </li>
          )
        })}
      </ol>

      {/* HP */}
      <div className="rounded-xl border border-line px-4 py-3.5 md:hidden">
        <p className="flex justify-between gap-3 text-[13.5px]">
          <span className="font-semibold">
            Tahap {done} dari {STAGES.length}
          </span>
          <span className="font-mono text-[12px] text-muted">
            {current.label} ({current.note})
          </span>
        </p>
        <div aria-hidden="true" className="mt-2.5 grid grid-cols-7 gap-1">
          {STAGES.map((stage, i) => (
            <span
              key={stage.label}
              className={`h-1.25 rounded-full ${i < done ? (i === GO_LIVE ? 'bg-ok' : 'bg-fg') : 'bg-line'}`}
            />
          ))}
        </div>
        <p className="mt-2 font-mono text-[11px] text-muted">{STAGES.map((s) => s.note.split(' ')[0]).join(' · ')}</p>
      </div>
    </div>
  )
}
