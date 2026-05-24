import type { Database } from "@/lib/database.types"

export type Campaign = Database["public"]["Tables"]["campaigns"]["Row"]
export type CampaignPlatform = Database["public"]["Enums"]["campaign_platform"]
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
  | "client_email"
  | "client_name"
  | "client_phone"
  | "deliverables"
  | "due_date"
  | "payment_status"
  | "platform"
  | "status"

export type CampaignFormValues = {
  amount: number
  brand_name: string
  campaign_title: string
  client_email: string | null
  client_name: string | null
  client_phone: string | null
  deliverables: string
  due_date: string
  notes: string | null
  payment_status: PaymentStatus
  platform: CampaignPlatform | null
  status: CampaignStatus
}
