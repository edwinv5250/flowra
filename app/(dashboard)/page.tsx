import { DashboardLayout } from "@/components/dashboard-layout"
import { getCampaigns } from "@/features/campaigns/campaign-queries"
import { DashboardOverview } from "@/features/dashboard/dashboard-overview"
import { getSidebarProfile } from "@/features/profile/profile-queries"

export default async function Home() {
  const [campaigns, sidebarProfile] = await Promise.all([
    getCampaigns(),
    getSidebarProfile(),
  ])

  return (
    <DashboardLayout currentPage="overview" profile={sidebarProfile}>
      <DashboardOverview campaigns={campaigns} />
    </DashboardLayout>
  )
}
