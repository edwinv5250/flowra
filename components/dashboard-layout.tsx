"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Handshake,
  Receipt,
  LifeBuoy,
  ChevronDown,
  RefreshCw,
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
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth/actions"
import { getProfileInitials } from "@/features/profile/profile-display"
import type { SidebarProfile } from "@/features/profile/profile-types"

const navigation = [
  {
    title: "MAIN",
    items: [
      { title: "Overview", href: "/", icon: LayoutDashboard },
      { title: "Sponsorships", href: "/sponsorships", icon: Handshake },
      { title: "Finance", href: "/finance", icon: Receipt },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { title: "Settings", href: "/settings", icon: Settings },
      { title: "Support", href: "/support", icon: LifeBuoy },
    ],
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  currentPage?: string
  profile?: SidebarProfile
}

export function DashboardLayout({ children, currentPage, profile }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const displayName = profile?.displayName ?? "Flowra Creator"
  const creatorName = profile?.creatorName ?? "Creator Dashboard"
  const handle = profile?.handle ? `@${profile.handle}` : profile?.email ?? ""
  const avatarFallback = getProfileInitials(
    profile?.displayName,
    profile?.creatorName,
    profile?.handle,
    profile?.email,
  )

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border px-3 py-3.5 group-data-[collapsible=icon]:px-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-md outline-none transition-colors hover:bg-sidebar-accent/60 focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
          >
            <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
              <img
                src="/Flowra_logo.png"
                alt="Flowra"
                className="h-full w-full scale-150 object-cover"
              />
            </span>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold text-sidebar-foreground">Flowra</span>
              <span className="text-xs text-muted-foreground">Creator Ops</span>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="px-2 py-3">
          {navigation.map((group) => (
            <SidebarGroup key={group.title} className="px-1.5 py-2 group-data-[collapsible=icon]:px-2">
              <SidebarGroupLabel className="mb-1 h-6 px-2 text-[0.68rem] font-semibold tracking-[0.12em] text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || currentPage === item.title.toLowerCase()
                    return (
                      <DashboardNavItem key={item.title} item={item} isActive={isActive} />
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border bg-sidebar-accent/25 p-3 group-data-[collapsible=icon]:p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2.5 rounded-md p-2 transition-colors hover:bg-sidebar-accent/70 group-data-[collapsible=icon]:justify-center">
                <Avatar className="h-8 w-8">
                  {profile?.avatarUrl && (
                    <AvatarImage src={profile.avatarUrl} alt={displayName} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col items-start text-left group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium text-sidebar-foreground">{displayName}</span>
                  <span className="text-xs text-muted-foreground">{handle || creatorName}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
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
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:h-16 sm:gap-4 sm:px-6">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="h-6" />
          <span className="text-sm font-medium text-muted-foreground">Creator Management</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="ml-auto"
            onClick={() => router.refresh()}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh page</span>
          </Button>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

type DashboardNavItemProps = {
  item: {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }
  isActive: boolean
}

function DashboardNavItem({ item, isActive }: DashboardNavItemProps) {
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn(
          "relative h-9 rounded-md px-2.5 text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:px-2",
          "before:absolute before:left-0 before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-transparent",
          isActive &&
            "bg-primary/5 font-semibold text-sidebar-foreground before:bg-primary [&>svg]:text-primary",
        )}
      >
        <Link href={item.href} onClick={() => isMobile && setOpenMobile(false)}>
          <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
