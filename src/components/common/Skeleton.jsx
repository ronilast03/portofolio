import { cn } from '@/utils/cn'

/** Placeholder saat konten dimuat (PRD §9.4). */
export default function Skeleton({ className }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-[10px] bg-surface', className)} />
}
