import { requireUserId } from "@/lib/auth/require-user"
import { createClient } from "@/lib/supabase/server"

export async function getInvoices() {
  const userId = await requireUserId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      campaign:campaigns (
        id,
        brand_name,
        campaign_title,
        amount
      )
    `)
    .eq("user_id", userId)
    .order("issued_date", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Unable to load invoices: ${error.message}`)
  }

  return data
}

export async function getInvoiceCampaignOptions() {
  const userId = await requireUserId()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("campaigns")
    .select("id, brand_name, campaign_title, amount")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Unable to load campaigns for invoices: ${error.message}`)
  }

  return data
}
