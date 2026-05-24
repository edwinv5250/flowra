"use client"

import Link from "next/link"
import { Download, Edit, Eye, Trash2 } from "lucide-react"

import { deleteInvoice } from "@/features/invoices/invoice-actions"
import { getInvoiceStatusLabel } from "@/features/invoices/invoice-options"
import type { InvoiceWithCampaign } from "@/features/invoices/invoice-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type InvoiceTableProps = {
  invoices: InvoiceWithCampaign[]
  onEdit: (invoice: InvoiceWithCampaign) => void
}

export function InvoiceTable({ invoices, onEdit }: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-base font-medium">No invoices yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create invoices for campaigns and track payment status.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead>Issued</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[184px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{invoice.invoice_number}</p>
                  <p className="text-sm text-muted-foreground">{invoice.client_name}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{getInvoiceStatusLabel(invoice.status)}</Badge>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {invoice.campaign
                  ? `${invoice.campaign.brand_name} - ${invoice.campaign.campaign_title}`
                  : "No campaign"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(invoice.issued_date)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(invoice.due_date)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {invoice.paid_date ? formatDate(invoice.paid_date) : "-"}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(invoice.amount)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="icon-sm">
                    <Link href={`/finance/invoices/${invoice.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View invoice</span>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon-sm">
                    <a href={`/finance/invoices/${invoice.id}/pdf`}>
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download invoice PDF</span>
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(invoice)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit invoice</span>
                  </Button>
                  <form
                    action={deleteInvoice}
                    onSubmit={(event) => {
                      if (!window.confirm("Delete this invoice?")) {
                        event.preventDefault()
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={invoice.id} />
                    <Button type="submit" variant="ghost" size="icon-sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete invoice</span>
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
