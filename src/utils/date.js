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

const SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

/** "2024-09" -> "Sep 2024" */
export function formatMonth(yearMonth) {
  if (!yearMonth) return ''
  const [y, m] = String(yearMonth).split('-').map(Number)
  if (!y || !m) return String(yearMonth)
  return `${SHORT[m - 1]} ${y}`
}
