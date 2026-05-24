import type {
  CampaignPlatform,
  CampaignStatus,
  PaymentStatus,
} from "@/features/campaigns/campaign-types"

export const campaignPlatformOptions: Array<{ label: string; value: CampaignPlatform }> = [
  { label: "Instagram", value: "instagram" },
  { label: "TikTok", value: "tiktok" },
  { label: "Facebook", value: "facebook" },
  { label: "XHS", value: "xhs" },
  { label: "Other", value: "other" },
]

export const campaignStatusOptions: Array<{ label: string; value: CampaignStatus }> = [
  { label: "Draft", value: "draft" },
  { label: "Negotiating", value: "negotiating" },
  { label: "Confirmed", value: "confirmed" },
  { label: "In progress", value: "in_progress" },
  { label: "Submitted", value: "submitted" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
]

export const paymentStatusOptions: Array<{ label: string; value: PaymentStatus }> = [
  { label: "Unpaid", value: "unpaid" },
  { label: "Partial", value: "partial" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" },
]

export function getCampaignStatusLabel(status: CampaignStatus) {
  return campaignStatusOptions.find((option) => option.value === status)?.label ?? status
}

export function getCampaignPlatformLabel(platform: CampaignPlatform | null) {
  if (!platform) return "No platform"

  return campaignPlatformOptions.find((option) => option.value === platform)?.label ?? platform
}

export function getPaymentStatusLabel(status: PaymentStatus) {
  return paymentStatusOptions.find((option) => option.value === status)?.label ?? status
}
