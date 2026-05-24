"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"

import { saveProfile } from "@/features/profile/profile-actions"
import type { CurrentUserProfile, ProfileFormState } from "@/features/profile/profile-types"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: ProfileFormState = {}

export function ProfileForm({ currentUser }: { currentUser: CurrentUserProfile }) {
  const [state, formAction] = useActionState(saveProfile, initialState)
  const profile = currentUser.profile
  const avatarUrl = profile?.avatar_path ? getPublicAvatarUrl(profile.avatar_path) : null
  const avatarFallback = getInitials(profile?.full_name || profile?.creator_name || currentUser.email)

  return (
    <form action={formAction} className="space-y-5">
      {state.message && (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          {state.message}
        </p>
      )}

      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={currentUser.email} readOnly />
        <p className="text-xs text-muted-foreground">
          Email comes from your Supabase login account.
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="avatar">Profile picture</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile picture" />}
            <AvatarFallback className="bg-primary/10 text-primary">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Input id="avatar" name="avatar" type="file" accept="image/png,image/jpeg,image/webp" />
            <p className="text-xs text-muted-foreground">
              JPG, PNG, or WebP. Maximum 2MB.
            </p>
          </div>
        </div>
        {state.errors?.avatar && (
          <p className="text-sm text-destructive">{state.errors.avatar}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ""} />
        {state.errors?.full_name && (
          <p className="text-sm text-destructive">{state.errors.full_name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="creator_name">Creator name</Label>
        <Input
          id="creator_name"
          name="creator_name"
          defaultValue={profile?.creator_name ?? ""}
          placeholder="e.g. Sarah Eats KL"
        />
        {state.errors?.creator_name && (
          <p className="text-sm text-destructive">{state.errors.creator_name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="handle">Handle</Label>
        <Input
          id="handle"
          name="handle"
          defaultValue={profile?.handle ?? ""}
          placeholder="e.g. sarah_eats"
        />
        {state.errors?.handle && (
          <p className="text-sm text-destructive">{state.errors.handle}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  )
}

function getPublicAvatarUrl(path: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    return null
  }

  return `${supabaseUrl}/storage/v1/object/public/profile-avatars/${path}`
}

function getInitials(value: string) {
  const initials = value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("")

  return initials || "F"
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save profile"}
    </Button>
  )
}
