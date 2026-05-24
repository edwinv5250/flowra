export type SponsorshipStatus = "negotiating" | "in-review" | "active" | "completed"

export type SponsorshipCampaign = {
  id: string
  brandName: string
  campaignName: string
  amount: number
  postingDate: string
  deliverables: string[]
  status: SponsorshipStatus
  notes: string
}

export type SponsorshipFormValues = {
  brandName: string
  campaignName: string
  amount: string
  postingDate: string
  deliverables: string
  status: SponsorshipStatus
  notes: string
}
