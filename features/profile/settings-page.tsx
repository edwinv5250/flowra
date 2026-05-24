import type { CurrentUserProfile } from "@/features/profile/profile-types"
import { PasswordForm } from "@/features/profile/password-form"
import { ProfileForm } from "@/features/profile/profile-form"
import { ProfilePhotoForm } from "@/features/profile/profile-photo-form"
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
            Update the profile details and photo shown inside Flowra.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProfilePhotoForm currentUser={currentUser} />
          <ProfileForm currentUser={currentUser} />
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Password</CardTitle>
          <CardDescription>
            Update the password used to log in to your Flowra account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
