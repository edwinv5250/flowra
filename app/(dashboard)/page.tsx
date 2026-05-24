import { DashboardLayout } from "@/components/dashboard-layout"
import { getCampaigns } from "@/features/campaigns/campaign-queries"
import { DashboardOverview } from "@/features/dashboard/dashboard-overview"

export default async function Home() {
  const campaigns = await getCampaigns()

  return (
    <DashboardLayout currentPage="overview">
      <DashboardOverview campaigns={campaigns} />
    </DashboardLayout>
  )
}
