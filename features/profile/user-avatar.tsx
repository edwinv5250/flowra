"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type UserAvatarProps = {
  avatarUrl: string | null | undefined
  fallback: string
  alt?: string
  className?: string
}

const base =
  "shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-primary/10 text-primary font-medium select-none"

export function UserAvatar({ avatarUrl, fallback, alt = "Avatar", className }: UserAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false)

  // Reset failure state whenever the URL changes so a new URL gets a fresh attempt
  useEffect(() => {
    setImgFailed(false)
  }, [avatarUrl])

  if (avatarUrl && !imgFailed) {
    return (
      <img
        src={avatarUrl}
        alt={alt}
        className={cn("shrink-0 rounded-full object-cover", className)}
        onError={() => setImgFailed(true)}
      />
    )
  }

  return (
    <div className={cn(base, className)} aria-label={alt}>
      {fallback}
    </div>
  )
}
