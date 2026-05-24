"use client"

import { AlertCircle } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SponsorshipsError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <DashboardLayout currentPage="sponsorships">
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Could not load campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <Button onClick={reset}>Try again</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
