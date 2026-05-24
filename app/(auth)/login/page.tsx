import Link from "next/link"

import { login } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AuthSearchParams = Promise<{
  error?: string
  success?: string
}>

export default async function LoginPage({
  searchParams,
}: {
  searchParams: AuthSearchParams
}) {
  const { error, success } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">F</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Log in to Flowra</h1>
          <p className="text-sm text-muted-foreground">
            Manage your sponsorship work in one place.
          </p>
        </div>

        <form action={login} className="space-y-4 rounded-lg border bg-card p-5 shadow-sm">
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-md bg-success/10 px-3 py-2 text-sm text-success">
              {success}
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Log in
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          New to Flowra?{" "}
          <Link className="font-medium text-primary hover:underline" href="/signup">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  )
}
