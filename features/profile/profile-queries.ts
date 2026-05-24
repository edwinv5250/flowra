import { createClient } from "@/lib/supabase/server"
import type { CurrentUserProfile, SidebarProfile } from "@/features/profile/profile-types"
import { redirect } from "next/navigation"

export async function getCurrentUserProfile(): Promise<CurrentUserProfile> {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    redirect("/login")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .maybeSingle()

  if (profileError) {
    throw new Error(`Unable to load profile: ${profileError.message}`)
  }

  return {
    email: userData.user.email ?? "",
    profile,
    userId: userData.user.id,
  }
}

export async function getSidebarProfile(): Promise<SidebarProfile> {
  const currentUser = await getCurrentUserProfile()
  const profile = currentUser.profile
  const displayName = profile?.full_name || profile?.creator_name || currentUser.email
  const creatorName = profile?.creator_name || "Creator Dashboard"
  const avatarUrl = profile?.avatar_path
    ? getPublicAvatarUrl(profile.avatar_path)
    : null

  return {
    avatarUrl,
    creatorName,
    displayName,
    email: currentUser.email,
    handle: profile?.handle ?? null,
  }
}

function getPublicAvatarUrl(path: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    return null
  }

  return `${supabaseUrl}/storage/v1/object/public/profile-avatars/${path}`
}
