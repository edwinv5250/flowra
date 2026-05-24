import { DashboardLayout } from "@/components/dashboard-layout"
import { FinanceTracking } from "@/components/finance-tracking"

export default function FinancePage() {
  return (
    <DashboardLayout currentPage="finance">
      <FinanceTracking />
    </DashboardLayout>
  )
}
