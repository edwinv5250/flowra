import { DashboardLayout } from "@/components/dashboard-layout"
import { AIAssistant } from "@/components/ai-assistant"

export default function AIAssistantPage() {
  return (
    <DashboardLayout currentPage="ai-assistant">
      <AIAssistant />
    </DashboardLayout>
  )
}
