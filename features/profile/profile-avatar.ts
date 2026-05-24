export const avatarBucket = "avatars"

export function getPublicAvatarUrl(path: string, version?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    return null
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${avatarBucket}/${path}`
  return version ? `${publicUrl}?v=${encodeURIComponent(version)}` : publicUrl
}
