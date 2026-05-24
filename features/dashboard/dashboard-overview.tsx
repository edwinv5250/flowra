import { CalendarDays, Clock, Handshake, Wallet } from "lucide-react"

import {
  formatCurrency,
  getDashboardSummary,
} from "@/features/dashboard/dashboard-summary"
import type { Campaign } from "@/features/campaigns/campaign-types"
import {
  getCampaignStatusLabel,
  getPaymentStatusLabel,
} from "@/features/campaigns/campaign-options"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DashboardOverviewProps = {
  campaigns: Campaign[]
}

export function DashboardOverview({ campaigns }: DashboardOverviewProps) {
  const summary = getDashboardSummary(campaigns)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          A clear view of campaign money, payments, and upcoming work.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={Wallet}
          label="This month revenue"
          value={formatCurrency(summary.thisMonthRevenue)}
          hint="Paid campaigns updated this month"
        />
        <SummaryCard
          icon={Clock}
          label="Pending payments"
          value={formatCurrency(summary.pendingPayments)}
          hint="Unpaid, partial, and overdue"
        />
        <SummaryCard
          icon={Handshake}
          label="Active campaigns"
          value={String(summary.activeCampaigns)}
          hint="Confirmed, in progress, or submitted"
        />
        <SummaryCard
          icon={CalendarDays}
          label="Upcoming deadlines"
          value={String(summary.upcomingDeadlines.length)}
          hint="Due in the next 14 days"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <CampaignList
              campaigns={summary.upcomingDeadlines}
              emptyText="No campaign deadlines in the next 14 days."
              meta="deadline"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payments To Chase</CardTitle>
          </CardHeader>
          <CardContent>
            <CampaignList
              campaigns={summary.paymentsToChase}
              emptyText="No pending campaign payments."
              meta="payment"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SummaryCard({
  hint,
  icon: Icon,
  label,
  value,
}: {
  hint: string
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

function CampaignList({
  campaigns,
  emptyText,
  meta,
}: {
  campaigns: Campaign[]
  emptyText: string
  meta: "deadline" | "payment"
}) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        {emptyText}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="rounded-lg border p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-medium">{campaign.campaign_title}</p>
              <p className="text-sm text-muted-foreground">{campaign.brand_name}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{getCampaignStatusLabel(campaign.status)}</Badge>
              <Badge variant="outline">{getPaymentStatusLabel(campaign.payment_status)}</Badge>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <span>Due {formatDate(campaign.due_date)}</span>
            <span className="font-medium text-foreground">
              {meta === "payment" ? formatCurrency(campaign.amount) : campaign.deliverables}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
