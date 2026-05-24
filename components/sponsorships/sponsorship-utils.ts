import type {
  SponsorshipCampaign,
  SponsorshipFormValues,
  SponsorshipStatus,
} from "@/lib/types/sponsorship"

export const sponsorshipStatusOptions: {
  value: SponsorshipStatus
  label: string
  className: string
}[] = [
  { value: "negotiating", label: "Negotiating", className: "bg-primary/10 text-primary border-primary/20" },
  { value: "in-review", label: "In Review", className: "bg-warning/10 text-warning border-warning/20" },
  { value: "active", label: "Active", className: "bg-success/10 text-success border-success/20" },
  { value: "completed", label: "Completed", className: "bg-muted text-muted-foreground border-muted" },
]

export const emptySponsorshipFormValues: SponsorshipFormValues = {
  brandName: "",
  campaignName: "",
  amount: "",
  postingDate: "",
  deliverables: "",
  status: "negotiating",
  notes: "",
}

export function getSponsorshipStatusConfig(status: SponsorshipStatus) {
  return sponsorshipStatusOptions.find((option) => option.value === status) ?? sponsorshipStatusOptions[0]
}

export function formatSponsorshipCurrency(amount: number) {
  return `RM ${amount.toLocaleString("en-MY")}`
}

export function formatSponsorshipDate(date: string) {
  return new Date(date).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function splitDeliverables(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export function toSponsorshipFormValues(campaign: SponsorshipCampaign): SponsorshipFormValues {
  return {
    brandName: campaign.brandName,
    campaignName: campaign.campaignName,
    amount: String(campaign.amount),
    postingDate: campaign.postingDate,
    deliverables: campaign.deliverables.join(", "),
    status: campaign.status,
    notes: campaign.notes,
  }
}

export function createSponsorshipFromForm(
  values: SponsorshipFormValues,
  id: string,
): SponsorshipCampaign {
  return {
    id,
    brandName: values.brandName.trim(),
    campaignName: values.campaignName.trim(),
    amount: Number(values.amount),
    postingDate: values.postingDate,
    deliverables: splitDeliverables(values.deliverables),
    status: values.status,
    notes: values.notes.trim(),
  }
}
