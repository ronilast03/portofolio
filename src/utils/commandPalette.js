// Membuka command palette dari mana saja (tombol navbar, terminal, dsb.).
export const OPEN_PALETTE_EVENT = 'open-command-palette'

export const openCommandPalette = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))
}

/** Huruf kecil tanpa aksen, untuk pencarian yang tidak peka huruf besar/kecil. */
export const normalize = (text) =>
  String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
