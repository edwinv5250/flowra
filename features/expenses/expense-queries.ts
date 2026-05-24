import { requireUserId } from "@/lib/auth/require-user"
import { createClient } from "@/lib/supabase/server"

export async function getExpenses() {
  const userId = await requireUserId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("expenses")
    .select(`
      *,
      campaign:campaigns (
        id,
        brand_name,
        campaign_title
      )
    `)
    .eq("user_id", userId)
    .order("expense_date", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Unable to load expenses: ${error.message}`)
  }

  return data
}

export async function getExpenseCampaignOptions() {
  const userId = await requireUserId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("campaigns")
    .select("id, brand_name, campaign_title")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Unable to load campaigns for expenses: ${error.message}`)
  }

  return data
}
