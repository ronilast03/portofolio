const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

/** "2026-10-28" -> "28 Oktober 2026" (tanpa zona waktu agar SSR & browser konsisten). */
export function formatDate(isoDate) {
  if (!isoDate) return ''
  const [y, m, d] = String(isoDate).slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return String(isoDate)
  return `${d} ${MONTHS[m - 1]} ${y}`
}
