import { requireUserId } from "@/lib/auth/require-user"
import { createClient } from "@/lib/supabase/server"

export async function getCampaigns() {
  const userId = await requireUserId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("user_id", userId)
    .order("due_date", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Unable to load campaigns: ${error.message}`)
  }

  return data
}
