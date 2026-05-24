"use server"

import { revalidatePath } from "next/cache"

import { avatarBucket } from "@/features/profile/profile-avatar"
import { validateProfileForm } from "@/features/profile/profile-validation"
import type {
  ProfileFormState,
  ProfilePhotoFormState,
} from "@/features/profile/profile-types"
import { requireUserId } from "@/lib/auth/require-user"
import { createClient } from "@/lib/supabase/server"

const maxAvatarSize = 2 * 1024 * 1024
const allowedAvatarTypes = ["image/jpeg", "image/png", "image/webp"]

export async function saveProfile(
  _previousState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const validated = validateProfileForm(formData)

  if ("state" in validated) {
    return validated.state
  }

  const userId = await requireUserId()
  const supabase = await createClient()
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    ...validated.data,
  })

  if (error) {
    return { message: error.message }
  }

  revalidatePath("/settings")
  revalidatePath("/", "layout")
  return { message: "Profile saved.", success: true }
}

export async function uploadProfilePhoto(
  _previousState: ProfilePhotoFormState,
  formData: FormData,
): Promise<ProfilePhotoFormState> {
  const userId = await requireUserId()
  const supabase = await createClient()
  const currentAvatarPath = await getCurrentAvatarPath(supabase, userId)
  const avatarResult = await uploadAvatar(supabase, userId, currentAvatarPath, formData)

  if ("state" in avatarResult) {
    return avatarResult.state
  }

  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    avatar_path: avatarResult.avatar_path,
  })

  if (error) {
    return { message: error.message }
  }

  revalidatePath("/settings")
  revalidatePath("/", "layout")
  return { message: "Profile photo uploaded.", success: true }
}

export async function removeProfilePhoto(
  _previousState: ProfilePhotoFormState,
  _formData: FormData,
): Promise<ProfilePhotoFormState> {
  const userId = await requireUserId()
  const supabase = await createClient()
  const currentAvatarPath = await getCurrentAvatarPath(supabase, userId)
  const avatarResult = await removeAvatar(supabase, currentAvatarPath)

  if ("state" in avatarResult) {
    return avatarResult.state
  }

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_path: null })
    .eq("id", userId)

  if (error) {
    return { message: error.message }
  }

  revalidatePath("/settings")
  revalidatePath("/", "layout")
  return { message: "Profile photo removed.", success: true }
}

async function uploadAvatar(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  currentAvatarPath: string | null,
  formData: FormData,
): Promise<{ avatar_path: string } | { state: ProfilePhotoFormState }> {
  const avatar = formData.get("avatar")

  if (!(avatar instanceof File) || avatar.size === 0) {
    return {
      state: {
        errors: { avatar: "Choose a profile photo first." },
        message: "Please fix the highlighted fields.",
      },
    }
  }

  if (!allowedAvatarTypes.includes(avatar.type)) {
    return {
      state: {
        errors: { avatar: "Upload a JPG, PNG, or WebP image." },
        message: "Please fix the highlighted fields.",
      },
    }
  }

  if (avatar.size > maxAvatarSize) {
    return {
      state: {
        errors: { avatar: "Profile picture must be 2MB or smaller." },
        message: "Please fix the highlighted fields.",
      },
    }
  }

  const extension = avatar.type.split("/")[1] === "jpeg" ? "jpg" : avatar.type.split("/")[1]
  const avatarPath = `${userId}/avatar.${extension}`
  const { error } = await supabase.storage
    .from(avatarBucket)
    .upload(avatarPath, avatar, {
      cacheControl: "3600",
      contentType: avatar.type,
      upsert: true,
    })

  if (error) {
    return { state: { message: `Could not upload profile picture: ${error.message}` } }
  }

  if (currentAvatarPath && currentAvatarPath !== avatarPath) {
    await supabase.storage.from(avatarBucket).remove([currentAvatarPath])
  }

  return { avatar_path: avatarPath }
}

async function removeAvatar(
  supabase: Awaited<ReturnType<typeof createClient>>,
  currentAvatarPath: string | null,
): Promise<{ avatar_path: null } | { state: ProfilePhotoFormState }> {
  if (!currentAvatarPath) {
    return { avatar_path: null }
  }

  const { error } = await supabase.storage.from(avatarBucket).remove([currentAvatarPath])

  if (error) {
    return { state: { message: `Could not remove profile picture: ${error.message}` } }
  }

  return { avatar_path: null }
}

async function getCurrentAvatarPath(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("profiles")
    .select("avatar_path")
    .eq("id", userId)
    .maybeSingle()

  if (error) {
    throw new Error(`Could not load profile picture: ${error.message}`)
  }

  return data?.avatar_path ?? null
}
