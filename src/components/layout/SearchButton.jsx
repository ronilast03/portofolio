import { useEffect, useState } from 'react'
import Icon from '@/components/common/Icon'
import { openCommandPalette } from '@/utils/commandPalette'

/** Tombol pembuka command palette di navbar. Menampilkan ⌘K di Mac, Ctrl K di lainnya. */
export default function SearchButton() {
  const [mac, setMac] = useState(false)

  useEffect(() => {
    setMac(/mac|iphone|ipad/i.test(navigator.userAgentData?.platform || navigator.platform || ''))
  }, [])

  return (
    <button
      type="button"
      onClick={openCommandPalette}
      aria-keyshortcuts="Control+K Meta+K"
      className="flex h-10 cursor-pointer items-center gap-2 rounded-[10px] border border-line px-2.75 text-muted hover:bg-surface hover:text-fg"
    >
      <Icon name="search" className="size-4" />
      {/* Teks ini juga menjadi nama tombol untuk pembaca layar (di layar kecil disembunyikan secara visual). */}
      <span className="sr-only text-[13.5px] lg:not-sr-only">Cari…</span>
      <kbd aria-hidden="true" className="hidden rounded-md border border-line bg-surface px-1.5 py-px font-mono text-[11px] lg:inline">
        {mac ? '⌘K' : 'Ctrl K'}
      </kbd>
    </button>
  )
}
