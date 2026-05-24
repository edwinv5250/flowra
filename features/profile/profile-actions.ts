"use server"

import { revalidatePath } from "next/cache"

import { validateProfileForm } from "@/features/profile/profile-validation"
import type { ProfileFormState } from "@/features/profile/profile-types"
import { requireUserId } from "@/lib/auth/require-user"
import { createClient } from "@/lib/supabase/server"

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
