"use server"

import { validatePasswordForm } from "@/features/profile/password-validation"
import type { PasswordFormState } from "@/features/profile/profile-types"
import { createClient } from "@/lib/supabase/server"

export async function changePassword(
  _previousState: PasswordFormState,
  formData: FormData,
): Promise<PasswordFormState> {
  const validated = validatePasswordForm(formData)

  if ("state" in validated) {
    return validated.state
  }

  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user?.email) {
    return { message: "You must be logged in to change your password." }
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password: validated.data.current_password,
  })

  if (verifyError) {
    return {
      errors: {
        current_password: "Current password is incorrect.",
      },
      message: "Could not verify your current password.",
    }
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: validated.data.new_password,
  })

  if (updateError) {
    return { message: updateError.message }
  }

  return { message: "Password updated.", success: true }
}
