"use client"

import { useActionState, useEffect, useMemo, useState, type ReactNode } from "react"
import { useFormStatus } from "react-dom"

import { invoiceStatusOptions } from "@/features/invoices/invoice-options"
import type {
  InvoiceCampaignOption,
  InvoiceFormState,
  InvoiceWithCampaign,
} from "@/features/invoices/invoice-types"
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

type InvoiceFormProps = {
  action: (
    previousState: InvoiceFormState,
    formData: FormData,
  ) => Promise<InvoiceFormState>
  campaignOptions: InvoiceCampaignOption[]
  invoice?: InvoiceWithCampaign
  onCancel: () => void
  onSuccess: () => void
}

const initialState: InvoiceFormState = {}

export function InvoiceForm({
  action,
  campaignOptions,
  invoice,
  onCancel,
  onSuccess,
}: InvoiceFormProps) {
  const [state, formAction] = useActionState(action, initialState)
  const [selectedCampaignId, setSelectedCampaignId] = useState(invoice?.campaign_id ?? "none")
  const selectedCampaign = useMemo(
    () => campaignOptions.find((campaign) => campaign.id === selectedCampaignId),
    [campaignOptions, selectedCampaignId],
  )

  useEffect(() => {
    if (state.success) {
      onSuccess()
    }
  }, [onSuccess, state.success])

  return (
    <form action={formAction} className="space-y-4">
      {invoice && <input type="hidden" name="id" value={invoice.id} />}

      {state.message && (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          {state.message}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <FieldError label="Invoice number" error={state.errors?.invoice_number}>
          <Input
            name="invoice_number"
            defaultValue={invoice?.invoice_number}
            placeholder="e.g. INV-2026-001"
            required
          />
        </FieldError>

        <FieldError label="Status" error={state.errors?.status}>
          <Select name="status" defaultValue={invoice?.status ?? "draft"}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {invoiceStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldError>
      </div>

      <FieldError label="Campaign link" error={state.errors?.campaign_id}>
        <Select
          name="campaign_id"
          value={selectedCampaignId}
          onValueChange={setSelectedCampaignId}
        >
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

      <div className="grid gap-4 md:grid-cols-2">
        <FieldError label="Client name" error={state.errors?.client_name}>
          <Input
            name="client_name"
            defaultValue={invoice?.client_name ?? selectedCampaign?.brand_name}
            key={selectedCampaign?.brand_name ?? invoice?.id ?? "client"}
            placeholder="e.g. Brand or client name"
            required
          />
        </FieldError>

        <FieldError label="Payment terms" error={state.errors?.payment_terms}>
          <Input
            name="payment_terms"
            defaultValue={invoice?.payment_terms ?? ""}
            placeholder="e.g. Due on receipt, Net 14"
          />
        </FieldError>
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice-client-address">Client address</Label>
        <Textarea
          id="invoice-client-address"
          name="client_address"
          defaultValue={invoice?.client_address ?? ""}
          placeholder="Optional billing address"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_120px_160px]">
        <FieldError label="Item" error={state.errors?.item_description}>
          <Input
            name="item_description"
            defaultValue={invoice?.item_description ?? selectedCampaign?.campaign_title ?? ""}
            key={selectedCampaign?.campaign_title ?? invoice?.id ?? "item"}
            placeholder="e.g. Sponsored content package"
          />
        </FieldError>

        <FieldError label="Quantity" error={state.errors?.quantity}>
          <Input
            name="quantity"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={invoice?.quantity ?? 1}
            required
          />
        </FieldError>

        <FieldError label="Rate (RM)" error={state.errors?.rate}>
          <Input
            name="rate"
            type="number"
            min="0"
            step="0.01"
            defaultValue={invoice?.rate ?? invoice?.amount ?? selectedCampaign?.amount ?? 0}
            key={selectedCampaign?.amount ?? invoice?.id ?? "rate"}
            required
          />
        </FieldError>
      </div>

      <input
        type="hidden"
        name="amount"
        value={invoice?.amount ?? selectedCampaign?.amount ?? 0}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <FieldError label="Issued date" error={state.errors?.issued_date}>
          <Input name="issued_date" type="date" defaultValue={invoice?.issued_date} required />
        </FieldError>

        <FieldError label="Due date" error={state.errors?.due_date}>
          <Input name="due_date" type="date" defaultValue={invoice?.due_date} required />
        </FieldError>

        <FieldError label="Paid date" error={state.errors?.paid_date}>
          <Input name="paid_date" type="date" defaultValue={invoice?.paid_date ?? ""} />
        </FieldError>
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice-bank-details">Bank / payment details</Label>
        <Textarea
          id="invoice-bank-details"
          name="bank_details"
          defaultValue={invoice?.bank_details ?? ""}
          placeholder="Optional bank account, DuitNow, or payment instructions"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice-notes">Notes</Label>
        <Textarea
          id="invoice-notes"
          name="notes"
          defaultValue={invoice?.notes ?? ""}
          placeholder="Optional invoice notes"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitButton label={invoice ? "Save changes" : "Create invoice"} />
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
