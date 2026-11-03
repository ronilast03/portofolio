// Daftar gambar yang punya versi kecil (nama-file-800.webp) di folder public/images.
// Komponen Image memakai daftar ini untuk membuat srcset, sehingga HP mengunduh versi 800px
// dan layar besar tetap mendapat versi aslinya. Gambar tanpa versi -800 tetap tampil seperti biasa.
import fs from 'node:fs'
import path from 'node:path'

const ID = 'virtual:image-variants'
const RESOLVED = '\0' + ID
const SUFFIX = '-800.webp'

function scan(dir, base, out) {
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) scan(full, `${base}/${entry.name}`, out)
    else if (entry.name.endsWith(SUFFIX)) out.push(`${base}/${entry.name.slice(0, -SUFFIX.length)}.webp`)
  }
  return out
}

export default function imageVariants() {
  let publicDir = 'public'
  return {
    name: 'image-variants',
    configResolved(config) {
      publicDir = config.publicDir
    },
    resolveId(id) {
      if (id === ID) return RESOLVED
    },
    load(id) {
      if (id !== RESOLVED) return
      const list = scan(path.join(publicDir, 'images'), '/images', []).sort()
      return `export default new Set(${JSON.stringify(list)})`
    },
  }
}
