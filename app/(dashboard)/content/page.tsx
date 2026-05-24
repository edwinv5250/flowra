import { DashboardLayout } from "@/components/dashboard-layout"
import { ContentPlanner } from "@/components/content-planner"

export default function ContentPage() {
  return (
    <DashboardLayout currentPage="content">
      <ContentPlanner />
    </DashboardLayout>
  )
}
