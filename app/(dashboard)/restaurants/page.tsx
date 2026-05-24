import { DashboardLayout } from "@/components/dashboard-layout"
import { RestaurantCRM } from "@/components/restaurant-crm"
import { getSidebarProfile } from "@/features/profile/profile-queries"

export default async function RestaurantsPage() {
  const sidebarProfile = await getSidebarProfile()

  return (
    <DashboardLayout currentPage="restaurants" profile={sidebarProfile}>
      <RestaurantCRM />
    </DashboardLayout>
  )
}
