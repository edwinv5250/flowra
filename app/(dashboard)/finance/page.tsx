import { DashboardLayout } from "@/components/dashboard-layout"
import {
  getExpenseCampaignOptions,
  getExpenses,
} from "@/features/expenses/expense-queries"
import { ExpensesPage } from "@/features/expenses/expenses-page"
import {
  getInvoiceCampaignOptions,
  getInvoices,
} from "@/features/invoices/invoice-queries"
import { InvoicesSection } from "@/features/invoices/invoices-section"
import { getSidebarProfile } from "@/features/profile/profile-queries"

export default async function FinancePage() {
  const [
    expenses,
    expenseCampaignOptions,
    invoices,
    invoiceCampaignOptions,
    sidebarProfile,
  ] = await Promise.all([
    getExpenses(),
    getExpenseCampaignOptions(),
    getInvoices(),
    getInvoiceCampaignOptions(),
    getSidebarProfile(),
  ])

  return (
    <DashboardLayout currentPage="finance" profile={sidebarProfile}>
      <ExpensesPage
        campaignOptions={expenseCampaignOptions}
        expenses={expenses}
        invoiceSection={
          <InvoicesSection
            campaignOptions={invoiceCampaignOptions}
            invoices={invoices}
          />
        }
      />
    </DashboardLayout>
  )
}
