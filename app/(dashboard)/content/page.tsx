import { DashboardLayout } from "@/components/dashboard-layout"
import { ContentPlanner } from "@/components/content-planner"
import { getSidebarProfile } from "@/features/profile/profile-queries"

export default async function ContentPage() {
  const sidebarProfile = await getSidebarProfile()

  return (
    <DashboardLayout currentPage="content" profile={sidebarProfile}>
      <ContentPlanner />
    </DashboardLayout>
  )
}
