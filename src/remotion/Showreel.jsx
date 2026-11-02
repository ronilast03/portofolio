// Video showreel portofolio, dibuat dengan Remotion.
// Komposisi ini hanya dimuat saat bagian "Sekilas karya" di Home terlihat (lihat ShowreelSection).
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'

export const SHOWREEL = {
  fps: 30,
  width: 1280,
  height: 720,
  intro: 75, // 2,5 detik
  perProject: 105, // 3,5 detik per proyek
  outro: 75,
}

export const showreelDuration = (projectCount) =>
  SHOWREEL.intro + SHOWREEL.perProject * projectCount + SHOWREEL.outro

const C = {
  bg: '#111111',
  surface: '#1B1B1B',
  fg: '#DADADA',
  muted: '#A0A0A0',
  line: '#333333',
  accent: '#8FA6FF',
}
const FONT = {
  display: "'Plus Jakarta Sans Variable', ui-sans-serif, system-ui, sans-serif",
  body: "'Inter Variable', ui-sans-serif, system-ui, sans-serif",
  mono: "'JetBrains Mono Variable', ui-monospace, monospace",
}
const ease = Easing.bezier(0.22, 1, 0.36, 1)

/** Nilai 0→1 dengan easing halus antara frame a dan b. */
const ramp = (frame, a, b) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease })

/** Fade-out di ujung scene supaya pergantian scene tidak patah. */
const fadeOut = (frame, total, len = 12) =>
  interpolate(frame, [total - len, total], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

function Backdrop() {
  // Garis grid tipis sebagai tekstur latar.
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        backgroundImage: `linear-gradient(${C.line}55 1px, transparent 1px), linear-gradient(90deg, ${C.line}55 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        backgroundPosition: '-1px -1px',
      }}
    />
  )
}

function Intro({ name, role, count }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const words = name.split(' ')
  const out = fadeOut(frame, SHOWREEL.intro)

  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '0 120px', opacity: out }}>
      <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: 3, color: C.accent, opacity: ramp(frame, 0, 15) }}>
        PORTFOLIO · {String(count).padStart(2, '0')} PROYEK
      </div>
      <div style={{ display: 'flex', gap: 28, marginTop: 18, overflow: 'hidden', paddingBottom: 10 }}>
        {words.map((w, i) => {
          const s = spring({ frame: frame - 6 - i * 5, fps, config: { damping: 200 } })
          return (
            <span
              key={w + i}
              style={{
                fontFamily: FONT.display,
                fontWeight: 800,
                fontSize: 128,
                lineHeight: 1,
                letterSpacing: -4,
                color: C.fg,
                transform: `translateY(${(1 - s) * 110}%)`,
                display: 'inline-block',
              }}
            >
              {w}
            </span>
          )
        })}
      </div>
      <div
        style={{
          height: 4,
          width: 160,
          marginTop: 30,
          background: C.accent,
          transformOrigin: 'left',
          transform: `scaleX(${ramp(frame, 18, 40)})`,
        }}
      />
      <div
        style={{
          fontFamily: FONT.display,
          fontWeight: 600,
          fontSize: 38,
          color: C.muted,
          marginTop: 28,
          opacity: ramp(frame, 22, 40),
          transform: `translateY(${(1 - ramp(frame, 22, 40)) * 16}px)`,
        }}
      >
        {role}
      </div>
    </AbsoluteFill>
  )
}

function ProjectScene({ project, index, total }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const len = SHOWREEL.perProject
  const out = fadeOut(frame, len)
  const enter = spring({ frame, fps, config: { damping: 200 } })
  const zoom = interpolate(frame, [0, len], [1, 1.06])

  return (
    <AbsoluteFill style={{ opacity: out }}>
      {/* Kolom teks */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 0,
          bottom: 0,
          width: 430,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontSize: 20, color: C.muted, opacity: ramp(frame, 0, 12) }}>
          <span style={{ color: C.accent }}>{String(index + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
          <span style={{ marginLeft: 18, letterSpacing: 2 }}>{project.category.toUpperCase()}</span>
        </div>
        <div
          style={{
            fontFamily: FONT.display,
            fontWeight: 800,
            fontSize: project.title.length > 34 ? 42 : 52,
            lineHeight: 1.12,
            letterSpacing: -1.2,
            color: C.fg,
            marginTop: 18,
            opacity: ramp(frame, 4, 20),
            transform: `translateY(${(1 - ramp(frame, 4, 20)) * 24}px)`,
          }}
        >
          {project.title}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28 }}>
          {project.stack.slice(0, 4).map((s, i) => {
            const t = ramp(frame, 14 + i * 4, 28 + i * 4)
            return (
              <span
                key={s}
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 18,
                  color: C.fg,
                  border: `1px solid ${C.line}`,
                  background: C.surface,
                  borderRadius: 8,
                  padding: '6px 12px',
                  opacity: t,
                  transform: `translateY(${(1 - t) * 12}px)`,
                }}
              >
                {s}
              </span>
            )
          })}
        </div>
      </div>

      {/* Gambar proyek */}
      <div
        style={{
          position: 'absolute',
          right: 70,
          top: 110,
          width: 640,
          height: 500,
          borderRadius: 18,
          overflow: 'hidden',
          border: `1px solid ${C.line}`,
          background: C.surface,
          boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
          opacity: enter,
          transform: `translateX(${(1 - enter) * 120}px)`,
        }}
      >
        {project.thumbnail && (
          <img
            src={project.thumbnail}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${zoom})`,
            }}
          />
        )}
      </div>

      {/* Garis progres proyek */}
      <div style={{ position: 'absolute', left: 90, right: 90, bottom: 48, display: 'flex', gap: 8 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{ flex: 1, height: 3, background: C.line, borderRadius: 2, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: C.accent,
                width: i < index ? '100%' : i === index ? `${interpolate(frame, [0, len], [0, 100])}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}

function Outro({ name }) {
  const frame = useCurrentFrame()
  const t = ramp(frame, 0, 20)
  const out = fadeOut(frame, SHOWREEL.outro, 15)

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', opacity: out }}>
      <div
        style={{
          fontFamily: FONT.display,
          fontWeight: 800,
          fontSize: 76,
          letterSpacing: -2,
          color: C.fg,
          opacity: t,
          transform: `translateY(${(1 - t) * 20}px)`,
        }}
      >
        Lihat semua proyek <span style={{ color: C.accent }}>→</span>
      </div>
      <div style={{ fontFamily: FONT.mono, fontSize: 22, letterSpacing: 3, color: C.muted, marginTop: 22, opacity: ramp(frame, 10, 28) }}>
        {name.toUpperCase()} · PORTFOLIO
      </div>
    </AbsoluteFill>
  )
}

export default function Showreel({ name, role, projects }) {
  const total = projects.length
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Backdrop />
      <Sequence durationInFrames={SHOWREEL.intro} name="Intro">
        <Intro name={name} role={role} count={total} />
      </Sequence>
      {projects.map((p, i) => (
        <Sequence
          key={p.slug}
          from={SHOWREEL.intro + i * SHOWREEL.perProject}
          durationInFrames={SHOWREEL.perProject}
          name={p.title}
        >
          <ProjectScene project={p} index={i} total={total} />
        </Sequence>
      ))}
      <Sequence from={SHOWREEL.intro + total * SHOWREEL.perProject} durationInFrames={SHOWREEL.outro} name="Outro">
        <Outro name={name} />
      </Sequence>
    </AbsoluteFill>
  )
}
