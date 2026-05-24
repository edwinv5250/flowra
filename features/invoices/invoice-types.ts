import type { Database } from "@/lib/database.types"

export type Invoice = Database["public"]["Tables"]["invoices"]["Row"]
export type InvoiceStatus = Database["public"]["Enums"]["invoice_status"]

export type InvoiceWithCampaign = Invoice & {
  campaign: {
    amount: number
    brand_name: string
    campaign_title: string
    id: string
  } | null
}

export type InvoiceCampaignOption = {
  amount: number
  brand_name: string
  campaign_title: string
  id: string
}

export type InvoiceFormField =
  | "amount"
  | "campaign_id"
  | "client_name"
  | "due_date"
  | "invoice_number"
  | "issued_date"
  | "paid_date"
  | "status"

export type InvoiceFormState = {
  errors?: Partial<Record<InvoiceFormField, string>>
  message?: string
  success?: boolean
}

export type InvoiceFormValues = {
  amount: number
  campaign_id: string | null
  client_name: string
  due_date: string
  invoice_number: string
  issued_date: string
  notes: string | null
  paid_date: string | null
  status: InvoiceStatus
}
