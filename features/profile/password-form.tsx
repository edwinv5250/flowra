"use client"

import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"

import { changePassword } from "@/features/profile/password-actions"
import type { PasswordFormState } from "@/features/profile/profile-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: PasswordFormState = {}

export function PasswordForm() {
  const [state, formAction] = useActionState(changePassword, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {state.message && (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          {state.message}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="current_password">Current password</Label>
        <Input
          id="current_password"
          name="current_password"
          type="password"
          autoComplete="current-password"
          required
        />
        {state.errors?.current_password && (
          <p className="text-sm text-destructive">{state.errors.current_password}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="new_password">New password</Label>
          <Input
            id="new_password"
            name="new_password"
            type="password"
            autoComplete="new-password"
            required
          />
          {state.errors?.new_password && (
            <p className="text-sm text-destructive">{state.errors.new_password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm_password">Confirm new password</Label>
          <Input
            id="confirm_password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            required
          />
          {state.errors?.confirm_password && (
            <p className="text-sm text-destructive">{state.errors.confirm_password}</p>
          )}
        </div>
      </div>

      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Updating..." : "Change password"}
    </Button>
  )
}
