import type { Campaign } from "@/features/campaigns/campaign-types"

const activeStatuses = new Set<Campaign["status"]>([
  "confirmed",
  "in_progress",
  "submitted",
])

const unpaidStatuses = new Set<Campaign["payment_status"]>([
  "partial",
  "overdue",
  "unpaid",
])

export function getDashboardSummary(campaigns: Campaign[]) {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const nextDeadlineLimit = new Date(now)
  nextDeadlineLimit.setDate(now.getDate() + 14)

  const thisMonthRevenue = campaigns
    .filter((campaign) => {
      const updatedAt = new Date(campaign.updated_at)
      return campaign.payment_status === "paid" && updatedAt >= monthStart
    })
    .reduce((sum, campaign) => sum + campaign.amount, 0)

  const pendingPayments = campaigns
    .filter((campaign) => unpaidStatuses.has(campaign.payment_status))
    .reduce((sum, campaign) => sum + campaign.amount, 0)

  const upcomingDeadlines = campaigns
    .filter((campaign) => {
      const dueDate = new Date(`${campaign.due_date}T00:00:00`)

      return (
        dueDate >= startOfDay(now) &&
        dueDate <= nextDeadlineLimit &&
        campaign.status !== "completed" &&
        campaign.status !== "cancelled"
      )
    })
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 5)

  const paymentsToChase = campaigns
    .filter((campaign) => unpaidStatuses.has(campaign.payment_status))
    .sort((a, b) => {
      if (a.payment_status === "overdue" && b.payment_status !== "overdue") return -1
      if (a.payment_status !== "overdue" && b.payment_status === "overdue") return 1
      return a.due_date.localeCompare(b.due_date)
    })
    .slice(0, 5)

  return {
    activeCampaigns: campaigns.filter((campaign) => activeStatuses.has(campaign.status)).length,
    pendingPayments,
    paymentsToChase,
    thisMonthRevenue,
    upcomingDeadlines,
  }
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function formatCurrency(amount: number) {
  return `RM ${amount.toLocaleString("en-MY", {
    maximumFractionDigits: 2,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  })}`
}
