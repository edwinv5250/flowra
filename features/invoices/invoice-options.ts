import type { InvoiceStatus } from "@/features/invoices/invoice-types"

export const invoiceStatusOptions: Array<{ label: string; value: InvoiceStatus }> = [
  { label: "Draft", value: "draft" },
  { label: "Sent", value: "sent" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" },
  { label: "Void", value: "void" },
]

export function getInvoiceStatusLabel(status: InvoiceStatus) {
  return invoiceStatusOptions.find((option) => option.value === status)?.label ?? status
}
