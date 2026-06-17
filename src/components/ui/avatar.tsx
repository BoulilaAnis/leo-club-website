import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  alt?: string | null
  fallback: string
  className?: string
}

export function Avatar({ src, alt, fallback, className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? fallback}
        className={cn('rounded-full object-cover', className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-muted font-bold text-muted-foreground',
        className,
      )}
    >
      {fallback.slice(0, 2).toUpperCase()}
    </div>
  )
}
