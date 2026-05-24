import Link from "next/link"

import { signup } from "@/lib/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AuthSearchParams = Promise<{
  error?: string
}>

export default async function SignupPage({
  searchParams,
}: {
  searchParams: AuthSearchParams
}) {
  const { error } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">F</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Create your Flowra account</h1>
          <p className="text-sm text-muted-foreground">
            Start tracking campaigns, payments, and creator expenses.
          </p>
        </div>

        <form action={signup} className="space-y-4 rounded-lg border bg-card p-5 shadow-sm">
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
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
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="font-medium text-primary hover:underline" href="/login">
            Log in
          </Link>
        </p>
      </section>
    </main>
  )
}
