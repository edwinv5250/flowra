import {
  campaignStatusOptions,
  paymentStatusOptions,
} from "@/features/campaigns/campaign-options"
import type {
  CampaignFormState,
  CampaignFormValues,
  CampaignStatus,
  PaymentStatus,
} from "@/features/campaigns/campaign-types"

function getString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function isCampaignStatus(value: string): value is CampaignStatus {
  return campaignStatusOptions.some((option) => option.value === value)
}

function isPaymentStatus(value: string): value is PaymentStatus {
  return paymentStatusOptions.some((option) => option.value === value)
}

export function validateCampaignForm(formData: FormData):
  | { data: CampaignFormValues }
  | { state: CampaignFormState } {
  const amountValue = getString(formData, "amount")
  const status = getString(formData, "status")
  const paymentStatus = getString(formData, "payment_status")
  const amount = Number(amountValue)

  const data = {
    amount,
    brand_name: getString(formData, "brand_name"),
    campaign_title: getString(formData, "campaign_title"),
    deliverables: getString(formData, "deliverables"),
    due_date: getString(formData, "due_date"),
    notes: getString(formData, "notes") || null,
    payment_status: paymentStatus,
    status,
  }

  const errors: CampaignFormState["errors"] = {}

  if (!data.brand_name) errors.brand_name = "Brand name is required."
  if (!data.campaign_title) errors.campaign_title = "Campaign title is required."
  if (!data.deliverables) errors.deliverables = "Deliverables are required."
  if (!data.due_date) errors.due_date = "Due date is required."
  if (!Number.isFinite(amount) || amount < 0) {
    errors.amount = "Amount must be zero or more."
  }
  if (!isCampaignStatus(status)) errors.status = "Choose a valid campaign status."
  if (!isPaymentStatus(paymentStatus)) {
    errors.payment_status = "Choose a valid payment status."
  }

  if (Object.keys(errors).length > 0) {
    return {
      state: {
        errors,
        message: "Please fix the highlighted fields.",
      },
    }
  }

  const validPaymentStatus = paymentStatus as PaymentStatus
  const validStatus = status as CampaignStatus

  return {
    data: {
      ...data,
      payment_status: validPaymentStatus,
      status: validStatus,
    },
  }
}
