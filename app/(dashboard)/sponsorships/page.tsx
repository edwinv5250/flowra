import { DashboardLayout } from "@/components/dashboard-layout"
import { CampaignsPage } from "@/features/campaigns/campaigns-page"
import { getCampaigns } from "@/features/campaigns/campaign-queries"

export default async function SponsorshipsPage() {
  const campaigns = await getCampaigns()

  return (
    <DashboardLayout currentPage="sponsorships">
      <CampaignsPage campaigns={campaigns} />
    </DashboardLayout>
  )
}
