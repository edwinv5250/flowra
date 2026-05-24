import { DashboardLayout } from "@/components/dashboard-layout"
import { SponsorshipManagement } from "@/components/sponsorships/sponsorship-management"

export default function SponsorshipsPage() {
  return (
    <DashboardLayout currentPage="sponsorships">
      <SponsorshipManagement />
    </DashboardLayout>
  )
}
