import { cn, merchantAccent, merchantInitials } from '../lib/utils'

interface Props {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function MerchantAvatar({ name, size = 'md', className }: Props) {
  const sizes = {
    sm: 'h-8 w-8 text-[11px]',
    md: 'h-10 w-10 text-xs',
    lg: 'h-14 w-14 text-base',
  }
  return (
    <div
      className={cn(
        'rounded-xl bg-gradient-to-br text-white font-extrabold font-display flex items-center justify-center border-2 border-ink-900 shadow-brutal-sm',
        merchantAccent(name),
        sizes[size],
        className,
      )}
    >
      {merchantInitials(name)}
    </div>
  )
}
