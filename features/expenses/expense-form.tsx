"use client"

import { useActionState, useEffect, type ReactNode } from "react"
import { useFormStatus } from "react-dom"

import { expenseCategoryOptions } from "@/features/expenses/expense-options"
import type {
  ExpenseCampaignOption,
  ExpenseFormState,
  ExpenseWithCampaign,
} from "@/features/expenses/expense-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type ExpenseFormProps = {
  action: (
    previousState: ExpenseFormState,
    formData: FormData,
  ) => Promise<ExpenseFormState>
  campaignOptions: ExpenseCampaignOption[]
  expense?: ExpenseWithCampaign
  onCancel: () => void
  onSuccess: () => void
}

const initialState: ExpenseFormState = {}

export function ExpenseForm({
  action,
  campaignOptions,
  expense,
  onCancel,
  onSuccess,
}: ExpenseFormProps) {
  const [state, formAction] = useActionState(action, initialState)

  useEffect(() => {
    if (state.success) {
      onSuccess()
    }
  }, [onSuccess, state.success])

  return (
    <form action={formAction} className="space-y-4">
      {expense && <input type="hidden" name="id" value={expense.id} />}

      {state.message && (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          {state.message}
        </p>
      )}

      <FieldError label="Title" error={state.errors?.title}>
        <Input
          name="title"
          defaultValue={expense?.title}
          placeholder="e.g. Grab to campaign shoot"
          required
        />
      </FieldError>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldError label="Amount (RM)" error={state.errors?.amount}>
          <Input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            defaultValue={expense?.amount ?? 0}
            required
          />
        </FieldError>

        <FieldError label="Expense date" error={state.errors?.expense_date}>
          <Input
            name="expense_date"
            type="date"
            defaultValue={expense?.expense_date}
            required
          />
        </FieldError>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldError label="Category" error={state.errors?.category}>
          <Select name="category" defaultValue={expense?.category ?? "other"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldError>

        <FieldError label="Campaign link" error={state.errors?.campaign_id}>
          <Select name="campaign_id" defaultValue={expense?.campaign_id ?? "none"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Optional campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No campaign</SelectItem>
              {campaignOptions.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.brand_name} - {campaign.campaign_title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldError>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={expense?.notes ?? ""}
          placeholder="Optional context about this expense"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton label={expense ? "Save changes" : "Create expense"} />
      </div>
    </form>
  )
}

function FieldError({
  children,
  error,
  label,
}: {
  children: ReactNode
  error?: string
  label: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  )
}
