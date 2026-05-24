import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    redirect("/login")
  }

  return data.claims
}

export async function requireUserId() {
  const claims = await requireUser()

  if (!claims.sub) {
    redirect("/login")
  }

  return claims.sub
}
