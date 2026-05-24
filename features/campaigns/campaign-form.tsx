"use client"

import { useActionState, useEffect, type ReactNode } from "react"
import { useFormStatus } from "react-dom"

import {
  campaignPlatformOptions,
  campaignStatusOptions,
  paymentStatusOptions,
} from "@/features/campaigns/campaign-options"
import type {
  Campaign,
  CampaignFormState,
} from "@/features/campaigns/campaign-types"
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

type CampaignFormProps = {
  action: (
    previousState: CampaignFormState,
    formData: FormData,
  ) => Promise<CampaignFormState>
  campaign?: Campaign
  onCancel: () => void
  onSuccess: () => void
}

const initialState: CampaignFormState = {}

export function CampaignForm({
  action,
  campaign,
  onCancel,
  onSuccess,
}: CampaignFormProps) {
  const [state, formAction] = useActionState(action, initialState)

  useEffect(() => {
    if (state.success) {
      onSuccess()
    }
  }, [onSuccess, state.success])

  return (
    <form action={formAction} className="space-y-4">
      {campaign && <input type="hidden" name="id" value={campaign.id} />}

      {state.message && (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          {state.message}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <FieldError label="Brand name" error={state.errors?.brand_name}>
          <Input
            name="brand_name"
            defaultValue={campaign?.brand_name}
            placeholder="e.g. Nasi Lemak Co."
            required
          />
        </FieldError>

        <FieldError label="Campaign title" error={state.errors?.campaign_title}>
          <Input
            name="campaign_title"
            defaultValue={campaign?.campaign_title}
            placeholder="e.g. Ramadan launch"
            required
          />
        </FieldError>
      </div>

      <FieldError label="Deliverables" error={state.errors?.deliverables}>
        <Textarea
          name="deliverables"
          defaultValue={campaign?.deliverables}
          placeholder="1 TikTok video, 2 IG stories, 1 restaurant visit"
          required
        />
      </FieldError>

      <div className="space-y-3 rounded-lg border p-4">
        <div>
          <h3 className="text-sm font-medium">Client contact</h3>
          <p className="text-sm text-muted-foreground">
            Optional details for the brand contact or talent manager.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldError label="Client name" error={state.errors?.client_name}>
            <Input
              name="client_name"
              defaultValue={campaign?.client_name ?? ""}
              placeholder="e.g. Aisyah from brand team"
            />
          </FieldError>

          <FieldError label="Client phone" error={state.errors?.client_phone}>
            <Input
              name="client_phone"
              defaultValue={campaign?.client_phone ?? ""}
              placeholder="e.g. +60 12-345 6789"
            />
          </FieldError>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FieldError label="Client email" error={state.errors?.client_email}>
            <Input
              name="client_email"
              type="email"
              defaultValue={campaign?.client_email ?? ""}
              placeholder="client@example.com"
            />
          </FieldError>

          <FieldError label="Platform" error={state.errors?.platform}>
            <Select name="platform" defaultValue={campaign?.platform ?? "none"}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Optional platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No platform</SelectItem>
                {campaignPlatformOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldError>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldError label="Amount (RM)" error={state.errors?.amount}>
          <Input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            defaultValue={campaign?.amount ?? 0}
            required
          />
        </FieldError>

        <FieldError label="Due date" error={state.errors?.due_date}>
          <Input name="due_date" type="date" defaultValue={campaign?.due_date} required />
        </FieldError>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FieldError label="Campaign status" error={state.errors?.status}>
          <Select name="status" defaultValue={campaign?.status ?? "draft"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {campaignStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldError>

        <FieldError label="Payment status" error={state.errors?.payment_status}>
          <Select name="payment_status" defaultValue={campaign?.payment_status ?? "unpaid"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent>
              {paymentStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
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
          defaultValue={campaign?.notes ?? ""}
          placeholder="Optional client notes, WhatsApp context, or reminders"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton label={campaign ? "Save changes" : "Create campaign"} />
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
