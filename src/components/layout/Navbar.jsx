import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { AnimatePresence, m } from 'motion/react'
import { navigation } from '@/data/site'
import { profile } from '@/data/profile'
import Icon from '@/components/common/Icon'
import ThemeToggle from './ThemeToggle'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-[-0.01em] no-underline">
      <span className="grid size-7.5 place-items-center rounded-lg bg-fg text-[13px] font-extrabold text-bg">
        {profile.initials}
      </span>
      {profile.name}
    </Link>
  )
}

const isActive = (pathname, to) => (to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`))

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex gap-1">
            {navigation.map((item) => {
              const active = isActive(pathname, item.to)
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-lg px-3 py-2 text-[14.5px] font-medium no-underline hover:bg-surface hover:text-fg ${
                      active ? 'text-fg' : 'text-muted'
                    }`}
                  >
                    {item.label}
                    {active && <span className="mt-[3px] block h-0.5 rounded bg-accent" />}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <button
            type="button"
            className="grid size-10 cursor-pointer place-items-center rounded-[10px] border border-line md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} className="size-[18px]" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.nav
            id="mobile-menu"
            aria-label="Navigasi mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line bg-bg md:hidden"
          >
            <ul className="container-page pt-2 pb-4">
              {navigation.map((item) => {
                const active = isActive(pathname, item.to)
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      aria-current={active ? 'page' : undefined}
                      className={`block border-b border-line py-3 font-display text-[17px] font-semibold no-underline ${
                        active ? 'text-accent' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
