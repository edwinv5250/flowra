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
import { ProfilePhotoCropModal } from "@/features/profile/profile-photo-crop-modal"
import { validateProfilePhotoFile } from "@/features/profile/profile-photo-utils"
import type {
  CurrentUserProfile,
  ProfilePhotoFormState,
} from "@/features/profile/profile-types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: ProfilePhotoFormState = {}

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
  const [sourceUrl, setSourceUrl] = useState<string | null>(null)
  const [sourceFileName, setSourceFileName] = useState("")
  const [selectedFileName, setSelectedFileName] = useState("")
  const [fileError, setFileError] = useState("")
  const [isCropOpen, setIsCropOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
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
      setSourceUrl(null)
      setSourceFileName("")
      setSelectedFileName("")
      setFileError("")
      router.refresh()
    }
  }, [router, uploadState.success])

  useEffect(() => {
    if (removeState.success) {
      formRef.current?.reset()
      setPreviewUrl(null)
      setSourceUrl(null)
      setSourceFileName("")
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

  useEffect(() => {
    return () => {
      if (sourceUrl) {
        URL.revokeObjectURL(sourceUrl)
      }
    }
  }, [sourceUrl])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    if (sourceUrl) {
      URL.revokeObjectURL(sourceUrl)
    }

    if (avatarInputRef.current) {
      avatarInputRef.current.value = ""
    }

    if (!file) {
      setPreviewUrl(null)
      setSourceUrl(null)
      setSourceFileName("")
      setSelectedFileName("")
      setFileError("")
      return
    }

    const validationError = validateProfilePhotoFile(file)
    if (validationError) {
      event.target.value = ""
      setPreviewUrl(null)
      setSourceUrl(null)
      setSourceFileName("")
      setSelectedFileName("")
      setFileError(validationError)
      return
    }

    const nextSourceUrl = URL.createObjectURL(file)
    setPreviewUrl(nextSourceUrl)
    setSourceUrl(nextSourceUrl)
    setSourceFileName(file.name)
    setSelectedFileName("")
    setFileError("")
    setIsCropOpen(true)
  }

  function handleApplyCrop(file: File) {
    const validationError = validateProfilePhotoFile(file)
    if (validationError) {
      setFileError(validationError)
      return
    }

    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)

    if (avatarInputRef.current) {
      avatarInputRef.current.files = dataTransfer.files
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setPreviewUrl(URL.createObjectURL(file))
    setSelectedFileName(file.name)
    setFileError("")
  }

  return (
    <div className="space-y-4">
      <form ref={formRef} action={uploadAction} className="space-y-4">
        <input ref={avatarInputRef} type="file" name="avatar" className="sr-only" tabIndex={-1} />

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
          {sourceUrl && !selectedFileName && (
            <Button type="button" variant="outline" onClick={() => setIsCropOpen(true)}>
              Crop photo
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

      <ProfilePhotoCropModal
        imageSource={sourceUrl}
        fileName={sourceFileName}
        open={isCropOpen}
        onOpenChange={setIsCropOpen}
        onApplyCrop={handleApplyCrop}
        onError={setFileError}
      />
    </div>
  )
}
