import type { Database } from "@/lib/database.types"

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export type CurrentUserProfile = {
  email: string
  profile: Profile | null
  userId: string
}

export type ProfileFormState = {
  errors?: Partial<Record<"creator_name" | "full_name" | "handle", string>>
  message?: string
  success?: boolean
}

export type SidebarProfile = {
  creatorName: string
  displayName: string
  email: string
  handle: string | null
}
