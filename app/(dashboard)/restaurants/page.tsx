import { DashboardLayout } from "@/components/dashboard-layout"
import { RestaurantCRM } from "@/components/restaurant-crm"

export default function RestaurantsPage() {
  return (
    <DashboardLayout currentPage="restaurants">
      <RestaurantCRM />
    </DashboardLayout>
  )
}
