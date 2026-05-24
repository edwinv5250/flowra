import { invoiceStatusOptions } from "@/features/invoices/invoice-options"
import type {
  InvoiceFormState,
  InvoiceFormValues,
  InvoiceStatus,
} from "@/features/invoices/invoice-types"

const noCampaignValue = "none"

function getString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function isInvoiceStatus(value: string): value is InvoiceStatus {
  return invoiceStatusOptions.some((option) => option.value === value)
}

export function validateInvoiceForm(formData: FormData):
  | { data: InvoiceFormValues }
  | { state: InvoiceFormState } {
  const amountValue = getString(formData, "amount")
  const campaignId = getString(formData, "campaign_id")
  const quantityValue = getString(formData, "quantity")
  const rateValue = getString(formData, "rate")
  const status = getString(formData, "status")
  const quantity = Number(quantityValue)
  const rate = Number(rateValue)
  const fallbackAmount = Number(amountValue)
  const amount =
    Number.isFinite(quantity) && Number.isFinite(rate)
      ? Math.round(quantity * rate * 100) / 100
      : fallbackAmount

  const data = {
    amount,
    bank_details: getString(formData, "bank_details") || null,
    campaign_id: campaignId && campaignId !== noCampaignValue ? campaignId : null,
    client_address: getString(formData, "client_address") || null,
    client_name: getString(formData, "client_name"),
    due_date: getString(formData, "due_date"),
    invoice_number: getString(formData, "invoice_number"),
    issued_date: getString(formData, "issued_date"),
    item_description: getString(formData, "item_description") || null,
    notes: getString(formData, "notes") || null,
    paid_date: getString(formData, "paid_date") || null,
    payment_terms: getString(formData, "payment_terms") || null,
    quantity,
    rate,
    status,
  }

  const errors: InvoiceFormState["errors"] = {}

  if (!data.invoice_number) errors.invoice_number = "Invoice number is required."
  if (!data.client_name) errors.client_name = "Client name is required."
  if (!data.issued_date) errors.issued_date = "Issued date is required."
  if (!data.due_date) errors.due_date = "Due date is required."
  if (!Number.isFinite(quantity) || quantity <= 0) {
    errors.quantity = "Quantity must be more than zero."
  }
  if (!Number.isFinite(rate) || rate < 0) {
    errors.rate = "Rate must be zero or more."
  }
  if (!Number.isFinite(amount) || amount < 0) {
    errors.amount = "Total amount must be zero or more."
  }
  if (!isInvoiceStatus(status)) errors.status = "Choose a valid invoice status."
  if (data.issued_date && data.due_date && data.due_date < data.issued_date) {
    errors.due_date = "Due date must be on or after issued date."
  }
  if (data.issued_date && data.paid_date && data.paid_date < data.issued_date) {
    errors.paid_date = "Paid date must be on or after issued date."
  }

  if (Object.keys(errors).length > 0) {
    return {
      state: {
        errors,
        message: "Please fix the highlighted fields.",
      },
    }
  }

  return {
    data: {
      ...data,
      status: status as InvoiceStatus,
    },
  }
}
