import Image from 'next/image'
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
      <div className={cn('relative overflow-hidden rounded-full', className)}>
        <Image src={src} alt={alt ?? fallback} fill className="object-cover" sizes="96px" />
      </div>
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
