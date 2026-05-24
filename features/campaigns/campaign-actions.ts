"use server"

import { revalidatePath } from "next/cache"

import { validateCampaignForm } from "@/features/campaigns/campaign-validation"
import type { CampaignFormState } from "@/features/campaigns/campaign-types"
import { requireUserId } from "@/lib/auth/require-user"
import { createClient } from "@/lib/supabase/server"

const campaignPath = "/sponsorships"

export async function createCampaign(
  _previousState: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  const validated = validateCampaignForm(formData)

  if ("state" in validated) {
    return validated.state
  }

  const userId = await requireUserId()
  const supabase = await createClient()
  const { error } = await supabase.from("campaigns").insert({
    ...validated.data,
    user_id: userId,
  })

  if (error) {
    return { message: error.message }
  }

  revalidatePath(campaignPath)
  return { message: "Campaign created.", success: true }
}

export async function updateCampaign(
  _previousState: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  const id = formData.get("id")

  if (typeof id !== "string" || !id) {
    return { message: "Missing campaign id." }
  }

  const validated = validateCampaignForm(formData)

  if ("state" in validated) {
    return validated.state
  }

  const userId = await requireUserId()
  const supabase = await createClient()
  const { error } = await supabase
    .from("campaigns")
    .update(validated.data)
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    return { message: error.message }
  }

  revalidatePath(campaignPath)
  return { message: "Campaign updated.", success: true }
}

export async function deleteCampaign(formData: FormData) {
  const id = formData.get("id")

  if (typeof id !== "string" || !id) {
    return
  }

  const userId = await requireUserId()
  const supabase = await createClient()

  await supabase
    .from("campaigns")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  revalidatePath(campaignPath)
}
