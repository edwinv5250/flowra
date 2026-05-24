import type { Database } from "@/lib/database.types"

export type Campaign = Database["public"]["Tables"]["campaigns"]["Row"]
export type CampaignStatus = Database["public"]["Enums"]["campaign_status"]
export type PaymentStatus = Database["public"]["Enums"]["payment_status"]

export type CampaignFormState = {
  errors?: Partial<Record<CampaignFormField, string>>
  message?: string
  success?: boolean
}

export type CampaignFormField =
  | "amount"
  | "brand_name"
  | "campaign_title"
  | "deliverables"
  | "due_date"
  | "payment_status"
  | "status"

export type CampaignFormValues = {
  amount: number
  brand_name: string
  campaign_title: string
  deliverables: string
  due_date: string
  notes: string | null
  payment_status: PaymentStatus
  status: CampaignStatus
}
