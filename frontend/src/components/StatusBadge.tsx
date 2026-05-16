import { cn, statusLabel } from '../lib/utils'

interface Props {
  status: string
  className?: string
}

const styles: Record<string, string> = {
  UPLOADED: 'bg-sky-200 text-sky-900',
  EXTRACTED: 'bg-mint-300 text-ink-900',
  NEEDS_REVIEW: 'bg-gold-300 text-ink-900',
  CORRECTED: 'bg-violet-300 text-ink-900',
  FAILED: 'bg-rose-300 text-rose-900',
}

export default function StatusBadge({ status, className }: Props) {
  return (
    <span className={cn('chip', styles[status] ?? 'bg-ink-200 text-ink-900', className)}>
      {statusLabel(status)}
    </span>
  )
}
