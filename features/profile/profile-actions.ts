"use server"

import { revalidatePath } from "next/cache"

import { validateProfileForm } from "@/features/profile/profile-validation"
import type { ProfileFormState } from "@/features/profile/profile-types"
import { requireUserId } from "@/lib/auth/require-user"
import { createClient } from "@/lib/supabase/server"

const avatarBucket = "profile-avatars"
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
  const avatarResult = await uploadAvatar(supabase, userId, formData)

  if ("state" in avatarResult) {
    return avatarResult.state
  }

  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    ...validated.data,
    ...(avatarResult.avatar_path ? { avatar_path: avatarResult.avatar_path } : {}),
  })

  if (error) {
    return { message: error.message }
  }

  revalidatePath("/settings")
  revalidatePath("/", "layout")
  return { message: "Profile saved.", success: true }
}

async function uploadAvatar(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  formData: FormData,
): Promise<{ avatar_path: string | null } | { state: ProfileFormState }> {
  const avatar = formData.get("avatar")

  if (!(avatar instanceof File) || avatar.size === 0) {
    return { avatar_path: null }
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

  return { avatar_path: avatarPath }
}
