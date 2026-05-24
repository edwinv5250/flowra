import type { CurrentUserProfile } from "@/features/profile/profile-types"
import { ProfileForm } from "@/features/profile/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SettingsPage({ currentUser }: { currentUser: CurrentUserProfile }) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage the creator identity shown inside Flowra.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>
            Keep this simple for now. Public creator pages and avatar uploads come later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm currentUser={currentUser} />
        </CardContent>
      </Card>
    </div>
  )
}
