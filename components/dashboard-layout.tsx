"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Handshake,
  Receipt,
  CalendarDays,
  Store,
  BarChart3,
  Sparkles,
  Bell,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { logout } from "@/lib/auth/actions"

const navigation = [
  {
    title: "Main",
    items: [
      { title: "Overview", href: "/", icon: LayoutDashboard },
      { title: "Sponsorships", href: "/sponsorships", icon: Handshake },
      { title: "Finance", href: "/finance", icon: Receipt },
      { title: "Content Planner", href: "/content", icon: CalendarDays },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Restaurant CRM", href: "/restaurants", icon: Store },
      { title: "Analytics", href: "/analytics", icon: BarChart3 },
      { title: "AI Assistant", href: "/ai-assistant", icon: Sparkles },
    ],
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPage?: string
}

export function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">F</span>
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold text-sidebar-foreground">FoodieFlow</span>
              <span className="text-xs text-muted-foreground">Creator Dashboard</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          {navigation.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || currentPage === item.title.toLowerCase()
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.title}
                          className={cn(
                            "rounded-lg transition-colors",
                            isActive && "bg-primary/10 text-primary font-medium"
                          )}
                        >
                          <Link href={item.href}>
                            <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent transition-colors group-data-[collapsible=icon]:justify-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Sarah Lim" />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">SL</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col items-start text-left group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium text-sidebar-foreground">Sarah Lim</span>
                  <span className="text-xs text-muted-foreground">@sarahlimeats</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="text-destructive">
                <form action={logout}>
                  <button className="flex w-full items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Top Navbar */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="h-6" />
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sponsorships, restaurants..."
              className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  <Badge variant="secondary" className="text-xs">3 new</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-auto">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="font-medium text-sm">Payment Received</span>
                    </div>
                    <span className="text-xs text-muted-foreground pl-4">RM 5,000 from Teh Tarik Place</span>
                    <span className="text-xs text-muted-foreground pl-4">2 hours ago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="font-medium text-sm">Content Deadline</span>
                    </div>
                    <span className="text-xs text-muted-foreground pl-4">Penang Laksa Reel due tomorrow</span>
                    <span className="text-xs text-muted-foreground pl-4">5 hours ago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                      <span className="font-medium text-sm">New Collaboration</span>
                    </div>
                    <span className="text-xs text-muted-foreground pl-4">Secret Recipe wants to discuss partnership</span>
                    <span className="text-xs text-muted-foreground pl-4">1 day ago</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-6" />

            {/* Quick Action */}
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generate
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
