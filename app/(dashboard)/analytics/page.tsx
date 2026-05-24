import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { getSidebarProfile } from "@/features/profile/profile-queries"

export default async function AnalyticsPage() {
  const sidebarProfile = await getSidebarProfile()

  return (
    <DashboardLayout currentPage="analytics" profile={sidebarProfile}>
      <AnalyticsDashboard />
    </DashboardLayout>
  )
}
