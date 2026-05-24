import type { PasswordFormState } from "@/features/profile/profile-types"

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

export function validatePasswordForm(formData: FormData):
  | {
      data: {
        current_password: string
        new_password: string
      }
    }
  | { state: PasswordFormState } {
  const currentPassword = getRequiredString(formData, "current_password")
  const newPassword = getRequiredString(formData, "new_password")
  const confirmPassword = getRequiredString(formData, "confirm_password")
  const errors: PasswordFormState["errors"] = {}

  if (!currentPassword) {
    errors.current_password = "Current password is required."
  }

  if (!newPassword) {
    errors.new_password = "New password is required."
  } else if (newPassword.length < 8) {
    errors.new_password = "New password must be at least 8 characters."
  }

  if (!confirmPassword) {
    errors.confirm_password = "Confirm your new password."
  } else if (newPassword && confirmPassword !== newPassword) {
    errors.confirm_password = "Passwords do not match."
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.new_password = "New password must be different from your current password."
  }

  if (Object.keys(errors).length > 0) {
    return {
      state: {
        errors,
        message: "Please fix the highlighted fields.",
      },
    }
  }

  return {
    data: {
      current_password: currentPassword,
      new_password: newPassword,
    },
  }
}
