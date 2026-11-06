// =====================================================================
// PETA KEAHLIAN (CMDB) — dibangun OTOMATIS dari data yang sudah ada:
// - proyek & tech stack   : src/data/projects.js (field "stack")
// - level skill           : src/data/skills.js
// - sertifikat            : src/data/certificates.js (field "skills")
// - layanan terkait       : src/data/services.js (lewat proyek bukti)
// Teknologi yang belum dipakai di proyek atau sertifikat mana pun tidak tampil di peta.
// =====================================================================
import { projects } from '@/data/projects'
import { skillGroups } from '@/data/skills'
import { certificates } from '@/data/certificates'
import { services } from '@/data/services'

// Nama berbeda untuk teknologi yang sama -> satu nama
const ALIASES = {
  'Laravel 12': 'Laravel',
  Tailwind: 'Tailwind CSS',
  'HTML/CSS': 'HTML & CSS',
  HTML: 'HTML & CSS',
  CSS: 'HTML & CSS',
  JS: 'JavaScript',
}

// Kelompok kolom teknologi (urutan = urutan di peta). Teknologi lain masuk "Library & tools".
const GROUPS = [
  { name: 'Frontend', items: ['React', 'React Native', 'Tailwind CSS', 'JavaScript', 'HTML & CSS', 'TypeScript'] },
  { name: 'Backend & data', items: ['Laravel', 'PHP', 'REST API', 'MySQL', 'Python', 'Node.js'] },
  { name: 'Library & tools', items: [] },
]

// Kelas CI per teknologi
const TECH_CLASS = {
  React: 'Library UI',
  'React Native': 'Framework mobile',
  'Tailwind CSS': 'Framework CSS',
  JavaScript: 'Bahasa pemrograman',
  TypeScript: 'Bahasa pemrograman',
  'HTML & CSS': 'Bahasa markup & gaya',
  Laravel: 'Framework backend',
  PHP: 'Bahasa pemrograman',
  MySQL: 'Database',
  Python: 'Bahasa pemrograman',
  Vite: 'Build tool',
  Expo: 'Platform mobile',
  Leaflet: 'Library peta',
}

const LEVEL_LABEL = { dasar: 'Dasar', menengah: 'Menengah', mahir: 'Mahir' }

export const techName = (name) => ALIASES[name] ?? name
const pad = (n) => String(n).padStart(2, '0')

function build() {
  const thisYear = new Date().getFullYear()
  const levels = new Map(skillGroups.flatMap((g) => g.items.map((i) => [techName(i.name), i.level])))

  // Proyek, urut nomor change
  const projectCis = [...projects]
    .sort((a, b) => String(a.changeId ?? a.year).localeCompare(String(b.changeId ?? b.year)))
    .map((p) => ({
      key: `p:${p.slug}`,
      type: 'project',
      id: p.changeId ?? p.slug,
      name: p.title.split(' - ')[0],
      fullName: p.title,
      year: p.year,
      category: p.category,
      status: p.status ?? 'Implemented',
      slug: p.slug,
      techs: [...new Set(p.stack.map(techName))],
    }))

  const certCis = certificates
    .filter((c) => c.skills?.length)
    .map((c, i) => ({
      key: `c:${i}`,
      type: 'cert',
      id: `CI-CERT-${pad(i + 1)}`,
      name: c.title,
      issuer: c.issuer,
      date: c.date,
      url: c.url,
      techs: c.skills.map(techName),
    }))

  // Teknologi: semua yang muncul di proyek atau sertifikat
  const names = [...new Set([...projectCis.flatMap((p) => p.techs), ...certCis.flatMap((c) => c.techs)])]
  const groupOf = (n) => GROUPS.find((g) => g.items.includes(n)) ?? GROUPS[GROUPS.length - 1]
  const order = (n) => {
    const g = groupOf(n)
    const i = g.items.indexOf(n)
    return GROUPS.indexOf(g) * 100 + (i < 0 ? 50 : i)
  }
  const techCis = names
    .sort((a, b) => order(a) - order(b) || a.localeCompare(b))
    .map((n, i) => {
      const usedIn = projectCis.filter((p) => p.techs.includes(n))
      const years = usedIn.map((p) => Number(p.year)).filter(Boolean)
      const last = usedIn.reduce((best, p) => (!best || Number(p.year) >= Number(best.year) ? p : best), null)
      const first = usedIn.reduce((best, p) => (!best || Number(p.year) < Number(best.year) ? p : best), null)
      return {
        key: `t:${n}`,
        type: 'tech',
        id: `CI-TECH-${pad(i + 1)}`,
        name: n,
        group: groupOf(n).name,
        className: TECH_CLASS[n] ?? 'Teknologi',
        level: LEVEL_LABEL[levels.get(n)] ?? null,
        status: !usedIn.length ? 'Dipelajari' : Math.max(...years) >= thisYear - 1 ? 'Aktif dipakai' : 'Pernah dipakai',
        first,
        last,
      }
    })

  // Relasi: proyek -> teknologi ("dipakai di"), sertifikat -> teknologi ("dibuktikan oleh")
  const edges = [
    ...projectCis.flatMap((p) => p.techs.map((t) => ({ from: p.key, to: `t:${t}`, kind: 'uses' }))),
    ...certCis.flatMap((c) => c.techs.map((t) => ({ from: c.key, to: `t:${t}`, kind: 'proves' }))),
  ]

  const all = [...projectCis, ...techCis, ...certCis]
  const byKey = new Map(all.map((ci) => [ci.key, ci]))
  const neighbors = (key) =>
    edges.flatMap((e) => (e.from === key ? [e.to] : e.to === key ? [e.from] : [])).map((k) => byKey.get(k))

  /** Layanan yang proyek buktinya memakai teknologi / adalah proyek ini. */
  const servicesFor = (ci) => {
    const slugs =
      ci.type === 'project' ? [ci.slug] : ci.type === 'tech' ? projectCis.filter((p) => p.techs.includes(ci.name)).map((p) => p.slug) : []
    return services.filter((s) => s.proof.some((slug) => slugs.includes(slug)))
  }

  /** Teknologi yang sering dipakai bersama teknologi ini (berapa proyek). */
  const together = (ci) => {
    const counts = new Map()
    projectCis
      .filter((p) => p.techs.includes(ci.name))
      .forEach((p) => p.techs.forEach((t) => t !== ci.name && counts.set(t, (counts.get(t) ?? 0) + 1)))
    return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 4)
  }

  const usage = (ci) => edges.filter((e) => e.to === ci.key && e.kind === 'uses').length

  return { projects: projectCis, techs: techCis, certs: certCis, edges, byKey, neighbors, servicesFor, together, usage, groups: GROUPS.map((g) => g.name) }
}

export const cmdb = build()

/** Sertifikat lain yang belum dihubungkan ke teknologi mana pun. */
export const unlinkedCertificates = certificates.filter((c) => !c.skills?.length).length
