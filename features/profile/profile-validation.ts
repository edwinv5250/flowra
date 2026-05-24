import type { ProfileFormState } from "@/features/profile/profile-types"

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key)
  const text = typeof value === "string" ? value.trim() : ""
  return text || null
}

export function validateProfileForm(formData: FormData):
  | {
      data: {
        creator_name: string | null
        full_name: string | null
        handle: string | null
      }
    }
  | { state: ProfileFormState } {
  const fullName = getOptionalString(formData, "full_name")
  const creatorName = getOptionalString(formData, "creator_name")
  const handle = getOptionalString(formData, "handle")
  const errors: ProfileFormState["errors"] = {}

  if (handle && /\s/.test(handle)) {
    errors.handle = "Handle cannot contain spaces."
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
      creator_name: creatorName,
      full_name: fullName,
      handle,
    },
  }
}
