import { useTheme } from '@/hooks/useTheme'
import Icon from '@/components/common/Icon'

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mounted ? label : 'Ganti tema'}
      title={mounted ? label : 'Ganti tema'}
      className="grid size-10 cursor-pointer place-items-center rounded-[10px] border border-line text-fg hover:bg-surface"
    >
      {/* Ikon baru ditampilkan setelah mount agar tidak beda dengan HTML hasil prerender. */}
      <span className={mounted ? 'opacity-100' : 'opacity-0'}>
        <Icon name={isDark ? 'sun' : 'moon'} className="size-[18px]" />
      </span>
    </button>
  )
}
