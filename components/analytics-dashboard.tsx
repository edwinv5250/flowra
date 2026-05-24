"use client"

import * as React from "react"
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Users,
  BarChart3,
  Instagram,
  Film,
  Image as ImageIcon,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analyticsData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const platformIcons: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="h-4 w-4" />,
  TikTok: <Film className="h-4 w-4" />,
  Xiaohongshu: <ImageIcon className="h-4 w-4" />,
}

const platformColors = {
  Instagram: "oklch(0.65 0.15 45)",
  TikTok: "oklch(0.7 0.12 150)",
  Xiaohongshu: "oklch(0.6 0.1 250)",
}

const engagementData = [
  { week: "W1", Instagram: 4.2, TikTok: 5.1, Xiaohongshu: 3.5 },
  { week: "W2", Instagram: 4.5, TikTok: 4.8, Xiaohongshu: 3.8 },
  { week: "W3", Instagram: 4.8, TikTok: 5.2, Xiaohongshu: 3.9 },
  { week: "W4", Instagram: 4.6, TikTok: 5.5, Xiaohongshu: 4.1 },
]

const reachData = [
  { day: "Mon", reach: 45000 },
  { day: "Tue", reach: 52000 },
  { day: "Wed", reach: 48000 },
  { day: "Thu", reach: 61000 },
  { day: "Fri", reach: 55000 },
  { day: "Sat", reach: 78000 },
  { day: "Sun", reach: 82000 },
]

const audienceData = [
  { age: "18-24", value: 35 },
  { age: "25-34", value: 42 },
  { age: "35-44", value: 15 },
  { age: "45+", value: 8 },
]

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = React.useState("30d")

  const totalFollowers = analyticsData.engagementByPlatform.reduce((sum, p) => sum + p.followers, 0)
  const avgEngagement = (analyticsData.engagementByPlatform.reduce((sum, p) => sum + p.engagement, 0) / 3).toFixed(1)
  const totalViews = analyticsData.topContent.reduce((sum, c) => sum + c.views, 0)
  const totalLikes = analyticsData.topContent.reduce((sum, c) => sum + c.likes, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Track your performance across all platforms.
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {(totalFollowers / 1000).toFixed(0)}K
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center text-xs font-medium text-success">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2%
              </span>
              <span className="text-xs text-muted-foreground">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgEngagement}%</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center text-xs font-medium text-success">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.5%
              </span>
              <span className="text-xs text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {(totalViews / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center text-xs font-medium text-success">
                <TrendingUp className="h-3 w-3 mr-1" />
                +22.4%
              </span>
              <span className="text-xs text-muted-foreground">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {(totalLikes / 1000).toFixed(0)}K
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center text-xs font-medium text-success">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18.3%
              </span>
              <span className="text-xs text-muted-foreground">this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Engagement by Platform */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Engagement Trend</CardTitle>
            <CardDescription>Weekly engagement rate by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <XAxis 
                    dataKey="week" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'oklch(0.5 0.02 50)', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'oklch(0.5 0.02 50)', fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'oklch(1 0 0)',
                      border: '1px solid oklch(0.92 0.01 80)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Engagement']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Instagram" 
                    stroke={platformColors.Instagram} 
                    strokeWidth={2}
                    dot={{ fill: platformColors.Instagram, strokeWidth: 0, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="TikTok" 
                    stroke={platformColors.TikTok}
                    strokeWidth={2}
                    dot={{ fill: platformColors.TikTok, strokeWidth: 0, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Xiaohongshu" 
                    stroke={platformColors.Xiaohongshu}
                    strokeWidth={2}
                    dot={{ fill: platformColors.Xiaohongshu, strokeWidth: 0, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              {Object.entries(platformColors).map(([platform, color]) => (
                <div key={platform} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm text-muted-foreground">{platform}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Reach */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Daily Reach</CardTitle>
            <CardDescription>Content reach over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reachData}>
                  <defs>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.15 45)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="oklch(0.65 0.15 45)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
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
                    }}
                    formatter={(value: number) => [value.toLocaleString(), 'Reach']}
                  />
                  <Area
                    type="monotone"
                    dataKey="reach"
                    stroke="oklch(0.65 0.15 45)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorReach)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown & Top Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Platform Breakdown */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Platform Breakdown</CardTitle>
            <CardDescription>Followers distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.engagementByPlatform.map((platform, index) => {
              const percentage = ((platform.followers / totalFollowers) * 100).toFixed(0)
              return (
                <div key={platform.platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {platformIcons[platform.platform]}
                      <span className="text-sm font-medium text-foreground">{platform.platform}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {(platform.followers / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: Object.values(platformColors)[index]
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{percentage}% of total</span>
                    <span>{platform.engagement}% engagement</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Top Performing Content */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top Performing Content</CardTitle>
            <CardDescription>Best content by views this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topContent.map((content, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                    <span className="text-lg font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{content.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {platformIcons[content.platform]}
                      <span className="text-xs text-muted-foreground">{content.platform}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-semibold text-foreground">
                          {(content.views / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">views</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-semibold text-foreground">
                          {(content.likes / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">likes</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audience Demographics */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Audience Demographics</CardTitle>
          <CardDescription>Age distribution of your followers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={audienceData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="age" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'oklch(0.5 0.02 50)', fontSize: 12 }}
                    width={60}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'oklch(1 0 0)',
                      border: '1px solid oklch(0.92 0.01 80)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Percentage']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {audienceData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 1 ? "oklch(0.65 0.15 45)" : "oklch(0.85 0.05 45)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10">
                <p className="text-sm font-medium text-foreground">Primary Audience</p>
                <p className="text-2xl font-bold text-primary mt-1">25-34 years</p>
                <p className="text-sm text-muted-foreground mt-1">
                  42% of your followers fall within this age group
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Female</p>
                  <p className="text-lg font-bold text-foreground">68%</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground">Male</p>
                  <p className="text-lg font-bold text-foreground">32%</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Top locations: Kuala Lumpur, Penang, Johor Bahru
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
