import type { CampaignStatus, PaymentStatus } from "@/features/campaigns/campaign-types"

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

export function getPaymentStatusLabel(status: PaymentStatus) {
  return paymentStatusOptions.find((option) => option.value === status)?.label ?? status
}
