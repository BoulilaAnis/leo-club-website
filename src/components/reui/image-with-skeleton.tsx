"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/reui/skeleton"

interface ImageWithSkeletonProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  className?: string
  containerClassName?: string
  priority?: boolean
}

function ImageWithSkeleton({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  className,
  containerClassName,
  priority,
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {!loaded && <Skeleton className="absolute inset-0 h-full w-full" />}
      <Image
        src={src}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={cn(
          "transition-opacity duration-300",
          !loaded && "opacity-0",
          className,
        )}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

export { ImageWithSkeleton }
