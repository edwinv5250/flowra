"use client"

import * as React from "react"
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MoreHorizontal,
  Sparkles,
  Instagram,
  Film,
  Image as ImageIcon,
  FileText,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { contentPlan } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const platformIcons: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="h-4 w-4" />,
  TikTok: <Film className="h-4 w-4" />,
  Xiaohongshu: <ImageIcon className="h-4 w-4" />,
}

const statusConfig = {
  scheduled: { label: "Scheduled", color: "bg-success/10 text-success border-success/20" },
  draft: { label: "Draft", color: "bg-muted text-muted-foreground border-muted" },
  idea: { label: "Idea", color: "bg-primary/10 text-primary border-primary/20" },
  published: { label: "Published", color: "bg-chart-2/10 text-chart-2 border-chart-2/20" },
}

const typeConfig = {
  Reel: { icon: Film, color: "text-primary" },
  Carousel: { icon: ImageIcon, color: "text-chart-2" },
  Video: { icon: Film, color: "text-chart-3" },
  Post: { icon: FileText, color: "text-chart-4" },
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export function ContentPlanner() {
  const [currentDate, setCurrentDate] = React.useState(new Date(2024, 2, 1)) // March 2024
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)
  const [aiCaption, setAiCaption] = React.useState("")
  const [isGenerating, setIsGenerating] = React.useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getContentForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return contentPlan.filter((c) => c.scheduledDate === dateStr)
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const generateCaption = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500))
    setAiCaption("Discover the secret behind Penang&apos;s most legendary laksa! 🍜 This bowl of perfection at Sister Laksa Teluk Kumbar has been winning hearts for over 30 years. The rich, tangy broth made with fresh fish and torch ginger flower will transport you straight to foodie heaven! 😍\n\n#PenangFood #Laksa #MalaysianFood #FoodieFinds #Penang #StreetFood #AssamLaksa")
    setIsGenerating(false)
  }

  const upcomingContent = contentPlan.filter(c => c.status === "scheduled" || c.status === "draft").slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Content Planner</h1>
          <p className="text-muted-foreground">
            Plan and schedule your content across platforms.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Caption
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Caption Generator
                </DialogTitle>
                <DialogDescription>
                  Generate engaging captions for your food content
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Content Topic</Label>
                  <Input placeholder="e.g., Penang Laksa Review" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Platform</Label>
                    <Select defaultValue="instagram">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="xiaohongshu">Xiaohongshu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Tone</Label>
                    <Select defaultValue="casual">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual & Fun</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Key Points (optional)</Label>
                  <Textarea placeholder="Any specific details to include..." rows={2} />
                </div>
                <Button 
                  onClick={generateCaption}
                  disabled={isGenerating}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  {isGenerating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Caption
                    </>
                  )}
                </Button>
                {aiCaption && (
                  <div className="grid gap-2">
                    <Label>Generated Caption</Label>
                    <Textarea 
                      value={aiCaption} 
                      onChange={(e) => setAiCaption(e.target.value)}
                      rows={6}
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(aiCaption)}>
                      Copy to Clipboard
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Plus className="h-4 w-4" />
                New Content
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Schedule Content</DialogTitle>
                <DialogDescription>
                  Plan a new post or reel for your content calendar
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Content Title</Label>
                  <Input placeholder="Enter content title" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Platform</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="xiaohongshu">Xiaohongshu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Content Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reel">Reel</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="post">Post</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Restaurant / Location</Label>
                  <Input placeholder="Enter restaurant name" />
                </div>
                <div className="grid gap-2">
                  <Label>Scheduled Date</Label>
                  <Input type="date" />
                </div>
                <div className="grid gap-2">
                  <Label>Notes</Label>
                  <Textarea placeholder="Any additional notes..." rows={2} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Save as Draft</Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Schedule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Calendar */}
        <Card className="lg:col-span-3 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">
              {MONTHS[month]} {year}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
              {/* Day Headers */}
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="bg-muted/50 p-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {days.map((day, index) => {
                const content = day ? getContentForDay(day) : []
                const isToday = day === 15 // Mock "today" for demo
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "min-h-[100px] bg-card p-2 transition-colors",
                      day && "hover:bg-muted/30 cursor-pointer",
                      !day && "bg-muted/10"
                    )}
                    onClick={() => day && setSelectedDate(new Date(year, month, day))}
                  >
                    {day && (
                      <>
                        <span className={cn(
                          "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
                          isToday && "bg-primary text-primary-foreground font-medium"
                        )}>
                          {day}
                        </span>
                        <div className="mt-1 space-y-1">
                          {content.slice(0, 2).map((item) => {
                            const TypeIcon = typeConfig[item.type as keyof typeof typeConfig]?.icon || FileText
                            return (
                              <div
                                key={item.id}
                                className={cn(
                                  "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium truncate",
                                  statusConfig[item.status as keyof typeof statusConfig]?.color
                                )}
                              >
                                <TypeIcon className="h-3 w-3 shrink-0" />
                                <span className="truncate">{item.title}</span>
                              </div>
                            )
                          })}
                          {content.length > 2 && (
                            <span className="text-[10px] text-muted-foreground pl-1">
                              +{content.length - 2} more
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Upcoming Content */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Upcoming</CardTitle>
              <CardDescription>Scheduled content this week</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingContent.map((content) => {
                const status = statusConfig[content.status as keyof typeof statusConfig]
                const TypeIcon = typeConfig[content.type as keyof typeof typeConfig]?.icon || FileText
                
                return (
                  <div
                    key={content.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center h-10 w-10 rounded-lg bg-primary/10 shrink-0">
                      <span className="text-xs font-medium text-primary">
                        {new Date(content.scheduledDate).getDate()}
                      </span>
                      <span className="text-[8px] text-muted-foreground uppercase">
                        {new Date(content.scheduledDate).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {content.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {platformIcons[content.platform]}
                          <span>{content.platform}</span>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px]", status.color)}>
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Quick Ideas */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Draft Ideas</CardTitle>
              <CardDescription>Content in the pipeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {contentPlan.filter(c => c.status === "idea" || c.status === "draft").slice(0, 3).map((content) => (
                <div
                  key={content.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      content.status === "idea" ? "bg-primary" : "bg-muted-foreground"
                    )} />
                    <span className="text-sm text-foreground truncate max-w-[150px]">
                      {content.title}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Schedule</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2 text-muted-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Idea
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
