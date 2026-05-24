"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type UserAvatarProps = {
  avatarUrl: string | null | undefined
  fallback: string
  alt?: string
  className?: string
}

export function UserAvatar({ avatarUrl, fallback, alt = "Avatar", className }: UserAvatarProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Reset image state whenever the URL changes
  useEffect(() => {
    setLoaded(false)
    setError(false)
  }, [avatarUrl])

  const showImage = Boolean(avatarUrl) && !error

  return (
    <Avatar className={cn("shrink-0", className)}>
      {showImage && (
        // Use a plain <img> so we own the load/error state — Radix's
        // internal state machine can get stuck when src changes on the
        // same mounted component instance.
        <img
          src={avatarUrl!}
          alt={alt}
          className="aspect-square size-full rounded-full object-cover"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ display: loaded ? undefined : "none" }}
        />
      )}
      {(!showImage || !loaded) && (
        <AvatarFallback className="bg-primary/10 text-primary">
          {fallback}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
