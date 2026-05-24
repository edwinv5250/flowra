"use client"

import { useRouter } from "next/navigation"
import { useActionState, useEffect, useRef, useState } from "react"
import type { ChangeEvent } from "react"

import {
  removeProfilePhoto,
  uploadProfilePhoto,
} from "@/features/profile/profile-actions"
import { getPublicAvatarUrl } from "@/features/profile/profile-avatar"
import { getProfileInitials } from "@/features/profile/profile-display"
import type {
  CurrentUserProfile,
  ProfilePhotoFormState,
} from "@/features/profile/profile-types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: ProfilePhotoFormState = {}
const maxAvatarSize = 2 * 1024 * 1024
const allowedAvatarTypes = ["image/jpeg", "image/png", "image/webp"]

export function ProfilePhotoForm({ currentUser }: { currentUser: CurrentUserProfile }) {
  const router = useRouter()
  const [uploadState, uploadAction, isUploading] = useActionState(
    uploadProfilePhoto,
    initialState,
  )
  const [removeState, removeAction, isRemoving] = useActionState(
    removeProfilePhoto,
    initialState,
  )
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFileName, setSelectedFileName] = useState("")
  const [fileError, setFileError] = useState("")
  const formRef = useRef<HTMLFormElement>(null)
  const profile = currentUser.profile
  const avatarUrl = profile?.avatar_path
    ? getPublicAvatarUrl(profile.avatar_path, profile.updated_at)
    : null
  const visibleAvatarUrl = previewUrl || avatarUrl
  const avatarFallback = getProfileInitials(
    profile?.full_name,
    profile?.creator_name,
    profile?.handle,
    currentUser.email,
  )

  useEffect(() => {
    if (uploadState.success) {
      formRef.current?.reset()
      setPreviewUrl(null)
      setSelectedFileName("")
      setFileError("")
      router.refresh()
    }
  }, [router, uploadState.success])

  useEffect(() => {
    if (removeState.success) {
      formRef.current?.reset()
      setPreviewUrl(null)
      setSelectedFileName("")
      setFileError("")
      router.refresh()
    }
  }, [removeState.success, router])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    if (!file) {
      setPreviewUrl(null)
      setSelectedFileName("")
      setFileError("")
      return
    }

    if (!allowedAvatarTypes.includes(file.type)) {
      event.target.value = ""
      setPreviewUrl(null)
      setSelectedFileName("")
      setFileError("Upload a JPG, PNG, or WebP image.")
      return
    }

    if (file.size > maxAvatarSize) {
      event.target.value = ""
      setPreviewUrl(null)
      setSelectedFileName("")
      setFileError("Profile picture must be 2MB or smaller.")
      return
    }

    setPreviewUrl(URL.createObjectURL(file))
    setSelectedFileName(file.name)
    setFileError("")
  }

  return (
    <div className="space-y-4">
      <form ref={formRef} action={uploadAction} className="space-y-4">
        {(uploadState.message || removeState.message) && (
          <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            {uploadState.message || removeState.message}
          </p>
        )}

        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {visibleAvatarUrl && <AvatarImage src={visibleAvatarUrl} alt="Profile photo" />}
            <AvatarFallback className="bg-primary/10 text-primary">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <Label htmlFor="avatar">{avatarUrl ? "Replace photo" : "Upload photo"}</Label>
            <Input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={isUploading || isRemoving}
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground">
              JPG, PNG, or WebP. Maximum 2MB.
            </p>
            {selectedFileName && (
              <p className="text-xs text-muted-foreground">
                Selected: {selectedFileName}
              </p>
            )}
          </div>
        </div>

        {(fileError || uploadState.errors?.avatar) && (
          <p className="text-sm text-destructive">
            {fileError || uploadState.errors?.avatar}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {selectedFileName && (
            <Button type="submit" disabled={isUploading || Boolean(fileError)}>
              {isUploading ? "Uploading..." : "Upload photo"}
            </Button>
          )}
        </div>
      </form>

      {avatarUrl && !selectedFileName && (
        <form action={removeAction}>
          <Button type="submit" variant="outline" size="sm" disabled={isRemoving}>
            {isRemoving ? "Removing..." : "Remove photo"}
          </Button>
        </form>
      )}
    </div>
  )
}
