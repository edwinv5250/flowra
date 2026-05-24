import { DashboardLayout } from "@/components/dashboard-layout"
import { getCurrentUserProfile, getSidebarProfile } from "@/features/profile/profile-queries"
import { SettingsPage } from "@/features/profile/settings-page"

export default async function SettingsRoutePage() {
  const [currentUser, sidebarProfile] = await Promise.all([
    getCurrentUserProfile(),
    getSidebarProfile(),
  ])

  return (
    <DashboardLayout currentPage="settings" profile={sidebarProfile}>
      <SettingsPage currentUser={currentUser} />
    </DashboardLayout>
  )
}
