import { useEffect, useState } from 'react'

/** true setelah komponen berjalan di browser. Mencegah hydration mismatch. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}
