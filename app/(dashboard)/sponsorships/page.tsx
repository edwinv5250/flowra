import { DashboardLayout } from "@/components/dashboard-layout"
import { CampaignsPage } from "@/features/campaigns/campaigns-page"
import { getCampaigns } from "@/features/campaigns/campaign-queries"
import { getSidebarProfile } from "@/features/profile/profile-queries"

export default async function SponsorshipsPage() {
  const [campaigns, sidebarProfile] = await Promise.all([
    getCampaigns(),
    getSidebarProfile(),
  ])

  return (
    <DashboardLayout currentPage="sponsorships" profile={sidebarProfile}>
      <CampaignsPage campaigns={campaigns} />
    </DashboardLayout>
  )
}
