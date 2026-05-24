import type { SponsorshipCampaign } from "@/lib/types/sponsorship"

// This is the sponsorship module's local seed data.
// Later, Supabase can replace this file without changing the page components.
export const mockSponsorshipCampaigns: SponsorshipCampaign[] = [
  {
    id: "sponsor-1",
    brandName: "Nasi Lemak Antarabangsa",
    campaignName: "Ramadan Feast Campaign",
    amount: 8500,
    postingDate: "2024-03-15",
    deliverables: ["3 Reels", "5 Stories", "1 Post"],
    status: "active",
    notes: "Confirm posting window with Sarah before the weekend.",
  },
  {
    id: "sponsor-2",
    brandName: "Teh Tarik Place",
    campaignName: "New Menu Launch",
    amount: 5000,
    postingDate: "2024-03-10",
    deliverables: ["2 Reels", "3 Stories"],
    status: "completed",
    notes: "Campaign wrapped. Keep contact warm for Hari Raya bundle.",
  },
  {
    id: "sponsor-3",
    brandName: "Gurney Paragon",
    campaignName: "Food Festival Coverage",
    amount: 12000,
    postingDate: "2024-03-20",
    deliverables: ["5 Reels", "10 Stories", "2 Posts"],
    status: "in-review",
    notes: "Client is reviewing the shot list and event schedule.",
  },
  {
    id: "sponsor-4",
    brandName: "Secret Recipe",
    campaignName: "Valentine Special",
    amount: 6500,
    postingDate: "2024-02-14",
    deliverables: ["2 Reels", "4 Stories"],
    status: "negotiating",
    notes: "Waiting on final rate approval from the brand manager.",
  },
]
