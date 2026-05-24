"use client"

import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"

import {
  createInvoice,
  updateInvoice,
} from "@/features/invoices/invoice-actions"
import { InvoiceForm } from "@/features/invoices/invoice-form"
import { InvoiceTable } from "@/features/invoices/invoice-table"
import type {
  InvoiceCampaignOption,
  InvoiceWithCampaign,
} from "@/features/invoices/invoice-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type InvoicesSectionProps = {
  campaignOptions: InvoiceCampaignOption[]
  invoices: InvoiceWithCampaign[]
}

export function InvoicesSection({ campaignOptions, invoices }: InvoicesSectionProps) {
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithCampaign | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredInvoices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) return invoices

    return invoices.filter((invoice) => {
      return (
        invoice.invoice_number.toLowerCase().includes(query) ||
        invoice.client_name.toLowerCase().includes(query) ||
        invoice.status.toLowerCase().includes(query) ||
        invoice.campaign?.brand_name.toLowerCase().includes(query) ||
        invoice.campaign?.campaign_title.toLowerCase().includes(query)
      )
    })
  }, [invoices, searchQuery])

  const totalOutstanding = invoices
    .filter((invoice) => invoice.status !== "paid" && invoice.status !== "void")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  function openCreateForm() {
    setEditingInvoice(null)
    setIsFormOpen(true)
  }

  function openEditForm(invoice: InvoiceWithCampaign) {
    setEditingInvoice(invoice)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingInvoice(null)
  }

  return (
    <Card>
      <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-base">Invoices</CardTitle>
          <p className="text-sm text-muted-foreground">
            RM {totalOutstanding.toLocaleString("en-MY")} outstanding across {invoices.length} invoice
            {invoices.length === 1 ? "" : "s"}.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search invoices..."
              className="pl-9"
            />
          </div>
          <Button onClick={openCreateForm}>
            <Plus className="h-4 w-4" />
            New invoice
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <InvoiceTable invoices={filteredInvoices} onEdit={openEditForm} />
      </CardContent>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingInvoice ? "Edit invoice" : "Create invoice"}</DialogTitle>
            <DialogDescription>
              Link a campaign to prefill client and amount. PDF generation comes later.
            </DialogDescription>
          </DialogHeader>
          <InvoiceForm
            key={editingInvoice?.id ?? "create"}
            action={editingInvoice ? updateInvoice : createInvoice}
            campaignOptions={campaignOptions}
            invoice={editingInvoice ?? undefined}
            onCancel={closeForm}
            onSuccess={closeForm}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}
