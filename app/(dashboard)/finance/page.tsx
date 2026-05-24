import { DashboardLayout } from "@/components/dashboard-layout"
import {
  getExpenseCampaignOptions,
  getExpenses,
} from "@/features/expenses/expense-queries"
import { ExpensesPage } from "@/features/expenses/expenses-page"

export default async function FinancePage() {
  const [expenses, campaignOptions] = await Promise.all([
    getExpenses(),
    getExpenseCampaignOptions(),
  ])

  return (
    <DashboardLayout currentPage="finance">
      <ExpensesPage campaignOptions={campaignOptions} expenses={expenses} />
    </DashboardLayout>
  )
}
