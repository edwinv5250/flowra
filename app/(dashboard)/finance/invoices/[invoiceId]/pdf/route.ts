import { notFound } from "next/navigation"

import {
  createInvoicePdf,
  createInvoicePdfFilename,
} from "@/features/invoices/invoice-pdf"
import type { InvoiceWithCampaign } from "@/features/invoices/invoice-types"
import { requireUserId } from "@/lib/auth/require-user"
import { createClient } from "@/lib/supabase/server"

type InvoicePdfRouteContext = {
  params: Promise<{
    invoiceId: string
  }>
}

export async function GET(_request: Request, { params }: InvoicePdfRouteContext) {
  const { invoiceId } = await params
  const userId = await requireUserId()
  const supabase = await createClient()

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select(
      `
        *,
        campaign:campaigns (
          amount,
          brand_name,
          campaign_title,
          id
        )
      `,
    )
    .eq("id", invoiceId)
    .eq("user_id", userId)
    .single()

  if (invoiceError || !invoice) {
    notFound()
  }

  const invoiceRow = invoice as InvoiceWithCampaign

  const [{ data: profile }, { data: authUser }] = await Promise.all([
    supabase
      .from("profiles")
      .select("creator_name, full_name, handle")
      .eq("id", userId)
      .maybeSingle(),
    supabase.auth.getUser(),
  ])

  const creatorName =
    profile?.creator_name?.trim() ||
    profile?.full_name?.trim() ||
    authUser.user?.email ||
    "Flowra Creator"

  const pdfBytes = await createInvoicePdf({
    creatorEmail: authUser.user?.email,
    creatorHandle: profile?.handle,
    creatorName,
    invoice: invoiceRow,
  })

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${createInvoicePdfFilename(
        invoiceRow.invoice_number,
      )}"`,
      "Content-Type": "application/pdf",
    },
  })
}
