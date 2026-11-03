/**
 * Mengubah teks dengan tanda bintang menjadi huruf miring (italic) untuk judul serif.
 * Contoh: "Proyek *pilihan*" -> Proyek <em>pilihan</em>
 * Teks tanpa tanda bintang dikembalikan apa adanya.
 */
export function emphasize(text) {
  if (typeof text !== 'string' || !text.includes('*')) return text
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
      <em key={i} className="serif-em">
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    ),
  )
}

/** Teks polos tanpa tanda bintang (untuk aria-label, judul tab, dsb.). */
export const plainText = (text) => (typeof text === 'string' ? text.replace(/\*/g, '') : text)
