import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"

import { getInvoiceStatusLabel } from "@/features/invoices/invoice-options"
import type { InvoiceWithCampaign } from "@/features/invoices/invoice-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type InvoiceDetailProps = {
  invoice: InvoiceWithCampaign
}

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const itemDescription =
    invoice.item_description ||
    invoice.campaign?.campaign_title ||
    "Creator services"

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href="/finance">
              <ArrowLeft className="h-4 w-4" />
              Finance
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Invoice {invoice.invoice_number}
            </h1>
            <p className="text-sm text-muted-foreground">
              {invoice.client_name} - {formatCurrency(invoice.amount)}
            </p>
          </div>
        </div>

        <Button asChild>
          <a href={`/finance/invoices/${invoice.id}/pdf`}>
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bill To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Client</p>
              <p className="font-medium">{invoice.client_name}</p>
            </div>
            <DetailLine label="Email" value={invoice.client_email} />
            <DetailLine label="Phone" value={invoice.client_phone} />
            <DetailBlock label="Address" value={invoice.client_address} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invoice Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="secondary">{getInvoiceStatusLabel(invoice.status)}</Badge>
            </div>
            <DetailRow label="Issued" value={formatDate(invoice.issued_date)} />
            <DetailRow label="Due" value={formatDate(invoice.due_date)} />
            <DetailRow
              label="Paid"
              value={invoice.paid_date ? formatDate(invoice.paid_date) : "-"}
            />
            <DetailRow label="Payment terms" value={invoice.payment_terms || "-"} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campaign & Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <DetailLine
              label="Campaign"
              value={
                invoice.campaign
                  ? `${invoice.campaign.brand_name} - ${invoice.campaign.campaign_title}`
                  : "No campaign linked"
              }
            />
            <DetailLine label="Description" value={itemDescription} />
          </div>

          <div className="rounded-lg border">
            <div className="hidden grid-cols-[1fr_90px_120px_120px] gap-3 border-b bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground sm:grid">
              <span>Item</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Rate</span>
              <span className="text-right">Amount</span>
            </div>
            <div className="hidden grid-cols-[1fr_90px_120px_120px] gap-3 px-4 py-4 text-sm sm:grid">
              <span>{itemDescription}</span>
              <span className="text-right">{formatQuantity(invoice.quantity)}</span>
              <span className="text-right">{formatCurrency(invoice.rate)}</span>
              <span className="text-right font-medium">{formatCurrency(invoice.amount)}</span>
            </div>
            <div className="space-y-1 px-4 py-4 text-sm sm:hidden">
              <p className="font-medium">{itemDescription}</p>
              <div className="flex justify-between text-muted-foreground">
                <span>Qty × Rate</span>
                <span>{formatQuantity(invoice.quantity)} × {formatCurrency(invoice.rate)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Amount</span>
                <span>{formatCurrency(invoice.amount)}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="text-xl font-semibold">{formatCurrency(invoice.amount)}</span>
              </div>
            </div>
          </div>

          <DetailBlock label="Bank / payment details" value={invoice.bank_details} />
          <DetailBlock label="Notes" value={invoice.notes} />
        </CardContent>
      </Card>
    </div>
  )
}

function DetailLine({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  )
}

function DetailBlock({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="whitespace-pre-line font-medium">{value || "-"}</p>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    currency: "MYR",
    style: "currency",
  }).format(value)
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatQuantity(value: number) {
  return new Intl.NumberFormat("en-MY", {
    maximumFractionDigits: 2,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}
