import { cn } from '../lib/utils'

interface Props {
  className?: string
  color?: string
}

export default function Sparkle({ className, color = 'currentColor' }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={cn('inline-block', className)} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
      <path d="M12 8.5l1.2 2.3 2.3 1.2-2.3 1.2L12 15.5l-1.2-2.3L8.5 12l2.3-1.2z" fill={color} />
    </svg>
  )
}
