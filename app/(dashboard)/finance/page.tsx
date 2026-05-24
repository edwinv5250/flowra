import { DashboardLayout } from "@/components/dashboard-layout"
import {
  getExpenseCampaignOptions,
  getExpenses,
} from "@/features/expenses/expense-queries"
import { ExpensesPage } from "@/features/expenses/expenses-page"
import { getSidebarProfile } from "@/features/profile/profile-queries"

export default async function FinancePage() {
  const [expenses, campaignOptions, sidebarProfile] = await Promise.all([
    getExpenses(),
    getExpenseCampaignOptions(),
    getSidebarProfile(),
  ])

  return (
    <DashboardLayout currentPage="finance" profile={sidebarProfile}>
      <ExpensesPage campaignOptions={campaignOptions} expenses={expenses} />
    </DashboardLayout>
  )
}
