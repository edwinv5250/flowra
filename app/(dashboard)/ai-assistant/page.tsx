import { DashboardLayout } from "@/components/dashboard-layout"
import { AIAssistant } from "@/components/ai-assistant"
import { getSidebarProfile } from "@/features/profile/profile-queries"

export default async function AIAssistantPage() {
  const sidebarProfile = await getSidebarProfile()

  return (
    <DashboardLayout currentPage="ai-assistant" profile={sidebarProfile}>
      <AIAssistant />
    </DashboardLayout>
  )
}
