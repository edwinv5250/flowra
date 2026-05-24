import { MessageCircle } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSidebarProfile } from "@/features/profile/profile-queries"

export default async function SupportPage() {
  const sidebarProfile = await getSidebarProfile()

  return (
    <DashboardLayout currentPage="support" profile={sidebarProfile}>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
          <p className="text-sm text-muted-foreground">
            Need help, found a bug, or want to request a feature?
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">Edwin Ooi</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <a
                  className="font-medium text-primary hover:underline"
                  href="mailto:edwin9950@gmail.com"
                >
                  edwin9950@gmail.com
                </a>
              </div>
            </div>

            <Button asChild>
              <a
                href="https://wa.me/60103505250"
                rel="noreferrer"
                target="_blank"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
