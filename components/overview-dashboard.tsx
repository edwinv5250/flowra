"use client"

import {
  DollarSign,
  Clock,
  Handshake,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { analyticsData, sponsorships, contentPlan } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Total Revenue",
    value: `RM ${analyticsData.overview.totalRevenue.toLocaleString()}`,
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "This month",
  },
  {
    title: "Pending Payments",
    value: `RM ${analyticsData.overview.pendingPayments.toLocaleString()}`,
    change: "-8.2%",
    trend: "down",
    icon: Clock,
    description: "3 invoices",
  },
  {
    title: "Active Sponsorships",
    value: analyticsData.overview.activeSponsorships,
    change: "+2",
    trend: "up",
    icon: Handshake,
    description: "From 6 brands",
  },
  {
    title: "Content Deadlines",
    value: analyticsData.overview.upcomingDeadlines,
    change: "Next 7 days",
    trend: "neutral",
    icon: CalendarDays,
    description: "Scheduled posts",
  },
]

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  completed: "bg-muted text-muted-foreground border-muted",
  "in-review": "bg-warning/10 text-warning border-warning/20",
  negotiating: "bg-primary/10 text-primary border-primary/20",
  scheduled: "bg-primary/10 text-primary border-primary/20",
  draft: "bg-muted text-muted-foreground border-muted",
  idea: "bg-secondary text-secondary-foreground border-secondary",
}

const priorityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-muted text-muted-foreground",
}

export function OverviewDashboard() {
  const recentSponsorships = sponsorships.slice(0, 4)
  const upcomingContent = contentPlan.filter(c => c.status === "scheduled").slice(0, 3)

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back, Sarah! Here&apos;s what&apos;s happening with your content business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                {stat.trend !== "neutral" && (
                  <span className={cn(
                    "flex items-center text-xs font-medium",
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  )}>
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue for the last 6 months</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View Report
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.revenueByMonth}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.15 45)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="oklch(0.65 0.15 45)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'oklch(0.5 0.02 50)', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'oklch(0.5 0.02 50)', fontSize: 12 }}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'oklch(1 0 0)',
                      border: '1px solid oklch(0.92 0.01 80)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: number) => [`RM ${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.65 0.15 45)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sponsorships */}
        <Card className="lg:col-span-3 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Recent Sponsorships</CardTitle>
              <CardDescription>Latest brand collaborations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSponsorships.map((sponsor) => (
              <div
                key={sponsor.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {sponsor.brand.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{sponsor.brand}</p>
                    <p className="text-xs text-muted-foreground">{sponsor.campaign}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={cn("text-xs", statusColors[sponsor.status])}>
                    {sponsor.status}
                  </Badge>
                  <span className="text-sm font-semibold text-foreground">
                    RM {sponsor.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Content & Engagement */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Content */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Upcoming Content</CardTitle>
              <CardDescription>Scheduled posts and deadlines</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Content Planner
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingContent.map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                      <span className="text-xs font-medium text-primary">
                        {new Date(content.scheduledDate).toLocaleDateString('en-US', { day: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase">
                        {new Date(content.scheduledDate).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{content.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {content.platform}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{content.type}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Platform Engagement */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Platform Performance</CardTitle>
              <CardDescription>Engagement across social platforms</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Analytics
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.engagementByPlatform.map((platform, index) => (
                <div key={platform.platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-3 w-3 rounded-full",
                        index === 0 ? "bg-chart-1" : index === 1 ? "bg-chart-2" : "bg-chart-3"
                      )} />
                      <span className="text-sm font-medium text-foreground">{platform.platform}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {(platform.followers / 1000).toFixed(0)}K followers
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {platform.engagement}% engagement
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        index === 0 ? "bg-chart-1" : index === 1 ? "bg-chart-2" : "bg-chart-3"
                      )}
                      style={{ width: `${(platform.engagement / 6) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Top Content */}
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-4">Top Performing Content</h4>
              <div className="space-y-3">
                {analyticsData.topContent.slice(0, 2).map((content, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-primary">#{index + 1}</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{content.title}</p>
                        <p className="text-xs text-muted-foreground">{content.platform}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {(content.views / 1000000).toFixed(1)}M views
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(content.likes / 1000).toFixed(0)}K likes
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
