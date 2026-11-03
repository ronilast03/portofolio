import { encode } from 'uqr'
import { profile, socials } from '@/data/profile'
import { site } from '@/data/site'

// Karakter khusus di vCard harus di-escape: \ , ; dan baris baru.
const esc = (value) => String(value ?? '').replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\r?\n/g, '\\n')

/**
 * Isi file kontak (.vcf, vCard 3.0) dari data profil. Bisa langsung disimpan ke HP.
 * compact: tanpa catatan & alamat, supaya QR code-nya tidak terlalu rapat.
 */
export function buildVCard({ compact = false } = {}) {
  const parts = profile.name.trim().split(/\s+/)
  const family = parts.length > 1 ? parts.pop() : ''
  const given = parts.join(' ')
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(family)};${esc(given)};;;`,
    `FN:${esc(profile.name)}`,
    `TITLE:${esc(profile.role)}`,
    profile.email && `EMAIL;TYPE=INTERNET:${profile.email}`,
    profile.phone && `TEL;TYPE=CELL:${profile.phone}`,
    `URL:${site.url}`,
    ...(compact ? [] : socials.map((s) => `X-SOCIALPROFILE;TYPE=${esc(s.label.toLowerCase())}:${s.url}`)),
    !compact && profile.location && `ADR;TYPE=WORK:;;;;;;${esc(profile.location)}`,
    !compact && `NOTE:${esc(profile.intro)}`,
    'END:VCARD',
  ].filter(Boolean)
  return lines.join('\r\n')
}

export const vcardHref = () => `data:text/vcard;charset=utf-8,${encodeURIComponent(buildVCard())}`
export const vcardFileName = () => `${profile.name.toLowerCase().replace(/\s+/g, '-')}.vcf`

/**
 * SVG QR code (tanpa gambar eksternal). Kotak-kotak yang bersebelahan digabung jadi satu path supaya ringan.
 * margin = jumlah kotak kosong di tepi (zona tenang) agar mudah dipindai.
 */
export function qrSvg(text, { margin = 3, fg = '#111111', bg = '#ffffff', ecc = 'M' } = {}) {
  const { data, size } = encode(text, { ecc })
  const total = size + margin * 2
  let d = ''
  data.forEach((row, y) => {
    let x = 0
    while (x < size) {
      if (row[x]) {
        let w = 1
        while (x + w < size && row[x + w]) w++
        d += `M${x + margin} ${y + margin}h${w}v1h-${w}z`
        x += w
      } else x++
    }
  })
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges"><rect width="${total}" height="${total}" fill="${bg}"/><path d="${d}" fill="${fg}"/></svg>`
}
